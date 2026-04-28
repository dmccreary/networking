---
title: Network Performance and Quality of Service
description: The measurement vocabulary every networking class relies on — bandwidth, throughput, goodput, the four sources of delay, RTT, jitter, packet loss, MTU, and the bandwidth-delay product — followed by the QoS toolbox of traffic shaping, fair queuing, admission control, DiffServ, IntServ, and the network neutrality debate.
generated_by: claude skill chapter-content-generator
date: 2026-04-27 23:53:00
version: 0.07
---

# Chapter 4: Network Performance and Quality of Service

## Summary

This chapter builds the measurement vocabulary that the entire course relies on — bandwidth, throughput, goodput, latency components, RTT, jitter, packet loss, MTU, and the bandwidth-delay product. It then introduces the QoS toolbox: traffic shaping, token and leaky buckets, fair queuing, scheduling disciplines, admission control, DiffServ, IntServ, and the network neutrality debate. Students leave with the language to reason quantitatively about every later topic.

## Concepts Covered

This chapter covers the following 23 concepts from the learning graph:

1. Bandwidth
2. Throughput
3. Goodput
4. Latency
5. Propagation Delay
6. Transmission Delay
7. Queuing Delay
8. Processing Delay
9. Round Trip Time
10. Jitter
11. Packet Loss
12. MTU
13. Bandwidth Delay Product
14. Quality Of Service
15. Traffic Shaping
16. Token Bucket
17. Leaky Bucket
18. Fair Queuing
19. Scheduling Discipline
20. Admission Control
21. Differentiated Services
22. Integrated Services
23. Net Neutrality

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Networks and Communication](../01-intro-to-networks/index.md)
- [Chapter 2: Standards, Data Units, and Encapsulation](../02-standards-and-encapsulation/index.md)
- [Chapter 3: Network Architecture and Layered Models](../03-architecture-and-layering/index.md)

---

!!! mascot-welcome "Counting honey-flow"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Buzz the bee waving welcome">
    Welcome back. A hive measures everything: how much nectar is incoming per minute, how long the round-trip flight is, how often a forager comes back empty-handed. Networks need the same instincts. *Let's trace the route!* This chapter gives you the numbers and the units that turn vague complaints — "the network feels slow" — into specific, fixable problems.

## 4.1 Why Measurement Matters

Chapter 3 ended with a framework: layers, service models, addressing scopes. That framework tells you how networks are *organized*. This chapter tells you how networks *perform*. Network performance is not one number but a small collection of numbers, each capturing a different facet of how data moves between two endpoints. Confusing them — saying "bandwidth" when you mean "throughput," or "latency" when you mean "round-trip time" — is one of the most common mistakes in networking, and it routinely produces wrong diagnoses.

Two large categories of metric matter: **rate metrics** (how much data moves per second) and **time metrics** (how long a single piece of data takes). The two are not redundant; high rate does not imply low time, and low time does not imply high rate. A satellite link can have enormous bandwidth (gigabits per second of capacity) and terrible latency (half a second per round trip). A short copper wire can have low bandwidth (10 Mbps) and very low latency (under a millisecond). Pinning down which axis matters for a given application is the first step to every network engineering decision.

## 4.2 Bandwidth, Throughput, and Goodput

These three terms describe rates of data flow, and they are routinely confused. We'll define each one before we compare them.

**Bandwidth** is the *theoretical maximum rate* at which a link or network path can transmit bits, measured in bits per second (bps, Kbps, Mbps, Gbps). Bandwidth is a property of the medium and the encoding — a Cat-6 cable rated for 10 Gbps Ethernet has a fixed bandwidth ceiling, regardless of how much actual traffic happens to be flowing through it. Bandwidth does not vary minute-to-minute. The word is sometimes used loosely to mean "the network speed I'm seeing right now," but in this textbook we reserve "bandwidth" for the capacity figure.

**Throughput** is the *actual rate* at which data is being delivered, measured at some specific point during some specific time window. Throughput is necessarily less than or equal to bandwidth. If you copy a large file from one host to another over a 1 Gbps link, the network might deliver only 800 Mbps because of TCP overhead, contention from other traffic, or limits at one of the endpoints. Throughput depends on the moment-by-moment state of the path, the protocols in use, and the load on the endpoints. Tools like `iperf` measure throughput; they cannot measure bandwidth directly.

