---
title: "Congestion Control Phases and Algorithms"
description: "Interactive p5.js MicroSim: congestion control phases and algorithms."
image: /sims/tcp-congestion-control-comparison/tcp-congestion-control-comparison.png
og:image: /sims/tcp-congestion-control-comparison/tcp-congestion-control-comparison.png
twitter:image: /sims/tcp-congestion-control-comparison/tcp-congestion-control-comparison.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
quality_score: 0
---

# Congestion Control Phases and Algorithms

<iframe src="main.html" height="602" width="100%" scrolling="no"></iframe>

[Run the Congestion Control Phases and Algorithms MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

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
[Chapter 11: The Transport Layer](../../chapters/11-transport-layer/index.md).

```
Type: microsim
**sim-id:** tcp-congestion-control-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that plots `cwnd` over time for Reno, CUBIC, and BBR running on the same simulated path with configurable loss and bandwidth.

Canvas: 960 px wide by 600 px tall, responsive down to 360 px. A 120 px control panel sits below.

Layout:

- A large time-vs-cwnd plot occupying most of the canvas. X-axis is time in RTTs; Y-axis is cwnd in segments.
- Three traces, one per algorithm, in distinct colors with a legend.
- Horizontal dashed lines marking the simulated link's bottleneck capacity and the bandwidth-delay product.
- Annotations at each loss event, showing fast retransmit, fast recovery, and timeout events.

Controls panel:

- Sliders: link bandwidth (1–10000 Mbps log), RTT (10–500 ms), loss rate (0–5%), buffer size (in BDPs).
- Toggle: "Add competing flows" to introduce additional algorithms competing for the link.
- Buttons: Step / Play / Reset.
- "Single algorithm focus" dropdown to highlight one trace.

Visual style:

- Reno: slate blue, sawtooth pattern.
- CUBIC: honey amber, cubic curve.
- BBR: forest green, smoother saturating curve.

Learning objectives:

- (Bloom — Understanding) Students explain how each algorithm's `cwnd` evolves through slow start, congestion avoidance, and loss recovery.
- (Bloom — Analyzing) Students compare fairness, buffer occupancy, and convergence time for the three algorithms.
- (Bloom — Evaluating) Students judge which algorithm fits a given link profile (lossy, long, or fast).

Implement in pure p5.js with the existing MicroSim CSS theme.
```

## Iframe Embed Code

You can add this MicroSim to any web page by adding this HTML:

```html
<iframe src="https://dmccreary.github.io/networking/sims/tcp-congestion-control-comparison/main.html"
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
   and how it connects to the transport layer.

## References

- [Chapter 11: The Transport Layer](../../chapters/11-transport-layer/index.md)
- [ACM/IEEE CS2023 Networking and Communication Knowledge Area](https://csed.acm.org/)
