---
title: "Sliding Window Animation"
description: "Interactive p5.js MicroSim: sliding window animation."
image: /sims/arq-protocols-comparison/arq-protocols-comparison.png
og:image: /sims/arq-protocols-comparison/arq-protocols-comparison.png
twitter:image: /sims/arq-protocols-comparison/arq-protocols-comparison.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
quality_score: 0
---

# Sliding Window Animation

<iframe src="main.html" height="622" width="100%" scrolling="no"></iframe>

[Run the Sliding Window Animation MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

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
[Chapter 6: Link Layer Fundamentals and Reliable Transfer](../../chapters/06-link-layer-fundamentals/index.md).

```
Type: microsim
**sim-id:** arq-protocols-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that animates three ARQ protocols side by side, sending the same sequence of frames over a lossy link, so students can compare bandwidth efficiency.

Canvas: 940 px wide by 620 px tall, responsive down to 360 px. A 120 px control panel sits below.

Layout:

- Three vertical lanes side by side, each ~300 px wide.
  - Left lane: Stop-and-Wait.
  - Middle lane: Go-Back-N (with configurable window size).
  - Right lane: Selective Repeat (with configurable window size).
- Each lane shows a sender on the left, a receiver on the right, and a horizontal time axis flowing downward.
- Frames are drawn as colored arrows from sender to receiver; ACKs as arrows from receiver to sender.
- Lost frames are crossed out in red; retransmissions are drawn in a darker shade of the original color.

Animation:

- Each lane processes the same input: 10 frames numbered 0-9.
- A "loss profile" controls which frames are dropped: e.g., frame 3 lost, all others delivered.
- Time runs simultaneously across the three lanes so students can directly compare elapsed time to deliver all frames.
- A real-time counter in each lane shows total time, retransmissions used, and effective throughput.

Controls panel:

- Sliders: window size (for Go-Back-N and Selective Repeat, 1–8), loss profile (predefined set of patterns or random with a probability slider), RTT (10–500 ms).
- Buttons: Step / Play / Reset.
- Toggle: "Stress test" — runs many random loss patterns and plots a histogram of completion times across the three protocols.

Visual style:

- Frames in honey amber; retransmissions in deeper amber; lost frames crossed out in red.
- ACKs in slate.
- Sender / receiver as rounded rectangles.

Learning objectives:

- (Bloom — Understanding) Students explain how each ARQ variant handles a lost frame.
- (Bloom — Analyzing) Students compare the bandwidth and time costs of Go-Back-N vs. selective repeat under varying loss rates.
- (Bloom — Evaluating) Students choose an ARQ variant for a deployment based on RTT, BER, and receiver-buffer constraints.

Implement in pure p5.js with the existing MicroSim CSS theme.
```

## Iframe Embed Code

You can add this MicroSim to any web page by adding this HTML:

```html
<iframe src="https://dmccreary.github.io/networking/sims/arq-protocols-comparison/main.html"
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
   and how it connects to link layer fundamentals and reliable transfer.

## References

- [Chapter 6: Link Layer Fundamentals and Reliable Transfer](../../chapters/06-link-layer-fundamentals/index.md)
- [ACM/IEEE CS2023 Networking and Communication Knowledge Area](https://csed.acm.org/)
