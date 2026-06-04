---
title: "Encapsulation Walkthrough"
description: "Interactive p5.js MicroSim: encapsulation walkthrough."
image: /sims/encapsulation-walkthrough/encapsulation-walkthrough.png
og:image: /sims/encapsulation-walkthrough/encapsulation-walkthrough.png
twitter:image: /sims/encapsulation-walkthrough/encapsulation-walkthrough.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
quality_score: 0
---

# Encapsulation Walkthrough

<iframe src="main.html" height="602" width="100%" scrolling="no"></iframe>

[Run the Encapsulation Walkthrough MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

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
[Chapter 2: Standards, Data Units, and Encapsulation](../../chapters/02-standards-and-encapsulation/index.md).

```
Type: microsim
**sim-id:** encapsulation-walkthrough<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that animates the encapsulation of an HTTP request from sender to receiver and back up the stack at the destination, with a Step / Play / Reset controller.

Canvas: 960 px wide by 600 px tall, responsive down to 360 px wide. A 100 px control panel sits below the canvas.

Layout:

- The canvas is divided into three vertical regions: Sender (left third), Wire (middle third), Receiver (right third).
- Each side stacks four protocol layers vertically, top to bottom: Application, Transport, Network, Link. Use the same color coding as the standards-bodies infographic (gradient honey amber).
- The Wire region is a horizontal line in the middle of the canvas labeled "Communication Link". A small packet glyph travels left-to-right along this line during playback.

Animation steps (one step per click of "Step", or auto-advanced by "Play"):

1. The Application layer on the sender shows a small rectangle labeled "HTTP message" (yellow).
2. Transport layer on the sender adds a "TCP header" (blue) on the left, producing a "TCP segment".
3. Network layer on the sender adds an "IP header" (green) on the left, producing an "IP packet".
4. Link layer on the sender adds an "Ethernet header" (brown) on the left and a "FCS trailer" (brown) on the right, producing an "Ethernet frame".
5. The frame slides into the Wire region as a sequence of bits and travels left to right.
6. The frame arrives at the Receiver Link layer, which strips the Ethernet header and FCS trailer, leaving an IP packet.
7. The Network layer on the receiver strips the IP header, leaving a TCP segment.
8. The Transport layer on the receiver strips the TCP header, leaving an HTTP message.
9. The Application layer on the receiver displays the HTTP message and labels it "Delivered".

Each header rectangle should display its layer name and a sample value (e.g., the IP header rectangle shows "src 192.0.2.10 → dst 198.51.100.5"). Hovering on a header reveals an info tooltip listing 2-3 of its key fields.

Controls panel:

- Step button — advance one step at a time
- Play button — auto-advance with adjustable speed slider (0.5×, 1×, 2×, 4×)
- Reset button — return to step 0
- Layer toggle — checkboxes to skip animation of any layer (useful for showing what UDP looks like with only Transport-Network-Link, or for highlighting the link layer alone)
- "Show byte counts" toggle — when enabled, each header rectangle shows its size in bytes (HTTP message: variable; TCP header: 20 bytes; IP header: 20 bytes; Ethernet header: 14 bytes; FCS trailer: 4 bytes)

Visual style:

- Honey-amber background gradient for layer bands.
- Header rectangles use distinct colors per layer (per the color codes above) with a subtle drop shadow.
- Wire bits should briefly twinkle as the frame travels.

Learning objectives:

- (Bloom — Understanding) Students explain how each layer wraps the layer above and unwraps on receipt.
- (Bloom — Analyzing) Students decompose a frame on the wire into its constituent headers and identify the original application payload.
- (Bloom — Evaluating) Students judge how skipping a layer (e.g., switching TCP for UDP, or running over Wi-Fi rather than Ethernet) changes the encapsulation diagram.

The MicroSim should be implemented in pure p5.js with no external dependencies, using the existing MicroSim CSS theme. All controls must be touch-friendly and keyboard-accessible.
```

## Iframe Embed Code

You can add this MicroSim to any web page by adding this HTML:

```html
<iframe src="https://dmccreary.github.io/networking/sims/encapsulation-walkthrough/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

s:

### Bloom Taxonomy Level

**Understand**

### Suggested Classroom Use

1. **Predict** — Ask students to predict the behavior before they interact.
2. **Explore** — Have students manipulate the controls and observe the results.
3. **Explain** — Ask students to explain, in their own words, what they observed
   and how it connects to standards, data units, and encapsulation.

## References

- [Chapter 2: Standards, Data Units, and Encapsulation](../../chapters/02-standards-and-encapsulation/index.md)
- [ACM/IEEE CS2023 Networking and Communication Knowledge Area](https://csed.acm.org/)
