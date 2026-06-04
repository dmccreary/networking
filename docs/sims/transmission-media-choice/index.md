---
title: "Choosing a Transmission Medium"
description: "Interactive p5.js MicroSim: choosing a transmission medium."
image: /sims/transmission-media-choice/transmission-media-choice.png
og:image: /sims/transmission-media-choice/transmission-media-choice.png
twitter:image: /sims/transmission-media-choice/transmission-media-choice.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Apply
quality_score: 0
---

# Choosing a Transmission Medium

<iframe src="main.html" height="602" width="100%" scrolling="no"></iframe>

[Run the Choosing a Transmission Medium MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Students apply medium-selection criteria to a deployment scenario and justify their choice based on bandwidth, distance, mobility, EMI, and cost.

This MicroSim is built with p5.js and is width-responsive, so it adapts to
the width of the page or container it is embedded in.

## How to Use

Use the controls in the panel below the drawing area to explore the concept.
Adjust the sliders, toggle the options, and step through the stages to see how
each change affects what is shown.

## Specification

The full specification below is extracted from
[Chapter 5: The Physical Layer](../../chapters/05-physical-layer/index.md).

```
Type: infographic
**sim-id:** transmission-media-choice<br/>
**Library:** p5.js<br/>
**Status:** Specified

Render an interactive infographic that helps students choose a transmission medium based on deployment constraints (distance, mobility, EMI environment, cost budget).

Canvas: 920 px wide by 600 px tall, responsive down to 360 px.

Tree layout:

1. Root: "Need mobility?" → Yes (wireless branch) | No (continue).
2. "Distance > 1 km?" → Yes (fiber) | No (continue).
3. "EMI environment severe?" → Yes (fiber or shielded twisted pair / coax) | No (continue).
4. "Cost-sensitive bulk install?" → Yes (twisted pair) | No (consider fiber for future-proofing).

Each leaf is a labeled box with the recommended medium, a representative typical use case, and a small icon (twisted-pair icon, coax icon, fiber icon, antenna icon).

Interactivity:

- Each tree node is clickable. When clicked, the path from root highlights in honey amber; off-path branches dim.
- Hover on a leaf shows a side panel with that medium's typical bandwidth, attenuation per km, EMI immunity, and approximate cost per meter.
- A reset button collapses the tree.

Visual style:

- Tree edges drawn as honey-amber arrows.
- Decision nodes: rounded rectangles in slate.
- Leaf nodes: rounded rectangles in honey amber.

Learning objective (Bloom — Applying): Students apply medium-selection criteria to a deployment scenario and justify their choice based on bandwidth, distance, mobility, EMI, and cost.
```

## Iframe Embed Code

You can add this MicroSim to any web page by adding this HTML:

```html
<iframe src="https://dmccreary.github.io/networking/sims/transmission-media-choice/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students apply medium-selection criteria to a deployment scenario and justify their choice based on bandwidth, distance, mobility, EMI, and cost.

### Bloom Taxonomy Level

**Apply**

### Suggested Classroom Use

1. **Predict** — Ask students to predict the behavior before they interact.
2. **Explore** — Have students manipulate the controls and observe the results.
3. **Explain** — Ask students to explain, in their own words, what they observed
   and how it connects to the physical layer.

## References

- [Chapter 5: The Physical Layer](../../chapters/05-physical-layer/index.md)
- [ACM/IEEE CS2023 Networking and Communication Knowledge Area](https://csed.acm.org/)
