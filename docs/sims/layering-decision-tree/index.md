---
title: "Layering Decision Tree"
description: "Interactive p5.js MicroSim: layering decision tree."
image: /sims/layering-decision-tree/layering-decision-tree.png
og:image: /sims/layering-decision-tree/layering-decision-tree.png
twitter:image: /sims/layering-decision-tree/layering-decision-tree.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Apply
quality_score: 0
---

# Layering Decision Tree

<iframe src="main.html" height="634" width="100%" scrolling="no"></iframe>

[Run the Layering Decision Tree MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

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
[Chapter 3: Network Architecture and Layered Models](../../chapters/03-architecture-and-layering/index.md).

```
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

## Iframe Embed Code

You can add this MicroSim to any web page by adding this HTML:

```html
<iframe src="https://dmccreary.github.io/networking/sims/layering-decision-tree/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

s:

### Bloom Taxonomy Level

**Apply**

### Suggested Classroom Use

1. **Predict** — Ask students to predict the behavior before they interact.
2. **Explore** — Have students manipulate the controls and observe the results.
3. **Explain** — Ask students to explain, in their own words, what they observed
   and how it connects to network architecture and layered models.

## References

- [Chapter 3: Network Architecture and Layered Models](../../chapters/03-architecture-and-layering/index.md)
- [ACM/IEEE CS2023 Networking and Communication Knowledge Area](https://csed.acm.org/)
