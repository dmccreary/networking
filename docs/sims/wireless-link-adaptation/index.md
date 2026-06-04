---
title: "Wireless Performance vs. Distance"
description: "Interactive p5.js MicroSim: wireless performance vs. distance."
image: /sims/wireless-link-adaptation/wireless-link-adaptation.png
og:image: /sims/wireless-link-adaptation/wireless-link-adaptation.png
twitter:image: /sims/wireless-link-adaptation/wireless-link-adaptation.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
quality_score: 0
---

# Wireless Performance vs. Distance

<iframe src="main.html" height="602" width="100%" scrolling="no"></iframe>

[Run the Wireless Performance vs. Distance MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

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
[Chapter 8: Wireless and Mobile Networking](../../chapters/08-wireless-and-mobility/index.md).

```
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

## Iframe Embed Code

You can add this MicroSim to any web page by adding this HTML:

```html
<iframe src="https://dmccreary.github.io/networking/sims/wireless-link-adaptation/main.html"
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
   and how it connects to wireless and mobile networking.

## References

- [Chapter 8: Wireless and Mobile Networking](../../chapters/08-wireless-and-mobility/index.md)
- [ACM/IEEE CS2023 Networking and Communication Knowledge Area](https://csed.acm.org/)
