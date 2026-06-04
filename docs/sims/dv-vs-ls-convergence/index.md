---
title: Distance-Vector vs. Link-State Convergence
description: Distance-Vector vs. Link-State Convergence
status: scaffold
library: p5.js
bloom_level: TBD
---

# Distance-Vector vs. Link-State Convergence



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 10: Routing and Forwarding](../../chapters/10-routing-and-forwarding/index.md).

```text
Type: microsim
**sim-id:** dv-vs-ls-convergence<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that animates how a small network converges under distance-vector and link-state algorithms when a link fails.

Canvas: 960 px wide by 620 px tall, responsive down to 360 px. A 100 px control panel sits below.

Layout:

- A network of 6 routers arranged in a partial mesh, with link costs labeled.
- The canvas is split into two side-by-side mirrors of the same topology: left is "RIP (distance vector)", right is "OSPF (link state)".
- Each router displays its current routing table — destination, next hop, cost — updated as messages flow.

Animation:

- Step 1: Both networks converge on identical routing tables.
- Step 2: A specific link fails (user clicks to choose).
- RIP side: routers exchange vectors round by round; count-to-infinity may visible appear and the update interval is shown as a slow tick.
- OSPF side: a flooding wave of LSAs propagates immediately; each router runs Dijkstra and updates within seconds.
- A side-by-side "convergence time" counter increments.

Controls panel:

- Dropdown: link to fail.
- Buttons: Step / Play / Reset.
- Toggle: "Enable split horizon" (RIP side only) — turns on/off the loop-prevention.
- Toggle: "Enable poison reverse".
- Speed slider for RIP update interval.

Visual style:

- Routers as rounded rectangles with router IDs.
- Active links: green; failed link: red dashed; flooding wave: pulsing blue.
- Routing table cells: highlight changed entries in honey amber.

Learning objectives:

- (Bloom — Understanding) Students explain how each protocol family responds to a topology change.
- (Bloom — Analyzing) Students compare convergence time, message overhead, and CPU cost.
- (Bloom — Evaluating) Students judge which family is appropriate for a given network size.

Implement in pure p5.js with the existing MicroSim CSS theme.
```

## Related Resources

- [Chapter 10: Routing and Forwarding](../../chapters/10-routing-and-forwarding/index.md)
