---
title: "IPv4 vs. IPv6 Header Comparison"
description: "Interactive p5.js MicroSim: ipv4 vs. ipv6 header comparison."
image: /sims/ipv4-vs-ipv6-headers/ipv4-vs-ipv6-headers.png
og:image: /sims/ipv4-vs-ipv6-headers/ipv4-vs-ipv6-headers.png
twitter:image: /sims/ipv4-vs-ipv6-headers/ipv4-vs-ipv6-headers.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Remember
quality_score: 0
---

# IPv4 vs. IPv6 Header Comparison

<iframe src="main.html" height="582" width="100%" scrolling="no"></iframe>

[Run the IPv4 vs. IPv6 Header Comparison MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

(Bloom — Remembering and Understanding): Students recognize each IPv4 and IPv6 header field, can name what was removed, what was added, and what the redesign accomplished.

This MicroSim is built with p5.js and is width-responsive, so it adapts to
the width of the page or container it is embedded in.

## How to Use

Use the controls in the panel below the drawing area to explore the concept.
Adjust the sliders, toggle the options, and step through the stages to see how
each change affects what is shown.

## Specification

The full specification below is extracted from
[Chapter 9: The Network Layer and IP Addressing](../../chapters/09-network-layer-and-ip/index.md).

```
Type: infographic
**sim-id:** ipv4-vs-ipv6-headers<br/>
**Library:** p5.js<br/>
**Status:** Specified

Render an interactive side-by-side comparison of the IPv4 and IPv6 fixed headers, with hoverable annotations explaining each field.

Canvas: 940 px wide by 580 px tall, responsive down to 360 px.

Layout:

- Two stacked headers, top is IPv4 (20 bytes), bottom is IPv6 (40 bytes).
- Each header is rendered as a grid: rows are 32 bits wide; each field is shown as a colored cell labeled with its name and bit width.
- A small "removed in IPv6" label appears on IPv4 fields that have no IPv6 counterpart (Header Checksum, Identification/Flags/Fragment Offset, IHL, Options).
- A small "new in IPv6" label appears on IPv6 fields that did not exist in IPv4 (Flow Label).
- IP addresses: IPv4 source/dest are 32 bits each; IPv6 source/dest are 128 bits each (rendered as four 32-bit rows for visual symmetry).

Interactivity:

- Hover any cell raises a callout with the field's purpose, typical values, and relevant RFC.
- Toggle "Show example values" populates each field with a sample value (TTL = 64, Hop Limit = 64, Protocol/Next Header = 6 for TCP, etc.).
- Toggle "Show byte ruler" overlays a byte-position label below each row.

Visual style:

- IPv4 fields: honey-amber palette.
- IPv6 fields: signal-blue palette.
- Removed fields: striped slate background.
- New fields: glowing green border.

Learning objective (Bloom — Remembering and Understanding): Students recognize each IPv4 and IPv6 header field, can name what was removed, what was added, and what the redesign accomplished.
```

## Iframe Embed Code

You can add this MicroSim to any web page by adding this HTML:

```html
<iframe src="https://dmccreary.github.io/networking/sims/ipv4-vs-ipv6-headers/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

(Bloom — Remembering and Understanding): Students recognize each IPv4 and IPv6 header field, can name what was removed, what was added, and what the redesign accomplished.

### Bloom Taxonomy Level

**Remember**

### Suggested Classroom Use

1. **Predict** — Ask students to predict the behavior before they interact.
2. **Explore** — Have students manipulate the controls and observe the results.
3. **Explain** — Ask students to explain, in their own words, what they observed
   and how it connects to the network layer and ip addressing.

## References

- [Chapter 9: The Network Layer and IP Addressing](../../chapters/09-network-layer-and-ip/index.md)
- [ACM/IEEE CS2023 Networking and Communication Knowledge Area](https://csed.acm.org/)
