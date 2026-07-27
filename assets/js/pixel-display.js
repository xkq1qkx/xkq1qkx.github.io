const WIDTH = 320;
const HEIGHT = 180;

const clamp = (value, low = 0, high = 1) => Math.max(low, Math.min(high, value));
const ease = (value) => {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
};
const mix = (a, b, amount) => a + (b - a) * amount;

function block(ctx, x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(width)), Math.max(1, Math.round(height)));
}

function pixelLine(ctx, from, to, color, size = 2, progress = 1) {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / Math.max(1, size - 0.3)));
  const count = Math.ceil(steps * clamp(progress));
  for (let index = 0; index <= count; index += 1) {
    const amount = index / steps;
    block(ctx, mix(from[0], to[0], amount) - size / 2, mix(from[1], to[1], amount) - size / 2, size, size, color);
  }
}

function pixelCircle(ctx, x, y, radius, color, size = 2, progress = 1) {
  const steps = Math.max(12, Math.ceil(radius * 5));
  const count = Math.ceil(steps * clamp(progress));
  for (let index = 0; index < count; index += 1) {
    const angle = (index / steps) * Math.PI * 2;
    block(ctx, x + Math.cos(angle) * radius - size / 2, y + Math.sin(angle) * radius - size / 2, size, size, color);
  }
}

function drawTrainer(ctx, x, y, throwAmount, time) {
  const navy = "#122345";
  const blue = "#25b9d3";
  const skin = "#f2b08d";
  const white = "#e9fbff";
  const magenta = "#ef4fad";
  const bob = Math.round(Math.sin(time * 7) * (throwAmount < 0.05 ? 1 : 0));
  y += bob;

  block(ctx, x + 5, y, 9, 3, white);
  block(ctx, x + 2, y + 3, 15, 3, navy);
  block(ctx, x + 5, y + 6, 10, 8, skin);
  block(ctx, x + 3, y + 8, 3, 5, navy);
  block(ctx, x + 7, y + 8, 2, 2, navy);
  block(ctx, x + 11, y + 8, 2, 2, navy);
  block(ctx, x + 4, y + 14, 12, 16, blue);
  block(ctx, x + 6, y + 17, 8, 4, white);
  block(ctx, x - 2, y + 16, 6, 5, blue);

  const handX = mix(x - 7, x + 29, throwAmount);
  const handY = mix(y + 14, y + 2, Math.sin(throwAmount * Math.PI));
  pixelLine(ctx, [x + 3, y + 18], [handX, handY], skin, 4);
  block(ctx, handX - 1, handY - 1, 4, 4, skin);
  pixelLine(ctx, [x + 15, y + 18], [x + 22, y + 20], skin, 4);
  block(ctx, x + 7, y + 30, 4, 13, navy);
  block(ctx, x + 13, y + 30, 4, 13, navy);
  block(ctx, x + 4, y + 42, 8, 3, magenta);
  block(ctx, x + 12, y + 42, 9, 3, magenta);
}

function drawTrainerBack(ctx, x, y, throwAmount, time) {
  const navy = "#18233e";
  const purple = "#46345f";
  const lavender = "#baa6db";
  const skin = "#edb28e";
  const white = "#f4f4e9";
  const yellow = "#d8a634";
  const bob = Math.round(Math.sin(time * 7) * (throwAmount < 0.04 ? 1 : 0));
  y += bob;

  block(ctx, x + 7, y, 13, 4, white);
  block(ctx, x + 3, y + 3, 22, 4, lavender);
  block(ctx, x + 5, y + 7, 18, 7, purple);
  block(ctx, x + 8, y + 12, 12, 7, skin);
  block(ctx, x + 4, y + 18, 20, 21, navy);
  block(ctx, x - 1, y + 20, 9, 15, yellow);
  block(ctx, x, y + 23, 5, 8, "#f3cb59");

  const handX = mix(x + 30, x + 42, Math.sin(throwAmount * Math.PI));
  const handY = mix(y + 22, y + 5, Math.sin(throwAmount * Math.PI));
  pixelLine(ctx, [x + 22, y + 22], [handX, handY], skin, 5);
  block(ctx, handX - 1, handY - 1, 5, 5, skin);
  block(ctx, x + 7, y + 39, 6, 14, purple);
  block(ctx, x + 17, y + 39, 6, 14, purple);
  block(ctx, x + 3, y + 51, 11, 4, white);
  block(ctx, x + 17, y + 51, 11, 4, white);
}

