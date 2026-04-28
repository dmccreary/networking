---
title: The Transport Layer
description: End-to-end delivery — UDP datagram service, then TCP from segments and sequence numbers through three-way handshake, termination, sliding window, flow control, and congestion control (slow start, congestion avoidance, Reno, CUBIC, BBR), plus Karn, Nagle, SACK, QUIC, and Multipath TCP.
generated_by: claude skill chapter-content-generator
date: 2026-04-28 00:50:00
version: 0.07
---

# Chapter 11: The Transport Layer

## Summary

This chapter develops end-to-end delivery — UDP and its datagram service, then TCP from segments and sequence numbers through three-way handshake, connection termination, sliding window, flow control, and congestion control (slow start, congestion avoidance, fast retransmit/recovery, Reno, CUBIC, BBR). It also introduces Karn's algorithm, the Nagle algorithm, SACK, QUIC, and Multipath TCP. Students leave able to read a TCP capture and explain its behavior.

## Concepts Covered

This chapter covers the following 24 concepts from the learning graph:

1. UDP
2. UDP Datagram
3. TCP
4. TCP Segment
5. TCP Three Way Handshake
6. TCP Termination
7. Sequence Number
8. Acknowledgment
9. TCP Window
10. Flow Control
11. Congestion Control
12. Slow Start
13. Congestion Avoidance
14. Fast Retransmit
15. Fast Recovery
16. TCP Reno
17. TCP CUBIC
18. TCP BBR
19. Retransmission Timer
20. Karn Algorithm
21. Nagle Algorithm
22. SACK Option
23. QUIC Protocol
24. Multipath TCP

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: Standards, Data Units, and Encapsulation](../02-standards-and-encapsulation/index.md)
- [Chapter 3: Network Architecture and Layered Models](../03-architecture-and-layering/index.md)
- [Chapter 4: Network Performance and Quality of Service](../04-performance-and-qos/index.md)
- [Chapter 6: Link Layer Fundamentals and Reliable Transfer](../06-link-layer-fundamentals/index.md)

---

!!! mascot-welcome "Reliable hands"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Buzz the bee waving welcome">
    Welcome back. The Internet's network layer just delivers packets — best-effort, possibly out of order, occasionally lost. The transport layer is what turns that into a reliable byte stream you can build a website on. *Let's trace the route!* This chapter is the most operationally important in the textbook. Read a TCP capture cleanly and you can debug almost anything above it.

## 11.1 What the Transport Layer Adds

The network layer hands the transport layer a best-effort packet-delivery service. Packets *might* arrive; they *might* arrive in the right order; they *might not* be corrupted. The **transport layer** sits between the network and the application, and its job is to translate that ragged service into something useful for application code.

Two main transport protocols dominate the Internet. **UDP (User Datagram Protocol)** keeps the network layer's best-effort character and adds only the minimum needed to multiplex multiple applications onto one host. **TCP (Transmission Control Protocol)** does much more: connection establishment, in-order delivery, reliability, flow control, and congestion control. Newer protocols (QUIC, MPTCP) build on these and address their limitations. This chapter develops UDP first as a baseline, then TCP in depth.

Three jobs unify all transport-layer protocols, regardless of how much else they do:

- **Multiplexing** — let many application processes on one host share a single network-layer address. Achieved through port numbers.
- **End-to-end identification** — a transport-layer connection (or flow) is named by a 4-tuple `(source IP, source port, destination IP, destination port)` plus the protocol. The same 4-tuple identifies the same connection across the entire path.
- **Optional reliability** — the transport layer may add retransmission, ordering, and flow control on top of best-effort IP, or it may not. UDP does not; TCP does.

## 11.2 UDP and Its Datagram Service

**UDP** is the bare-minimum transport. The UDP header is just 8 bytes:

| Field | Size | Purpose |
|-------|------|---------|
| Source Port | 2 bytes | The sender's port number (often ephemeral) |
| Destination Port | 2 bytes | The receiver's well-known port number |
| Length | 2 bytes | UDP header + payload length, in bytes |
| Checksum | 2 bytes | Internet checksum over header + payload + pseudo-header |

