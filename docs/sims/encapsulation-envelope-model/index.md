---
title: "The Nesting Envelope Model"
description: "Interactive p5.js MicroSim: the nesting envelope model."
image: /sims/encapsulation-envelope-model/encapsulation-envelope-model.png
og:image: /sims/encapsulation-envelope-model/encapsulation-envelope-model.png
twitter:image: /sims/encapsulation-envelope-model/encapsulation-envelope-model.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Remember
quality_score: 0
---

# The Nesting Envelope Model

<iframe src="main.html" height="492" width="100%" scrolling="no"></iframe>

[Run the The Nesting Envelope Model MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

(Bloom — Remembering and Understanding): Students recognize the canonical encapsulation order and recall the typical header size at each layer.

This MicroSim is built with p5.js and is width-responsive, so it adapts to
the width of the page or container it is embedded in.

## How to Use

Use the controls in the panel below the drawing area to explore the concept.
Adjust the sliders, toggle the options, and step through the stages to see how
each change affects what is shown.

## Specification

The full specification below is extracted from
[Chapter 2: Standards, Data Units, and Encapsulation](../../chapters/02-standards-and-encapsulation/index.md).

```
Type: diagram
**sim-id:** encapsulation-envelope-model<br/>
**Library:** p5.js<br/>
**Status:** Specified

Render a static diagram that visualizes encapsulation as a series of concentric rectangles, one per layer.

Canvas: 800 px wide by 480 px tall, responsive to container width down to 360 px.

Layout:

- Five concentric rectangles centered on the canvas, drawn from outside to inside:
  - Outermost (largest): Ethernet Frame, brown border (#5D4037), with a small "Header" tab on the left and "Trailer (FCS)" tab on the right.
  - Next: IP Packet, green border (#2e7d32), with a "Header" tab on the left.
  - Next: TCP Segment, blue border (#1976D2), with a "Header" tab on the left.
  - Next: HTTP Message, amber background (#F5A623), labeled "Application Payload".
  - The innermost region is the actual payload bytes (e.g., "GET /index.html HTTP/1.1").
- To the left of the diagram, render a vertical legend listing each layer name, the data unit at that layer, and the typical header size: Application (message, variable); Transport TCP (segment, 20-byte header); Network (packet, 20-byte IPv4 header); Link (frame, 14-byte Ethernet header + 4-byte FCS).
- Below the diagram, render a single horizontal byte ruler showing the running total of header bytes added by each layer — this lets students see the per-layer overhead concretely.

Interactivity:

- Hover on any concentric rectangle's border highlights that layer in the legend and pops a tooltip with the header's most important fields.
- A toggle button at the top labeled "TCP / UDP" switches the second-innermost rectangle between TCP segment (blue, 20 bytes) and UDP datagram (purple, 8 bytes), updating the byte ruler accordingly.

The diagram should be implemented in p5.js using the existing MicroSim styling. Use a 2 px border for each layer rectangle and a 6 px gap between layers so the nesting is visually unambiguous.

Learning objective (Bloom — Remembering and Understanding): Students recognize the canonical encapsulation order and recall the typical header size at each layer.
```

## Iframe Embed Code

You can add this MicroSim to any web page by adding this HTML:

```html
<iframe src="https://dmccreary.github.io/networking/sims/encapsulation-envelope-model/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

(Bloom — Remembering and Understanding): Students recognize the canonical encapsulation order and recall the typical header size at each layer.

### Bloom Taxonomy Level

**Remember**

### Suggested Classroom Use

1. **Predict** — Ask students to predict the behavior before they interact.
2. **Explore** — Have students manipulate the controls and observe the results.
3. **Explain** — Ask students to explain, in their own words, what they observed
   and how it connects to standards, data units, and encapsulation.

## References

- [Chapter 2: Standards, Data Units, and Encapsulation](../../chapters/02-standards-and-encapsulation/index.md)
- [ACM/IEEE CS2023 Networking and Communication Knowledge Area](https://csed.acm.org/)
