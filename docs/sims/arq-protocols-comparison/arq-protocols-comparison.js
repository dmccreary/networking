// ARQ Protocols Comparison (Stop-and-Wait / Go-Back-N / Selective Repeat)
// CANVAS_HEIGHT: 620
// Three lanes send the same 10 frames over a lossy link so students can
// compare retransmission cost and completion time.
// Bloom: Understand, Analyze, Evaluate.

let containerWidth;
let canvasWidth = 940;
let drawHeight = 495;
let controlHeight = 125;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 14;
let defaultTextSize = 16;
let sliderLeftMargin = 210;

const AMBER = '#F5A623', DARKAMBER = '#bf6a00', SLATE = '#546e7a', RED = '#e53935';
const NFRAMES = 10;
const P = 6;            // one-way propagation in time units
let lossSet = new Set([3]);

let winSlider, lossSlider, rttSlider;
let stepButton, playButton, resetButton, randBtn, defBtn;
let lanes = [];         // generated {name, events, totalTime, retx}
let maxT = 1;
let cursor = 0;
let isPlaying = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  winSlider = createSlider(1, 8, 4, 1);
  lossSlider = createSlider(0, 50, 10, 1);
  rttSlider = createSlider(10, 500, 100, 10);
  [winSlider, lossSlider, rttSlider].forEach((s, i) => { s.position(sliderLeftMargin, drawHeight + 10 + i * 26); s.size(canvasWidth - sliderLeftMargin - margin); });
  winSlider.input(regen);

  stepButton = createButton('Step ▶'); stepButton.position(10, drawHeight + 92); stepButton.mousePressed(doStep);
  playButton = createButton('Play'); playButton.position(80, drawHeight + 92); playButton.mousePressed(togglePlay);
  resetButton = createButton('Reset'); resetButton.position(140, drawHeight + 92); resetButton.mousePressed(() => { cursor = 0; isPlaying = false; playButton.html('Play'); });
  randBtn = createButton('Random loss'); randBtn.position(205, drawHeight + 92); randBtn.mousePressed(randomLoss);
  defBtn = createButton('Loss = frame 3'); defBtn.position(300, drawHeight + 92); defBtn.mousePressed(() => { lossSet = new Set([3]); regen(); });

  regen();
  describe('Three side-by-side time-sequence diagrams comparing Stop-and-Wait, ' +
    'Go-Back-N, and Selective Repeat sending ten frames over a link that drops ' +
    'selected frames, with retransmission counts and completion times.', LABEL);
}

function randomLoss() {
  const p = lossSlider.value() / 100; lossSet = new Set();
  for (let f = 0; f < NFRAMES; f++) if (Math.random() < p) lossSet.add(f);
  regen();
}

function regen() {
  const W = winSlider.value();
  lanes = [
    Object.assign({ name: 'Stop-and-Wait' }, genStopWait()),
    Object.assign({ name: 'Go-Back-N (W=' + W + ')' }, genGBN(W)),
    Object.assign({ name: 'Selective Repeat (W=' + W + ')' }, genSR(W))
  ];
  maxT = Math.max(1, ...lanes.map(l => l.totalTime));
  cursor = 0; isPlaying = false; if (playButton) playButton.html('Play');
}

function genStopWait() {
  let t = 0, retx = 0; const ev = [];
  for (let f = 0; f < NFRAMES; f++) {
    const lost = lossSet.has(f);
    ev.push({ f, kind: 'data', t0: t, lost, retx: false });
    if (lost) {
      t += 2 * P + 4;
      ev.push({ f, kind: 'data', t0: t, lost: false, retx: true }); retx++;
      ev.push({ f, kind: 'ack', t0: t + P, lost: false });
      t += 2 * P;
    } else { ev.push({ f, kind: 'ack', t0: t + P, lost: false }); t += 2 * P; }
  }
  return { events: ev, totalTime: t, retx };
}

function genGBN(W) {
  let base = 0, t = 0, retx = 0; const ev = []; const consumed = new Set(); const delivered = new Array(NFRAMES).fill(false);
  let guard = 0;
  while (base < NFRAMES && guard++ < 200) {
    const sendList = [];
    for (let j = 0; j < W && base + j < NFRAMES; j++) sendList.push(base + j);
    let firstLostPos = -1;
    for (let j = 0; j < sendList.length; j++) {
      const f = sendList[j], st = t + j;
      const lost = lossSet.has(f) && !consumed.has(f);
      if (lost) consumed.add(f);
      ev.push({ f, kind: 'data', t0: st, lost, retx: delivered[f] === false && consumed.has(f) && lossSet.has(f) ? false : (st > f ? true : false) });
      if (!lost) ev.push({ f, kind: 'ack', t0: st + P, lost: false });
      if (lost && firstLostPos < 0) firstLostPos = j;
    }
    if (firstLostPos < 0) {
      for (const f of sendList) delivered[f] = true;
      base += sendList.length;
      t += sendList.length + 2 * P;
    } else {
      for (let j = 0; j < firstLostPos; j++) delivered[base + j] = true;
      retx += sendList.length - firstLostPos;     // GBN resends from the lost frame
      base = base + firstLostPos;
      t += sendList.length + 2 * P + 2;
    }
  }
  return { events: ev, totalTime: t, retx };
}

