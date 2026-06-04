---
title: Ethernet Frame Format
description: Ethernet Frame Format
status: scaffold
library: p5.js
bloom_level: TBD
---

# Ethernet Frame Format



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 7: Ethernet, Switching, and VLANs](../../chapters/07-ethernet-and-vlans/index.md).

```text
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

## Related Resources

- [Chapter 7: Ethernet, Switching, and VLANs](../../chapters/07-ethernet-and-vlans/index.md)