**Goodput** is throughput counted only as *useful application bytes*, after subtracting protocol overhead, retransmissions, and corrupted data that had to be discarded. If you transfer a 100 MB file in 1 second over a 1 Gbps link, throughput might be 950 Mbps but goodput is exactly 800 Mbps (100 MB ÷ 1 s × 8 bits/byte). For network engineers, throughput is the most-quoted metric; for application developers, goodput is what actually matters.

The relationship between the three is a strict hierarchy: \( \text{goodput} \le \text{throughput} \le \text{bandwidth} \). Equality on either side is rare in practice — overhead from headers, retransmissions, and link-layer encoding always introduces some gap.

| Metric | Definition | Where you measure it |
|--------|-----------|----------------------|
| Bandwidth | Theoretical maximum capacity | Datasheet, link specification |
| Throughput | Actual delivery rate, including overhead | `iperf`, packet counters |
| Goodput | Useful application data per unit time | Application-level log, file size ÷ transfer time |

## 4.3 The Four Sources of Latency

**Latency** is the time from when a sender begins transmitting a unit of data until the receiver finishes receiving it, measured in seconds (typically milliseconds in modern networks). Latency is end-to-end, accumulating contributions from every step along the path. Four distinct delays make up the total.

**Propagation delay** is the time it takes a single bit to physically travel from sender to receiver, given the speed of the signal in the medium and the length of the medium. Light in fiber travels at roughly two-thirds the speed of light in vacuum, so 1000 kilometers of fiber adds about 5 milliseconds of one-way propagation delay no matter what protocol or how fast the link runs. Propagation delay is a fixed cost set by physics and geometry. You can lower it only by shortening the cable.

**Transmission delay** is the time it takes the sender to push all the bits of a packet onto the wire. It depends on packet size and link rate: a 1500-byte packet on a 1 Gbps link takes \( 1500 \times 8 / 10^9 = 12\ \mu\text{s} \) to transmit. On a 1 Mbps link the same packet takes 12 ms — a thousand times longer. Transmission delay is the only delay component that scales directly with link rate, which is why faster links so dramatically improve performance for short messages.

**Queuing delay** is the time a packet spends waiting in a router or switch buffer before it can be transmitted on the outgoing link. Queuing delay is highly variable: on an idle network it is essentially zero, while on a saturated link it can grow without bound until the buffer fills and packets are dropped. Queuing delay is the single largest source of unpredictability in network performance, and most QoS mechanisms exist to manage it.

**Processing delay** is the time a router or end host spends inspecting a packet's headers, computing forwarding decisions, applying access-control rules, and moving the packet between memory locations. Modern hardware-accelerated routers process packets in nanoseconds; software-defined routers and end hosts running heavyweight protocols may take microseconds or more. Processing delay is usually small, but it accumulates over many hops.

The total latency between two hosts is the sum across all delay components and all hops along the path:

\[
\text{latency} = \sum_{\text{hops}} (d_{\text{prop}} + d_{\text{trans}} + d_{\text{queue}} + d_{\text{proc}})
\]

For a long-distance path, propagation delay almost always dominates. For a short, highly-loaded path, queuing delay can dominate. Knowing which delay is the bottleneck for a particular workload tells you what kind of fix will help.

#### Diagram: Anatomy of a Packet's Journey

<details markdown="1">
<summary>Animated breakdown of the four delay components on a multi-hop path</summary>
Type: microsim
**sim-id:** four-delay-components<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that shows a single packet moving from sender to receiver across three hops, decomposing the time spent at each stage into the four delay components.

Canvas: 960 px wide by 600 px tall, responsive down to 360 px. A 120 px control panel sits below.

Topology:

- A horizontal path: Sender → Router 1 → Router 2 → Receiver. Distances between nodes are visually proportional to a configurable propagation delay.
- Each router is drawn with a small input buffer (queue) on its left side.

Animation steps:

1. Sender begins transmitting bits onto the first link. As bits flow out, a colored bar grows from the sender into the wire — this bar represents transmission delay; its length is proportional to packet size / link rate.
2. The leading edge of the bar travels along the wire to Router 1 — this represents propagation delay.
3. The packet enters Router 1's input buffer. If the buffer is non-empty (controlled by a slider showing background traffic load), the packet waits — this is queuing delay; visualize the wait as a darker color while the buffer drains.
4. Router 1 inspects headers and performs forwarding lookup — a small spinner over the router represents processing delay.
5. Router 1 transmits onto the next link, and the cycle repeats for hop 2 and hop 3.
6. Receiver finishes receiving the last bit; a horizontal bar at the bottom of the canvas accumulates the four delay components in distinct colors with running totals.

