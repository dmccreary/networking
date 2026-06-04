---
title: Congestion Control Phases and Algorithms
description: Congestion Control Phases and Algorithms
status: scaffold
library: p5.js
bloom_level: TBD
---

# Congestion Control Phases and Algorithms



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 11: The Transport Layer](../../chapters/11-transport-layer/index.md).

```text
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

## Related Resources

- [Chapter 11: The Transport Layer](../../chapters/11-transport-layer/index.md)
