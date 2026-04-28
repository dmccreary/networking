---
title: Link Layer Fundamentals and Reliable Transfer
description: Reliable transfer over a single link — framing (bit and byte stuffing), error detection (parity, checksum, CRC), forward error correction, ARQ variants (stop-and-wait, sliding window, Go-Back-N, selective repeat), and media access control protocols (ALOHA, CSMA, CSMA/CD, CSMA/CA, token passing).
generated_by: claude skill chapter-content-generator
date: 2026-04-28 00:05:00
version: 0.07
---

# Chapter 6: Link Layer Fundamentals and Reliable Transfer

## Summary

This chapter covers reliable transfer over a single link: framing techniques (bit and byte stuffing), error detection (parity, checksum, CRC), forward error correction, and automatic repeat request variants (stop-and-wait, sliding window, Go-Back-N, selective repeat). It also introduces media access control and the classic protocols — ALOHA, CSMA, CSMA/CD, CSMA/CA, and token passing. Students leave able to reason about how a single link delivers a frame correctly under contention.

## Concepts Covered

This chapter covers the following 18 concepts from the learning graph:

1. Framing
2. Bit Stuffing
3. Byte Stuffing
4. Parity Check
5. Checksum
6. CRC
7. Forward Error Correction
8. Automatic Repeat Request
9. Stop And Wait Protocol
10. Sliding Window
11. Go Back N
12. Selective Repeat
13. Media Access Control
14. ALOHA Protocol
15. CSMA
16. CSMA CD
17. CSMA CA
18. Token Passing

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Networks and Communication](../01-intro-to-networks/index.md)
- [Chapter 2: Standards, Data Units, and Encapsulation](../02-standards-and-encapsulation/index.md)
- [Chapter 3: Network Architecture and Layered Models](../03-architecture-and-layering/index.md)
- [Chapter 5: The Physical Layer](../05-physical-layer/index.md)

---

!!! mascot-welcome "Sharing the dance floor"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Buzz the bee waving welcome">
    Welcome back. Inside the hive, only one forager performs at a time on the dance floor; the others watch and wait. If two danced at once, no one could read the directions. *Let's trace the route!* This chapter is about how computers — many of them sharing the same wire or radio channel — take turns, frame their messages, catch errors, and recover from collisions. It's the social protocol of the link.

## 6.1 What the Link Layer Adds

Chapter 5 ended with a noisy, finite-bandwidth channel that delivers raw bits with some bit error rate. The **link layer** sits directly on top, and its job is to turn that lumpy bit-pipe into something useful for the network layer above. Three responsibilities define the link layer:

- **Framing** — group bits into discrete units (frames) with clear boundaries.
- **Error detection and recovery** — find bits that arrived corrupted and either fix them or arrange a retransmission.
- **Media access control** — decide which device gets to transmit when many share the same medium.

The first two are present on every link, even point-to-point fiber connections. The third is present whenever more than two devices share a medium — Ethernet hubs, Wi-Fi networks, satellite uplinks, and the bus topologies that started LAN networking. Together, the three functions transform a noisy bit channel into a service that delivers labeled, error-checked frames between immediate neighbors.

This chapter develops each of the three responsibilities in turn, finishing with a comparison of the classic media-access protocols. Chapter 7 then specializes the link-layer story to Ethernet and switched LANs, and Chapter 8 specializes it to wireless.

## 6.2 Framing: Where Does One Message End and the Next Begin?

The physical layer hands the link layer a continuous stream of bits with no inherent structure. **Framing** is the link layer's first job: marking where one frame starts and the next begins, so the receiver can pull discrete units out of the bit stream. Framing has to handle two cases — the start of a transmission after silence, and the boundary between back-to-back frames — and it must work even when the contents of the frame happen to look like a frame boundary.

The most common framing approaches are:

- **Length-prefix framing** — the frame begins with a fixed-size length field saying how many bytes follow. The receiver reads the length, then reads exactly that many bytes. Simple and efficient, but vulnerable to a corrupted length field, which can desynchronize the receiver until the connection is reset.
- **Delimiter framing** — a special bit pattern marks the start and/or end of every frame. Ethernet, HDLC, and PPP all use a flag pattern (`01111110` for HDLC, a longer preamble plus `10101011` start-of-frame delimiter for Ethernet). Easy to resynchronize after a glitch — the receiver just hunts for the next delimiter.
- **Idle gap framing** — the medium goes silent between frames. Used in protocols where the underlying channel naturally pauses, including some wireless variants.

