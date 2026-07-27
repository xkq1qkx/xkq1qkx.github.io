import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

const config = window.__KUNQI_PORTFOLIO__;
const canvas = document.querySelector("#robotics-scene");
const shell = document.querySelector(".scene-shell");
const fallback = document.querySelector("#scene-fallback");
const loaderLabel = document.querySelector("#scene-loader-label");
const errorLabel = document.querySelector("#scene-error");
const sectionLabel = document.querySelector("#scene-section-label");
const interactionLabel = document.querySelector("#scene-interaction-label");
const scrollMeter = document.querySelector("#scroll-meter-bar");
const heroCard = document.querySelector(".hero-card");
const sections = [...document.querySelectorAll(".story-section[data-camera]")];
const navLinks = [...document.querySelectorAll(".portfolio-menu a[href^='#']")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const state = {
  renderer: null,
  scene: null,
  camera: null,
  root: null,
  mixer: null,
  anchors: new Map(),
  stops: [],
  activeSection: sections[0] ?? null,
  mode: "arms",
  pointerTarget: new THREE.Vector2(),
  pointer: new THREE.Vector2(),
  armNodes: [],
  handNodes: [],
  lastTime: performance.now(),
  frame: 0,
  ready: false,
};

const fallbackUrls = {
  home: config.homeFallback,
  overview: config.overviewFallback,
  publications: config.publicationsFallback,
  awards: config.awardsFallback,
};

function supportsWebGL() {
  try {
    const probe = document.createElement("canvas");
    return Boolean(window.WebGL2RenderingContext && probe.getContext("webgl2"));
  } catch (_) {
    return false;
  }
}

function smoothstep(value) {
  const x = Math.max(0, Math.min(1, value));
  return x * x * (3 - 2 * x);
}

function damping(rate, delta) {
  return 1 - Math.exp(-rate * delta);
}

function setupNavigation() {
  const toggle = document.querySelector("#nav-toggle");
  const menu = document.querySelector("#portfolio-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = !menu.classList.contains("is-open");
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.addEventListener("click", () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  }

  document.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", link.getAttribute("href"));
    });
  });
}

function buildScrollStops() {
  const navHeight = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-height")) || 0;
  state.stops = sections.map((element, index) => ({
    element,
    cameraName: element.dataset.camera,
    position: index === 0 ? 0 : Math.max(0, element.offsetTop - navHeight),
  }));
}

function updateSectionUI(marker) {
  let active = state.stops[0];
  for (const stop of state.stops) {
    if (marker >= stop.position) active = stop;
  }
  if (!active) return;
  if (active.element === state.activeSection) {
    updateSceneBackground(active.element);
    return;
  }

  state.activeSection = active.element;
  state.mode = active.element.dataset.interaction || "arms";
  sectionLabel.textContent = active.element.dataset.label || active.element.id.toUpperCase();
  interactionLabel.textContent = state.mode === "hands"
    ? "MOVE POINTER · ARTICULATE FINGERS"
    : "MOVE POINTER · MOVE ROBOT JOINTS";

  const fallbackKey = active.element.dataset.fallback || "home";
  if (fallbackUrls[fallbackKey]) fallback.style.backgroundImage = `url("${fallbackUrls[fallbackKey]}")`;
  updateSceneBackground(active.element);
  navLinks.forEach((link) => link.classList.toggle("is-active", link.hash === `#${active.element.id}`));
}

function updateSceneBackground(section = state.activeSection) {
  if (!state.scene) return;
  const mobileHome = window.innerWidth <= 700 && section?.id === "home";
  state.scene.background.setHex(mobileHome ? 0xc9cbcd : 0x071019);
}