Controls panel:

- Sliders: packet size (64–9000 bytes), link rate (1 Mbps – 100 Gbps, log scale), distance per hop (1 km – 10000 km), background load (0–100%).
- Buttons: Step / Play / Reset.
- Toggle: "Show formulas" — overlays the algebraic expression for each delay component as it animates (\( d_{\text{trans}} = \text{packet}/{\text{rate}} \), \( d_{\text{prop}} = \text{distance}/c \), etc.).
- Toggle: "Stress test" — sweeps load from 0 to 100% and plots the resulting end-to-end latency on a small embedded chart showing the characteristic hockey-stick growth as queuing dominates near saturation.

Visual style:

- Propagation delay: light blue.
- Transmission delay: honey amber.
- Queuing delay: red (proportional to buffer depth, which fluctuates with load).
- Processing delay: green.
- The cumulative bar at the bottom uses the same colors stacked end-to-end.

Learning objectives:

- (Bloom — Understanding) Students explain how each of the four delay components contributes to total latency.
- (Bloom — Applying) Students compute end-to-end latency given packet size, link rate, distance, and load.
- (Bloom — Analyzing) Students identify which delay component dominates in scenarios such as a long satellite link, a saturated office link, or a short uncongested fiber.

The MicroSim should be implemented in pure p5.js with no external dependencies, using the existing MicroSim CSS theme.
</details>

## 4.4 Round-Trip Time and Jitter

The single most important latency-derived measurement in networking is the **round-trip time (RTT)** — the time from when a sender emits a probe message until it receives the corresponding reply. RTT includes the latency in both directions plus a small amount of remote processing. Because most networks treat the two directions of a flow nearly symmetrically, RTT is approximately \(2 \times \text{one-way latency}\), and most engineers measure RTT (with `ping` or TCP timestamps) rather than one-way latency (which is hard to measure without synchronized clocks).

RTT determines how fast a connection can react to events. A reliable transport protocol cannot acknowledge data faster than one RTT after the data was sent. A new TCP connection cannot exchange its first byte of data until at least one RTT has elapsed (for the three-way handshake). Window-based flow control limits throughput to (window size) / RTT — meaning a connection across a 100 ms RTT path with a 64 KB window can deliver at most 5.2 Mbps regardless of link bandwidth. RTT is the heartbeat of every reliable protocol.

RTT is rarely constant. **Jitter** is the variation in delay observed across a sequence of packets, typically measured as the standard deviation or as the gap between successive arrivals. Low jitter means packets arrive at predictable intervals; high jitter means arrivals are bursty and uneven. Jitter is most problematic for real-time applications: a video call rendering audio at 50 packets per second cannot recover from packets that arrive 100 ms apart instead of 20 ms apart. To smooth jitter, real-time receivers buffer a few hundred milliseconds of arriving data — but the buffer adds end-to-end latency, so the right size is always a trade-off.

| Metric | Symbol | Typical units | Application sensitivity |
|--------|--------|---------------|--------------------------|
| Latency (one-way) | — | ms | File transfer (low sensitivity), gaming (high) |
| Round-trip time | RTT | ms | Every reliable protocol depends on it |
| Jitter | — | ms (std deviation) | Voice/video (very high), batch transfer (low) |

## 4.5 Packet Loss

The fourth fundamental performance metric is **packet loss** — the fraction of packets sent that fail to arrive at the destination, typically reported as a percentage. Loss has many causes: a router buffer overflowed; a wireless frame was corrupted by interference and discarded by its CRC check; a fiber cut destroyed a link entirely; an active routing change discarded packets in flight. From the application's perspective, the cause is invisible — packets simply do not arrive.

Even small loss rates have outsized effects on performance. TCP's congestion control treats loss as a signal of congestion and *halves* its sending rate every time it detects a missing packet. A path with 1% steady packet loss caps TCP throughput at roughly 12 Mbps regardless of the underlying bandwidth. A path with 5% loss caps it near 5 Mbps. This is why high-bandwidth, high-latency paths (sometimes called "long fat networks") are so painful: a single lost packet costs an entire RTT before it can be detected, and the resulting rate cut takes many more RTTs to recover from.

