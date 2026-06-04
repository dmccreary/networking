---
title: "Spanning Tree in Action"
description: "Interactive p5.js MicroSim: spanning tree in action."
image: /sims/spanning-tree-protocol/spanning-tree-protocol.png
og:image: /sims/spanning-tree-protocol/spanning-tree-protocol.png
twitter:image: /sims/spanning-tree-protocol/spanning-tree-protocol.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
quality_score: 0
---

# Spanning Tree in Action

<iframe src="main.html" height="602" width="100%" scrolling="no"></iframe>

[Run the Spanning Tree in Action MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

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
[Chapter 7: Ethernet, Switching, and VLANs](../../chapters/07-ethernet-and-vlans/index.md).

```
Type: microsim
**sim-id:** spanning-tree-protocol<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that animates the Spanning Tree Protocol building a loop-free tree from a redundant switch topology.

Canvas: 940 px wide by 600 px tall, responsive down to 360 px. A 120 px control panel sits below.

Topology:

- 5 switches arranged in a partial mesh with redundant links (e.g., a triangle with a tail and a diagonal). Each switch is labeled S1–S5 with a small bridge ID (priority + MAC).
- Hosts are not shown; this is a switch-only topology.

Animation steps:

1. All ports start in a "listening" state, drawn in yellow.
2. Each switch begins emitting BPDUs. The animation shows pulses traveling along each link.
3. Switches compare bridge IDs and elect the lowest-ID switch as root (highlighted with a crown icon).
4. Each non-root switch computes its shortest path to the root; ports on the path are turned green (forwarding), ports that would create loops are turned red (blocking).
5. A scenario button "Link failure" lets students click any link to disable it; the simulation re-runs RSTP and shows convergence as a previously-blocked port turns green.

Controls panel:

- Buttons: Step / Play / Reset.
- Toggle: "Show BPDU contents" — clicking a BPDU pulse displays the proposed root bridge ID and root path cost.
- Buttons: "Inject failure" (random link fails), "Inject root failure" (root bridge goes down).
- Speed slider.

Visual style:

- Switches: rounded rectangles in slate.
- Root bridge: highlighted with a crown icon and honey-amber border.
- Forwarding ports: green dots at link endpoints.
- Blocked ports: red dots.
- BPDUs: small pulsing circles traveling along links.

Learning objectives:

- (Bloom — Understanding) Students explain how STP elects a root and decides which ports to block.
- (Bloom — Analyzing) Students examine convergence behavior under link or root failure.
- (Bloom — Evaluating) Students judge the trade-off between STP simplicity and the bandwidth-efficient alternatives used in modern datacenter fabrics.

Implement in pure p5.js with the existing MicroSim CSS theme.
```

## Iframe Embed Code

You can add this MicroSim to any web page by adding this HTML:

```html
<iframe src="https://dmccreary.github.io/networking/sims/spanning-tree-protocol/main.html"
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
   and how it connects to ethernet, switching, and vlans.

## References

- [Chapter 7: Ethernet, Switching, and VLANs](../../chapters/07-ethernet-and-vlans/index.md)
- [ACM/IEEE CS2023 Networking and Communication Knowledge Area](https://csed.acm.org/)
