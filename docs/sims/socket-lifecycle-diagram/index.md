---
title: "TCP and UDP Socket Lifecycle"
description: "Interactive p5.js MicroSim: tcp and udp socket lifecycle."
image: /sims/socket-lifecycle-diagram/socket-lifecycle-diagram.png
og:image: /sims/socket-lifecycle-diagram/socket-lifecycle-diagram.png
twitter:image: /sims/socket-lifecycle-diagram/socket-lifecycle-diagram.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
quality_score: 0
---

# TCP and UDP Socket Lifecycle

<iframe src="main.html" height="642" width="100%" scrolling="no"></iframe>

[Run the TCP and UDP Socket Lifecycle MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Students explain the order of system calls for TCP and UDP and identify which calls block on network events.

This MicroSim is built with p5.js and is width-responsive, so it adapts to
the width of the page or container it is embedded in.

## How to Use

Use the controls in the panel below the drawing area to explore the concept.
Adjust the sliders, toggle the options, and step through the stages to see how
each change affects what is shown.

## Specification

The full specification below is extracted from
[Chapter 14: Network Programming with Sockets](../../chapters/14-network-programming/index.md).

```
Type: infographic
**sim-id:** socket-lifecycle-diagram<br/>
**Library:** p5.js<br/>
**Status:** Specified

Render an interactive infographic that shows the system-call sequence for TCP server, TCP client, and UDP socket programs side by side, with arrows indicating the cross-process synchronization points (e.g., the SYN exchange between TCP client connect and TCP server accept).

Canvas: 960 px wide by 640 px tall, responsive down to 360 px.

Layout:

- Three vertical lanes labeled "TCP Server", "TCP Client", and "UDP (peer)".
- Each lane lists system calls in order from top to bottom: TCP Server (`socket → bind → listen → accept → recv/send → close`), TCP Client (`socket → connect → send/recv → close`), UDP peer (`socket → bind (optional) → sendto/recvfrom → close`).
- Synchronization arrows: dashed arrows between the TCP client `connect` and the TCP server `accept` indicating the three-way handshake. Smaller arrows between client `send` and server `recv` indicating data flow.

Interactivity:

- Click any system call in any lane to see a side panel with: the C function signature, the Python equivalent, what the call blocks on (if anything), and what error conditions to handle.
- Toggle "Show non-blocking variants" inserts the `O_NONBLOCK` versions and the `EAGAIN`/`EWOULDBLOCK` error path for each blocking call.
- Toggle "Show kernel state machine" overlays the TCP state transitions (CLOSED → LISTEN → SYN_RCVD → ESTABLISHED → CLOSE_WAIT → ...) on the TCP server lane.

Visual style:

- Each system call as a labeled rounded rectangle.
- Synchronization arrows in honey amber (TCP) and slate (UDP).
- Side panel with monospace function signatures.

Learning objective (Bloom — Understanding): Students explain the order of system calls for TCP and UDP and identify which calls block on network events.
```

## Iframe Embed Code

You can add this MicroSim to any web page by adding this HTML:

```html
<iframe src="https://dmccreary.github.io/networking/sims/socket-lifecycle-diagram/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students explain the order of system calls for TCP and UDP and identify which calls block on network events.

### Bloom Taxonomy Level

**Understand**

### Suggested Classroom Use

1. **Predict** — Ask students to predict the behavior before they interact.
2. **Explore** — Have students manipulate the controls and observe the results.
3. **Explain** — Ask students to explain, in their own words, what they observed
   and how it connects to network programming with sockets.

## References

- [Chapter 14: Network Programming with Sockets](../../chapters/14-network-programming/index.md)
- [ACM/IEEE CS2023 Networking and Communication Knowledge Area](https://csed.acm.org/)
