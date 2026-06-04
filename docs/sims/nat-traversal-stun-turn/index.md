---
title: "NAT Traversal with STUN and TURN"
description: "Interactive p5.js MicroSim: nat traversal with stun and turn."
image: /sims/nat-traversal-stun-turn/nat-traversal-stun-turn.png
og:image: /sims/nat-traversal-stun-turn/nat-traversal-stun-turn.png
twitter:image: /sims/nat-traversal-stun-turn/nat-traversal-stun-turn.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
quality_score: 0
---

# NAT Traversal with STUN and TURN

<iframe src="main.html" height="600" width="100%" scrolling="no"></iframe>

[Run the NAT Traversal with STUN and TURN MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

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
[Chapter 14: Network Programming with Sockets](../../chapters/14-network-programming/index.md).

```
Type: microsim
**sim-id:** nat-traversal-stun-turn<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that shows two peers, each behind their own NAT, discovering each other's external addresses via STUN and falling back to TURN when hole punching fails.

Canvas: 960 px wide by 600 px tall, responsive down to 360 px. A 100 px control panel sits below.

Topology:

- Peer A (left): private IP `10.0.0.5:50001`, behind NAT-A with public IP `203.0.113.1`.
- Peer B (right): private IP `192.168.1.10:50002`, behind NAT-B with public IP `198.51.100.1`.
- STUN server in the middle-top with public address `stun.example.com:3478`.
- TURN relay in the middle-bottom with public address `turn.example.com:3478`.
- Signaling service (small box top-center) carries candidate addresses between peers.

Animation modes (selectable from a tab control):

- **STUN successful (cone NAT)**: Each peer sends a STUN binding request; the server replies with the observed external address. Peers exchange candidates via signaling. Each peer sends a probe to the other's external address; both NATs open mappings; direct UDP flow established.
- **STUN fails, TURN required (symmetric NAT)**: STUN returns an external address, but the symmetric NAT changes ports per destination, so the address is useless for B → A. TURN: peer A allocates a relay binding on the TURN server. Peer B connects to the relay address. Traffic flows through the relay.

Controls panel:

- Mode tabs: Cone NAT (STUN) / Symmetric NAT (TURN).
- Buttons: Step / Play / Reset.
- Toggle: "Show signaling messages" reveals the candidate-exchange flow.
- Toggle: "Visualize bandwidth path" shows how TURN doubles bytes-on-wire compared to direct STUN.

Visual style:

- Peers: rounded rectangles with laptop icons.
- NATs: hexagons with translation tables visible.
- STUN/TURN servers: rounded rectangles with cloud icons.
- Successful path: green; relay path: amber.

Learning objectives:

- (Bloom — Understanding) Students explain how STUN discovers external addresses.
- (Bloom — Analyzing) Students compare the bandwidth and latency cost of STUN-direct vs. TURN-relayed connections.
- (Bloom — Evaluating) Students judge when TURN is required given NAT type.

Implement in pure p5.js with the existing MicroSim CSS theme.
```

## Iframe Embed Code

You can add this MicroSim to any web page by adding this HTML:

```html
<iframe src="https://dmccreary.github.io/networking/sims/nat-traversal-stun-turn/main.html"
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
   and how it connects to network programming with sockets.

## References

- [Chapter 14: Network Programming with Sockets](../../chapters/14-network-programming/index.md)
- [ACM/IEEE CS2023 Networking and Communication Knowledge Area](https://csed.acm.org/)
