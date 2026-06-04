---
title: Anatomy of a Man-in-the-Middle Attack
description: Anatomy of a Man-in-the-Middle Attack
status: scaffold
library: p5.js
bloom_level: TBD
---

# Anatomy of a Man-in-the-Middle Attack



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 12: Network Security](../../chapters/12-network-security/index.md).

```text
Type: microsim
**sim-id:** mitm-and-tls-defense<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that animates a man-in-the-middle attack on an unprotected connection, then on a TLS-protected connection, demonstrating how authentication blocks the attack.

Canvas: 960 px wide by 600 px tall, responsive down to 360 px. A 120 px control panel sits below.

Layout:

- Three nodes arranged horizontally: Client (left), Attacker (middle), Server (right).
- A "Real path" toggle: client believes traffic goes direct to server, but actually traverses the attacker.

Animation phases:

- **Phase 1 — Plaintext.** Client sends "Send $1000 to Alice" in cleartext. Attacker reads it, modifies to "Send $10000 to Mallory", and forwards. Server processes the modified message. Attack succeeds.
- **Phase 2 — TLS without verification (incorrect).** Client connects via TLS but skips certificate verification. Attacker presents its own fake certificate, completes its own TLS handshake with the client (in the role of fake server) and a separate one with the real server (as fake client). Attacker still reads everything.
- **Phase 3 — TLS with proper certificate verification.** Client refuses the fake certificate (because it is signed by an unknown CA). Connection fails to establish; attack fails. Optionally show the real CA-signed certificate and successful negotiation.

Controls panel:

- Buttons: Step / Play / Reset.
- Phase tabs.
- Toggle: "Show certificate chain" reveals the chain validation steps in Phase 3.
- Toggle: "Show pinned certificate" shows certificate pinning catching even an attacker with a CA-signed fake certificate.

Visual style:

- Client / Attacker / Server: rounded rectangles with appropriate icons.
- Plaintext messages: visible bytes.
- Encrypted messages: padlock icons.
- Modified messages highlighted in red.

Learning objectives:

- (Bloom — Understanding) Students explain how MITM works and what authentication adds.
- (Bloom — Analyzing) Students decompose a TLS handshake into the steps that actually defeat MITM.
- (Bloom — Evaluating) Students judge when certificate verification is sufficient and when pinning adds value.

Implement in pure p5.js with the existing MicroSim CSS theme.
```

## Related Resources

- [Chapter 12: Network Security](../../chapters/12-network-security/index.md)
