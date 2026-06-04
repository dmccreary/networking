---
title: Sliding Window Animation
description: Sliding Window Animation
status: scaffold
library: p5.js
bloom_level: TBD
---

# Sliding Window Animation



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 6: Link Layer Fundamentals and Reliable Transfer](../../chapters/06-link-layer-fundamentals/index.md).

```text
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

## Related Resources

- [Chapter 6: Link Layer Fundamentals and Reliable Transfer](../../chapters/06-link-layer-fundamentals/index.md)