Delimiter framing leads to a problem: what if the user data happens to contain the delimiter pattern? The link layer must transform user data so that the delimiter cannot appear by accident inside a frame. Two transformations solve this.

**Byte stuffing** is used when the link operates on bytes. The transmitter scans outgoing data and, whenever it encounters the delimiter byte (or a designated escape byte), inserts an escape byte before it. The receiver scans incoming data and removes the escape byte, recovering the original. PPP uses byte stuffing with `0x7E` as the flag and `0x7D` as the escape byte; on transmission, every `0x7E` in the data becomes `0x7D 0x5E`, and every `0x7D` becomes `0x7D 0x5D`.

**Bit stuffing** is used when the link operates at the bit level. HDLC's flag byte is `01111110`, which is six 1-bits in a row. To prevent this pattern from appearing in user data, the transmitter inserts a 0 bit after every five consecutive 1 bits in the payload. The receiver removes any 0 bit that follows five consecutive 1s. The result is that the flag pattern can never appear in payload — only as a deliberate frame boundary.

| Technique | Operates on | Example | What it inserts |
|-----------|-------------|---------|-----------------|
| Byte stuffing | Bytes | PPP | An escape byte before any byte that matches a special value |
| Bit stuffing | Bits | HDLC | A 0 bit after every five consecutive 1 bits in the payload |
| Length prefix | Bytes | Ethernet (length variant), TLS records | No insertion — count bytes literally |

Modern Ethernet sidesteps the stuffing problem entirely by using a fixed preamble plus a frame-length-from-context approach: the receiver stops reading at the end of the carrier signal. Bit and byte stuffing remain in PPP, HDLC, USB, and many specialized protocols.

## 6.3 Error Detection: Was the Frame Damaged in Flight?

Even on a low-BER medium, occasional bit errors slip through. The link layer must detect them so that it can either fix the frame or discard it. Three error-detection schemes are essential, and each is a trade-off between strength and cost.

**Parity check** is the simplest. The transmitter computes one parity bit — the XOR of all the data bits — and appends it to the frame. The receiver recomputes the parity from the received data and compares. A single-bit error flips the parity bit's expected value and is detected; an even number of bit errors cancels out and is not detected. Parity is cheap (one bit of overhead) but weak (catches only odd-bit-count errors). Parity is rarely used alone in modern networks; it shows up inside RAM systems and as part of stronger codes.

A **checksum** treats the data as a sequence of fixed-size words (often 16 bits) and computes their sum, with various schemes for carrying overflow back into the result. The Internet checksum, defined in RFC 1071, is a 16-bit one's-complement sum used by IP, TCP, and UDP. Checksums are stronger than parity — they catch all single-bit errors and most multi-bit errors — and they are cheap enough to compute in software at line rate. Their main weakness is that certain rearrangements of data (a swap of two equal words) leave the checksum unchanged.

A **cyclic redundancy check (CRC)** treats the data as a polynomial over GF(2), divides it by a fixed generator polynomial, and uses the remainder as the error-detection code. CRCs are computationally heavier than checksums but vastly stronger. A CRC-32, used by Ethernet, catches all errors of up to 32 bits in length, all odd numbers of bit errors, and (for a well-chosen polynomial) the overwhelming majority of longer error bursts. CRC-32 is computed efficiently in hardware via shift registers, which is why Ethernet, Wi-Fi, USB, and Bluetooth all use CRCs at the link layer.

The three schemes form a clear hierarchy: parity is weakest, CRC is strongest, and checksum sits in between. The choice depends on where the code is computed (hardware can afford CRC; software-only might prefer checksum) and on the medium's BER (higher-BER media justify stronger codes).

| Code | Bits of overhead (typical) | Strength | Computation |
|------|----------------------------|----------|-------------|
| Parity | 1 | Catches odd-bit errors only | Trivial |
| Internet checksum | 16 | Catches single and most multi-bit errors | Fast software |
| CRC-32 | 32 | Catches all errors up to 32 bits, plus most bursts | Fast hardware |

#### Diagram: Error Detection in Action

<details markdown="1">
<summary>Interactive demonstration of parity, checksum, and CRC catching different error patterns</summary>
Type: microsim
**sim-id:** error-detection-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that lets students inject bit errors into a frame and watch which of three error-detection codes catch them.