Loss matters differently for different applications:

- **Reliable transport (TCP)** — every loss must be retransmitted; loss directly reduces goodput.
- **Real-time media (UDP/RTP)** — small losses are masked by codecs (interpolation, forward error correction); large losses produce visible glitches.
- **Mission-critical control (industrial protocols)** — even one lost packet can be catastrophic, so the application typically adds its own reliability above UDP.

The latency, jitter, and loss numbers any application can tolerate define its **service requirements**, and those requirements drive the choice of every protocol and QoS mechanism that follows.

## 4.6 MTU and the Bandwidth-Delay Product

Two more parameters round out the basic measurement vocabulary, and both of them shape protocol design.

The **maximum transmission unit (MTU)** is the largest payload size, in bytes, that a link can carry in a single frame. Standard Ethernet has an MTU of 1500 bytes; jumbo-frame Ethernet supports 9000 bytes; many WAN links use smaller values. When a packet at the network layer is larger than the next link's MTU, the network must either fragment the packet (splitting it across multiple frames and reassembling at the destination) or drop it and inform the sender. Fragmentation is expensive and historically buggy; modern protocols use **Path MTU Discovery** to learn the smallest MTU along the path and never send anything larger.

MTU interacts with header overhead in important ways. A 1500-byte Ethernet frame carries 1500 bytes of IP packet, of which up to 40 bytes are TCP header and 20 bytes are IPv4 header — leaving 1440 bytes of application data per frame in the best case. For a TCP connection running flat-out, the per-segment overhead is roughly 4%. For DNS over UDP, where each datagram is dozens of bytes, headers can be 60% of the bytes on the wire.

The **bandwidth-delay product (BDP)** is the product of a path's bandwidth and its round-trip time, measured in bits or bytes. The BDP equals the amount of data "in flight" on the path at any moment when it is fully utilized. It is the volume of the pipe.

\[
\text{BDP} = \text{bandwidth} \times \text{RTT}
\]

Why does BDP matter? Reliable transport protocols use windowing to keep multiple segments outstanding without waiting for each to be acknowledged. To keep a path fully utilized, the sender's window must hold at least one BDP's worth of unacknowledged data. A window smaller than the BDP under-uses the link; a window larger than the BDP overflows buffers and induces loss. TCP's window-scaling option (RFC 1323) was added specifically because the original TCP window (64 KB) was far too small for the BDP of long-haul gigabit paths.

A worked example. A 1 Gbps link with 80 ms RTT has BDP \(= 10^9 \times 0.080 = 8 \times 10^7\) bits, or 10 megabytes. To keep that link fully utilized, the sender must be willing to have 10 MB of data outstanding before any acknowledgments arrive. If the receiver advertises only a 1 MB window, the achievable throughput is capped at \(1\ \text{MB} / 0.080\ \text{s} = 12.5\ \text{MB/s}\) — about 100 Mbps, one tenth of the link's bandwidth. Diagnosing this kind of mismatch is one of the routine jobs of a network engineer.

| Concept | Formula | What it tells you |
|---------|---------|-------------------|
| MTU | (link-defined byte limit) | Maximum packet size on this link |
| BDP | bandwidth × RTT | Bytes "in flight" when path is full |
| Required window | ≥ BDP | Smallest sender window that fully uses the path |
| Achievable throughput | window / RTT | Throughput cap given a window smaller than BDP |

## 4.7 What Is Quality of Service?

Latency, throughput, jitter, and loss describe *what is happening* on a network. They do not describe *what we want to happen*. **Quality of Service (QoS)** is the umbrella term for the techniques a network uses to give different traffic flows different performance guarantees, so that the most demanding applications get the resources they need and best-effort applications get whatever is left over. QoS mechanisms live mostly inside routers and switches, and they only come into play when the network is congested — on an idle network, all traffic gets the same excellent service.

QoS exists because modern networks carry workloads with wildly different requirements. A backup job moving terabytes overnight wants throughput and tolerates any latency. A voice call wants 20-millisecond latency and minimal jitter and tolerates very low throughput. A surgical robot's control loop wants single-digit milliseconds of latency and zero loss and tolerates almost no throughput. Treating all three flows identically — pure best-effort — works only when the network has so much excess capacity that congestion never occurs. Once congestion is possible, the network must choose: who gets ahead, who gets behind, and who gets dropped.

