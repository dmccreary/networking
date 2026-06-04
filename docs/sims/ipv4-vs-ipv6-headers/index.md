---
title: IPv4 vs. IPv6 Header Comparison
description: IPv4 vs. IPv6 Header Comparison
status: scaffold
library: p5.js
bloom_level: TBD
---

# IPv4 vs. IPv6 Header Comparison



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 9: The Network Layer and IP Addressing](../../chapters/09-network-layer-and-ip/index.md).

```text
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

## Related Resources

- [Chapter 9: The Network Layer and IP Addressing](../../chapters/09-network-layer-and-ip/index.md)
