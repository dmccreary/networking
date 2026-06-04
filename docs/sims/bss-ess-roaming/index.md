---
title: BSS and ESS Topology
description: BSS and ESS Topology
status: scaffold
library: p5.js
bloom_level: TBD
---

# BSS and ESS Topology



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 8: Wireless and Mobile Networking](../../chapters/08-wireless-and-mobility/index.md).

```text
Type: microsim
**sim-id:** bss-ess-roaming<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that visualizes a multi-AP enterprise Wi-Fi deployment, with a single client device that the user can drag through the floor plan to trigger roaming.

Canvas: 940 px wide by 600 px tall, responsive down to 360 px. A 100 px control panel sits below.

Layout:

- A simple floor plan: a horizontal rectangle representing a building with three rooms separated by walls (rendered as gray bars that attenuate signal).
- Three APs, one per room, each labeled AP-1, AP-2, AP-3. Each AP has a circular signal-strength region drawn in pale color extending around it; regions overlap at room boundaries.
- One client device (laptop icon) that the user can click and drag through the floor plan.
- All three APs share the same SSID "Office_Wi-Fi" but each has its own BSSID (MAC address) shown on hover.

Interactivity:

- The client device automatically associates with whichever AP has the strongest signal at its current position.
- A "current AP" indicator shows the BSSID of the AP the client is associated with.
- When the client crosses into another AP's stronger region, an animation visualizes the roaming handoff: probe request, association response, brief connection drop indicator, reassociation.
- A signal-strength meter shows RSSI from each of the three APs to the client in real time.
- A toggle "Show wired backbone" reveals the switch behind the APs and the path data takes through the wired network.

Controls panel:

- "Drag to move" instruction.
- Toggle: "Auto-walk client" — automatically moves the client along a predefined path so students can watch handoffs.
- Toggle: "Slow handoff" — delays the reassociation to show the brief connectivity gap that real roaming can incur.
- Speed slider for auto-walk.

Visual style:

- APs: rounded rectangles with antenna icons.
- Signal regions: pale concentric circles fading outward.
- Walls: gray bars with reduced signal strength on the far side.
- Client: laptop icon with a small antenna indicator showing current BSSID.

Learning objectives:

- (Bloom — Understanding) Students explain how an SSID is shared across many BSSes to form an ESS.
- (Bloom — Analyzing) Students trace what happens during a Wi-Fi roam, including the brief disconnection and reassociation.
- (Bloom — Evaluating) Students judge how AP placement affects roaming behavior in a building floor plan.

Implement in pure p5.js with the existing MicroSim CSS theme.
```

## Related Resources

- [Chapter 8: Wireless and Mobile Networking](../../chapters/08-wireless-and-mobility/index.md)
