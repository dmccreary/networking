---
title: "DNS Resolution Walkthrough"
description: "Interactive p5.js MicroSim: dns resolution walkthrough."
image: /sims/dns-resolution-walkthrough/dns-resolution-walkthrough.png
og:image: /sims/dns-resolution-walkthrough/dns-resolution-walkthrough.png
twitter:image: /sims/dns-resolution-walkthrough/dns-resolution-walkthrough.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
quality_score: 0
---

# DNS Resolution Walkthrough

<iframe src="main.html" height="622" width="100%" scrolling="no"></iframe>

[Run the DNS Resolution Walkthrough MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

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
[Chapter 13: Application Layer Protocols](../../chapters/13-application-layer/index.md).

```
Type: microsim
**sim-id:** dns-resolution-walkthrough<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that animates a DNS resolution from the user's laptop through their recursive resolver and the DNS hierarchy.

Canvas: 960 px wide by 620 px tall, responsive down to 360 px. A 100 px control panel sits below.

Layout:

- Five labeled nodes arranged top to bottom: "Laptop", "Recursive Resolver", "Root", "TLD Server (.com)", "Authoritative Server (example.com)".
- Bidirectional arrows show queries (down) and answers (up). Each query/answer is labeled with the question/answer.
- A "cache" panel beside the recursive resolver shows currently-cached records with their remaining TTLs.

Animation:

- Step 1: Laptop sends "A example.com?" to resolver. Cache miss.
- Step 2: Resolver asks Root: "Where can I find .com?" Root returns NS records for .com TLD.
- Step 3: Resolver asks .com TLD: "Where can I find example.com?" TLD returns NS records.
- Step 4: Resolver asks Authoritative: "A example.com?" Authoritative returns the IP.
- Step 5: Resolver caches each answer with its TTL and returns the final IP to the laptop.

Subsequent queries: a second query for the same name is answered from cache instantly, demonstrating caching benefits. A third query for `www.example.com` walks only to the authoritative server (TLD info already cached).

Controls panel:

- Buttons: Step / Play / Reset.
- Toggle: "Enable DNSSEC" — adds signature exchanges and verification steps.
- Toggle: "Cache poisoning attack" — shows an attacker injecting a forged response and the resolver caching it (without DNSSEC); with DNSSEC the forged response is rejected.
- Speed slider for animation pace.

Visual style:

- Nodes: rounded rectangles with role-specific icons.
- Queries: honey-amber arrows.
- Answers: slate arrows.
- Cache panel: yellow background with timestamps counting down.

Learning objectives:

- (Bloom — Understanding) Students explain the DNS hierarchy and the role of each tier.
- (Bloom — Analyzing) Students decompose a DNS resolution and identify which queries are answered from cache vs. fresh lookups.
- (Bloom — Evaluating) Students judge how DNSSEC and randomization defend against cache poisoning.

Implement in pure p5.js with the existing MicroSim CSS theme.
```

## Iframe Embed Code

You can add this MicroSim to any web page by adding this HTML:

```html
<iframe src="https://dmccreary.github.io/networking/sims/dns-resolution-walkthrough/main.html"
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
   and how it connects to application layer protocols.

## References

- [Chapter 13: Application Layer Protocols](../../chapters/13-application-layer/index.md)
- [ACM/IEEE CS2023 Networking and Communication Knowledge Area](https://csed.acm.org/)