function scrollState() {
  buildScrollStops();
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const pageProgress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
  scrollMeter.style.width = `${pageProgress * 100}%`;

  if (heroCard && state.stops.length > 1) {
    const homeProgress = window.scrollY / Math.max(1, state.stops[1].position);
    const visibility = 1 - smoothstep(homeProgress / 0.38);
    heroCard.style.opacity = String(visibility);
    heroCard.style.transform = `translateY(${Math.round((1 - visibility) * 24)}px)`;
    heroCard.style.pointerEvents = visibility < 0.15 ? "none" : "auto";
  }

  if (!state.stops.length) return null;
  const activeMarker = window.scrollY + window.innerHeight * 0.35;
  const cameraMarker = window.scrollY;
  updateSectionUI(activeMarker);

  let before = state.stops[0];
  let after = state.stops[state.stops.length - 1];
  for (let index = 0; index < state.stops.length - 1; index += 1) {
    if (cameraMarker >= state.stops[index].position && cameraMarker <= state.stops[index + 1].position) {
      before = state.stops[index];
      after = state.stops[index + 1];
      break;
    }
    if (cameraMarker > state.stops[state.stops.length - 1].position) {
      before = after;
    }
  }
  const span = Math.max(1, after.position - before.position);
  const segmentProgress = before === after ? 0 : (cameraMarker - before.position) / span;
  const changesCamera = before.cameraName !== after.cameraName;
  const transition = before.element.dataset.cameraTransition || "late";
  const transitionProgress = transition === "full"
    ? segmentProgress
    : (segmentProgress - 0.72) / 0.28;
  const blend = changesCamera ? smoothstep(transitionProgress) : 0;
  return { before, after, blend };
}

function addLighting(scene) {
  const hemisphere = new THREE.HemisphereLight(0xfff5ea, 0x14263a, 2.5);
  scene.add(hemisphere);

  const key = new THREE.DirectionalLight(0xffdcc2, 3.8);
  key.position.set(-3.5, 7.5, -4.0);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0x8ecbff, 2.1);
  fill.position.set(4.5, 3.0, 3.0);
  scene.add(fill);

  const front = new THREE.DirectionalLight(0xffffff, 1.25);
  front.position.set(0, 2.5, 7.0);
  scene.add(front);
}

function cacheAnchor(name) {
  const object = state.root?.getObjectByName(name);
  if (!object) return null;
  object.updateWorldMatrix(true, false);
  const pose = {
    object,
    position: new THREE.Vector3(),
    quaternion: new THREE.Quaternion(),
    fov: object.isPerspectiveCamera ? object.fov : 50,
  };
  object.getWorldPosition(pose.position);
  object.getWorldQuaternion(pose.quaternion);
  state.anchors.set(name, pose);
  return pose;
}

function resolveAnchors() {
  sections.forEach((section) => cacheAnchor(section.dataset.camera));
  fitHomeCamera();
  const home = state.anchors.get("CAM_WEB_HOME_GRAFFITI") || [...state.anchors.values()][0];
  if (home) {
    state.camera.position.copy(home.position);
    state.camera.quaternion.copy(home.quaternion);
    state.camera.fov = home.fov;
    state.camera.updateProjectionMatrix();
  }
}

function fitHomeCamera() {
  const home = state.anchors.get("CAM_WEB_HOME_GRAFFITI");
  if (!home) return;
  if (!home.baseFov) home.baseFov = home.fov;
  const aspect = window.innerWidth / Math.max(1, window.innerHeight);
  const fit = window.innerWidth <= 700 ? 1.55 : aspect < 1.68 ? 1.16 : 1.08;
  const halfFov = THREE.MathUtils.degToRad(home.baseFov) * 0.5;
  home.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(halfFov) * fit));
}

function cameraTargetFromScroll() {
  const current = scrollState();
  if (!current || !state.ready) return null;
  const start = state.anchors.get(current.before.cameraName);
  const end = state.anchors.get(current.after.cameraName) || start;
  if (!start || !end) return null;
  return {
    position: new THREE.Vector3().lerpVectors(start.position, end.position, current.blend),
    quaternion: new THREE.Quaternion().slerpQuaternions(start.quaternion, end.quaternion, current.blend),
    fov: THREE.MathUtils.lerp(start.fov, end.fov, current.blend),
  };
}