function drawEnergyBall(ctx, x, y, time, burst) {
  const pulse = Math.round(Math.sin(time * 12));
  pixelCircle(ctx, x, y, 7 + pulse, "#101823", 2);
  block(ctx, x - 6, y - 6, 13, 7, "#dc3947");
  block(ctx, x - 6, y + 1, 13, 6, "#f6f3e9");
  block(ctx, x - 7, y, 15, 2, "#101823");
  block(ctx, x - 2, y - 2, 5, 5, "#f6f3e9");
  block(ctx, x - 1, y - 1, 3, 3, "#62d6df");
  if (burst <= 0) return;
  pixelCircle(ctx, x, y, 10 + burst * 23, "#56e1f0", 2, 0.82);
  pixelCircle(ctx, x, y, 5 + burst * 34, "#245f7e", 2, 0.7);
  const sparks = [[-31, -12], [-24, 18], [25, -16], [34, 10], [3, -31], [0, 30], [21, 26], [-35, 4]];
  sparks.forEach(([dx, dy], index) => {
    const travel = ease(burst);
    block(ctx, x + dx * travel, y + dy * travel, index % 3 === 0 ? 3 : 2, 2, index % 2 ? "#ef4fad" : "#56e1f0");
  });
}

function drawRobotArm(ctx, progress, pointer, time) {
  if (progress <= 0) return;
  const base = [241, 96];
  const joints = [
    base,
    [232 + pointer.x * 4, 78 + pointer.y * 2],
    [248 + pointer.x * 5, 61 - pointer.y * 4],
    [237 + pointer.x * 7, 45 - pointer.y * 5],
  ];
  const segments = joints.length - 1;
  for (let index = 0; index < segments; index += 1) {
    const segmentProgress = clamp(progress * segments - index);
    pixelLine(ctx, joints[index], joints[index + 1], "#17213b", 9, segmentProgress);
    pixelLine(ctx, joints[index], joints[index + 1], "#e9fbff", 5, segmentProgress);
    if (segmentProgress > 0.92) {
      const [x, y] = joints[index + 1];
      pixelCircle(ctx, x, y, 5, "#17213b", 3);
      pixelCircle(ctx, x, y, 3, "#56e1f0", 2);
    }
  }
  if (progress > 0.25) {
    block(ctx, base[0] - 12, base[1] + 3, 24, 5, "#17213b");
    block(ctx, base[0] - 8, base[1], 16, 5, "#e9fbff");
  }
  if (progress > 0.94) {
    block(ctx, joints[3][0] - 5, joints[3][1] - 6, 10, 7, "#17213b");
    block(ctx, joints[3][0] - 3, joints[3][1] - 8 + Math.round(Math.sin(time * 5)), 6, 8, "#e9fbff");
  }
}

function drawDexterousHand(ctx, progress, pointer, time) {
  if (progress <= 0.72) return;
  const reveal = ease((progress - 0.72) / 0.28);
  const x = 273;
  const y = 52;
  const white = "#e9fbff";
  const cyan = "#56e1f0";
  const dark = "#17213b";
  block(ctx, x - 10, y, 20 * reveal, 15, dark);
  block(ctx, x - 8, y - 2, 16 * reveal, 14, white);
  const curl = pointer.y * 4 + Math.sin(time * 3) * 1.4;
  [17, 22, 24, 19].forEach((height, index) => {
    const fingerReveal = clamp(reveal * 5 - index * 0.45);
    const fx = x - 10 + index * 6;
    const bend = Math.round(curl * (index + 1) / 5);
    block(ctx, fx + bend, y - height * fingerReveal, 4, height * fingerReveal, dark);
    block(ctx, fx + 1 + bend, y - height * fingerReveal + 2, 2, Math.max(1, height * fingerReveal - 3), white);
    if (fingerReveal > 0.7) block(ctx, fx + bend, y - height + 7, 4, 2, cyan);
  });
  pixelLine(ctx, [x - 8, y + 3], [x - 18, y - 7], dark, 6, reveal);
  pixelLine(ctx, [x - 8, y + 3], [x - 18, y - 7], white, 3, reveal);
  pixelLine(ctx, [x - 18, y - 7], [x - 19 - pointer.x * 3, y - 17], white, 3, reveal);
}