Three big categories of QoS technique, in increasing order of ambition: **traffic shaping** (which controls how traffic enters the network), **scheduling and queuing** (which controls how routers serve queued packets), and **end-to-end reservation** (which sets up explicit per-flow agreements before any data is sent).

## 4.8 Traffic Shaping: Token and Leaky Buckets

**Traffic shaping** is the practice of regulating the rate at which traffic enters the network, so that downstream queues do not overflow. Two classic algorithms describe the shape of regulated traffic.

The **leaky bucket** algorithm is the simpler of the two. Imagine a bucket with a small hole in the bottom. Packets arriving at the source are placed into the bucket; the bucket drains at a fixed rate (say, 10 Mbps), and the network sees a smooth stream coming out. If packets arrive faster than the bucket drains, the bucket fills up; if it overflows, excess packets are dropped (or queued elsewhere). The leaky bucket enforces a constant output rate regardless of how bursty the input is. Its characteristic property is *smoothness*: the network never sees bursts, no matter what the source does.

The **token bucket** algorithm is more flexible. Tokens are generated at a fixed rate (say, 10 tokens per second, each corresponding to one packet) and accumulate in a bucket of finite capacity. To send a packet, the source consumes one token. If the bucket has tokens available, the packet leaves immediately; if the bucket is empty, the packet waits or is dropped. The bucket's capacity allows bursts: if the source is silent for a while, tokens accumulate, and the source can subsequently send many packets in rapid succession until the bucket drains. Token bucket enforces an *average* rate while permitting *bursts* up to the bucket size — exactly the property real applications usually want.

| Property | Leaky bucket | Token bucket |
|----------|--------------|--------------|
| Output rate | Constant | Average rate, with bursts allowed |
| Bursts permitted | No | Yes — up to the bucket capacity |
| Easy to compose | Yes | Yes |
| Common use | Network ingress shaping | API rate limiting, traffic policing |

Both algorithms can be applied at any boundary where traffic enters a network (ISP customer link, datacenter top-of-rack switch, application API gateway). Most modern QoS systems use token-bucket variants because real workloads are inherently bursty.

#### Diagram: Token Bucket vs. Leaky Bucket

<details markdown="1">
<summary>Side-by-side animation comparing token-bucket and leaky-bucket shaping</summary>
Type: microsim
**sim-id:** token-vs-leaky-bucket<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that animates a token bucket and a leaky bucket side by side, processing the same input stream so students can compare their output behaviors.

Canvas: 900 px wide by 560 px tall, responsive down to 360 px. A 100 px control panel sits below.

Layout:

- Left half: leaky bucket. A vertical bucket icon with a small hole at the bottom. Packets arrive at the top as colored squares; the bucket fills if input exceeds drain rate; output emerges from the bottom hole at a constant rate. A side-channel labeled "Dropped" collects overflow.
- Right half: token bucket. A vertical bucket icon. Tokens (small green circles) are generated at a fixed rate and accumulate at the top. Packets arrive separately; each packet that finds a token available consumes one and leaves immediately. Packets that arrive when the bucket is empty wait in a queue or, if the queue overflows, are dropped.

Both halves share a single input stream so students can directly compare behavior. Output streams are visualized as horizontal time-series strips showing packet emission times.

Animation:

- Input stream is generated according to user-configurable bursts: e.g., 5 packets at t=0, idle for 2s, 10 packets at t=2s, idle for 1s, 3 packets at t=3s.
- Below each bucket, a strip chart plots output rate vs. time.
- A combined chart at the bottom overlays both output streams so students can see that leaky-bucket output is uniformly spaced while token-bucket output preserves bursts.

Controls panel:

- Sliders: drain rate (leaky), token-fill rate (token), bucket capacity (both).
- Buttons: Play / Pause / Reset.
- Toggle: "Show drops" — highlights overflow events in red on both buckets.
- Preset buttons: "Smooth source", "Bursty source", "Stress test".

Visual style:

- Leaky bucket water level: pale blue.
- Token bucket tokens: green.
- Packets: colored squares with sequence numbers.
- Output strip charts: the existing MicroSim chart styling.

Learning objectives:

