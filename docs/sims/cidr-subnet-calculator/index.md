---
title: CIDR Subnet Calculator
description: CIDR Subnet Calculator
status: scaffold
library: p5.js
bloom_level: TBD
---

# CIDR Subnet Calculator



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 9: The Network Layer and IP Addressing](../../chapters/09-network-layer-and-ip/index.md).

```text
Type: microsim
**sim-id:** cidr-subnet-calculator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that lets students enter a CIDR block, choose a subnet prefix length, and see the resulting subnets visualized as colored bands on an address-space ruler.

Canvas: 940 px wide by 540 px tall, responsive down to 360 px. A 120 px control panel sits below.

Layout:

- A horizontal address-space ruler at the top showing the entire input CIDR block as a long colored bar with binary, dotted-decimal, and hexadecimal labels at each major boundary.
- Below the ruler, a stacked breakdown of the subnets — each subnet is a colored band labeled with its network address, broadcast address, usable host range, and number of usable hosts.
- A binary view of the network/host bit split: bits in the network portion shown in dark blue, host bits in pale yellow, with the slash position highlighted.

Controls panel:

- Input box for the parent CIDR block (e.g., `198.51.100.0/24`).
- Dropdown for new subnet prefix length (must be ≥ parent's prefix).
- Toggle: "Show subnet mask in dotted decimal" alongside CIDR.
- Toggle: "Variable-length subnetting" — lets the user define mixed-size subnets (e.g., one `/25`, two `/26`s, four `/28`s) and shows how they tile the parent block.

Interactivity:

- As the user changes inputs, the ruler updates live.
- Hover any subnet band to see its first/last addresses and host count.
- Clicking on a host bit toggles it, demonstrating how individual host addresses change while the subnet stays the same.

Visual style:

- Network bits: dark blue.
- Host bits: pale yellow.
- Subnet bands: alternating honey amber and slate.
- Reserved network/broadcast addresses highlighted in red.

Learning objectives:

- (Bloom — Applying) Students compute subnet boundaries given a CIDR block and a target subnet size.
- (Bloom — Analyzing) Students examine the bit-level structure of an address and identify network vs. host portions.
- (Bloom — Evaluating) Students judge whether a given subnetting plan efficiently uses the parent block.

Implement in pure p5.js with the existing MicroSim CSS theme.
```

## Related Resources

- [Chapter 9: The Network Layer and IP Addressing](../../chapters/09-network-layer-and-ip/index.md)
