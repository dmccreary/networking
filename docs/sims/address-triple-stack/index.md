---
title: "The Three Identifiers Across the Protocol Stack"
description: "Interactive p5.js MicroSim: the three identifiers across the protocol stack."
image: /sims/address-triple-stack/address-triple-stack.png
og:image: /sims/address-triple-stack/address-triple-stack.png
twitter:image: /sims/address-triple-stack/address-triple-stack.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
quality_score: 0
---

# The Three Identifiers Across the Protocol Stack

<iframe src="main.html" height="512" width="100%" scrolling="no"></iframe>

[Run the The Three Identifiers Across the Protocol Stack MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Students explain why three different identifiers are used together and which question each one answers.

This MicroSim is built with p5.js and is width-responsive, so it adapts to
the width of the page or container it is embedded in.

## How to Use

Use the controls in the panel below the drawing area to explore the concept.
Adjust the sliders, toggle the options, and step through the stages to see how
each change affects what is shown.

## Specification

The full specification below is extracted from
[Chapter 1: Introduction to Networks and Communication](../../chapters/01-intro-to-networks/index.md).

```
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

## Iframe Embed Code

You can add this MicroSim to any web page by adding this HTML:

```html
<iframe src="https://dmccreary.github.io/networking/sims/address-triple-stack/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students explain why three different identifiers are used together and which question each one answers.

### Bloom Taxonomy Level

**Understand**

### Suggested Classroom Use

1. **Predict** — Ask students to predict the behavior before they interact.
2. **Explore** — Have students manipulate the controls and observe the results.
3. **Explain** — Ask students to explain, in their own words, what they observed
   and how it connects to introduction to networks and communication.

## References

- [Chapter 1: Introduction to Networks and Communication](../../chapters/01-intro-to-networks/index.md)
- [ACM/IEEE CS2023 Networking and Communication Knowledge Area](https://csed.acm.org/)
