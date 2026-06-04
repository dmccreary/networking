---
title: Standards Bodies and What They Govern
description: Standards Bodies and What They Govern
status: scaffold
library: p5.js
bloom_level: TBD
---

# Standards Bodies and What They Govern



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 2: Standards, Data Units, and Encapsulation](../../chapters/02-standards-and-encapsulation/index.md).

```text
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

## Related Resources

- [Chapter 2: Standards, Data Units, and Encapsulation](../../chapters/02-standards-and-encapsulation/index.md)