Canvas: 920 px wide by 580 px tall, responsive down to 360 px. A 120 px control panel sits below.

Layout:

- A frame display at the top: 32 bits of data shown as a row of small squares, one bit per square, with a small label above each indicating its bit position.
- Three trailing fields shown to the right of the frame:
  - 1-bit parity (computed from the data).
  - 16-bit Internet checksum (computed from the data).
  - 32-bit CRC-32 (computed from the data using polynomial `0xEDB88320`).
- Below the frame, a "received" copy initially identical to the sent frame.

Interactivity:

- Clicking any bit in the received copy flips it (toggles 0/1). The display recomputes the receiver's parity, checksum, and CRC values.
- Each of the three checks shows a green "OK" or red "FAIL" indicator depending on whether the recomputed value matches the original.
- "Inject N random errors" buttons (1, 2, 4, 8 errors) flip random bits and update the indicators.
- "Burst error" toggle: flip a contiguous block of bits.
- A counter tracks how many of the test cases each code caught.

Visual style:

- Sent frame in honey amber.
- Received frame in slate.
- Flipped bits highlighted in red.
- Pass/fail indicators in green/red.

Learning objectives:

- (Bloom — Understanding) Students explain why parity catches only odd-bit-count errors.
- (Bloom — Analyzing) Students decompose an error pattern into the contributions caught by each code.
- (Bloom — Evaluating) Students judge which error-detection code is strong enough for a given application.

Implement in pure p5.js using the existing MicroSim CSS theme.
</details>

## 6.4 Forward Error Correction: Repair Without Retransmission

Detection alone is not enough when the cost of asking for a retransmission is high. **Forward error correction (FEC)** adds enough redundancy to the transmitted bits that the receiver can not only detect but *correct* a bounded number of errors without contacting the sender. FEC is essential on any link with high latency (satellite links: a single round-trip retransmission costs hundreds of milliseconds), high BER (wireless: errors are common), or no return channel at all (one-way broadcast systems).

FEC schemes vary widely in strength and complexity:

- **Hamming codes** add a few parity bits in clever positions and can correct any single-bit error in a code word. Used in RAM error correction and a few short-message protocols.
- **Reed-Solomon codes** treat the data as polynomials over a finite field and can correct burst errors up to a known size. Used in CDs, DVDs, QR codes, and many satellite links.
- **LDPC and turbo codes** approach Shannon's bound for capacity within a small fraction of a dB. Used in modern Wi-Fi, 4G/5G cellular, and satellite networks.

Every FEC scheme costs bandwidth — the redundancy bits take up space that could have carried payload. The **rate** of a code is the ratio of payload bits to total transmitted bits. A rate-1/2 code transmits two bits for every one bit of useful data. Higher-rate codes (closer to 1) leave less room for correction; lower-rate codes (closer to 0) correct more errors but waste more bandwidth. Modern protocols often pick the rate adaptively based on observed channel conditions.

FEC and detection coexist. A typical wireless link uses FEC at the physical layer to repair most errors, then a CRC at the link layer to catch the rare uncorrected ones, then ARQ to retransmit any frame whose CRC fails. The combination delivers near-zero residual error rate while keeping retransmissions rare.

## 6.5 Automatic Repeat Request: Detect and Retransmit

When a frame fails its error check, the receiver discards it. Recovery happens through **Automatic Repeat Request (ARQ)** — a family of protocols in which the receiver acknowledges good frames and the sender retransmits any frame whose acknowledgment fails to arrive within a timeout. Three ARQ variants dominate the literature, and each makes a different throughput-vs-complexity trade-off.

The simplest is **stop-and-wait**. The sender transmits one frame, then waits for an acknowledgment (ACK) before sending the next. If no ACK arrives within a timeout, the sender retransmits. Stop-and-wait is trivial to implement and impossible to overflow the receiver. Its weakness is that the sender is idle for one round-trip time after every frame, regardless of bandwidth — exactly the inefficiency the bandwidth-delay product (Chapter 4) warned about. On a long-haul link, stop-and-wait wastes 99% of the available capacity.

A **sliding window** protocol fixes the stop-and-wait inefficiency by allowing the sender to have multiple frames outstanding at once. The sender maintains a *window* of frames it has transmitted but not yet had acknowledged; as ACKs arrive, the window slides forward and new frames can be sent. The window size determines how many frames can be in flight: a window of W frames can fully utilize a link as long as \( W \times \text{frame size} \ge \text{BDP} \).

