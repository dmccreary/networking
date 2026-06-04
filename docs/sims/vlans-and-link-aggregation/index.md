---
title: VLANs and Link Aggregation Together
description: VLANs and Link Aggregation Together
status: scaffold
library: p5.js
bloom_level: TBD
---

# VLANs and Link Aggregation Together



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 7: Ethernet, Switching, and VLANs](../../chapters/07-ethernet-and-vlans/index.md).

```text
Type: microsim
**sim-id:** vlans-and-link-aggregation<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that visualizes a small enterprise switching topology with VLANs and link aggregation, letting students click frames to trace their paths.

Canvas: 980 px wide by 620 px tall, responsive down to 360 px. A 120 px control panel sits below.

Topology:

- Two switches, S1 and S2, connected by a 4-port LAG (drawn as four parallel lines bundled together).
- 4 hosts attached to S1: H1 in VLAN 10, H2 in VLAN 20, H3 in VLAN 10, H4 in VLAN 30.
- 4 hosts attached to S2: H5 in VLAN 10, H6 in VLAN 20, H7 in VLAN 30, H8 in VLAN 10.
- A router R connects to S1 via a trunk port carrying VLANs 10, 20, and 30, providing inter-VLAN routing.

Animation:

- Click on any host to send a frame from that host to a chosen destination.
- The frame is rendered as a colored rectangle traveling along links; its color reflects its source VLAN.
- When the frame crosses the LAG, it follows one of the four physical members based on a hash of source/destination — the chosen member is highlighted.
- When the frame arrives at a trunk port, an "802.1Q tag" badge appears on it; the badge disappears when the frame egresses on an access port.
- Inter-VLAN frames (e.g., H1 → H6) route through R; the frame is shown changing VLAN tag at the router.

Controls panel:

- Source / destination dropdowns.
- "Send broadcast" button — shows the frame flooding only within its VLAN.
- "Disable LAG member" button — fails one of the four physical links and shows that the LAG keeps working at reduced capacity.
- VLAN visibility toggles.

Visual style:

- VLAN 10: amber. VLAN 20: blue. VLAN 30: green.
- Trunk links: thicker, dashed.
- LAG members: drawn as four parallel lines with a "LAG" label.

Learning objectives:

- (Bloom — Understanding) Students explain how 802.1Q tagging keeps multiple VLANs on one trunk link.
- (Bloom — Applying) Students predict which physical LAG member a given flow will traverse based on a hash function.
- (Bloom — Analyzing) Students decompose an inter-VLAN flow into its access, trunk, and routed segments.

Implement in pure p5.js with the existing MicroSim CSS theme.
```

## Related Resources

- [Chapter 7: Ethernet, Switching, and VLANs](../../chapters/07-ethernet-and-vlans/index.md)
