---
title: "Distance-Vector vs. Link-State Convergence"
description: "Interactive p5.js MicroSim: distance-vector vs. link-state convergence."
image: /sims/dv-vs-ls-convergence/dv-vs-ls-convergence.png
og:image: /sims/dv-vs-ls-convergence/dv-vs-ls-convergence.png
twitter:image: /sims/dv-vs-ls-convergence/dv-vs-ls-convergence.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
quality_score: 0
---

# Distance-Vector vs. Link-State Convergence

<iframe src="main.html" height="620" width="100%" scrolling="no"></iframe>

[Run the Distance-Vector vs. Link-State Convergence MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

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
[Chapter 10: Routing and Forwarding](../../chapters/10-routing-and-forwarding/index.md).

```
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

## Iframe Embed Code

You can add this MicroSim to any web page by adding this HTML:

```html
<iframe src="https://dmccreary.github.io/networking/sims/dv-vs-ls-convergence/main.html"
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
   and how it connects to routing and forwarding.

## References

- [Chapter 10: Routing and Forwarding](../../chapters/10-routing-and-forwarding/index.md)
- [ACM/IEEE CS2023 Networking and Communication Knowledge Area](https://csed.acm.org/)
