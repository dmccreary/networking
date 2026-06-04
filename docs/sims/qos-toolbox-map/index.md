---
title: "The QoS Toolbox"
description: "Interactive p5.js MicroSim: the qos toolbox."
image: /sims/qos-toolbox-map/qos-toolbox-map.png
og:image: /sims/qos-toolbox-map/qos-toolbox-map.png
twitter:image: /sims/qos-toolbox-map/qos-toolbox-map.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Analyze
quality_score: 0
---

# The QoS Toolbox

<iframe src="main.html" height="542" width="100%" scrolling="no"></iframe>

[Run the The QoS Toolbox MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Students decompose the QoS toolbox by location of action (edge ingress, core, end-to-end signaling) and by per-flow-state requirement (stateful vs. stateless).

This MicroSim is built with p5.js and is width-responsive, so it adapts to
the width of the page or container it is embedded in.

## How to Use

Use the controls in the panel below the drawing area to explore the concept.
Adjust the sliders, toggle the options, and step through the stages to see how
each change affects what is shown.

## Specification

The full specification below is extracted from
[Chapter 4: Network Performance and Quality of Service](../../chapters/04-performance-and-qos/index.md).

```
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

## Iframe Embed Code

You can add this MicroSim to any web page by adding this HTML:

```html
<iframe src="https://dmccreary.github.io/networking/sims/qos-toolbox-map/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students decompose the QoS toolbox by location of action (edge ingress, core, end-to-end signaling) and by per-flow-state requirement (stateful vs. stateless).

### Bloom Taxonomy Level

**Analyze**

### Suggested Classroom Use

1. **Predict** — Ask students to predict the behavior before they interact.
2. **Explore** — Have students manipulate the controls and observe the results.
3. **Explain** — Ask students to explain, in their own words, what they observed
   and how it connects to network performance and quality of service.

## References

- [Chapter 4: Network Performance and Quality of Service](../../chapters/04-performance-and-qos/index.md)
- [ACM/IEEE CS2023 Networking and Communication Knowledge Area](https://csed.acm.org/)
