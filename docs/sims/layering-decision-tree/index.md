---
title: Layering Decision Tree
description: Layering Decision Tree
status: scaffold
library: p5.js
bloom_level: TBD
---

# Layering Decision Tree



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 3: Network Architecture and Layered Models](../../chapters/03-architecture-and-layering/index.md).

```text
Type: infographic
**sim-id:** layering-decision-tree<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive decision-tree infographic that helps students choose the right layered architecture for a hypothetical new application.

Canvas: 900 px wide by 640 px tall, responsive down to 360 px.

Tree structure (top to bottom, branching as user clicks):

1. Root question: "What does your application send?" — branches: short request/response | continuous stream | one-to-many.
2. Short request/response branch → "Loss tolerable?" → No (TCP) | Yes (UDP).
3. Continuous stream branch → "Latency or correctness more important?" → Latency (UDP/QUIC, application-level FEC) | Correctness (TCP).
4. One-to-many branch → "Controlled network or public Internet?" → Controlled (multicast) | Public (unicast with replication or anycast).
5. Each leaf shows a recommended transport-layer protocol and an explanation paragraph citing the end-to-end principle.

Interactivity:

- Each tree node is a clickable rounded rectangle.
- When a node is clicked, the path from root to that node is highlighted in honey amber; off-path branches dim.
- A side panel updates with a one-paragraph rationale referring back to the service-model dimensions (connection-oriented vs. connectionless, reliable vs. best-effort, stateful vs. stateless, addressing scope).
- A "Show example apps" toggle annotates each leaf with two real-world apps that match (e.g., the Latency leaf labels "Zoom, FaceTime"; the Correctness leaf labels "Spotify offline download, Netflix").
- A reset button collapses the tree back to the root.

Visual style:

- Tree nodes: rounded rectangles, slate fill with white text.
- Active path: honey-amber edges and node borders.
- Side panel: white background with honey-amber accent on the recommended protocol.

Learning objectives:

- (Bloom — Applying) Students apply service-model criteria to recommend a transport-layer protocol for a new application.
- (Bloom — Evaluating) Students justify their choice by referencing the end-to-end principle and the trade-off between setup latency and reliability.

Implement in pure p5.js with the existing MicroSim CSS. The tree must remain readable on screens 360 px wide (horizontal scroll allowed).
```

## Related Resources

- [Chapter 3: Network Architecture and Layered Models](../../chapters/03-architecture-and-layering/index.md)