That is the entire protocol. UDP adds no sequence numbers, no acknowledgments, no retransmission, no connection setup, no congestion control. A **UDP datagram** is sent independently and arrives independently — or doesn't. The application is responsible for whatever reliability and ordering it needs.

UDP is the right choice when:

- **Latency matters more than reliability.** Voice and video conferencing send 50 packets per second; retransmitting a lost packet 100 ms later is worse than just skipping it.
- **The exchange is tiny.** A DNS query and response is a few hundred bytes; setting up a TCP connection costs more than the data exchange itself.
- **The application does its own reliability.** QUIC runs on top of UDP because UDP gives it the freedom to implement everything from scratch in user space.
- **The application needs multicast or broadcast.** TCP is unicast-only; UDP can carry multicast and broadcast traffic.

Common UDP-based protocols include DNS (port 53), SNMP (161), DHCP (67/68), NTP (123), and many real-time media streams using RTP. UDP's simplicity is its strength: it adds the minimum overhead while letting applications choose their own reliability strategy.

## 11.3 TCP: The Reliable Byte Stream

**TCP** delivers the Internet's most-used service: a reliable, in-order, byte-stream connection between two endpoints. Two characters — "byte stream" — are the key. TCP does not preserve message boundaries. If the application sends one 3000-byte message and another 1000-byte message, the receiver might read them as one 4000-byte chunk, or as 10 chunks of 400 bytes each, or any other slicing of the 4000 bytes. TCP guarantees only that the bytes arrive in the order they were sent, exactly once each, with no corruption.

The **TCP header** is at least 20 bytes (without options) and contains substantially more state than UDP:

| Field | Size | Purpose |
|-------|------|---------|
| Source Port | 2 bytes | Sender's port |
| Destination Port | 2 bytes | Receiver's port |
| Sequence Number | 4 bytes | Byte position in the sender's stream |
| Acknowledgment Number | 4 bytes | Next byte the receiver expects |
| Data Offset | 4 bits | Header length in 32-bit words |
| Flags | 9 bits | SYN, ACK, FIN, RST, PSH, URG, ECE, CWR, NS |
| Window Size | 2 bytes | Receiver's advertised buffer space |
| Checksum | 2 bytes | Internet checksum over header + payload |
| Urgent Pointer | 2 bytes | Rarely used |
| Options | variable | MSS, Window Scaling, SACK, Timestamps, etc. |

The **sequence number** is TCP's most fundamental concept. Every byte in the TCP byte stream has a position; the sequence number in a segment names the position of the *first* byte in that segment. The **acknowledgment number** in a returning segment names the next byte the receiver expects — equivalent to "I have received everything before this." Sequence numbers wrap around modulo \(2^{32}\), giving roughly 4 GB of stream before reuse; window scaling and Protect Against Wrapped Sequences (PAWS) handle the wrap on long-lived connections.

A **TCP segment** is the unit TCP transmits — a TCP header plus some payload bytes, the whole thing carried in an IP packet. Segments are not framed in the byte stream the application sees; they are an internal protocol detail. The receiver might deliver bytes from multiple segments as one buffer to the application or split one segment's bytes across two `read()` calls.

## 11.4 The Three-Way Handshake

A TCP connection begins with the **three-way handshake**, which establishes initial sequence numbers and confirms both endpoints can communicate. The exchange is:

