---
title: Spanning Tree in Action
description: Spanning Tree in Action
status: scaffold
library: p5.js
bloom_level: TBD
---

# Spanning Tree in Action



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 7: Ethernet, Switching, and VLANs](../../chapters/07-ethernet-and-vlans/index.md).

```text
Type: microsim
**sim-id:** spanning-tree-protocol<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that animates the Spanning Tree Protocol building a loop-free tree from a redundant switch topology.

Canvas: 940 px wide by 600 px tall, responsive down to 360 px. A 120 px control panel sits below.

Topology:

- 5 switches arranged in a partial mesh with redundant links (e.g., a triangle with a tail and a diagonal). Each switch is labeled S1–S5 with a small bridge ID (priority + MAC).
- Hosts are not shown; this is a switch-only topology.

Animation steps:

1. All ports start in a "listening" state, drawn in yellow.
2. Each switch begins emitting BPDUs. The animation shows pulses traveling along each link.
3. Switches compare bridge IDs and elect the lowest-ID switch as root (highlighted with a crown icon).
4. Each non-root switch computes its shortest path to the root; ports on the path are turned green (forwarding), ports that would create loops are turned red (blocking).
5. A scenario button "Link failure" lets students click any link to disable it; the simulation re-runs RSTP and shows convergence as a previously-blocked port turns green.

Controls panel:

- Buttons: Step / Play / Reset.
- Toggle: "Show BPDU contents" — clicking a BPDU pulse displays the proposed root bridge ID and root path cost.
- Buttons: "Inject failure" (random link fails), "Inject root failure" (root bridge goes down).
- Speed slider.

Visual style:

- Switches: rounded rectangles in slate.
- Root bridge: highlighted with a crown icon and honey-amber border.
- Forwarding ports: green dots at link endpoints.
- Blocked ports: red dots.
- BPDUs: small pulsing circles traveling along links.

Learning objectives:

- (Bloom — Understanding) Students explain how STP elects a root and decides which ports to block.
- (Bloom — Analyzing) Students examine convergence behavior under link or root failure.
- (Bloom — Evaluating) Students judge the trade-off between STP simplicity and the bandwidth-efficient alternatives used in modern datacenter fabrics.

Implement in pure p5.js with the existing MicroSim CSS theme.
```

## Related Resources

- [Chapter 7: Ethernet, Switching, and VLANs](../../chapters/07-ethernet-and-vlans/index.md)
