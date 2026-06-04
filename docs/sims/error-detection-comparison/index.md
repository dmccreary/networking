---
title: "Error Detection in Action"
description: "Interactive p5.js MicroSim: error detection in action."
image: /sims/error-detection-comparison/error-detection-comparison.png
og:image: /sims/error-detection-comparison/error-detection-comparison.png
twitter:image: /sims/error-detection-comparison/error-detection-comparison.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
quality_score: 0
---

# Error Detection in Action

<iframe src="main.html" height="574" width="100%" scrolling="no"></iframe>

[Run the Error Detection in Action MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

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
[Chapter 6: Link Layer Fundamentals and Reliable Transfer](../../chapters/06-link-layer-fundamentals/index.md).

```
Type: microsim
**sim-id:** error-detection-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that lets students inject bit errors into a frame and watch which of three error-detection codes catch them.

Canvas: 920 px wide by 580 px tall, responsive down to 360 px. A 120 px control panel sits below.

Layout:

- A frame display at the top: 32 bits of data shown as a row of small squares, one bit per square, with a small label above each indicating its bit position.
- Three trailing fields shown to the right of the frame:
  - 1-bit parity (computed from the data).
  - 16-bit Internet checksum (computed from the data).
  - 32-bit CRC-32 (computed from the data using polynomial `0xEDB88320`).
- Below the frame, a "received" copy initially identical to the sent frame.

Interactivity:

- Clicking any bit in the received copy flips it (toggles 0/1). The display recomputes the receiver's parity, checksum, and CRC values.
- Each of the three checks shows a green "OK" or red "FAIL" indicator depending on whether the recomputed value matches the original.
- "Inject N random errors" buttons (1, 2, 4, 8 errors) flip random bits and update the indicators.
- "Burst error" toggle: flip a contiguous block of bits.
- A counter tracks how many of the test cases each code caught.

Visual style:

- Sent frame in honey amber.
- Received frame in slate.
- Flipped bits highlighted in red.
- Pass/fail indicators in green/red.

Learning objectives:

- (Bloom — Understanding) Students explain why parity catches only odd-bit-count errors.
- (Bloom — Analyzing) Students decompose an error pattern into the contributions caught by each code.
- (Bloom — Evaluating) Students judge which error-detection code is strong enough for a given application.

Implement in pure p5.js using the existing MicroSim CSS theme.
```

## Iframe Embed Code

You can add this MicroSim to any web page by adding this HTML:

```html
<iframe src="https://dmccreary.github.io/networking/sims/error-detection-comparison/main.html"
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
   and how it connects to link layer fundamentals and reliable transfer.

## References

- [Chapter 6: Link Layer Fundamentals and Reliable Transfer](../../chapters/06-link-layer-fundamentals/index.md)
- [ACM/IEEE CS2023 Networking and Communication Knowledge Area](https://csed.acm.org/)