- (Bloom — Understanding) Students explain how each algorithm regulates traffic.
- (Bloom — Analyzing) Students contrast the burst-handling behavior of token vs. leaky bucket.
- (Bloom — Evaluating) Students recommend the appropriate algorithm for a given workload (constant-rate video stream → leaky; bursty file transfer → token).

The MicroSim should be implemented in pure p5.js with the existing MicroSim CSS theme.
</details>

## 4.9 Scheduling Disciplines and Fair Queuing

Once traffic enters the network, routers must decide which packets to serve next from their queues. The chosen rule is called the **scheduling discipline**. The simplest discipline is **First-In, First-Out (FIFO)**: packets are served in arrival order, with no regard for source, destination, or priority. FIFO is what most consumer-grade routers do, and it works fine until the queue is shared by flows with very different requirements — at which point a single high-rate flow can starve every other flow.

**Priority queuing** divides packets into a small number of priority classes, services the highest-priority queue exhaustively, then moves to the next, and so on. Priority queuing is simple and effective when one class genuinely deserves precedence (e.g., voice over data), but it is fragile: a high-priority flow that misbehaves can starve every lower-priority class indefinitely.

**Fair queuing** addresses this fragility by giving each flow its own queue and serving the queues in round-robin order, so that no flow can monopolize the link regardless of how aggressively it sends. The classical algorithm is **Weighted Fair Queuing (WFQ)**, which generalizes round-robin by attaching a weight to each flow and serving each flow in proportion to its weight. WFQ guarantees that a flow gets at least its weighted share of the link, and gives it more if other flows are quiescent. Most production routers implement a variant of WFQ.

Several other scheduling disciplines appear in real networks:

- **Deficit Round Robin (DRR)** — an efficient approximation of WFQ that handles variable packet sizes correctly.
- **Class-Based Queuing (CBQ)** — groups flows into classes and applies WFQ between classes and within each class.
- **Stochastic Fair Queuing (SFQ)** — uses hashing instead of per-flow state to approximate fairness with low memory overhead.

The choice of scheduling discipline determines how the network divides scarce capacity. Combined with traffic shaping at the ingress, it gives operators most of the levers needed for in-network QoS.

!!! mascot-thinking "Why fairness has to be designed in"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Buzz thinking carefully">
    Without fair queuing, a single greedy flow on a shared link drives every other flow's throughput to zero. TCP's congestion control assumes the network gives every flow a roughly equal share — and on a FIFO router with one greedy UDP flow, that assumption breaks. Fairness is not a happy accident; routers have to *enforce* it, packet by packet.

## 4.10 Admission Control

**Admission control** is the practice of refusing new traffic when the network cannot honor its existing commitments. The classic example is a phone network: when too many calls are in progress for the available trunk lines, the network gives a fast busy signal to the next caller rather than degrading every call already underway. Admission control trades the experience of rejected new flows for the protection of accepted flows.

In packet networks, admission control is rare because the canonical Internet design refuses to track per-flow state in the network core. Best-effort delivery does not promise anything, and so there is no commitment to violate. But in QoS-aware networks — particularly enterprise networks carrying voice, video conferencing systems, and certain service-provider networks — admission control is essential. A new voice call that arrives when the network is already saturated cannot be delivered without degrading every other call, so the right answer is to refuse it.

Admission control requires the network to *know* what resources a new flow needs, which is the kind of information best-effort networks never collect. This is the gap that the next two architectures — IntServ and DiffServ — try to fill.

## 4.11 IntServ and DiffServ

The Internet engineering community has developed two main architectures for end-to-end QoS, with very different design philosophies.

**Integrated Services (IntServ)**, defined in RFC 1633 and friends, is a per-flow reservation model. A sender wishing to send real-time traffic uses a signaling protocol — RSVP (Resource Reservation Protocol) — to request a specific service quality (peak rate, average rate, maximum delay, loss bound) along the entire path. Each router on the path examines the request, decides whether it can accept it, and stores per-flow state if it does. When the actual data arrives, routers identify each packet's flow and serve it according to the prior reservation. IntServ promises strong guarantees because every router along the path has explicitly committed.

The catch is that IntServ does not scale. A backbone router may carry hundreds of millions of simultaneous flows, and storing per-flow state and signaling messages for each is operationally infeasible. IntServ has found niche use in well-defined enterprise networks but never deployed across the public Internet.

