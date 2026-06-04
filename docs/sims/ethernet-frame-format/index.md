---
title: "Ethernet Frame Format"
description: "Interactive p5.js MicroSim: ethernet frame format."
image: /sims/ethernet-frame-format/ethernet-frame-format.png
og:image: /sims/ethernet-frame-format/ethernet-frame-format.png
twitter:image: /sims/ethernet-frame-format/ethernet-frame-format.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Remember
quality_score: 0
---

# Ethernet Frame Format

<iframe src="main.html" height="482" width="100%" scrolling="no"></iframe>

[Run the Ethernet Frame Format MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

(Bloom — Remembering and Understanding): Students recall the byte layout of an Ethernet frame and explain the purpose of each field.

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
Type: infographic
**sim-id:** ethernet-frame-format<br/>
**Library:** p5.js<br/>
**Status:** Specified

Render an interactive infographic that shows the byte-level layout of an Ethernet frame, with hoverable annotations explaining each field.

Canvas: 920 px wide by 480 px tall, responsive down to 360 px.

Layout:

- A horizontal "byte ruler" at the top shows positions 0-1517 (with breaks for the variable payload).
- Below the ruler, a frame is rendered as a series of color-coded blocks, each labeled with its field name and size:
  - Preamble (7 bytes) — pale gray
  - SFD (1 byte) — slate
  - Destination MAC (6 bytes) — honey amber
  - Source MAC (6 bytes) — honey amber
  - EtherType / Length (2 bytes) — green
  - Payload (46–1500 bytes) — light blue (variable width)
  - FCS (4 bytes) — brown
- Each block has a small label above showing field name and offset; below, an example value (e.g., `f0:18:98:01:23:45` for source MAC, `0x0800` for EtherType).

Interactivity:

- Hover any block raises a callout with a one-paragraph explanation of the field's purpose, the values commonly seen, and the standard reference (IEEE 802.3 section).
- A toggle "Add 802.1Q tag" inserts a 4-byte VLAN tag between source MAC and EtherType, with explanatory text — preview for the VLAN section later in the chapter.
- A toggle "Show pad bytes" highlights the padding bytes added when payload is below the 46-byte minimum.
- A toggle "Jumbo frame" extends the payload field up to 9000 bytes and adjusts the byte ruler accordingly.

Visual style:

- Blocks share rounded corners and a subtle drop shadow.
- Hovered block: 2 px deep purple border (#4a148c).
- The byte ruler uses a fixed-width font.

Learning objective (Bloom — Remembering and Understanding): Students recall the byte layout of an Ethernet frame and explain the purpose of each field.
```

## Iframe Embed Code

You can add this MicroSim to any web page by adding this HTML:

```html
<iframe src="https://dmccreary.github.io/networking/sims/ethernet-frame-format/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

(Bloom — Remembering and Understanding): Students recall the byte layout of an Ethernet frame and explain the purpose of each field.

### Bloom Taxonomy Level

**Remember**

### Suggested Classroom Use

1. **Predict** — Ask students to predict the behavior before they interact.
2. **Explore** — Have students manipulate the controls and observe the results.
3. **Explain** — Ask students to explain, in their own words, what they observed
   and how it connects to ethernet, switching, and vlans.

## References

- [Chapter 7: Ethernet, Switching, and VLANs](../../chapters/07-ethernet-and-vlans/index.md)
- [ACM/IEEE CS2023 Networking and Communication Knowledge Area](https://csed.acm.org/)
