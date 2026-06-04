---
title: "TLS 1.3 Handshake Walkthrough"
description: "Interactive p5.js MicroSim: tls 1.3 handshake walkthrough."
image: /sims/tls-handshake-walkthrough/tls-handshake-walkthrough.png
og:image: /sims/tls-handshake-walkthrough/tls-handshake-walkthrough.png
twitter:image: /sims/tls-handshake-walkthrough/tls-handshake-walkthrough.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
quality_score: 0
---

# TLS 1.3 Handshake Walkthrough

<iframe src="main.html" height="660" width="100%" scrolling="no"></iframe>

[Run the TLS 1.3 Handshake Walkthrough MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

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
[Chapter 12: Network Security](../../chapters/12-network-security/index.md).

```
Type: microsim
**sim-id:** tls-handshake-walkthrough<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that animates the TLS 1.3 handshake step by step, showing each message and the keys derived at each stage.

Canvas: 940 px wide by 640 px tall, responsive down to 360 px. A 120 px control panel sits below.

Layout:

- Two vertical timelines: Client (left) and Server (right). Time flows top to bottom.
- Each TLS message is drawn as an arrow with a labeled box showing the message type and key contents (e.g., "ClientHello: supported_versions, cipher_suites, key_share, client_random").
- A "key derivation" panel between the timelines updates as each step completes, showing which keys are now derived (early secret, handshake secret, master secret).

Animation phases:

1. ClientHello sent.
2. ServerHello + Certificate + signed transcript sent. Highlight: client now verifies cert chain against preinstalled CAs.
3. Both sides compute DH shared secret. Highlight: forward secrecy because the DH key shares are ephemeral.
4. Client and server derive matching session keys via HKDF.
5. Application data flows, encrypted.

Controls panel:

- Buttons: Step / Play / Reset.
- Toggle: "Show TLS 1.2 (compare)" splits the canvas to also show the older 2-RTT handshake.
- Toggle: "0-RTT mode" replays the handshake using a session ticket; data flows immediately on the first message.
- Toggle: "Compromised CA" injects a malicious cert and shows the verification failure.

Visual style:

- Client messages in honey amber.
- Server messages in slate.
- Encrypted messages drawn with a small lock icon.
- Key-derivation panel with each derived key fading in as it becomes available.

Learning objectives:

- (Bloom — Understanding) Students explain each step of the TLS 1.3 handshake.
- (Bloom — Analyzing) Students compare TLS 1.3 with TLS 1.2 in round trips and security guarantees.
- (Bloom — Evaluating) Students judge when 0-RTT is appropriate and what its limitations are.

Implement in pure p5.js with the existing MicroSim CSS theme.
```

## Iframe Embed Code

You can add this MicroSim to any web page by adding this HTML:

```html
<iframe src="https://dmccreary.github.io/networking/sims/tls-handshake-walkthrough/main.html"
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
   and how it connects to network security.

## References

- [Chapter 12: Network Security](../../chapters/12-network-security/index.md)
- [ACM/IEEE CS2023 Networking and Communication Knowledge Area](https://csed.acm.org/)
