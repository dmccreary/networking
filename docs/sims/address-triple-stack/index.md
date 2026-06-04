---
title: The Three Identifiers Across the Protocol Stack
description: The Three Identifiers Across the Protocol Stack
status: scaffold
library: p5.js
bloom_level: TBD
---

# The Three Identifiers Across the Protocol Stack



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 1: Introduction to Networks and Communication](../../chapters/01-intro-to-networks/index.md).

```text
Type: infographic
**sim-id:** address-triple-stack<br/>
**Library:** p5.js<br/>
**Status:** Specified

Render an infographic that visually stacks the three identifiers against the three lower protocol layers they belong to.

Canvas: 800 px wide by 520 px tall, responsive to container width down to 360 px.

Layout:

- Three horizontal bands stacked vertically. From top to bottom: "Transport Layer (port number)", "Network Layer (IP address)", "Link Layer (MAC address)". Each band fills the full canvas width and is roughly 140 px tall.
- Color-code each band: transport in honey amber (#F5A623), network in signal blue (#1976D2), link in deep hive brown (#5D4037). Each band has a contrasting white label on the left edge.
- On the right side of each band, render an example value in large monospace font: `443` for transport, `2001:db8::1` for network, `f0:18:98:01:23:45` for link.
- On the left side of each band, render a one-sentence plain-English description: "Which application?" for transport, "Which host on the Internet?" for network, "Which neighbor on this link?" for link.

Interactivity:

- Hover on a band raises a callout that explains what the identifier looks like and gives a second example value.
- A small toggle button at the top labeled "IPv4 / IPv6" switches the network band's example between `192.0.2.10` and `2001:db8::1`.

The infographic should be implemented in p5.js using the existing MicroSim styling. Use a 1 px slate border between bands. Ensure the toggle is touch-friendly on mobile.

Learning objective (Bloom — Understanding): Students explain why three different identifiers are used together and which question each one answers.
```

## Related Resources

- [Chapter 1: Introduction to Networks and Communication](../../chapters/01-intro-to-networks/index.md)
