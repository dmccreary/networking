---
title: Packet Fragmentation Walkthrough
description: Packet Fragmentation Walkthrough
status: scaffold
library: p5.js
bloom_level: TBD
---

# Packet Fragmentation Walkthrough



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 9: The Network Layer and IP Addressing](../../chapters/09-network-layer-and-ip/index.md).

```text
Type: microsim
**sim-id:** packet-fragmentation<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that animates a packet traversing a multi-hop path with mismatched MTUs, showing fragmentation in IPv4 and Path-MTU Discovery in IPv6.

Canvas: 940 px wide by 600 px tall, responsive down to 360 px. A 100 px control panel sits below.

Layout:

- A horizontal path: Sender — Link 1 (MTU 9000) — Router R1 — Link 2 (MTU 1500) — Router R2 — Link 3 (MTU 576) — Receiver.
- A large packet (e.g., 4000 bytes) starts at the sender; the animation shows what happens at each MTU mismatch.

Animation modes (selectable from a tab control):

- **IPv4 with DF=0 (legacy):** the packet is fragmented at R1 (4000 → 2× 1500 + 1× 1000 + headers). Fragments reach R2 where each is again fragmented to fit MTU 576. Receiver buffers all fragments and reassembles. A counter tracks fragments and reassembly buffer use.
- **IPv4 with DF=1:** R1 cannot fragment, returns ICMP "Fragmentation Needed" with MTU=1500. Sender retries with 1500-byte packet; R2 returns ICMP "Fragmentation Needed" with MTU=576. Sender retries with 576-byte packets; all reach the receiver intact. PMTU is now 576.
- **IPv6:** sender starts at 4000 bytes; R1 returns ICMPv6 "Packet Too Big" with MTU=1500. Sender retries with 1500-byte packets using Fragment Extension Header (source-only fragmentation) chunks of 1500 bytes carried by the source. Same workflow for R2. PMTU converges to 576.

Controls panel:

- Tab control for the three modes.
- Sliders: link MTU values (per-link).
- Buttons: Step / Play / Reset.
- Counters: fragments created, ICMP messages exchanged, total bytes on each link.

Visual style:

- Original packet: large honey-amber rectangle.
- Fragments: smaller honey-amber rectangles labeled with offset.
- ICMP messages: red arrows traveling backward.
- MTU labels above each link.

Learning objectives:

- (Bloom — Understanding) Students explain what happens at an MTU mismatch in each of the three modes.
- (Bloom — Analyzing) Students decompose the trade-offs between in-transit fragmentation and Path-MTU Discovery.
- (Bloom — Evaluating) Students judge why IPv6 deliberately removed in-transit fragmentation.

Implement in pure p5.js with the existing MicroSim CSS theme.
```

## Related Resources

- [Chapter 9: The Network Layer and IP Addressing](../../chapters/09-network-layer-and-ip/index.md)