**Differentiated Services (DiffServ)**, defined in RFC 2474 and 2475, takes the opposite approach. Instead of per-flow state, DiffServ defines a small set of *traffic classes* — typically a handful, with names like "Expedited Forwarding" (EF, for voice), "Assured Forwarding" (AF, with several drop-precedence levels), and "Best Effort" (the default). Each packet carries a 6-bit **DSCP (Differentiated Services Code Point)** in its IP header indicating its class. Edge routers classify and mark packets; core routers do not need per-flow state — they simply give each class the configured per-hop behavior (priority, queue weight, drop precedence). DiffServ scales beautifully because the core forgets about flows and remembers only classes.

The cost is weaker guarantees. DiffServ promises differentiated treatment but cannot promise specific delay or throughput bounds for any individual flow. In practice, DiffServ is deployed widely inside enterprise and ISP networks; IntServ is rare. The two architectures coexist mostly in textbook contrast.

| Property | IntServ | DiffServ |
|----------|---------|----------|
| Granularity | Per flow | Per class (small number of classes) |
| Signaling | RSVP, per-flow | None — DSCP markings in IP header |
| Per-router state | One entry per flow | None per flow; per-class config only |
| Scalability | Poor — limited to small networks | Good — used in ISP and enterprise networks |
| Guarantees | Strong, per-flow | Probabilistic, per-class |

## 4.12 Net Neutrality

Underneath all of QoS lurks a policy question: *who* should be allowed to apply differentiated treatment to *whose* traffic? **Net neutrality** is the principle that an ISP should treat all customer traffic equally — no blocking, no throttling, no paid prioritization based on content, source, or destination. The principle is sometimes stated as "the bits are the bits," meaning the network should not look inside packets and discriminate based on what the application is.

The net-neutrality debate intersects QoS in a specific way. QoS mechanisms are deeply rooted in the network's ability to discriminate among flows — by marking, by per-class scheduling, by admission control. Net neutrality does not prohibit *all* discrimination; almost everyone agrees that a network can prioritize voice over bulk file transfer when both come from the same customer. The argument is about discrimination *across* customers and *across* application providers — for example, an ISP charging Netflix a premium for un-throttled delivery while allowing competitor services to be throttled. Different jurisdictions have written and rewritten net-neutrality regulations multiple times in the past two decades; the technical mechanisms (DSCP marking, deep packet inspection) and the policy debates have evolved together.

This textbook takes no position on the policy question. The technical point is that the QoS toolbox introduced in this chapter is *capable* of selective treatment, and how that capability is used is a question networks answer through both engineering and policy.

#### Diagram: The QoS Toolbox

<details markdown="1">
<summary>Map of where each QoS mechanism is applied along the path from sender to receiver</summary>
Type: infographic
**sim-id:** qos-toolbox-map<br/>
**Library:** p5.js<br/>
**Status:** Specified

Render an infographic that places each QoS mechanism on a horizontal end-to-end path, so students can see which mechanisms apply at the edge, which apply in the core, and which are end-to-end signaling.

Canvas: 920 px wide by 540 px tall, responsive down to 360 px.

Layout:

- A horizontal swimlane diagram with a path drawn left-to-right: Sender → Edge Router → Core Router 1 → Core Router 2 → Edge Router → Receiver.
- Six labeled mechanism callouts attached to specific places on the path:
  - "Token / Leaky Bucket Shaping" attached at the Sender's edge router (ingress shaping).
  - "DSCP Marking (DiffServ)" attached at both edge routers (mark on entry, classify on exit).
  - "Per-Class Queues" attached at each core router.
  - "Fair Queuing / WFQ" attached at each core router.
  - "RSVP Signaling (IntServ)" attached as a separate path that runs along the data path but is labeled as out-of-band signaling.
  - "Admission Control" attached at the sender's edge router.
- A second row beneath the path summarizes the *cost* of each mechanism: "Per-flow state required" for IntServ and admission control; "Stateless — per-packet only" for DiffServ and fair queuing.

Interactivity:

- Click a callout to highlight its position on the path and pop a sidebar with the mechanism's purpose, its limitations, and its typical deployment scenario.
- A toggle "Show net-neutrality flag" overlays a small icon on each mechanism that *could* be used to discriminate across customers (DiffServ marking, admission control), so students see which levers are at the heart of the policy debate.