Sliding window leaves one design question open: what should the sender do when one frame in the window is lost? Two answers exist.

**Go-Back-N** retransmits the lost frame *and every frame sent after it* — even those that arrived correctly. The receiver discards anything received out of order. Go-Back-N is simple (the receiver tracks only the next expected sequence number) but wasteful on high-BER links: a single error triggers many retransmissions.

**Selective repeat** retransmits *only* the lost frame. The receiver buffers out-of-order arrivals and delivers them to the upper layer when the missing frame finally arrives. Selective repeat requires more state on the receiver but uses bandwidth more efficiently. Modern reliable protocols (TCP with selective acknowledgments, link-layer ARQ in cellular networks) almost always use selective repeat.

| Protocol | Sender state | Receiver state | Bandwidth efficiency on lossy link |
|----------|--------------|----------------|------------------------------------|
| Stop-and-Wait | One outstanding frame | One expected sequence | Poor — one frame per RTT |
| Sliding Window (Go-Back-N) | Window of N | Next expected sequence | Good when BER low; poor when BER high |
| Sliding Window (Selective Repeat) | Window of N | Buffer of out-of-order frames | Best on lossy links |

#### Diagram: Sliding Window Animation

<details markdown="1">
<summary>Animated comparison of stop-and-wait, Go-Back-N, and selective repeat under packet loss</summary>
Type: microsim
**sim-id:** arq-protocols-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that animates three ARQ protocols side by side, sending the same sequence of frames over a lossy link, so students can compare bandwidth efficiency.

Canvas: 940 px wide by 620 px tall, responsive down to 360 px. A 120 px control panel sits below.

Layout:

- Three vertical lanes side by side, each ~300 px wide.
  - Left lane: Stop-and-Wait.
  - Middle lane: Go-Back-N (with configurable window size).
  - Right lane: Selective Repeat (with configurable window size).
- Each lane shows a sender on the left, a receiver on the right, and a horizontal time axis flowing downward.
- Frames are drawn as colored arrows from sender to receiver; ACKs as arrows from receiver to sender.
- Lost frames are crossed out in red; retransmissions are drawn in a darker shade of the original color.

Animation:

- Each lane processes the same input: 10 frames numbered 0-9.
- A "loss profile" controls which frames are dropped: e.g., frame 3 lost, all others delivered.
- Time runs simultaneously across the three lanes so students can directly compare elapsed time to deliver all frames.
- A real-time counter in each lane shows total time, retransmissions used, and effective throughput.

Controls panel:

- Sliders: window size (for Go-Back-N and Selective Repeat, 1–8), loss profile (predefined set of patterns or random with a probability slider), RTT (10–500 ms).
- Buttons: Step / Play / Reset.
- Toggle: "Stress test" — runs many random loss patterns and plots a histogram of completion times across the three protocols.

Visual style:

- Frames in honey amber; retransmissions in deeper amber; lost frames crossed out in red.
- ACKs in slate.
- Sender / receiver as rounded rectangles.

Learning objectives:

- (Bloom — Understanding) Students explain how each ARQ variant handles a lost frame.
- (Bloom — Analyzing) Students compare the bandwidth and time costs of Go-Back-N vs. selective repeat under varying loss rates.
- (Bloom — Evaluating) Students choose an ARQ variant for a deployment based on RTT, BER, and receiver-buffer constraints.

Implement in pure p5.js with the existing MicroSim CSS theme.
</details>

## 6.6 Media Access Control: Sharing the Wire

Framing, error detection, and ARQ all assume that the sender has the channel to itself. On a point-to-point link (a single fiber from one end to the other) that is true. On a shared medium — a bus, a coaxial Ethernet segment, a wireless channel — it is not. **Media access control (MAC)** is the link layer's third major responsibility: arbitrating which device transmits when many devices share one medium.

The basic problem is collisions. If two devices transmit simultaneously, their signals overlap and neither is correctly received. The MAC protocol's job is to make collisions either impossible (by scheduling) or rare (by listening before transmitting). Three families of MAC protocol have shaped networking history: random access, carrier-sensing, and reservation-based.

## 6.7 Random Access: ALOHA

