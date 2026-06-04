---
title: Anatomy of a Packet's Journey
description: Anatomy of a Packet's Journey
status: scaffold
library: p5.js
bloom_level: TBD
---

# Anatomy of a Packet's Journey



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 4: Network Performance and Quality of Service](../../chapters/04-performance-and-qos/index.md).

```text
Type: microsim
**sim-id:** four-delay-components<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that shows a single packet moving from sender to receiver across three hops, decomposing the time spent at each stage into the four delay components.

Canvas: 960 px wide by 600 px tall, responsive down to 360 px. A 120 px control panel sits below.

Topology:

- A horizontal path: Sender → Router 1 → Router 2 → Receiver. Distances between nodes are visually proportional to a configurable propagation delay.
- Each router is drawn with a small input buffer (queue) on its left side.

Animation steps:

1. Sender begins transmitting bits onto the first link. As bits flow out, a colored bar grows from the sender into the wire — this bar represents transmission delay; its length is proportional to packet size / link rate.
2. The leading edge of the bar travels along the wire to Router 1 — this represents propagation delay.
3. The packet enters Router 1's input buffer. If the buffer is non-empty (controlled by a slider showing background traffic load), the packet waits — this is queuing delay; visualize the wait as a darker color while the buffer drains.
4. Router 1 inspects headers and performs forwarding lookup — a small spinner over the router represents processing delay.
5. Router 1 transmits onto the next link, and the cycle repeats for hop 2 and hop 3.
6. Receiver finishes receiving the last bit; a horizontal bar at the bottom of the canvas accumulates the four delay components in distinct colors with running totals.

Controls panel:

- Sliders: packet size (64–9000 bytes), link rate (1 Mbps – 100 Gbps, log scale), distance per hop (1 km – 10000 km), background load (0–100%).
- Buttons: Step / Play / Reset.
- Toggle: "Show formulas" — overlays the algebraic expression for each delay component as it animates (\( d_{\text{trans}} = \text{packet}/{\text{rate}} \), \( d_{\text{prop}} = \text{distance}/c \), etc.).
- Toggle: "Stress test" — sweeps load from 0 to 100% and plots the resulting end-to-end latency on a small embedded chart showing the characteristic hockey-stick growth as queuing dominates near saturation.

Visual style:

- Propagation delay: light blue.
- Transmission delay: honey amber.
- Queuing delay: red (proportional to buffer depth, which fluctuates with load).
- Processing delay: green.
- The cumulative bar at the bottom uses the same colors stacked end-to-end.

Learning objectives:

- (Bloom — Understanding) Students explain how each of the four delay components contributes to total latency.
- (Bloom — Applying) Students compute end-to-end latency given packet size, link rate, distance, and load.
- (Bloom — Analyzing) Students identify which delay component dominates in scenarios such as a long satellite link, a saturated office link, or a short uncongested fiber.

The MicroSim should be implemented in pure p5.js with no external dependencies, using the existing MicroSim CSS theme.
```

## Related Resources

- [Chapter 4: Network Performance and Quality of Service](../../chapters/04-performance-and-qos/index.md)
