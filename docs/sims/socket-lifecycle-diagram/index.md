---
title: TCP and UDP Socket Lifecycle
description: TCP and UDP Socket Lifecycle
status: scaffold
library: p5.js
bloom_level: TBD
---

# TCP and UDP Socket Lifecycle



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 14: Network Programming with Sockets](../../chapters/14-network-programming/index.md).

```text
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

## Related Resources

- [Chapter 14: Network Programming with Sockets](../../chapters/14-network-programming/index.md)