The original random-access protocol, **ALOHA**, was developed in 1971 to network the University of Hawaii's campuses across a packet radio system. Pure ALOHA's rule is breathtakingly simple: *send whenever you want; if you don't receive an ACK within a timeout, wait a random interval and retransmit.* No coordination, no listening, no agreed-upon time slots.

Pure ALOHA is wasteful — even at low loads, the chance that two transmissions overlap is significant. Mathematical analysis shows that pure ALOHA's maximum throughput is only \(1/(2e) \approx 18.4\%\) of the channel capacity. Slotted ALOHA, a refinement, divides time into discrete slots and requires devices to begin transmissions only at slot boundaries. This halves the collision window and doubles the throughput to \(1/e \approx 36.8\%\). Both numbers are bad by modern standards, but ALOHA's simplicity and the absence of any centralized scheduling made it the foundation for everything that followed.

ALOHA's intellectual descendants are everywhere: Ethernet's CSMA/CD, Wi-Fi's CSMA/CA, and the random-access channels in cellular protocols all build on the random-access idea. The pure-ALOHA throughput numbers are the baseline that every later protocol improves upon by adding a single ingredient: listening.

## 6.8 Carrier-Sense Multiple Access (CSMA) and Its Variants

**Carrier-sense multiple access (CSMA)** improves on ALOHA by requiring devices to listen for an existing transmission before sending. If the channel is busy, the device defers; if it is idle, the device transmits. Listening before sending dramatically reduces collisions: collisions happen only when two devices both observe an idle channel and begin transmitting at almost the same instant, before each detects the other's signal. The window of vulnerability shrinks from one full frame transmission (in ALOHA) to roughly one propagation delay (in CSMA).

Pure CSMA still suffers from collisions when the propagation delay is large relative to the frame transmission time. Two refinements address what to do *during* and *after* a collision.

**CSMA/CD (CSMA with Collision Detection)** is the algorithm used by classic shared-medium Ethernet (10BASE-2, 10BASE-5, 10BASE-T on hubs). After a device begins transmitting, it continues to listen on the same wire. If it hears its own transmission garbled by another's, a collision has occurred; the device aborts the transmission, sends a brief "jam" signal so all other devices also notice, and waits a random interval — chosen by **binary exponential backoff** — before trying again. After the n-th consecutive collision the device picks a random number from \([0, 2^n - 1]\) slot times to wait, doubling the maximum wait each time, up to a cap. Binary exponential backoff means lightly-loaded networks recover quickly while heavily-loaded networks gracefully throttle themselves.

CSMA/CD requires the medium to allow the sender to detect collisions while transmitting. Wired Ethernet on a shared bus permits this. Wireless does not — at radio frequencies, a transmitter cannot reliably listen to the same channel it is using because its own signal swamps everyone else's. Wireless networks therefore use a different variant.

**CSMA/CA (CSMA with Collision Avoidance)** is the Wi-Fi family's MAC protocol. Instead of detecting collisions during transmission, CSMA/CA tries to *avoid* them in advance: it adds an interframe gap, an explicit positive acknowledgment for every successful frame, and a random backoff *before* every transmission (not just after collisions). An optional RTS/CTS handshake further reduces collisions in dense networks by reserving the channel before sending data. CSMA/CA is more conservative than CSMA/CD — it serializes more carefully and uses more overhead per frame — but it works on a medium where collision detection is impossible.

| Protocol | Listen before? | Detect collisions? | Used by |
|----------|----------------|--------------------|---------|
| Pure ALOHA | No | After-the-fact (timeout) | Early packet radio |
| Slotted ALOHA | No (slotted timing) | After-the-fact | RFID, sensor networks |
| CSMA | Yes | After-the-fact | Building block, rarely deployed alone |
| CSMA/CD | Yes | During transmission | Classic shared Ethernet |
| CSMA/CA | Yes | Avoid via ACK + backoff | Wi-Fi (802.11) |

## 6.9 Reservation-Based Access: Token Passing

A different family of MAC protocols eliminates collisions entirely by *scheduling* who transmits. **Token passing** designates one device at a time as the holder of a special control message — the **token**. Only the token holder may transmit; when it has nothing more to send, it passes the token to the next device. With only one transmitter at a time, collisions are impossible.

