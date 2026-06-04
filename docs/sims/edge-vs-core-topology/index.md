---
title: Edge versus Core in a Small Network
description: Edge versus Core in a Small Network
status: scaffold
library: vis-network
bloom_level: TBD
---

# Edge versus Core in a Small Network



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 1: Introduction to Networks and Communication](../../chapters/01-intro-to-networks/index.md).

```text
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

## Related Resources

- [Chapter 1: Introduction to Networks and Communication](../../chapters/01-intro-to-networks/index.md)