function interactiveNode(name, axis, xGain, yGain, phase = 1) {
  const object = state.root.getObjectByName(name);
  if (!object) return null;
  return {
    object,
    axis: new THREE.Vector3(...axis).normalize(),
    xGain,
    yGain,
    phase,
    base: object.quaternion.clone(),
    target: object.quaternion.clone(),
  };
}

function cacheInteractionNodes() {
  const armSpecs = [
    ["FRANKA_PANDA_JOINT_link2", [0, 0, 1], 0.055, 0.018, 1],
    ["FRANKA_PANDA_JOINT_link4", [1, 0, 0], -0.025, 0.050, 1],
    ["FRANKA_PANDA_JOINT_link6", [0, 1, 0], 0.035, -0.030, 1],
    ["UR5E_JOINT_shoulder_link", [0, 1, 0], -0.045, 0.022, 1],
    ["UR5E_JOINT_forearm_link", [1, 0, 0], 0.020, -0.052, 1],
    ["UR5E_JOINT_wrist_2_link", [0, 0, 1], 0.048, 0.020, 1],
    ["AIRBOT_PLAY_JOINT_link2", [0, 0, 1], 0.048, -0.018, 1],
    ["AIRBOT_PLAY_JOINT_link4", [1, 0, 0], -0.024, 0.050, 1],
    ["AIRBOT_PLAY_JOINT_link6", [0, 1, 0], 0.040, -0.025, 1],
  ];
  state.armNodes = armSpecs.map((spec) => interactiveNode(...spec)).filter(Boolean);

  const handSpecs = [
    ["XHAND_right_hand_index_bend_link", [1, 0, 0], 0.06, 0.24, 1.0],
    ["XHAND_right_hand_index_rota_link1", [0, 0, 1], 0.15, 0.12, 1.0],
    ["XHAND_right_hand_index_rota_link2", [1, 0, 0], 0.04, 0.22, 1.0],
    ["XHAND_right_hand_mid_link1", [1, 0, 0], -0.03, 0.24, 0.88],
    ["XHAND_right_hand_mid_link2", [1, 0, 0], 0.02, 0.22, 0.88],
    ["XHAND_right_hand_ring_link1", [1, 0, 0], -0.06, 0.22, 0.76],
    ["XHAND_right_hand_ring_link2", [1, 0, 0], 0.02, 0.20, 0.76],
    ["XHAND_right_hand_pinky_link1", [1, 0, 0], -0.09, 0.20, 0.65],
    ["XHAND_right_hand_pinky_link2", [1, 0, 0], 0.02, 0.18, 0.65],
    ["XHAND_right_hand_thumb_bend_link", [0, 1, 0], 0.18, -0.14, 0.8],
    ["XHAND_right_hand_thumb_rota_link1", [0, 0, 1], -0.16, 0.08, 0.8],
  ];
  state.handNodes = handSpecs.map((spec) => interactiveNode(...spec)).filter(Boolean);
}

const interactionRotation = new THREE.Quaternion();
function updateNodeGroup(nodes, enabled, delta) {
  const blend = damping(enabled ? 11 : 7, delta);
  for (const node of nodes) {
    if (enabled) {
      const angle = (state.pointer.x * node.xGain + state.pointer.y * node.yGain) * node.phase;
      interactionRotation.setFromAxisAngle(node.axis, angle);
      node.target.copy(node.base).multiply(interactionRotation);
    } else {
      node.target.copy(node.base);
    }
    node.object.quaternion.slerp(node.target, blend);
  }
}

function setupPointer() {
  window.addEventListener("pointermove", (event) => {
    state.pointerTarget.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      1 - (event.clientY / window.innerHeight) * 2,
    );
  }, { passive: true });
  document.documentElement.addEventListener("mouseleave", () => state.pointerTarget.set(0, 0));
}

