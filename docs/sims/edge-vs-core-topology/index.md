---
title: "Edge versus Core in a Small Network"
description: "Interactive vis-network MicroSim: edge versus core in a small network."
image: /sims/edge-vs-core-topology/edge-vs-core-topology.png
og:image: /sims/edge-vs-core-topology/edge-vs-core-topology.png
twitter:image: /sims/edge-vs-core-topology/edge-vs-core-topology.png
social:
   cards: false
status: implemented
library: vis-network
bloom_level: Understand
quality_score: 0
---

# Edge versus Core in a Small Network

<iframe src="main.html" height="562" width="100%" scrolling="no"></iframe>

[Run the Edge versus Core in a Small Network MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Students explore edge versus core in a small network through interaction.

This MicroSim is built with vis-network and is width-responsive, so it adapts to
the width of the page or container it is embedded in.

## How to Use

Use the controls in the panel below the drawing area to explore the concept.
Adjust the sliders, toggle the options, and step through the stages to see how
each change affects what is shown.

## Specification

The full specification below is extracted from
[Chapter 1: Introduction to Networks and Communication](../../chapters/01-intro-to-networks/index.md).

```
Type: diagram
**sim-id:** edge-vs-core-topology<br/>
**Library:** vis-network<br/>
**Status:** Specified

Render a node-link diagram of a small network showing the edge–core distinction.

Layout:

- A horizontal canvas, 900 px wide by 500 px tall, responsive (scale to container width).
- Two visual zones with subtle background tints: a pale honey-amber band on the left and right thirds (the edges) and a pale slate band in the middle third (the core). Label the bands with large semi-transparent text "Network Edge", "Network Core", "Network Edge".

Nodes:

- Left edge: 4 end systems labeled "Laptop", "Phone", "Desktop", "IoT Sensor". Use a simple device icon (circle with a small monitor glyph) in honey amber (#F5A623).
- Right edge: 3 servers labeled "Web Server", "DNS Server", "Database". Use a server-rack glyph in honey amber.
- Core: 5 router nodes labeled "R1" through "R5", arranged in a partial mesh. Use a hexagonal glyph in slate (#546e7a).

Edges:

- Each end system on the left connects to either R1 or R2. Each server on the right connects to R4 or R5. The five core routers form a partial mesh: R1–R2, R1–R3, R2–R3, R3–R4, R3–R5, R4–R5.
- Style edge links (end-system-to-router) as thin honey-amber lines and core links (router-to-router) as thicker slate lines, to communicate that the core typically uses higher-bandwidth links.

Interactivity:

- Hover on any node shows a tooltip with the node's role: "End System (host)" for left/right edge devices, "Network Node (router)" for core devices.
- Hover on any edge shows a tooltip "Communication Link".

The diagram should be implemented with vis-network. Use the existing learning-graph viewer styling (rounded boxes, soft shadows). Disable physics-based jitter; lay out the graph deterministically.
```

## Iframe Embed Code

You can add this MicroSim to any web page by adding this HTML:

```html
<iframe src="https://dmccreary.github.io/networking/sims/edge-vs-core-topology/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students explore edge versus core in a small network through interaction.

### Bloom Taxonomy Level

**Understand**

### Suggested Classroom Use

1. **Predict** — Ask students to predict the behavior before they interact.
2. **Explore** — Have students manipulate the controls and observe the results.
3. **Explain** — Ask students to explain, in their own words, what they observed
   and how it connects to introduction to networks and communication.

## References

- [Chapter 1: Introduction to Networks and Communication](../../chapters/01-intro-to-networks/index.md)
- [ACM/IEEE CS2023 Networking and Communication Knowledge Area](https://csed.acm.org/)
