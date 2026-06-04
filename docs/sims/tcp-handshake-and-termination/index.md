---
title: "TCP Three-Way Handshake and Termination"
description: "Interactive p5.js MicroSim: tcp three-way handshake and termination."
image: /sims/tcp-handshake-and-termination/tcp-handshake-and-termination.png
og:image: /sims/tcp-handshake-and-termination/tcp-handshake-and-termination.png
twitter:image: /sims/tcp-handshake-and-termination/tcp-handshake-and-termination.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
quality_score: 0
---

# TCP Three-Way Handshake and Termination

<iframe src="main.html" height="660" width="100%" scrolling="no"></iframe>

[Run the TCP Three-Way Handshake and Termination MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

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
[Chapter 11: The Transport Layer](../../chapters/11-transport-layer/index.md).

```
Type: microsim
**sim-id:** tcp-handshake-and-termination<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that animates TCP connection setup, data exchange, and termination as a labeled sequence diagram.

Canvas: 940 px wide by 640 px tall, responsive down to 360 px. A 100 px control panel sits below.

Layout:

- Two vertical timelines (Client on the left, Server on the right) running top to bottom.
- Each segment is drawn as a labeled arrow between the timelines, with sequence and acknowledgment numbers shown.
- A current-state label appears beside each timeline at every step (CLOSED → SYN_SENT → ESTABLISHED → FIN_WAIT_1 → FIN_WAIT_2 → TIME_WAIT → CLOSED).

Animation phases:

1. **Handshake**: Client sends SYN(Cseq=100), Server replies SYN+ACK(Sseq=500, ack=101), Client sends ACK(ack=501).
2. **Data exchange**: Client sends DATA(seq=101, len=200), Server ACKs. Server sends DATA(seq=501, len=300), Client ACKs.
3. **Termination**: Client sends FIN(seq=301), Server ACKs. Server sends FIN(seq=801), Client ACKs. Client enters TIME_WAIT.

Controls panel:

- Buttons: Step / Play / Reset.
- Toggle: "Show TCP states" overlays the state machine on the side.
- Toggle: "Drop a packet" causes one of the segments to be lost; show retransmission and timer behavior.
- Toggle: "Half-close" pauses the termination after the first FIN, so students see a half-closed connection.

Visual style:

- Segments: arrows colored by direction (client→server in honey amber, server→client in slate).
- SYN/FIN flags: highlighted with a small badge.
- ACK numbers and sequence numbers in monospace labels.

Learning objectives:

- (Bloom — Understanding) Students explain each step of the three-way handshake and the four-way termination.
- (Bloom — Analyzing) Students decompose a captured TCP exchange into its phases and state transitions.
- (Bloom — Evaluating) Students judge when half-close is useful and why TIME_WAIT exists.

Implement in pure p5.js with the existing MicroSim CSS theme.
```

## Iframe Embed Code

You can add this MicroSim to any web page by adding this HTML:

```html
<iframe src="https://dmccreary.github.io/networking/sims/tcp-handshake-and-termination/main.html"
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
   and how it connects to the transport layer.

## References

- [Chapter 11: The Transport Layer](../../chapters/11-transport-layer/index.md)
- [ACM/IEEE CS2023 Networking and Communication Knowledge Area](https://csed.acm.org/)
