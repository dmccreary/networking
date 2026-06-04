// NRZ vs. Manchester Encoding
// CANVAS_HEIGHT: 550
// Enter a bit pattern and see the NRZ and Manchester voltage waveforms side by
// side, including a noise mode and a long-run-of-zeros mode that shows why
// Manchester guarantees a transition each bit. Bloom: Understand, Analyze, Evaluate.

let containerWidth;
let canvasWidth = 920;
let drawHeight = 460;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 16;
let defaultTextSize = 16;

const AMBER = '#F5A623';
let bitInput, zerosButton, noiseCheckbox;
let addNoise = false;
let bits = '10110001';

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  bitInput = createInput('10110001');
  bitInput.position(110, drawHeight + 10);
  bitInput.size(180);
  bitInput.input(() => { bits = bitInput.value().replace(/[^01]/g, '').slice(0, 16) || '0'; });

  zerosButton = createButton('Long run of zeros');
  zerosButton.position(305, drawHeight + 10);
  zerosButton.mousePressed(() => { bits = '00000000'; bitInput.value('00000000'); });

  noiseCheckbox = createCheckbox(' Add noise', false);
  noiseCheckbox.position(10, drawHeight + 50);
  noiseCheckbox.changed(() => { addNoise = noiseCheckbox.checked(); });

  describe('Two oscilloscope traces showing the same bit string encoded with ' +
    'NRZ (level per bit) and Manchester (mid-bit transition per bit), with ' +
    'optional noise and a long-run-of-zeros demonstration.', LABEL);
}

function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(20);
  text('NRZ vs. Manchester Encoding', canvasWidth / 2, 6);

  const b = bits.length ? bits : '0';
  const traceX = margin + 30;
  const traceW = canvasWidth - traceX - margin;
  const bw = traceW / b.length;

  drawTrace('NRZ Encoding', traceX, 70, traceW, 130, b, bw, 'nrz');
  drawTrace('Manchester Encoding', traceX, 250, traceW, 130, b, bw, 'manchester');

  // bit boundary labels region note
  noStroke(); fill('#546e7a'); textAlign(LEFT, TOP); textSize(12);
  text('Manchester guarantees a transition in every bit period → self-clocking. ' +
       'NRZ holds a level, so long runs lose the clock.', margin, 398, canvasWidth - 2 * margin, 50);

  // control labels
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(14);
  text('Bit string:', 10, drawHeight + 20);
}

function drawTrace(title, x, y, w, h, b, bw, mode) {
  // slate grid background
  noStroke(); fill('#37474f'); rect(x, y, w, h, 4);
  stroke('#546e7a'); strokeWeight(1);
  for (let gx = x; gx <= x + w; gx += bw) line(gx, y, gx, y + h);
  const hi = y + h * 0.25, lo = y + h * 0.75, mid = y + h * 0.5;

  // decision threshold (white dashed) at midpoint
  stroke('white'); strokeWeight(1);
  drawDashed(x, mid, x + w, mid);

  // title + axis labels
  noStroke(); fill(AMBER); textAlign(LEFT, BOTTOM); textSize(13);
  text(title, x, y - 2);
  fill('#cfd8dc'); textAlign(RIGHT, CENTER); textSize(10);
  text('high', x - 2, hi); text('low', x - 2, lo);

  // bit number labels above periods
  noStroke(); fill('#455a64'); textAlign(CENTER, BOTTOM); textSize(11);
  for (let i = 0; i < b.length; i++) text(b[i], x + i * bw + bw / 2, y - 2);

  // waveform
  stroke(AMBER); strokeWeight(2.5); noFill();
  const jit = () => addNoise ? random(-h * 0.07, h * 0.07) : 0;
  beginShape();
  let prevY = null;
  for (let i = 0; i < b.length; i++) {
    const x0 = x + i * bw, x1 = x0 + bw;
    if (mode === 'nrz') {
      const yv = (b[i] === '1' ? hi : lo) + jit();
      if (prevY !== null && prevY !== yv) { vertex(x0, prevY); }
      vertex(x0, yv); vertex(x1, yv); prevY = yv;
    } else {
      // Manchester: 1 = low→high, 0 = high→low (transition at mid)
      const first = (b[i] === '1' ? lo : hi) + jit();
      const second = (b[i] === '1' ? hi : lo) + jit();
      const xm = x0 + bw / 2;
      if (prevY !== null && prevY !== first) vertex(x0, prevY);
      vertex(x0, first); vertex(xm, first);
      vertex(xm, second); vertex(x1, second); prevY = second;
    }
  }
  endShape();
}

function drawDashed(x1, y1, x2, y2) {
  const d = dist(x1, y1, x2, y2), steps = floor(d / 8);
  for (let i = 0; i < steps; i += 2) {
    const t1 = i / steps, t2 = min(1, (i + 1) / steps);
    line(lerp(x1, x2, t1), lerp(y1, y2, t1), lerp(x1, x2, t2), lerp(y1, y2, t2));
  }
}

function windowResized() { updateCanvasSize(); resizeCanvas(containerWidth, containerHeight); redraw(); }
function updateCanvasSize() { const c = document.querySelector('main').getBoundingClientRect(); containerWidth = Math.floor(c.width); canvasWidth = containerWidth; }
