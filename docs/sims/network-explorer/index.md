---
title: Interactive Network Explorer
description: Interactive Network Explorer
status: scaffold
library: p5.js
bloom_level: TBD
---

# Interactive Network Explorer



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 1: Introduction to Networks and Communication](../../chapters/01-intro-to-networks/index.md).

```text
Type: microsim
**sim-id:** network-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that lets students click on elements of a small network and see their identifiers and role.

Canvas: 900 px wide by 600 px tall (responsive), with a 120 px control panel below the canvas.

Topology:

- 3 client end systems on the left (a laptop, a phone, a tablet), each with one labeled interface.
- 1 home router in the lower-left core, connected to all three clients.
- 2 ISP routers in the middle (R-ISP-1 and R-ISP-2) connected by core links.
- 1 web server on the right with two interfaces (one to the public network, one to a private backend).

Initial state: every node and link is rendered, but only the labels "Click an element to inspect" appear in the side panel.

Interactivity:

- Click on a host: the side panel shows "Role: End System (Host, Client)" and lists the host's interface(s), each with a generated MAC, IP, and one example port (80, 443, or an ephemeral 50000-range port for the client).
- Click on a router: the side panel shows "Role: Network Node (Router)", lists each interface with its MAC and IP, and notes "No port numbers — routers don't run user applications."
- Click on a link: the side panel shows "Communication Link", lists the two interfaces it connects, and indicates whether it is a wired Ethernet or Wi-Fi link.
- Click on the server: the side panel shows "Role: End System (Host, Server)" and lists the listening ports (80, 443) plus the IP and MAC of each interface.
- A "Reset" button clears the selection.
- A "Quiz Me" button enters a quiz mode: a question appears ("Which element here is a network node but not a host?") and the student must click the correct element to advance.

Visual styling:

- End systems: honey-amber circles with a device glyph.
- Routers: slate hexagons.
- Links: thin slate lines for wired, dashed honey-amber lines for Wi-Fi.
- Selected element: highlighted with a thick deep-purple border (#4a148c) and the side panel updates immediately.

Learning objectives:

- (Bloom — Remembering) Identify which devices in a topology are hosts, end systems, and network nodes.
- (Bloom — Understanding) Explain which identifiers (MAC, IP, port) belong to which kind of device.
- (Bloom — Applying) Distinguish a client port number from a server port number in a sample socket pair.

The MicroSim should be implemented in p5.js with no external dependencies. Use the existing MicroSim CSS theme. The side panel must remain visible on screens 480 px wide or wider; on narrower screens it stacks below the canvas.
```

## Related Resources

- [Chapter 1: Introduction to Networks and Communication](../../chapters/01-intro-to-networks/index.md)
