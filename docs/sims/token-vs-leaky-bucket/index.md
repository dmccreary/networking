---
title: Token Bucket vs. Leaky Bucket
description: Token Bucket vs. Leaky Bucket
status: scaffold
library: p5.js
bloom_level: TBD
---

# Token Bucket vs. Leaky Bucket



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 4: Network Performance and Quality of Service](../../chapters/04-performance-and-qos/index.md).

```text
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

## Related Resources

- [Chapter 4: Network Performance and Quality of Service](../../chapters/04-performance-and-qos/index.md)
