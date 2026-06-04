---
title: DNS Resolution Walkthrough
description: DNS Resolution Walkthrough
status: scaffold
library: p5.js
bloom_level: TBD
---

# DNS Resolution Walkthrough



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 13: Application Layer Protocols](../../chapters/13-application-layer/index.md).

```text
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

## Related Resources

- [Chapter 13: Application Layer Protocols](../../chapters/13-application-layer/index.md)
