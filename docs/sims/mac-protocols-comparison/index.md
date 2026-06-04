---
title: MAC Protocol Comparison
description: MAC Protocol Comparison
status: scaffold
library: p5.js
bloom_level: TBD
---

# MAC Protocol Comparison



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 6: Link Layer Fundamentals and Reliable Transfer](../../chapters/06-link-layer-fundamentals/index.md).

```text
Type: microsim
**sim-id:** mac-protocols-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that animates four MAC protocols on a single shared medium with several competing devices, so students can compare collision rates, fairness, and efficiency.

Canvas: 960 px wide by 600 px tall, responsive down to 360 px. A 120 px control panel sits below.

Layout:

- A long horizontal "shared medium" rectangle in the middle of the canvas, with 5 devices attached above and below.
- Four protocol modes selectable by tabs at the top: Pure ALOHA / CSMA/CD / CSMA/CA / Token Passing.
- A timeline at the bottom shows transmissions per device color-coded by success (green), collision (red), or backoff/wait (gray).

Animation per mode:

- Pure ALOHA: devices transmit at random times regardless of channel state; collisions are common.
- CSMA/CD: devices sense the channel before transmitting; collisions detected mid-frame, jam pulse, exponential backoff visualized.
- CSMA/CA: devices wait an interframe gap, perform random backoff before transmitting; explicit ACK after each frame.
- Token Passing: a token icon visibly circulates among devices; only the token holder may transmit.

Controls panel:

- Sliders: number of devices (2–8), per-device offered load (low / medium / high), propagation delay (small / large).
- Buttons: Play / Pause / Reset.
- Live readouts: throughput, collision rate, fairness index across devices.
- "Compare side by side" mode: splits the canvas into a 2×2 grid running all four protocols simultaneously on the same workload.

Visual style:

- Devices as honey-amber rounded rectangles.
- Successful transmissions: green.
- Collisions: red bursts.
- Backoff / wait: dim gray.
- Token: a glowing circle that visibly moves between devices.

Learning objectives:

- (Bloom — Understanding) Students explain why CSMA/CD reduces collisions compared to ALOHA, and why CSMA/CA further sacrifices efficiency for predictability on wireless.
- (Bloom — Analyzing) Students compare throughput, fairness, and worst-case access time across the four protocols.
- (Bloom — Evaluating) Students judge which MAC protocol fits a deployment based on medium type, device count, and load.

Implement in pure p5.js with the existing MicroSim CSS theme.
```

## Related Resources

- [Chapter 6: Link Layer Fundamentals and Reliable Transfer](../../chapters/06-link-layer-fundamentals/index.md)
