---
title: Network Lab Topology with Namespaces and netem
description: Network Lab Topology with Namespaces and netem
status: scaffold
library: p5.js
bloom_level: TBD
---

# Network Lab Topology with Namespaces and netem



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 15: Network Operations and Measurement](../../chapters/15-network-operations/index.md).

```text
Type: microsim
**sim-id:** virtual-network-lab<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that visualizes a small Linux-host virtual network lab and lets students apply impairments to specific interfaces.

Canvas: 960 px wide by 600 px tall, responsive down to 360 px. A 120 px control panel sits below.

Topology:

- A single host containing 4 network namespaces: client, router, server-east, server-west.
- A Linux bridge `br0` connects client to router; another bridge `br1` connects router to both servers.
- veth pairs are drawn explicitly between namespaces and bridges.

Animation:

- A traffic source in `client` sends test packets to `server-east` or `server-west`. Packet animations show traffic flowing through the bridges and router.
- When tc netem is applied (via the controls), a small "impairment" badge appears on the affected interface, and packets visibly slow, get dropped, or reorder.
- A real-time stats panel shows RTT, throughput, and loss observed by the client.

Controls panel:

- Per-interface dropdowns to apply netem impairments: latency (0–500 ms), jitter (0–100 ms), loss (0–10%), reorder (0–10%).
- Test buttons: ping (send ICMP), iperf-style throughput, http GET (large file).
- Reset all impairments.
- Toggle: "Show command line" displays the equivalent `tc netem` and `ip netns` commands the simulation is emulating.

Visual style:

- Namespaces: rounded rectangles with namespace icons.
- Bridges: hexagons.
- veth pairs: dashed amber edges.
- Impairment badges: red for loss, blue for delay, green for reorder.
- Packets: small dots animated along edges.

Learning objectives:

- (Bloom — Understanding) Students explain how Linux namespaces and bridges build a virtual network on one host.
- (Bloom — Applying) Students choose and apply tc netem impairments to test specific application behaviors.
- (Bloom — Analyzing) Students decompose observed application behavior under impairment into its causes (delay, loss, reorder).

Implement in pure p5.js with the existing MicroSim CSS theme.
```

## Related Resources

- [Chapter 15: Network Operations and Measurement](../../chapters/15-network-operations/index.md)
