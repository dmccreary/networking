---
title: "MAC Protocol Comparison"
description: "Interactive p5.js MicroSim: mac protocol comparison."
image: /sims/mac-protocols-comparison/mac-protocols-comparison.png
og:image: /sims/mac-protocols-comparison/mac-protocols-comparison.png
twitter:image: /sims/mac-protocols-comparison/mac-protocols-comparison.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
quality_score: 0
---

# MAC Protocol Comparison

<iframe src="main.html" height="602" width="100%" scrolling="no"></iframe>

[Run the MAC Protocol Comparison MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

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
**sim-id:** mac-protocols-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that animates four MAC protocols on a single shared medium with several competing devices, so students can compare collision rates, fairness, and efficiency.

Canvas: 960 px wide by 600 px tall, responsive down to 360 px. A 120 px control panel sits below.

Layout:

- A long horizontal "shared medium" rectangle in the middle of the canvas, with 5 devices attached above and below.
- Four protocol modes selectable by tabs at the top: Pure ALOHA / CSMA/CD / CSMA/CA / Token Passing.
- A timeline at the bottom shows transmissions per device color-coded by success (green), collision (red), or backoff/wait (gray).

Animation per mode:

- Pure ALOHA: devices transmit at random times regardless of channel state; collisions are common.
- CSMA/CD: devices sense the channel before transmitting; collisions detected mid-frame, jam pulse, exponential backoff visualized.
- CSMA/CA: devices wait an interframe gap, perform random backoff before transmitting; explicit ACK after each frame.
- Token Passing: a token icon visibly circulates among devices; only the token holder may transmit.

Controls panel:

- Sliders: number of devices (2–8), per-device offered load (low / medium / high), propagation delay (small / large).
- Buttons: Play / Pause / Reset.
- Live readouts: throughput, collision rate, fairness index across devices.
- "Compare side by side" mode: splits the canvas into a 2×2 grid running all four protocols simultaneously on the same workload.

Visual style:

- Devices as honey-amber rounded rectangles.
- Successful transmissions: green.
- Collisions: red bursts.
- Backoff / wait: dim gray.
- Token: a glowing circle that visibly moves between devices.

Learning objectives:

- (Bloom — Understanding) Students explain why CSMA/CD reduces collisions compared to ALOHA, and why CSMA/CA further sacrifices efficiency for predictability on wireless.
- (Bloom — Analyzing) Students compare throughput, fairness, and worst-case access time across the four protocols.
- (Bloom — Evaluating) Students judge which MAC protocol fits a deployment based on medium type, device count, and load.

Implement in pure p5.js with the existing MicroSim CSS theme.
```

## Iframe Embed Code

You can add this MicroSim to any web page by adding this HTML:

```html
<iframe src="https://dmccreary.github.io/networking/sims/mac-protocols-comparison/main.html"
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
