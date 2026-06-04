---
title: NAT Traversal with STUN and TURN
description: NAT Traversal with STUN and TURN
status: scaffold
library: p5.js
bloom_level: TBD
---

# NAT Traversal with STUN and TURN



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 14: Network Programming with Sockets](../../chapters/14-network-programming/index.md).

```text
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

## Related Resources

- [Chapter 14: Network Programming with Sockets](../../chapters/14-network-programming/index.md)
