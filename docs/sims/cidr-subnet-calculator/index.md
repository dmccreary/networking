---
title: "CIDR Subnet Calculator"
description: "Interactive p5.js MicroSim: cidr subnet calculator."
image: /sims/cidr-subnet-calculator/cidr-subnet-calculator.png
og:image: /sims/cidr-subnet-calculator/cidr-subnet-calculator.png
twitter:image: /sims/cidr-subnet-calculator/cidr-subnet-calculator.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Apply
quality_score: 0
---

# CIDR Subnet Calculator

<iframe src="main.html" height="562" width="100%" scrolling="no"></iframe>

[Run the CIDR Subnet Calculator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

s:

This MicroSim is built with p5.js and is width-responsive, so it adapts to
the width of the page or container it is embedded in.

## How to Use

Use the controls in the panel below the drawing area to explore the concept.
Adjust the sliders, toggle the options, and step through the stages to see how
each change affects what is shown.

## Specification

The full specification below is extracted from
[Chapter 9: The Network Layer and IP Addressing](../../chapters/09-network-layer-and-ip/index.md).

```
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

## Iframe Embed Code

You can add this MicroSim to any web page by adding this HTML:

```html
<iframe src="https://dmccreary.github.io/networking/sims/cidr-subnet-calculator/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

s:

### Bloom Taxonomy Level

**Apply**

### Suggested Classroom Use

1. **Predict** — Ask students to predict the behavior before they interact.
2. **Explore** — Have students manipulate the controls and observe the results.
3. **Explain** — Ask students to explain, in their own words, what they observed
   and how it connects to the network layer and ip addressing.

## References

- [Chapter 9: The Network Layer and IP Addressing](../../chapters/09-network-layer-and-ip/index.md)
- [ACM/IEEE CS2023 Networking and Communication Knowledge Area](https://csed.acm.org/)