function genSR(W) {
  let retx = 0; const ev = []; const ackTime = {};
  let lastAck = 0;
  for (let f = 0; f < NFRAMES; f++) {
    const earliest = f >= W ? (ackTime[f - W] || 0) : 0;
    const st = Math.max(f, earliest);
    const lost = lossSet.has(f);
    ev.push({ f, kind: 'data', t0: st, lost, retx: false });
    if (!lost) { ev.push({ f, kind: 'ack', t0: st + P, lost: false }); ackTime[f] = st + 2 * P; }
    else {
      const rt = st + 2 * P + 3;
      ev.push({ f, kind: 'data', t0: rt, lost: false, retx: true }); retx++;
      ev.push({ f, kind: 'ack', t0: rt + P, lost: false }); ackTime[f] = rt + 2 * P;
    }
    lastAck = Math.max(lastAck, ackTime[f]);
  }
  return { events: ev, totalTime: lastAck, retx };
}

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  if (isPlaying) { cursor += maxT / 240; if (cursor >= maxT) { cursor = maxT; isPlaying = false; playButton.html('Play'); } }

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(20);
  text('ARQ Protocols: Same 10 Frames, One Lossy Link', canvasWidth / 2, 6);

  const laneW = canvasWidth / 3;
  for (let i = 0; i < 3; i++) drawLane(lanes[i], i * laneW, laneW);

  // slider labels
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(13);
  text('Window size (GBN/SR): ' + winSlider.value(), 10, drawHeight + 20);
  text('Loss probability: ' + lossSlider.value() + '%', 10, drawHeight + 46);
  text('RTT: ' + rttSlider.value() + ' ms', 10, drawHeight + 72);
  fill('#455a64'); textSize(11);
  text('Dropped frames: {' + [...lossSet].sort((a, b) => a - b).join(', ') + '}', 470, drawHeight + 110);
}

function drawLane(lane, lx, lw) {
  const senderX = lx + lw * 0.20, receiverX = lx + lw * 0.80;
  const topY = 74, botY = drawHeight - 84;
  const pxPerUnit = (botY - topY) / maxT;
  const yOf = t => topY + t * pxPerUnit;

  // lane frame + title
  noStroke(); fill('#37474f'); textAlign(CENTER, TOP); textSize(13);
  text(lane.name, lx + lw / 2, 36);
  fill('#607d8b'); textSize(10); textAlign(CENTER, TOP);
  text('Sender', senderX, 54); text('Receiver', receiverX, 54);
  // timelines (vertical)
  stroke('#cfd8dc'); strokeWeight(1.5); line(senderX, topY, senderX, botY); line(receiverX, topY, receiverX, botY);

  // events
  for (const e of lane.events) {
    if (e.t0 > cursor) continue;
    const arrived = cursor >= e.t0 + P;
    const prog = arrived ? 1 : (cursor - e.t0) / P;
    if (e.kind === 'data') {
      const x0 = senderX, x1 = e.lost ? lerp(senderX, receiverX, 0.5) : receiverX;
      const y0 = yOf(e.t0), y1 = yOf(e.t0 + P * (e.lost ? 0.5 : 1));
      stroke(e.retx ? DARKAMBER : AMBER); strokeWeight(2);
      const ex = lerp(x0, x1, prog), ey = lerp(y0, y1, prog);
      line(x0, y0, ex, ey);
      if (arrived) {
        if (e.lost) { stroke(RED); strokeWeight(2); const mx = lerp(senderX, receiverX, 0.5), my = yOf(e.t0 + P * 0.5); line(mx - 6, my - 6, mx + 6, my + 6); line(mx - 6, my + 6, mx + 6, my - 6); }
        else drawArrowHead(x1, y1, 1, 0);
        noStroke(); fill(e.retx ? DARKAMBER : '#3e2723'); textAlign(LEFT, CENTER); textSize(9); text((e.retx ? 'rx' : '') + e.f, x0 + 4, y0 - 5);
      }
    } else {
      // ack: receiver -> sender
      const y0 = yOf(e.t0), y1 = yOf(e.t0 + P);
      stroke(SLATE); strokeWeight(1.5);
      const ex = lerp(receiverX, senderX, prog), ey = lerp(y0, y1, prog);
      line(receiverX, y0, ex, ey);
      if (arrived) drawArrowHead(senderX, y1, -1, 0);
    }
  }

  // readouts
  const ms = (lane.totalTime / (2 * P)) * rttSlider.value();
  noStroke(); textAlign(CENTER, TOP); textSize(11);
  fill('#1b5e20'); text('time ≈ ' + ms.toFixed(0) + ' ms', lx + lw / 2, botY + 6);
  fill('#c62828'); text('retransmissions: ' + lane.retx, lx + lw / 2, botY + 22);
  fill('#1565c0'); text('frames/time: ' + (NFRAMES / lane.totalTime).toFixed(2), lx + lw / 2, botY + 38);
}

function drawArrowHead(x, y, dirx, diry) {
  noStroke(); fill(dirx < 0 ? SLATE : AMBER);
  if (dirx >= 0) triangle(x, y, x - 7, y - 4, x - 7, y + 4);
  else triangle(x, y, x + 7, y - 4, x + 7, y + 4);
}

function doStep() { isPlaying = false; playButton.html('Play'); cursor = min(maxT, cursor + P); }
function togglePlay() { if (cursor >= maxT) cursor = 0; isPlaying = !isPlaying; playButton.html(isPlaying ? 'Pause' : 'Play'); }

function windowResized() { updateCanvasSize(); resizeCanvas(containerWidth, containerHeight); [winSlider, lossSlider, rttSlider].forEach(s => s.size(canvasWidth - sliderLeftMargin - margin)); redraw(); }
function updateCanvasSize() { const c = document.querySelector('main').getBoundingClientRect(); containerWidth = Math.floor(c.width); canvasWidth = containerWidth; }