1. **SYN** — Client sends a segment with the SYN flag set and an initial sequence number `Cseq`. No data; just the header.
2. **SYN+ACK** — Server replies with SYN flag *and* ACK flag set, its own initial sequence number `Sseq`, and an acknowledgment number of `Cseq + 1` (acknowledging the client's SYN).
3. **ACK** — Client replies with ACK flag set and acknowledgment number `Sseq + 1` (acknowledging the server's SYN). The connection is now established and either side can send data.

The handshake serves three purposes. First, both sides confirm the other is alive and reachable. Second, both sides exchange initial sequence numbers — chosen randomly to avoid certain attack and reuse pitfalls. Third, both sides advertise their initial window size and any options they want to negotiate (MSS, window scaling, SACK support, timestamps).

The handshake costs one round-trip time before any data flows. On a 100 ms RTT, that's 100 ms of pure overhead. Modern alternatives — TCP Fast Open, QUIC's 0-RTT mode — reduce this to zero on resumed connections.

## 11.5 Connection Termination

A TCP connection closes through a four-way handshake. Each direction closes independently — TCP supports a "half-closed" state where one direction is shut down while the other still flows.

1. **FIN** — Endpoint A sends a segment with the FIN flag set, signaling "I have no more data to send."
2. **ACK** — Endpoint B acknowledges the FIN. Now A → B is closed; B → A is still open.
3. **FIN** — Endpoint B sends its own FIN when it has finished sending.
4. **ACK** — Endpoint A acknowledges. Both directions are now closed.

After a connection closes, the side that sent the last ACK enters a TIME_WAIT state for a few minutes (typically 2 × Maximum Segment Lifetime, or roughly 60–240 seconds). TIME_WAIT prevents stale segments from a previous instance of the same 4-tuple from being mistaken for traffic on a newly-established connection. TIME_WAIT is a frequent source of operational frustration on busy servers, since the kernel keeps state for every recently-closed connection.

A connection can also be torn down abruptly with a **RST** (reset) segment. RST is used to abort connections after errors, refuse connections to closed ports, or short-circuit graceful closure. Applications usually do not send RST deliberately; the kernel sends it on their behalf when something goes wrong.

#### Diagram: TCP Three-Way Handshake and Termination

<details markdown="1">
<summary>Animated sequence diagram of TCP setup, data exchange, and graceful termination</summary>
Type: microsim
**sim-id:** tcp-handshake-and-termination<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that animates TCP connection setup, data exchange, and termination as a labeled sequence diagram.

Canvas: 940 px wide by 640 px tall, responsive down to 360 px. A 100 px control panel sits below.

Layout:

- Two vertical timelines (Client on the left, Server on the right) running top to bottom.
- Each segment is drawn as a labeled arrow between the timelines, with sequence and acknowledgment numbers shown.
- A current-state label appears beside each timeline at every step (CLOSED → SYN_SENT → ESTABLISHED → FIN_WAIT_1 → FIN_WAIT_2 → TIME_WAIT → CLOSED).

Animation phases:

1. **Handshake**: Client sends SYN(Cseq=100), Server replies SYN+ACK(Sseq=500, ack=101), Client sends ACK(ack=501).
2. **Data exchange**: Client sends DATA(seq=101, len=200), Server ACKs. Server sends DATA(seq=501, len=300), Client ACKs.
3. **Termination**: Client sends FIN(seq=301), Server ACKs. Server sends FIN(seq=801), Client ACKs. Client enters TIME_WAIT.

Controls panel:

- Buttons: Step / Play / Reset.
- Toggle: "Show TCP states" overlays the state machine on the side.
- Toggle: "Drop a packet" causes one of the segments to be lost; show retransmission and timer behavior.
- Toggle: "Half-close" pauses the termination after the first FIN, so students see a half-closed connection.

Visual style:

- Segments: arrows colored by direction (client→server in honey amber, server→client in slate).
- SYN/FIN flags: highlighted with a small badge.
- ACK numbers and sequence numbers in monospace labels.

Learning objectives:

- (Bloom — Understanding) Students explain each step of the three-way handshake and the four-way termination.
- (Bloom — Analyzing) Students decompose a captured TCP exchange into its phases and state transitions.
- (Bloom — Evaluating) Students judge when half-close is useful and why TIME_WAIT exists.

Implement in pure p5.js with the existing MicroSim CSS theme.
</details>

## 11.6 Sliding Window and Flow Control

Once a connection is established, data flows. TCP uses a **sliding window** (Chapter 6 introduced the general concept) to keep multiple segments outstanding without waiting for each ACK. The window slides forward as ACKs arrive: at any moment, the sender knows the lowest unacknowledged sequence number, and can send up to `window` bytes ahead of it.

TCP's window has two distinct ceilings. The first is **flow control**: the receiver advertises in every ACK how much buffer space it has available (the **rwnd** — receive window). The sender must not send more than `rwnd` unacknowledged bytes, regardless of how fast the network can carry them. Flow control protects the receiver from being overwhelmed by a sender faster than the receiver's application reads. If the receiver's buffer fills (because the application is slow to consume), `rwnd` shrinks toward zero and the sender stops; ACKs with non-zero `rwnd` re-open the window when the application reads more data.

The receive window is announced as a 16-bit number — capped at 65,535 bytes. For long-haul connections with bandwidth-delay products in the megabytes (Chapter 4), this is a hopeless cap. The **window-scaling option** (RFC 1323) lets endpoints advertise a left-shift factor at handshake time, multiplying the effective window by up to \(2^{14}\). Modern TCP stacks always negotiate window scaling; without it, no high-rate transfer over a transcontinental link is possible.

The second window ceiling is **congestion control** (next section), which limits how much the sender chooses to keep in flight based on its estimate of network capacity. The actual amount in flight is `min(rwnd, cwnd)` — the smaller of the receiver's advertised window and the sender's congestion window.

## 11.7 Congestion Control: The Four Phases

The Internet's foundational rule of fairness is that TCP senders voluntarily slow down when the network is congested, and they probe upward when there is bandwidth available. **Congestion control** is the algorithm that does this voluntary throttling. It is a vast subject; this section gives the canonical four-phase algorithm and the dominant variants.

The standard congestion-control algorithm, often called **TCP Reno** (after the BSD variant where it was first deployed), maintains a state variable `cwnd` (congestion window) and follows four phases:

**Slow start.** When the connection begins, `cwnd` starts at a small value (typically 10 segments now; historically 1) and *doubles* every RTT. Each ACK increases `cwnd` by one segment. This exponential ramp finds the network's capacity quickly. Slow start ends when either `cwnd` reaches a threshold called `ssthresh`, or a packet loss is detected.

**Congestion avoidance.** Once past `ssthresh`, `cwnd` grows linearly: by one segment per RTT (more precisely, roughly one segment per `cwnd` ACKs). This slower probing avoids causing too much loss.

**Fast retransmit.** When the sender receives three duplicate ACKs (a sign that one segment was lost but later segments did arrive), it retransmits the missing segment immediately rather than waiting for a timer. This is much faster than waiting for the retransmission timer to expire.

**Fast recovery.** After a fast retransmit, instead of dropping `cwnd` all the way to one and re-entering slow start, Reno enters fast recovery: halve `cwnd` and `ssthresh`, then resume congestion-avoidance growth from the new `cwnd`. The reasoning: if duplicate ACKs are arriving, the network is still delivering packets, just with one missing — no need to throttle as hard as a full timeout would suggest.

When the **retransmission timer** does expire (no ACK at all for an extended period — the network has stopped delivering), Reno falls all the way back: drop `cwnd` to 1 segment, set `ssthresh` to half of the previous `cwnd`, and re-enter slow start.

The retransmission timer itself is computed adaptively from observed RTT samples. The algorithm is roughly:

\[
\text{RTO} = \text{SRTT} + 4 \times \text{RTTVAR}
\]

where SRTT is a smoothed RTT estimate and RTTVAR is its smoothed variance. The factor of 4 in the variance keeps spurious retransmissions rare. Lower bounds (typically 200 ms or 1 second) prevent absurdly aggressive retransmission on fast paths.

| Event | Action |
|-------|--------|
| Connection start | `cwnd = 10`, slow start |
| Each ACK during slow start | `cwnd += 1` (exponential growth) |
| `cwnd` reaches `ssthresh` | Switch to congestion avoidance |
| Each ACK during congestion avoidance | `cwnd += 1/cwnd` (linear growth, +1 per RTT) |
| 3 duplicate ACKs | Fast retransmit + fast recovery: `cwnd = ssthresh = cwnd/2` |
| RTO timeout | Slow start restart: `cwnd = 1`, `ssthresh = cwnd/2` |

## 11.8 Karn's Algorithm

A subtle wrinkle in the retransmission-timer calculation: when a segment is retransmitted, the ACK that eventually arrives could be acknowledging the original transmission or the retransmission — the receiver does not say which. Using the wrong association would corrupt the RTT estimate.

**Karn's algorithm** addresses this with two rules: (1) do not update RTT estimates from retransmitted segments at all, and (2) when a retransmission timer fires, *exponentially back off* the timer rather than reusing it. So the first retransmission uses RTO; the second uses 2 × RTO; the third uses 4 × RTO; and so on, capped at some maximum. This prevents pathological retransmission storms when the network is severely congested. Modern TCP retains both Karn's rules.

## 11.9 Reno, CUBIC, and BBR

Reno was the dominant congestion-control algorithm for years. It works well for "low-BDP" connections — short paths or modest bandwidths — but its linear growth in congestion avoidance is too slow to fill modern long-haul, high-bandwidth links. Two newer algorithms now dominate.

**TCP CUBIC**, defined in RFC 8312, replaces Reno's linear growth with a *cubic function* of time since the last congestion event. CUBIC ramps up rapidly far from the previous loss point, slows down near it, and accelerates again past it. The result is that CUBIC fills high-BDP links far faster than Reno while still backing off after loss. CUBIC has been the default in Linux since 2007; it is the algorithm carrying most of today's Internet traffic.

**TCP BBR (Bottleneck Bandwidth and Round-trip propagation)**, developed by Google starting in 2016, takes a different approach. BBR ignores packet loss as a congestion signal and instead measures the bottleneck bandwidth and minimum RTT directly. It paces sending to match the bottleneck rate without filling buffers along the way (avoiding the "buffer bloat" problem of router queues). BBR achieves significantly higher throughput than CUBIC on lossy long-haul paths and is now the default in much of Google's infrastructure and some Linux distributions.

| Algorithm | Strategy | Fills buffers? | Default in |
|-----------|----------|----------------|------------|
| Reno | AIMD (additive-increase, multiplicative-decrease) on loss | Yes | Legacy systems |
| CUBIC | Cubic increase, halving on loss | Yes | Linux default since 2007 |
| BBR | Estimates bottleneck bandwidth and min RTT | No | Google services, some Linux |

The **TCP Reno**, **TCP CUBIC**, and **TCP BBR** distinctions matter because different algorithms compete differently for shared bandwidth. A CUBIC sender and a Reno sender on the same bottleneck link will each get a different share than would two senders running the same algorithm. Network operators and protocol designers care about this kind of fairness because the Internet's stability depends on senders behaving roughly compatibly.

#### Diagram: Congestion Control Phases and Algorithms

<details markdown="1">
<summary>Plot of cwnd over time showing slow start, congestion avoidance, and recovery for Reno, CUBIC, and BBR</summary>
Type: microsim
**sim-id:** tcp-congestion-control-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that plots `cwnd` over time for Reno, CUBIC, and BBR running on the same simulated path with configurable loss and bandwidth.

Canvas: 960 px wide by 600 px tall, responsive down to 360 px. A 120 px control panel sits below.

Layout:

- A large time-vs-cwnd plot occupying most of the canvas. X-axis is time in RTTs; Y-axis is cwnd in segments.
- Three traces, one per algorithm, in distinct colors with a legend.
- Horizontal dashed lines marking the simulated link's bottleneck capacity and the bandwidth-delay product.
- Annotations at each loss event, showing fast retransmit, fast recovery, and timeout events.

Controls panel:

- Sliders: link bandwidth (1–10000 Mbps log), RTT (10–500 ms), loss rate (0–5%), buffer size (in BDPs).
- Toggle: "Add competing flows" to introduce additional algorithms competing for the link.
- Buttons: Step / Play / Reset.
- "Single algorithm focus" dropdown to highlight one trace.

Visual style:

- Reno: slate blue, sawtooth pattern.
- CUBIC: honey amber, cubic curve.
- BBR: forest green, smoother saturating curve.

Learning objectives:

- (Bloom — Understanding) Students explain how each algorithm's `cwnd` evolves through slow start, congestion avoidance, and loss recovery.
- (Bloom — Analyzing) Students compare fairness, buffer occupancy, and convergence time for the three algorithms.
- (Bloom — Evaluating) Students judge which algorithm fits a given link profile (lossy, long, or fast).

Implement in pure p5.js with the existing MicroSim CSS theme.
</details>

## 11.10 Nagle's Algorithm and SACK

Two practical TCP optimizations worth knowing.

**Nagle's algorithm**, defined in RFC 896, addresses a problem with chatty applications that write a few bytes at a time (think character-by-character SSH typing). Without Nagle, every keystroke produces a 41-byte packet (1 byte payload + 20 IP + 20 TCP) — astronomically inefficient. Nagle's rule: if there is unacknowledged data in flight, don't send a new small segment; instead, wait and combine more bytes into a larger segment. The result is that TCP automatically batches small writes into larger segments without the application having to do anything. Nagle is on by default but can be disabled (the `TCP_NODELAY` socket option) for latency-sensitive applications that don't want the batching delay.

**SACK (Selective Acknowledgment)**, defined in RFC 2018, fixes a Reno limitation. With cumulative ACKs alone, the sender knows only the highest contiguous byte received — if segments 1, 3, and 4 arrive but segment 2 is lost, the cumulative ACK names byte 2 as the next expected, even though bytes 3 and 4 are actually buffered at the receiver. Without SACK, the sender doesn't know it has 3 and 4, so it might retransmit them too. The SACK option in the TCP header lets the receiver tell the sender exactly which non-contiguous ranges it has received, so the sender retransmits only the truly missing segments. SACK is universally supported in modern TCP implementations.

## 11.11 QUIC: TCP, Reinvented in User Space

The Internet ran on TCP for forty years. In the 2010s, Google began deploying a new transport — **QUIC (Quick UDP Internet Connections)** — that replaces TCP for a growing fraction of web traffic. QUIC is now standardized as RFC 9000 and is the transport beneath HTTP/3.

QUIC's headline differences from TCP:

- **Runs over UDP.** This lets QUIC avoid the calcified middlebox ecosystem that constrains TCP changes — middleboxes that mangle SYN packets, strip TCP options, or block unfamiliar segment shapes. UDP is a clean transport substrate.
- **0-RTT and 1-RTT setup.** QUIC integrates TLS handshakes with connection establishment, so connection setup and encryption negotiation finish in one round trip on a fresh connection — and zero round trips on a resumed connection. TCP+TLS needs two RTTs for the same.
- **No head-of-line blocking across streams.** QUIC supports multiple independent streams on one connection. A lost packet on stream A does not block delivery on stream B. HTTP/2 multiplexed streams over a single TCP connection but suffered from TCP's single-stream loss recovery; QUIC's per-stream recovery solves this.
- **Connection migration via connection IDs.** A QUIC connection is identified by a connection ID rather than the 4-tuple, so it can survive an IP address change (e.g., a phone moving between networks). TCP cannot.
- **Always encrypted.** QUIC integrates TLS 1.3 directly; there is no unencrypted QUIC option. This is partly a cleanliness choice and partly an end-run around middleboxes that interfere with unencrypted traffic.

QUIC re-implements much of TCP's behavior — congestion control, retransmission, flow control — in user-space libraries rather than kernel code. This makes it easier to evolve: deploying a new congestion-control algorithm or feature is an application update, not a kernel update.

The result is that for HTTP-based traffic — which is the majority of public Internet traffic — QUIC has largely replaced TCP. TCP remains dominant for non-web protocols (SSH, SMTP, database clients, server-to-server) and will for years, but the share of Internet bytes carried over QUIC has grown rapidly since 2020.

## 11.12 Multipath TCP

A mobile device often has multiple network interfaces — Wi-Fi and cellular, two cellular radios, or many in a datacenter context. TCP traditionally uses one interface per connection: the kernel picks one based on routing policy and uses it exclusively until the connection ends. **Multipath TCP (MPTCP)**, defined in RFC 8684, lets a single TCP connection use *multiple* paths simultaneously, dynamically adding and removing subflows as interfaces come and go.

MPTCP appears to applications as ordinary TCP — the same byte stream, the same socket interface, the same APIs. Underneath, MPTCP maintains multiple subflows, each a real TCP connection over a different path. Bytes are sent on whichever subflow has capacity; the receiver reassembles in order using extended sequence numbering.

The two main use cases:

- **Mobile devices.** A phone uses Wi-Fi when available and falls back smoothly to cellular when Wi-Fi degrades, without dropping the connection. Apple uses MPTCP for Siri (over Wi-Fi+cellular) since 2013.
- **Datacenter aggregation.** A server with multiple NICs aggregates their bandwidth into one MPTCP connection, similar to link aggregation but at the transport layer.

MPTCP deployment has been slower than its proponents hoped, but iOS, Linux, and several other OSes now support it. As Wi-Fi-cellular handoff becomes routine, MPTCP's seamless path failover becomes more valuable.

## 11.13 Putting It Together: Reading a TCP Exchange

A good way to fix all of this is to walk through what `tcpdump` would show for a small exchange — say, a client running `curl https://example.com/`:

1. **DNS lookup.** Client uses UDP to ask the DNS resolver for `example.com`. UDP datagram out, UDP datagram back.
2. **TCP handshake.** Client sends SYN to port 443. Server replies SYN+ACK. Client sends ACK. Connection ESTABLISHED. Roughly 1 RTT elapsed.
3. **TLS handshake.** Client sends ClientHello (over TCP). Server responds ServerHello + Certificate + ... Two more RTTs of TLS exchange (or one if TLS 1.3 0-RTT is used). Encryption keys established.
4. **HTTP request.** Encrypted under TLS, the client sends `GET / HTTP/1.1\r\nHost: example.com\r\n\r\n`. The bytes flow through TCP segments, sequenced and ACKed.
5. **HTTP response.** Server sends back the response — headers and HTML body — across some number of TCP segments. TCP slides its window forward as ACKs come back.
6. **Close.** Client or server sends FIN. The other side ACKs. The other side sends its own FIN. The first side ACKs. Connection enters TIME_WAIT.

In a packet capture you would see: SYN, SYN+ACK, ACK, [TLS handshake segments and ACKs], [HTTP request/response segments and ACKs], FIN, ACK, FIN, ACK. Knowing what each segment is doing — what flag is set, why the sequence numbers advance the way they do, how the window evolves over time — is the practical skill that makes TCP debugging tractable.

If you replace TCP+TLS with QUIC+HTTP/3, the picture is more compact: a single QUIC handshake (1 RTT or 0 RTT) replaces both the TCP and TLS handshakes; HTTP/3 frames flow inside QUIC streams; and the close is a single CONNECTION_CLOSE frame on UDP.

!!! mascot-encourage "If congestion control feels mathematical — that's because it is"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Buzz cheering you on">
    The four phases of Reno, the cubic curve of CUBIC, the bandwidth probing of BBR — these are decades of careful engineering. *One hop at a time.* You don't have to derive them, but you do need to recognize them in `cwnd`-vs-time plots. Spend twenty minutes with the comparison MicroSim and the patterns will click.

## 11.14 Key Takeaways

The transport layer is where the network's rough edges are smoothed for application code. Before moving on, make sure you can answer the following without looking back:

- What three jobs does every transport-layer protocol do?
- Compare UDP and TCP on header size, connection setup, reliability, and use cases.
- What is a TCP segment? What is a sequence number? What is an acknowledgment number?
- Walk through the three-way handshake and the four-way termination.
- Why does TCP have *two* windows (rwnd and cwnd)? What does each protect against?
- What is window scaling, and why is it essential?
- Describe slow start, congestion avoidance, fast retransmit, and fast recovery.
- What is Karn's algorithm? Why does it matter for retransmission timers?
- Compare Reno, CUBIC, and BBR. Why might BBR achieve higher throughput on a lossy path?
- What is Nagle's algorithm? When would you disable it?
- What does the SACK option add to TCP?
- What does QUIC do differently from TCP+TLS, and why does it matter?
- What problem does Multipath TCP solve?

If any of those answers feel shaky, re-read the corresponding section before continuing to Chapter 12, where we shift focus to network security — the attacks that the transport layer cannot prevent and the cryptographic protocols (TLS, IPsec, SSH) that protect everything we have built so far.

!!! mascot-celebration "TCP, demystified"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Buzz celebrating">
    You can now read a TCP capture, name every flag, and explain why `cwnd` is bouncing the way it is. The next chapter zooms back out — to the security layer that wraps every modern transport-layer connection. *Follow the packet.*
