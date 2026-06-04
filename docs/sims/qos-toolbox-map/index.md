---
title: The QoS Toolbox
description: The QoS Toolbox
status: scaffold
library: p5.js
bloom_level: TBD
---

# The QoS Toolbox



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 4: Network Performance and Quality of Service](../../chapters/04-performance-and-qos/index.md).

```text
Type: infographic
**sim-id:** qos-toolbox-map<br/>
**Library:** p5.js<br/>
**Status:** Specified

Render an infographic that places each QoS mechanism on a horizontal end-to-end path, so students can see which mechanisms apply at the edge, which apply in the core, and which are end-to-end signaling.

Canvas: 920 px wide by 540 px tall, responsive down to 360 px.

Layout:

- A horizontal swimlane diagram with a path drawn left-to-right: Sender → Edge Router → Core Router 1 → Core Router 2 → Edge Router → Receiver.
- Six labeled mechanism callouts attached to specific places on the path:
  - "Token / Leaky Bucket Shaping" attached at the Sender's edge router (ingress shaping).
  - "DSCP Marking (DiffServ)" attached at both edge routers (mark on entry, classify on exit).
  - "Per-Class Queues" attached at each core router.
  - "Fair Queuing / WFQ" attached at each core router.
  - "RSVP Signaling (IntServ)" attached as a separate path that runs along the data path but is labeled as out-of-band signaling.
  - "Admission Control" attached at the sender's edge router.
- A second row beneath the path summarizes the *cost* of each mechanism: "Per-flow state required" for IntServ and admission control; "Stateless — per-packet only" for DiffServ and fair queuing.

Interactivity:

- Click a callout to highlight its position on the path and pop a sidebar with the mechanism's purpose, its limitations, and its typical deployment scenario.
- A toggle "Show net-neutrality flag" overlays a small icon on each mechanism that *could* be used to discriminate across customers (DiffServ marking, admission control), so students see which levers are at the heart of the policy debate.

Visual style:

- Path: a thick honey-amber line with chevron arrows.
- Edge routers: hexagons in slate with a "border" badge.
- Core routers: hexagons in deeper slate.
- Mechanism callouts: rounded rectangles in distinct colors.

Learning objective (Bloom — Analyzing): Students decompose the QoS toolbox by location of action (edge ingress, core, end-to-end signaling) and by per-flow-state requirement (stateful vs. stateless).
```

## Related Resources

- [Chapter 4: Network Performance and Quality of Service](../../chapters/04-performance-and-qos/index.md)
