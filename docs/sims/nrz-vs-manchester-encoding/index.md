---
title: NRZ vs. Manchester Encoding
description: NRZ vs. Manchester Encoding
status: scaffold
library: p5.js
bloom_level: TBD
---

# NRZ vs. Manchester Encoding



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 5: The Physical Layer](../../chapters/05-physical-layer/index.md).

```text
Type: microsim
**sim-id:** nrz-vs-manchester-encoding<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that lets students enter a bit pattern and see the resulting voltage waveform under NRZ and Manchester encoding side by side.

Canvas: 920 px wide by 520 px tall, responsive down to 360 px. A 100 px control panel sits below.

Layout:

- A text input box at the top accepts a bit string (e.g., "10110001") with a default of "10110001".
- Below the input, two stacked oscilloscope-style displays:
  - Top trace labeled "NRZ Encoding": a horizontal voltage axis with discrete levels (low and high). The waveform follows the bit pattern directly — high for 1, low for 0 — with no transitions during a run of identical bits.
  - Bottom trace labeled "Manchester Encoding": the same bit pattern, but each bit period contains a mid-bit transition. A 1 is a low-to-high transition; a 0 is a high-to-low transition.
- A vertical dashed line indicates each bit boundary, and a small numeric label above shows which bit (0/1) is being encoded in that period.

Interactivity:

- The user can edit the bit string and the waveforms update live.
- Toggle "Add noise": injects small random voltage offsets and shows how the receiver's decision threshold (a horizontal dashed line at the midpoint) tolerates the noise. Manchester's transition-based decoding is shown to be more robust because the receiver is comparing levels just before and after the mid-bit transition.
- Toggle "Long run of zeros": replaces the input with "00000000" and highlights how NRZ produces a flat line with no clock recovery, while Manchester continues to provide a transition each bit period.

Visual style:

- Voltage traces in honey amber on a slate grid background.
- Bit boundaries as thin vertical lines.
- Decision threshold as a horizontal dashed line in white.

Learning objectives:

- (Bloom — Understanding) Students explain why Manchester encoding always provides at least one transition per bit period.
- (Bloom — Analyzing) Students compare the bandwidth efficiency and clock-recovery properties of NRZ vs. Manchester.
- (Bloom — Evaluating) Students judge which encoding is appropriate for a given combination of distance, noise, and clock-recovery requirements.

Implement in pure p5.js with the existing MicroSim CSS theme. The waveform display should be responsive and remain readable at 360 px wide.
```

## Related Resources

- [Chapter 5: The Physical Layer](../../chapters/05-physical-layer/index.md)
