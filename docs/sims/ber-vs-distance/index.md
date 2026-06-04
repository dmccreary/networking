---
title: "Signal Quality Across Distance"
description: "Interactive p5.js MicroSim: signal quality across distance."
image: /sims/ber-vs-distance/ber-vs-distance.png
og:image: /sims/ber-vs-distance/ber-vs-distance.png
twitter:image: /sims/ber-vs-distance/ber-vs-distance.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
quality_score: 0
---

# Signal Quality Across Distance

<iframe src="main.html" height="587" width="100%" scrolling="no"></iframe>

[Run the Signal Quality Across Distance MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

s:

This MicroSim is built with p5.js and is width-responsive, so it adapts to
the width of the page or container it is embedded in.

## How to Use

Use the controls in the panel below the drawing area to explore the concept.
Adjust the sliders, toggle the options, and step through the stages to see how
each change affects what is shown.

## Specification

The full specification below is extracted from
[Chapter 5: The Physical Layer](../../chapters/05-physical-layer/index.md).

```
Type: microsim
**sim-id:** ber-vs-distance<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that visualizes how attenuation, noise, and interference produce bit errors as signal traverses a medium of variable length.

Canvas: 920 px wide by 580 px tall, responsive down to 360 px. A 120 px control panel sits below.

Layout:

- Top half: an oscilloscope-style display showing the signal at the sender (clean digital pulse train) and at the receiver (degraded waveform). A vertical "decision threshold" line indicates how the receiver decides 0 vs. 1.
- Bottom half: a horizontal "channel" rendered as a long rectangle with a small graph showing signal amplitude vs. distance. The amplitude curve drops exponentially with distance (attenuation), and a noise floor is added as scattered random fluctuations.
- A bit-error indicator shows received bits in two colors: green (correctly received) and red (errored).

Controls panel:

- Sliders: distance (0–100 km), transmit power (0–30 dBm), noise floor (-100 to -30 dBm), interference level (off / low / high).
- Modulation dropdown: NRZ (1 bit/symbol), 4-QAM (2 bits/symbol), 16-QAM (4 bits/symbol), 64-QAM (6 bits/symbol).
- "Add forward error correction" toggle — when on, errors below a threshold are corrected by the receiver and shown in yellow.
- "Show Shannon capacity" toggle — annotates the current configuration's Shannon capacity and the achieved bit rate.

Behavior:

- As distance increases, signal amplitude shrinks; the receiver's decision threshold becomes harder to apply, and red error bits start to appear.
- As modulation order increases, the constellation diagram shows tighter spacing between points, and small noise produces many more errors.
- The bit-error rate (BER) is computed live and displayed as a numeric readout.

Visual style:

- Sender waveform: clean honey-amber pulses.
- Receiver waveform: noisy version of the same, with the noise tinted in slate.
- Errored bits highlighted in red on a strip below the receiver display.

Learning objectives:

- (Bloom — Understanding) Students explain how attenuation, noise, and modulation order interact to produce bit errors.
- (Bloom — Analyzing) Students decompose a high-BER scenario into its contributing factors.
- (Bloom — Evaluating) Students judge whether a deployment requires a different medium or just a different modulation, given a target BER.

The MicroSim should be implemented in pure p5.js with the existing MicroSim CSS theme.
```

## Iframe Embed Code

You can add this MicroSim to any web page by adding this HTML:

```html
<iframe src="https://dmccreary.github.io/networking/sims/ber-vs-distance/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

s:

### Bloom Taxonomy Level

**Understand**

### Suggested Classroom Use

1. **Predict** — Ask students to predict the behavior before they interact.
2. **Explore** — Have students manipulate the controls and observe the results.
3. **Explain** — Ask students to explain, in their own words, what they observed
   and how it connects to the physical layer.

## References

- [Chapter 5: The Physical Layer](../../chapters/05-physical-layer/index.md)
- [ACM/IEEE CS2023 Networking and Communication Knowledge Area](https://csed.acm.org/)
