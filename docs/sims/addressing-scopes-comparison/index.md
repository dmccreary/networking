---
title: The Four Addressing Scopes
description: The Four Addressing Scopes
status: scaffold
library: p5.js
bloom_level: TBD
---

# The Four Addressing Scopes



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 3: Network Architecture and Layered Models](../../chapters/03-architecture-and-layering/index.md).

```text
Type: microsim
**sim-id:** addressing-scopes-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that animates the four addressing scopes side by side, letting students click each to see its delivery pattern.

Canvas: 960 px wide by 600 px tall, responsive down to 360 px. A 100 px control panel sits below.

Layout:

- The canvas is split into four quadrants, each ~480 × 300 px, labeled "Unicast", "Multicast", "Broadcast", "Anycast".
- Each quadrant contains the same simple topology: 1 sender on the left, 1 router in the middle, and 6 receivers arranged on the right.
- All four quadrants are inactive by default; only one animates at a time, selected by clicking its label or via a tab control.

Animation per quadrant:

- **Unicast**: the sender emits a single packet (honey-amber dot) addressed to receiver 3. The router forwards it; only receiver 3 lights up green; the others stay dim.
- **Multicast**: the sender emits a single packet addressed to a multicast group. The router replicates it at the branching point and forwards copies to receivers 2, 4, and 6 (a subset, the multicast group). Those three light up green; the others stay dim. Annotate "Group members only".
- **Broadcast**: the sender emits a single packet with broadcast destination. The router replicates and forwards to all six receivers; all six light up green.
- **Anycast**: three receivers (1, 3, 5) share the same anycast address; the others have unrelated addresses. The sender emits a single packet to the anycast address. The router selects the "closest" of the three (e.g., receiver 1 based on shortest path), and only that one lights up. A separate animation step shows the same packet, this time arriving via a different ingress router, being delivered to receiver 5 instead — demonstrating that the chosen receiver depends on routing topology.

Controls panel:

- Tab buttons: Unicast / Multicast / Broadcast / Anycast (one selected at a time).
- Step / Play / Reset buttons.
- "Topology source" toggle for the anycast animation: switches between two ingress routers to show that anycast routing depends on origin.

Visual style:

- Sender: hexagon in honey amber.
- Router: octagon in slate.
- Receivers: circles, default dim gray, lit receivers in vibrant green (#43a047).
- Packets: small filled circles in the layer color of the demonstration.
- A small legend in each quadrant summarizes the scope's rule.

Learning objectives:

- (Bloom — Remembering) Students recall that unicast goes to one, multicast to a group, broadcast to all on the link, anycast to the closest of many.
- (Bloom — Analyzing) Students compare the network resource cost of multicast versus unicast for delivering the same data to many receivers.
- (Bloom — Evaluating) Students judge which addressing scope is appropriate for a given application (live sports broadcast → multicast; DNS root server lookup → anycast).

The MicroSim should be implemented in pure p5.js with no external dependencies, using the existing MicroSim CSS theme. Animations should be smooth at 60 FPS and pause on tab switch.
```

## Related Resources

- [Chapter 3: Network Architecture and Layered Models](../../chapters/03-architecture-and-layering/index.md)
