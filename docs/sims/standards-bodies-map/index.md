---
title: "Standards Bodies and What They Govern"
description: "Interactive p5.js MicroSim: standards bodies and what they govern."
image: /sims/standards-bodies-map/standards-bodies-map.png
og:image: /sims/standards-bodies-map/standards-bodies-map.png
twitter:image: /sims/standards-bodies-map/standards-bodies-map.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
quality_score: 0
---

# Standards Bodies and What They Govern

<iframe src="main.html" height="542" width="100%" scrolling="no"></iframe>

[Run the Standards Bodies and What They Govern MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Students explain which standards body to consult when researching a specific networking concern, and which layer of the stack that concern belongs to.

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
Type: infographic
**sim-id:** standards-bodies-map<br/>
**Library:** p5.js<br/>
**Status:** Specified

Render an infographic that maps the four standards bodies introduced in this chapter to the parts of the network they govern.

Canvas: 900 px wide by 540 px tall, responsive down to 360 px wide.

Layout:

- Render five horizontal layer bands stacked vertically, top to bottom: "Application", "Transport", "Network", "Link", "Physical". Color the bands in graduated honey amber (lightest at top, darkest at bottom). Each band fills the full canvas width and is roughly 70 px tall. Place a band label on the left edge.
- On the right side of each band, render colored badges showing which standards body governs that layer. Badges should overlap layers vertically when a body's scope spans multiple layers.
  - IETF badge: signal blue (#1976D2). Spans the top three bands (Application, Transport, Network).
  - IEEE badge: deep hive brown (#5D4037). Spans the bottom two bands (Link, Physical).
  - ISO badge: slate gray (#546e7a). A vertical badge on the far right that spans all five bands, labeled "OSI reference model — vocabulary".
  - ICANN badge: forest green (#2e7d32). A separate horizontal badge floated above the canvas labeled "Names, numbers, ports — across all layers".

Interactivity:

- Hover on a body's badge raises a callout listing 2-3 example outputs (e.g., IETF: "RFC 791 IPv4, RFC 9114 HTTP/3"; IEEE: "802.3 Ethernet, 802.11 Wi-Fi"; ISO: "ISO 7498 OSI model"; ICANN: ".com domain, port 443 registry").
- Hover on a layer band raises a callout naming the data unit at that layer (Application: message, Transport: segment/datagram, Network: packet, Link: frame, Physical: bit).

Use the existing MicroSim CSS theme. The infographic should have a 1 px slate border between bands. No text overlaps badges.

Learning objective (Bloom — Understanding): Students explain which standards body to consult when researching a specific networking concern, and which layer of the stack that concern belongs to.
```

## Iframe Embed Code

You can add this MicroSim to any web page by adding this HTML:

```html
<iframe src="https://dmccreary.github.io/networking/sims/standards-bodies-map/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students explain which standards body to consult when researching a specific networking concern, and which layer of the stack that concern belongs to.

### Bloom Taxonomy Level

**Understand**

### Suggested Classroom Use

1. **Predict** — Ask students to predict the behavior before they interact.
2. **Explore** — Have students manipulate the controls and observe the results.
3. **Explain** — Ask students to explain, in their own words, what they observed
   and how it connects to standards, data units, and encapsulation.

## References

- [Chapter 2: Standards, Data Units, and Encapsulation](../../chapters/02-standards-and-encapsulation/index.md)
- [ACM/IEEE CS2023 Networking and Communication Knowledge Area](https://csed.acm.org/)