function drawBackdrop(ctx, frame) {
  block(ctx, 0, 0, WIDTH, HEIGHT, "#07111c");
  block(ctx, 0, 29, WIDTH, 81, "#0d2030");
  for (let y = 32; y < 108; y += 6) block(ctx, 0, y, WIDTH, 2, "#123348");

  ctx.fillStyle = "#1c4955";
  ctx.beginPath();
  ctx.ellipse(244, 70, 69, 23, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#63c8bb";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#153c48";
  ctx.beginPath();
  ctx.ellipse(51, 135, 88, 28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#55b7b1";
  ctx.stroke();

  for (let index = 0; index < 22; index += 1) {
    if ((frame + index * 3) % 23 < 2) block(ctx, (index * 47 + 19) % WIDTH, 32 + ((index * 17) % 71), 2, 1, "#4a8e9c");
  }
}

function drawStatusBox(ctx, x, y, width, height) {
  block(ctx, x, y, width, height, "#d6d5c9");
  block(ctx, x + 3, y + 3, width - 6, height - 6, "#111b28");
}

function drawHud(ctx, phase, summon) {
  ctx.font = "7px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.textBaseline = "top";
  drawStatusBox(ctx, 8, 7, 132, 29);
  ctx.fillStyle = "#f1f3e8";
  ctx.fillText("KX TRAINER", 16, 13);
  ctx.fillText("Lv.26", 100, 13);
  ctx.fillStyle = phase < 1.1 ? "#72dcca" : "#f0c74b";
  ctx.fillText(phase < 1.1 ? "THROW: READY" : "CAPSULE: ACTIVE", 16, 24);

  if (summon > 0.2) {
    drawStatusBox(ctx, 177, 105, 135, 39);
    ctx.fillStyle = "#f1f3e8";
    ctx.fillText("MANIPULATOR", 186, 111);
    ctx.fillText("Lv.MAX", 273, 111);
    ctx.fillStyle = "#f0c74b";
    ctx.fillText("HP", 186, 123);
    block(ctx, 205, 124, 91, 6, "#28333b");
    block(ctx, 207, 126, Math.max(2, 87 * summon), 2, summon > 0.92 ? "#75dc6d" : "#f0c74b");
    ctx.fillStyle = "#8cecff";
    ctx.fillText("DEXTERITY", 227, 132);
  }

  block(ctx, 0, 150, WIDTH, 30, "#dad9cc");
  block(ctx, 5, 154, 310, 22, "#111b28");
  ctx.fillStyle = "#f6f3e9";
  const message = phase < 1.1
    ? "KX is ready to deploy."
    : phase < 3.1
      ? "KX used ROBOT CAPSULE!"
      : phase < 5.0
        ? "The capsule burst into light!"
        : "A dexterous manipulator appeared.";
  ctx.fillText(message, 12, 159);
  ctx.fillStyle = "#8cecff";
  ctx.fillText(phase > 5 ? "MOVE POINTER  >  ARTICULATE JOINTS" : "PHYSICS SIM / ROBUST CONTROL", 12, 168);
}

function drawFrame(ctx, seconds, pointer) {
  const phase = seconds % 10.5;
  const frame = Math.floor(seconds * 12);
  const summon = ease((phase - 3.45) / 2.05);
  drawBackdrop(ctx, frame);
  drawHud(ctx, phase, summon);

  const throwAmount = ease((phase - 1.0) / 1.25);
  drawTrainerBack(ctx, 43, 91, throwAmount, seconds);

  let ballX = 80;
  let ballY = 112;
  if (phase >= 1.0) {
    const flight = ease((phase - 1.0) / 1.75);
    ballX = mix(80, 155, flight);
    ballY = mix(112, 69, flight) - Math.sin(flight * Math.PI) * 31;
  }
  const burst = clamp((phase - 2.75) / 1.4);
  if (phase < 5.05) drawEnergyBall(ctx, ballX, ballY, seconds, burst);

  drawRobotArm(ctx, summon, pointer, seconds);
  drawDexterousHand(ctx, summon, pointer, seconds);

  if (phase > 9.3) {
    ctx.globalAlpha = ease((phase - 9.3) / 1.1);
    block(ctx, 0, 0, WIDTH, HEIGHT, "#02050b");
    ctx.globalAlpha = 1;
  }
  ctx.globalAlpha = 0.24;
  for (let y = 0; y < HEIGHT; y += 4) block(ctx, 0, y, WIDTH, 1, "#020912");
  ctx.globalAlpha = 1;
}

export function createPixelDisplay(THREE, root, pointer) {
  const screen = root?.getObjectByName("HOME_PIXEL_DISPLAY");
  if (!screen?.isMesh) return null;

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext("2d", { alpha: false });
  context.imageSmoothingEnabled = false;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.flipY = false;

  const original = screen.material;
  screen.material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, toneMapped: false });
  if (original?.dispose) original.dispose();

  let lastFrame = -1;
  return {
    update(now) {
      const seconds = now / 1000;
      const frame = Math.floor(seconds * 12);
      if (frame === lastFrame) return;
      lastFrame = frame;
      drawFrame(context, seconds, pointer);
      texture.needsUpdate = true;
    },
  };
}
