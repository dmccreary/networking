---
title: "Token Bucket vs. Leaky Bucket"
description: "Interactive p5.js MicroSim: token bucket vs. leaky bucket."
image: /sims/token-vs-leaky-bucket/token-vs-leaky-bucket.png
og:image: /sims/token-vs-leaky-bucket/token-vs-leaky-bucket.png
twitter:image: /sims/token-vs-leaky-bucket/token-vs-leaky-bucket.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
quality_score: 0
---

# Token Bucket vs. Leaky Bucket

<iframe src="main.html" height="592" width="100%" scrolling="no"></iframe>

[Run the Token Bucket vs. Leaky Bucket MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

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
[Chapter 4: Network Performance and Quality of Service](../../chapters/04-performance-and-qos/index.md).

```
Type: microsim
**sim-id:** token-vs-leaky-bucket<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that animates a token bucket and a leaky bucket side by side, processing the same input stream so students can compare their output behaviors.

Canvas: 900 px wide by 560 px tall, responsive down to 360 px. A 100 px control panel sits below.

Layout:

- Left half: leaky bucket. A vertical bucket icon with a small hole at the bottom. Packets arrive at the top as colored squares; the bucket fills if input exceeds drain rate; output emerges from the bottom hole at a constant rate. A side-channel labeled "Dropped" collects overflow.
- Right half: token bucket. A vertical bucket icon. Tokens (small green circles) are generated at a fixed rate and accumulate at the top. Packets arrive separately; each packet that finds a token available consumes one and leaves immediately. Packets that arrive when the bucket is empty wait in a queue or, if the queue overflows, are dropped.

Both halves share a single input stream so students can directly compare behavior. Output streams are visualized as horizontal time-series strips showing packet emission times.

Animation:

- Input stream is generated according to user-configurable bursts: e.g., 5 packets at t=0, idle for 2s, 10 packets at t=2s, idle for 1s, 3 packets at t=3s.
- Below each bucket, a strip chart plots output rate vs. time.
- A combined chart at the bottom overlays both output streams so students can see that leaky-bucket output is uniformly spaced while token-bucket output preserves bursts.

Controls panel:

- Sliders: drain rate (leaky), token-fill rate (token), bucket capacity (both).
- Buttons: Play / Pause / Reset.
- Toggle: "Show drops" — highlights overflow events in red on both buckets.
- Preset buttons: "Smooth source", "Bursty source", "Stress test".

Visual style:

- Leaky bucket water level: pale blue.
- Token bucket tokens: green.
- Packets: colored squares with sequence numbers.
- Output strip charts: the existing MicroSim chart styling.

Learning objectives:

- (Bloom — Understanding) Students explain how each algorithm regulates traffic.
- (Bloom — Analyzing) Students contrast the burst-handling behavior of token vs. leaky bucket.
- (Bloom — Evaluating) Students recommend the appropriate algorithm for a given workload (constant-rate video stream → leaky; bursty file transfer → token).

The MicroSim should be implemented in pure p5.js with the existing MicroSim CSS theme.
```

## Iframe Embed Code

You can add this MicroSim to any web page by adding this HTML:

```html
<iframe src="https://dmccreary.github.io/networking/sims/token-vs-leaky-bucket/main.html"
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
   and how it connects to network performance and quality of service.

## References

- [Chapter 4: Network Performance and Quality of Service](../../chapters/04-performance-and-qos/index.md)
- [ACM/IEEE CS2023 Networking and Communication Knowledge Area](https://csed.acm.org/)
