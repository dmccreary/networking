---
title: "OSI vs. TCP/IP Layer Mapping"
description: "Interactive p5.js MicroSim: osi vs. tcp/ip layer mapping."
image: /sims/osi-vs-tcpip-mapping/osi-vs-tcpip-mapping.png
og:image: /sims/osi-vs-tcpip-mapping/osi-vs-tcpip-mapping.png
twitter:image: /sims/osi-vs-tcpip-mapping/osi-vs-tcpip-mapping.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
quality_score: 0
---

# OSI vs. TCP/IP Layer Mapping

<iframe src="main.html" height="614" width="100%" scrolling="no"></iframe>

[Run the OSI vs. TCP/IP Layer Mapping MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Students explain why OSI's seven layers map to TCP/IP's four or five and which OSI layers have no dedicated counterpart in the Internet stack.

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
**sim-id:** osi-vs-tcpip-mapping<br/>
**Library:** p5.js<br/>
**Status:** Specified

Render an infographic that places the OSI seven-layer stack and the TCP/IP four/five-layer stack side by side, with bracket lines showing how OSI layers collapse into TCP/IP layers.

Canvas: 900 px wide by 620 px tall, responsive down to 360 px.

Layout:

- Two vertical stacks separated by a 200 px gap. Left stack labeled "OSI Reference Model" with seven horizontal bands stacked top to bottom: Application (7), Presentation (6), Session (5), Transport (4), Network (3), Data Link (2), Physical (1). Right stack labeled "TCP/IP Model (5-layer view)" with five bands: Application, Transport, Internet, Link, Physical.
- Color-code matching layers identically across both stacks (e.g., transport in honey amber on both sides).
- Draw thick translucent bracket lines from the right edge of each OSI layer to the corresponding TCP/IP layer. The OSI Application, Presentation, and Session layers all bracket together to the TCP/IP Application layer; the Transport, Network, Data Link, and Physical map one-to-one (with the slight wrinkle that some 4-layer presentations of TCP/IP merge Link and Physical).

Interactivity:

- Hover on any layer (either stack) raises a callout listing 2-3 example protocols that operate at that layer.
- A toggle "5-layer / 4-layer" view at the top compresses or separates the link and physical layers in the right-hand stack.
- A second toggle "Highlight: HTTP request" overlays an animation showing where each protocol of an HTTP-over-TLS-over-TCP-over-IPv6 stack lands on each model.

Visual style:

- 1 px slate borders between bands; rounded 6 px corners on each band.
- Bracket lines should be honey-amber with 30% transparency.

Learning objective (Bloom — Understanding): Students explain why OSI's seven layers map to TCP/IP's four or five and which OSI layers have no dedicated counterpart in the Internet stack.
```

## Iframe Embed Code

You can add this MicroSim to any web page by adding this HTML:

```html
<iframe src="https://dmccreary.github.io/networking/sims/osi-vs-tcpip-mapping/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students explain why OSI's seven layers map to TCP/IP's four or five and which OSI layers have no dedicated counterpart in the Internet stack.

### Bloom Taxonomy Level

**Understand**

### Suggested Classroom Use

1. **Predict** — Ask students to predict the behavior before they interact.
2. **Explore** — Have students manipulate the controls and observe the results.
3. **Explain** — Ask students to explain, in their own words, what they observed
   and how it connects to network architecture and layered models.

## References

- [Chapter 3: Network Architecture and Layered Models](../../chapters/03-architecture-and-layering/index.md)
- [ACM/IEEE CS2023 Networking and Communication Knowledge Area](https://csed.acm.org/)