Visual style:

- Path: a thick honey-amber line with chevron arrows.
- Edge routers: hexagons in slate with a "border" badge.
- Core routers: hexagons in deeper slate.
- Mechanism callouts: rounded rectangles in distinct colors.

Learning objective (Bloom — Analyzing): Students decompose the QoS toolbox by location of action (edge ingress, core, end-to-end signaling) and by per-flow-state requirement (stateful vs. stateless).
</details>

## 4.13 Putting It Together: Diagnosing a Slow Network

Imagine a colleague complains that "the network is slow" while uploading a large dataset to a cloud service. The vocabulary in this chapter turns the complaint into a sequence of measurable questions:

1. **What is the path's bandwidth?** Look at link specs and ISP plan. Suppose 1 Gbps.
2. **What is the achieved throughput?** Run `iperf` to the cloud endpoint. Suppose it shows 80 Mbps — ten times slower than bandwidth.
3. **What is the RTT?** Run `ping`. Suppose 90 ms (a transcontinental path).
4. **Compute the BDP.** \( 10^9 \times 0.090 = 9 \times 10^7 \) bits ≈ 11 MB.
5. **Check the TCP window.** If the receiver advertises a 1 MB window, achievable throughput is capped at \(1\ \text{MB} / 0.090\ \text{s} = 11\ \text{MB/s}\) ≈ 90 Mbps. Match found — the BDP / window mismatch is the cause.
6. **Fix.** Enable TCP window scaling on both endpoints (turning the window from 64 KB up to many megabytes), or use an application-level workaround (parallel streams).

A different complaint about the same path — "the video call sounds choppy" — produces a different diagnostic chain:

1. **Measure jitter.** A jitter histogram with a long tail (occasional 200 ms gaps in a 20 ms-spaced stream) suggests queuing variability.
2. **Measure loss.** A 2% loss rate on UDP is enough to produce visible glitches even with codec recovery.
3. **Look at the bottleneck queue.** Is it FIFO? A single high-bandwidth flow on a shared link will starve voice. Enable WFQ or DSCP-aware priority queuing on the bottleneck router.
4. **Apply admission control.** If many calls share a link and the bottleneck cannot serve them all, refuse new calls rather than degrading every existing one.

The diagnostic recipes are the same across most networking problems: measure the four delay components, the loss rate, the achieved throughput, and the BDP, and compare against application requirements. The QoS toolbox provides the levers to fix what you find.

!!! mascot-encourage "If the math feels heavy — that's the point"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Buzz cheering you on">
    The numbers in this chapter — bandwidth, RTT, BDP, jitter, loss — are the difference between *feeling* that a network is slow and *knowing* exactly where the time is going. Every later chapter (Wi-Fi, TCP, congestion control, CDNs) refers back to these metrics. *One hop at a time.* Pick one new measurement to make on your own network this week. The numbers will start to feel real fast.

## 4.14 Key Takeaways

The performance vocabulary in this chapter is the running ledger every later chapter writes against. Before moving on, make sure you can answer the following without looking back:

- What is the difference between bandwidth, throughput, and goodput?
- What are the four sources of latency? Which one is set by physics? Which one is most variable?
- What is RTT? Why does it limit how fast a reliable protocol can react?
- What is jitter, and which kinds of applications are most sensitive to it?
- Why does even small packet loss have a large effect on TCP throughput?
- What is MTU? What is the bandwidth-delay product? Why must a sender's window be at least one BDP?
- What is QoS, and why is it only relevant when the network is congested?
- How do leaky-bucket and token-bucket traffic shapers differ in their treatment of bursts?
- What is fair queuing, and what problem does it solve compared to FIFO?
- What is the difference between IntServ and DiffServ in scalability and per-router state?
- What is net neutrality, and how does it relate to the QoS toolbox?

If any of those answers feel shaky, re-read the corresponding section before continuing to Chapter 5, where we descend to the physical layer to see *why* bandwidth has a ceiling, *what* causes loss, and *how* the bits are actually moved across copper, fiber, and radio.

!!! mascot-celebration "Numbers in your pocket"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Buzz celebrating">
    You now have the measurement vocabulary every networking class assumes. Latency, throughput, jitter, loss, BDP — and the QoS levers that respond to them. The rest of this textbook is filled with numbers; you can read them now. *Follow the packet.*
