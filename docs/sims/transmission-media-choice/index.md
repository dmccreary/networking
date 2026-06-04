---
title: Choosing a Transmission Medium
description: Choosing a Transmission Medium
status: scaffold
library: p5.js
bloom_level: TBD
---

# Choosing a Transmission Medium



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 5: The Physical Layer](../../chapters/05-physical-layer/index.md).

```text
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

## Related Resources

- [Chapter 5: The Physical Layer](../../chapters/05-physical-layer/index.md)