Two classical token-passing networks are worth knowing. **Token Ring (IEEE 802.5)** arranged devices in a logical ring; the token circulated around the ring, and each device held it briefly to transmit before forwarding it to the next. **Fiber Distributed Data Interface (FDDI)** used a similar approach over fiber-optic media at 100 Mbps and was popular in 1990s campus backbones. Both networks delivered predictable, deterministic access time — a property that real-time and industrial applications still value.

Token passing has two big problems in practice. First, the token can be lost (if the holding device crashes), requiring a complex recovery protocol. Second, a device must wait for the token even when no one else wants to transmit, which is wasted time. CSMA/CD and CSMA/CA dominate today partly because their statistical multiplexing is more efficient under bursty workloads. Token passing survives in industrial protocols (PROFIBUS, EtherCAT) and a handful of specialized systems where determinism trumps efficiency.

#### Diagram: MAC Protocol Comparison

<details markdown="1">
<summary>Animation comparing ALOHA, CSMA/CD, CSMA/CA, and Token Passing on the same shared medium</summary>
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
</details>

## 6.10 Putting It Together: A Frame's Life Story

Imagine a Wi-Fi laptop sending an HTTP request to a web server. The frame's journey across a single 802.11 link involves every concept in this chapter:

1. **Framing.** The 802.11 MAC builds a frame: preamble, MAC header, payload (which contains the IP packet), and a CRC-32 trailer. The frame's start and end are unambiguously marked by the preamble and frame length.
2. **MAC protocol.** Before transmitting, the laptop's radio uses CSMA/CA: it senses the channel, waits an interframe gap, performs a random backoff, and only then transmits.
3. **Forward error correction.** The physical layer adds an LDPC code that lets the receiver repair a few bit errors without retransmission.
4. **Error detection.** The CRC-32 in the frame trailer catches any residual errors after FEC.
5. **ARQ.** If the access point successfully receives and decodes the frame, it sends a positive ACK. If no ACK arrives at the laptop within a timeout, the laptop retransmits — selective repeat at the link layer.
6. **Hand-off to the network layer.** The access point strips the 802.11 header and trailer, examines the IP packet inside, and forwards it across the wired backbone to the next router.

The same conceptual journey happens on every link the packet crosses, with different specifics — Ethernet uses CSMA/CD on classic shared media (or has no MAC contention at all on switched links), fiber backbones use no MAC protocol because they are point-to-point, satellite uplinks may use slotted ALOHA on the random-access channel and TDMA on the data channel. The link layer's universal vocabulary — framing, error detection, ARQ, MAC — applies everywhere; the specifics are negotiated per link technology.

!!! mascot-thinking "Why do we trust frames at all?"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Buzz thinking carefully">
    The link layer's job is to make the bit pipe look reliable enough for the network layer to ignore most errors. A combination of FEC, CRC, ARQ, and careful MAC reduces the residual frame error rate by orders of magnitude. By the time a frame reaches the network layer, it has typically survived multiple checks. The Internet's success rests partly on the link layer doing this dirty work invisibly, link by link.

## 6.11 Key Takeaways

The link layer is the first layer where the abstractions of networking start to feel concrete. Before moving on, make sure you can answer the following without looking back:

- What three jobs does the link layer do that the physical layer below it cannot?
- What is framing? What problem do bit stuffing and byte stuffing solve?
- Compare parity, checksum, and CRC for error detection. Which is strongest? Which is cheapest?
- What is forward error correction? When is FEC essential vs. optional?
- What is ARQ? Compare stop-and-wait, Go-Back-N, and selective repeat in throughput efficiency on a lossy link.
- Why must the sender's sliding window be at least as large as the bandwidth-delay product?
- What is media access control, and when is it necessary?
- Compare ALOHA, CSMA/CD, CSMA/CA, and token passing on collision behavior, throughput, and fairness.
- Why does Wi-Fi use CSMA/CA instead of CSMA/CD?
- What is binary exponential backoff, and why is it a good fit for shared-medium networks?

If any of those answers feel shaky, re-read the corresponding section before continuing to Chapter 7, where we specialize the link layer to Ethernet and to the switched LANs that make up nearly every modern wired network — including the Spanning Tree Protocol, VLANs, and the broadcast domains that bind it all together.

!!! mascot-celebration "One link, fully understood"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Buzz celebrating">
    You can now read a single link end-to-end: the medium, the MAC, the framing, the error checks, the retransmissions. The next chapter zooms out to a *network* of links, where switches and VLANs replace the shared bus. *Follow the packet.*
