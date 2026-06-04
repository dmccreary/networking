---
title: OSI vs. TCP/IP Layer Mapping
description: OSI vs. TCP/IP Layer Mapping
status: scaffold
library: p5.js
bloom_level: TBD
---

# OSI vs. TCP/IP Layer Mapping



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 3: Network Architecture and Layered Models](../../chapters/03-architecture-and-layering/index.md).

```text
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

## Related Resources

- [Chapter 3: Network Architecture and Layered Models](../../chapters/03-architecture-and-layering/index.md)
