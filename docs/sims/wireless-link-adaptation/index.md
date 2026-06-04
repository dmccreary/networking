---
title: Wireless Performance vs. Distance
description: Wireless Performance vs. Distance
status: scaffold
library: p5.js
bloom_level: TBD
---

# Wireless Performance vs. Distance



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 8: Wireless and Mobile Networking](../../chapters/08-wireless-and-mobility/index.md).

```text
Type: microsim
**sim-id:** wireless-link-adaptation<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that visualizes how link adaptation steps Wi-Fi modulation down as distance from the access point increases, and how interference further degrades the choice.

Canvas: 940 px wide by 600 px tall, responsive down to 360 px. A 120 px control panel sits below.

Layout:

- Top: a horizontal floor plan with an AP on the left and a draggable client device. The line between them is annotated with current SNR (dB) computed from a path-loss model.
- Middle: a stepped data-rate plot vs. distance, showing the discrete modulation/coding-scheme (MCS) steps as the client moves further from the AP.
- Bottom: a constellation diagram showing the currently-active modulation (BPSK / QPSK / 16-QAM / 64-QAM / 256-QAM / 1024-QAM / 4096-QAM) with noise-induced jitter on the constellation points.

Interactivity:

- Drag the client to change distance; the SNR, modulation, and data rate update live.
- Add walls (drag from a "wall" palette) between AP and client to simulate attenuation.
- Inject interference (slider for interference power) and see modulation step down accordingly.
- "Compare Wi-Fi 5 / Wi-Fi 6 / Wi-Fi 7" toggle changes the modulation set and recomputes data rates at the same SNRs.

Controls panel:

- Distance display (live).
- SNR display.
- Active MCS index and name.
- "Show Shannon limit" toggle that overlays the Shannon-bound capacity curve on the data-rate plot, showing the gap to optimal.
- "Add neighbor AP" button that introduces co-channel interference and shows further degradation.

Visual style:

- AP: amber rounded rectangle.
- Client: laptop icon.
- Constellation diagram: classic circular layout with constellation points and noise clouds.
- Data-rate plot: stepped staircase with each step labeled by modulation name.

Learning objectives:

- (Bloom — Understanding) Students explain how link adaptation chooses a modulation based on channel quality.
- (Bloom — Analyzing) Students decompose a real-world Wi-Fi connection's effective rate into the SNR, modulation, and coding contributions.
- (Bloom — Evaluating) Students judge how AP placement decisions affect effective data rate across a building.

Implement in pure p5.js with the existing MicroSim CSS theme.
```

## Related Resources

- [Chapter 8: Wireless and Mobile Networking](../../chapters/08-wireless-and-mobility/index.md)