function playAmbientAnimations(gltf) {
  state.mixer = new THREE.AnimationMixer(gltf.scene);
  let played = 0;
  for (const clip of gltf.animations) {
    if (!/STANFORD_BUNNY|GRAFFITI_Gear/i.test(clip.name)) continue;
    const action = state.mixer.clipAction(clip);
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.clampWhenFinished = false;
    action.play();
    played += 1;
  }
  if (played === 0) {
    console.warn("No ambient Blender animation clips were found.");
  }
}

function resizeRenderer() {
  if (!state.renderer || !state.camera) return;
  const width = window.innerWidth;
  const height = window.innerHeight;
  state.renderer.setSize(width, height, false);
  state.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.15 : 1.6));
  state.camera.aspect = width / Math.max(1, height);
  state.camera.updateProjectionMatrix();
  fitHomeCamera();
  updateSceneBackground();
  buildScrollStops();
}

function render(now) {
  state.frame = requestAnimationFrame(render);
  if (!state.renderer || !state.scene || !state.camera) return;
  const delta = Math.min(0.05, Math.max(0.001, (now - state.lastTime) / 1000));
  state.lastTime = now;

  state.pointer.lerp(state.pointerTarget, damping(7.5, delta));
  if (state.mixer) state.mixer.update(delta * (reducedMotion ? 0.4 : 1));

  const target = cameraTargetFromScroll();
  if (target) {
    const cameraBlend = damping(reducedMotion ? 18 : 7.5, delta);
    state.camera.position.lerp(target.position, cameraBlend);
    state.camera.quaternion.slerp(target.quaternion, cameraBlend);
    state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, target.fov, cameraBlend);
    state.camera.updateProjectionMatrix();
  }

  updateNodeGroup(state.armNodes, state.mode !== "hands" && !reducedMotion, delta);
  updateNodeGroup(state.handNodes, state.mode === "hands" && !reducedMotion, delta);
  state.renderer.render(state.scene, state.camera);
}

function failToFallback(error) {
  console.error(error);
  errorLabel.hidden = false;
  loaderLabel.textContent = "Rendered fallback active";
  shell.classList.add("has-error");
}

function initialize3D() {
  if (!supportsWebGL()) {
    failToFallback(new Error("WebGL 2 is unavailable."));
    return;
  }

  state.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  state.renderer.outputColorSpace = THREE.SRGBColorSpace;
  state.renderer.toneMapping = THREE.ACESFilmicToneMapping;
  state.renderer.toneMappingExposure = 1.08;
  state.renderer.setClearColor(0x071019, 1);

  state.scene = new THREE.Scene();
  state.scene.background = new THREE.Color(0x071019);
  updateSceneBackground();
  state.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.035, 120);
  addLighting(state.scene);
  resizeRenderer();

  const draco = new DRACOLoader();
  draco.setDecoderPath(config.dracoPath);
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);
  loader.load(
    config.modelUrl,
    (gltf) => {
      state.root = gltf.scene;
      state.scene.add(state.root);
      state.root.traverse((object) => {
        if (!object.isMesh) return;
        object.castShadow = false;
        object.receiveShadow = false;
        if (object.material) object.material.envMapIntensity = 0.7;
      });
      resolveAnchors();
      cacheInteractionNodes();
      playAmbientAnimations(gltf);
      state.ready = true;
      shell.classList.add("is-ready");
      loaderLabel.textContent = "Scene ready";
      scrollState();
      draco.dispose();
    },
    (event) => {
      if (!event.total) {
        loaderLabel.textContent = "Assembling robotics scene";
        return;
      }
      const percent = Math.min(100, Math.round((event.loaded / event.total) * 100));
      loaderLabel.textContent = `Assembling robotics scene  ${percent}%`;
    },
    failToFallback,
  );
}

setupNavigation();
setupPointer();
buildScrollStops();
scrollState();
window.addEventListener("resize", resizeRenderer, { passive: true });
window.addEventListener("scroll", scrollState, { passive: true });
window.addEventListener("load", buildScrollStops, { once: true });
initialize3D();
state.frame = requestAnimationFrame(render);
