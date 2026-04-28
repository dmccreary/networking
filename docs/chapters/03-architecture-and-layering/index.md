---
title: Network Architecture and Layered Models
description: The layered architecture that organizes all of networking — OSI and TCP/IP reference models, the role of each layer, service models (connection-oriented vs. connectionless, reliable vs. best-effort, stateful vs. stateless), the end-to-end principle, and the four addressing scopes.
generated_by: claude skill chapter-content-generator
date: 2026-04-27 23:48:00
version: 0.07
---

# Chapter 3: Network Architecture and Layered Models

## Summary

This chapter develops the layered architecture that organizes all of networking — the OSI seven-layer reference model, the TCP/IP four/five-layer model, the role of each layer, the end-to-end principle, and addressing scopes (unicast, multicast, broadcast, anycast). Students will understand why layering succeeded historically and how it continues to shape modern protocol design. The chapter establishes the framework every later chapter slots into.

## Concepts Covered

This chapter covers the following 25 concepts from the learning graph:

1. Layered Architecture
2. OSI Reference Model
3. TCP IP Model
4. Physical Layer
5. Data Link Layer
6. Network Layer
7. Transport Layer
8. Session Layer
9. Presentation Layer
10. Application Layer
11. End To End Principle
12. Separation Of Concerns
13. Service Model
14. Connection Oriented
15. Connectionless
16. Best Effort Delivery
17. Reliable Delivery
18. Stateful Protocol
19. Stateless Protocol
20. In Band Signaling
21. Out Of Band Signaling
22. Unicast
23. Multicast
24. Broadcast
25. Anycast

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Networks and Communication](../01-intro-to-networks/index.md)
- [Chapter 2: Standards, Data Units, and Encapsulation](../02-standards-and-encapsulation/index.md)

---

!!! mascot-welcome "Stacked, not tangled"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Buzz the bee waving welcome">
    Welcome back. The waggle dance is one layer of bee communication. Pheromone trails are another. Wing buzzing is a third. Each carries a different kind of information, and a forager can ignore the layers it doesn't need. Networks work the same way. *Let's trace the route!* This chapter shows you the layered architecture every later chapter slots into — and why splitting the network into layers was the design move that made the modern Internet possible.

## 3.1 What Is a Layered Architecture?

Chapter 2 ended with encapsulation — each layer adding its own header and handing the result down to the next layer. That mechanical process is the visible surface of a deeper design choice. A **layered architecture** is a way of organizing a complex system as a stack of cooperating components, where each layer provides a defined service to the layer above and uses the service of the layer below. Layers communicate only through narrow, well-defined interfaces — never by reaching across or skipping levels — and each layer can be replaced or evolved as long as it continues to honor its interface contract.

This architectural pattern is older than computer networking. Operating systems use layers (filesystem on top of block device on top of disk driver). Compilers use layers (parser on top of lexer; code generator on top of optimizer). Building construction uses layers (interior on top of structure on top of foundation). What computer networking added was the insight that layering is not just a tidy way to *organize source code* — it is a way to govern how independent organizations build interoperable systems. Two engineers writing different layers can never have met, work in different companies, use different programming languages, and target different hardware, yet their layers will fit together if they both honor the published interfaces between layers.

The discipline that makes layering work is **separation of concerns** — the principle that each layer addresses one and only one well-defined concern, and stays out of the concerns belonging to other layers. The link layer worries about delivering frames between immediate neighbors and ignores routing, reliability, and application meaning. The network layer worries about routing packets across many links and ignores how each link is signaled or what the application is doing. The transport layer worries about reliable delivery between processes and ignores routing. The application layer worries about what the data *means*. When a layer keeps its concerns to itself, the rest of the stack can evolve around it.

## 3.2 Why Layering Won

Layering is not the only way to build a network. The 1970s saw alternative designs that bundled most network functions into a single integrated stack — IBM's SNA was monolithic by design, and so were several competing systems. Three properties of the layered approach made it the design that won:

- **Local change** — replacing one layer (say, swapping copper Ethernet for fiber) does not force changes to any other layer. Higher layers see the same service interface either way.
- **Independent evolution** — Wi-Fi appeared in 1997 and slotted under the network layer without disturbing TCP, IP, or HTTP. IPv6 appeared in 1998 and slotted under the transport layer without disturbing Ethernet or HTTP.
- **Reusable expertise** — radio engineers can specialize in the physical layer, network operators in the network and link layers, and application developers in the application layer, without each needing to be expert in all the others.

The cost of layering is the per-packet header overhead we measured at the end of Chapter 2 — every layer wraps the data in its own header. The benefit is that today, in 2026, you can write a Python script that talks to a server using the same socket API your professor wrote against in 1995, even though every layer underneath has been rewritten multiple times. Layering is what made that possible.

## 3.3 The OSI Reference Model

The most influential layered architecture in networking is the **OSI Reference Model**, published by ISO in 1984 as ISO 7498. OSI defines seven layers, numbered 1 to 7 from the bottom (closest to the wire) to the top (closest to the application). Each layer has a name, a number, and a defined responsibility. We'll define each one in prose before summarizing them in a table.

The **physical layer** (Layer 1) governs the transmission of raw bits over a physical medium. It specifies the electrical, optical, or radio signals that represent 0 and 1, the connectors and cables that carry them, the timing of pulses, and the modulation schemes used over wireless. The physical layer's job is to get a bit from one end of a link to the other. It does not know what the bit *means*.

The **data link layer** (Layer 2) governs reliable communication between two directly-connected nodes. It groups bits into **frames**, addresses each frame to a specific neighbor by MAC address, detects (and sometimes corrects) bit errors introduced by the physical layer, and arbitrates access to a shared medium when many nodes share one link. Ethernet and Wi-Fi are link-layer protocols. The data link layer's reach is exactly one hop — once a frame is delivered, the layer's job is done.

The **network layer** (Layer 3) governs the delivery of **packets** across many links from an original source to a final destination, possibly traversing many routers along the way. It assigns global addresses (IP addresses), maintains forwarding tables that map destinations to next hops, and handles fragmentation when a packet is too large for the link it must cross. The Internet Protocol (IP) is the canonical network-layer protocol. The network layer is the first layer in the OSI stack that thinks globally rather than locally.

The **transport layer** (Layer 4) governs end-to-end communication between application processes on two hosts. It picks one of two service models — reliable, ordered, byte-stream delivery (TCP) or unreliable, unordered, message delivery (UDP) — and adds whatever logic is needed to provide that service on top of the network layer's basic packet-delivery capability. It demultiplexes incoming packets to the right application using port numbers. The transport layer hides the details of routing, retransmission, and congestion from the application above it.

The **session layer** (Layer 5) governs the establishment, maintenance, and orderly termination of long-lived conversations between two applications, sometimes called *sessions* or *dialogs*. Functions historically assigned to this layer include checkpointing (so a long file transfer can resume after a network outage) and dialog management (deciding which side has the right to speak next in half-duplex protocols). In modern Internet practice, dedicated session-layer protocols are rare — applications usually handle session management inside the application layer itself.

The **presentation layer** (Layer 6) governs the *syntax* of data exchanged between applications. Its job is to ensure that data sent in one application's internal representation can be correctly interpreted in the receiving application's internal representation, even if the two applications run on machines with different byte orders, character encodings, or floating-point formats. Data compression and encryption are sometimes assigned to this layer in OSI's classification, though in practice most modern networks handle compression and encryption at other layers (TLS, for example, lives between the transport and application layers).

The **application layer** (Layer 7) is where applications themselves live. Application-layer protocols include HTTP (web), DNS (name resolution), SMTP (email delivery), SSH (remote shell), and BitTorrent (file sharing), among hundreds of others. Each defines its own message format, its own state machine, and its own semantics. The application layer is where the *meaning* of the data finally appears — the layers below it never look this far up.

The seven OSI layers are summarized below. The table organizes the prose definitions you have just read.

| # | Layer | Concern | Data unit | Example |
|---|-------|---------|-----------|---------|
| 7 | Application | Application semantics | Message | HTTP, DNS, SMTP |
| 6 | Presentation | Data syntax, encoding | (data) | ASN.1, MIME types |
| 5 | Session | Conversation management | (data) | (rare on modern Internet) |
| 4 | Transport | End-to-end process delivery | Segment / Datagram | TCP, UDP, QUIC |
| 3 | Network | End-to-end packet routing | Packet | IPv4, IPv6, ICMP |
| 2 | Data Link | Frame delivery between neighbors | Frame | Ethernet, Wi-Fi, PPP |
| 1 | Physical | Bit transmission over a medium | Bit | Cat-6 cabling, fiber, radio |

## 3.4 The TCP/IP Model

The model the Internet actually runs on is simpler. The **TCP/IP model** (sometimes called the Internet model) collapses the OSI seven layers into four (or five, depending on whether you count the physical layer separately): the **Link layer** combines OSI's physical and data link layers; the **Internet layer** corresponds to OSI's network layer; the **Transport layer** corresponds to OSI's transport layer; and the **Application layer** combines OSI's session, presentation, and application layers. Most modern textbooks treat the link and physical layers separately and use a five-layer presentation, which is what the rest of this textbook does.

The TCP/IP model has fewer layers because the Internet's designers, working in parallel with OSI in the 1970s and 1980s, chose to push session and presentation responsibilities up into the application itself. The reasoning was practical: most applications need bespoke session and encoding logic anyway, and forcing every application through generic session and presentation layers added overhead without solving real problems. The OSI model's separation of session and presentation is intellectually clean but operationally underused.

When network engineers talk about the OSI numbering — "this is a Layer 2 problem," "we need a Layer 7 firewall" — they are using OSI vocabulary even when the underlying protocols come from the TCP/IP family. Both models are alive in everyday networking conversation. The OSI numbering survives because it gives a precise vocabulary for talking about responsibilities; the TCP/IP model survives because it describes what the network actually is.

#### Diagram: OSI vs. TCP/IP Layer Mapping

<details markdown="1">
<summary>Side-by-side stack mapping the OSI seven layers to the TCP/IP four/five layers</summary>
Type: infographic
**sim-id:** osi-vs-tcpip-mapping<br/>
**Library:** p5.js<br/>
**Status:** Specified

Render an infographic that places the OSI seven-layer stack and the TCP/IP four/five-layer stack side by side, with bracket lines showing how OSI layers collapse into TCP/IP layers.

Canvas: 900 px wide by 620 px tall, responsive down to 360 px.

Layout:

- Two vertical stacks separated by a 200 px gap. Left stack labeled "OSI Reference Model" with seven horizontal bands stacked top to bottom: Application (7), Presentation (6), Session (5), Transport (4), Network (3), Data Link (2), Physical (1). Right stack labeled "TCP/IP Model (5-layer view)" with five bands: Application, Transport, Internet, Link, Physical.
- Color-code matching layers identically across both stacks (e.g., transport in honey amber on both sides).
- Draw thick translucent bracket lines from the right edge of each OSI layer to the corresponding TCP/IP layer. The OSI Application, Presentation, and Session layers all bracket together to the TCP/IP Application layer; the Transport, Network, Data Link, and Physical map one-to-one (with the slight wrinkle that some 4-layer presentations of TCP/IP merge Link and Physical).

Interactivity:

- Hover on any layer (either stack) raises a callout listing 2-3 example protocols that operate at that layer.
- A toggle "5-layer / 4-layer" view at the top compresses or separates the link and physical layers in the right-hand stack.
- A second toggle "Highlight: HTTP request" overlays an animation showing where each protocol of an HTTP-over-TLS-over-TCP-over-IPv6 stack lands on each model.

Visual style:

- 1 px slate borders between bands; rounded 6 px corners on each band.
- Bracket lines should be honey-amber with 30% transparency.

Learning objective (Bloom — Understanding): Students explain why OSI's seven layers map to TCP/IP's four or five and which OSI layers have no dedicated counterpart in the Internet stack.
</details>

## 3.5 The End-to-End Principle

Layering tells you where in the stack a function should live. A second principle, equally important, tells you whether a function belongs in the network at all. The **end-to-end principle**, articulated by Saltzer, Reed, and Clark in 1984, says that a function should be implemented in the **end systems** rather than in the **network core**, unless implementing it in the core is the only way to make it work — and even then, the end systems must usually still implement it themselves.

The classic example is reliability. A network that drops packets occasionally cannot be made fully reliable by adding retransmission to every router along the path. A router that retransmits a lost packet still cannot tell whether the packet ever reached the application; only the receiving application can confirm that. So adding reliability to the network core does not eliminate the need for end-to-end reliability — it merely duplicates the work and complicates the system. The principled answer is: **leave the core simple; put reliability where it actually matters, in the end systems**. TCP follows this rule. The Internet's routers do not retransmit lost packets; they drop or forward, and TCP retransmission lives at the two endpoints.

The end-to-end principle is not absolute. Functions that *only* the network can implement — congestion signaling at queue overflow points, hop-by-hop authentication on a wireless link, packet scheduling at a bottleneck — must live in the network. The principle is a default, not a law: when in doubt, push functions to the edges. A great deal of network design history is the gradual accumulation of features that violate the end-to-end principle (NAT, deep packet inspection, in-network caching) and the ongoing tension between the operational benefits of those features and the architectural elegance the principle preserves.

!!! mascot-thinking "Why dumb networks beat smart networks"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Buzz thinking carefully">
    A dumb-core, smart-edge network can carry any application — past, present, or future — because the network does not need to understand what the data is. A smart-core network optimized for one application is faster *for that application* and worse for everything else. The Internet's astonishing range of applications, from the original email and file transfer to today's video streaming and AI inference, is the dividend the end-to-end principle pays.

## 3.6 The Service Model: What a Layer Promises

Each layer offers a **service model** — a precise description of what the layer guarantees and what it does not. The service model is the contract between a layer and the layer above. Two pairs of distinctions dominate every service model in networking: connection-oriented vs. connectionless, and reliable vs. best-effort.

A **connection-oriented** protocol requires a setup handshake before any data flows. The two endpoints exchange messages to establish a shared connection state — sequence numbers, window sizes, security parameters — and then send data through the connection until they tear it down with another handshake. TCP is connection-oriented. The setup overhead buys ordering, reliability, and a clean teardown sequence; the cost is at least one round-trip of latency before the first data byte arrives.

A **connectionless** protocol sends each message independently with no prior setup. Each datagram is a self-contained unit addressed to its destination, and the receiver may get datagrams in any order, with duplicates, or not at all. UDP is connectionless. The lack of setup makes connectionless protocols ideal for short request-response exchanges (DNS queries) and for media that prefer fresh data over correct data (live video).

**Reliable delivery** means the service guarantees that every byte (or every message) sent will eventually arrive at the destination, in order, without corruption — or the sender will be informed that delivery failed. TCP provides reliable delivery. The implementation requires acknowledgments, retransmissions, sequence numbers, and timers, all of which add overhead.

**Best-effort delivery** means the service tries to deliver but provides no guarantees. Packets may be lost, reordered, corrupted, or duplicated, and the network does not retry on the sender's behalf. IP is a best-effort protocol; UDP inherits IP's best-effort property at the transport layer. Best effort sounds inadequate, but it is the right choice when the network has no idea what the application would *want* the recovery behavior to be — a video conferencing app would rather skip a lost frame than wait for retransmission, while a file transfer would rather wait. By keeping the network layer best-effort, we let applications choose.

A third distinction shapes service models: whether a protocol carries state from one message to the next.

A **stateful protocol** maintains information about prior messages, and the meaning of any one message depends on what was exchanged before. TCP is stateful: a segment with sequence number 1500 means something different in connection A than in connection B, and only the per-connection state lets the receiver interpret it correctly. SSH, FTP control connections, and most database protocols are stateful.

A **stateless protocol** treats each message as independent. The server does not remember what the client asked yesterday, or even a millisecond ago. HTTP/1.0 was stateless by design; modern HTTP retains this property at the protocol level even though applications layered on top of HTTP frequently track session state through cookies or tokens. Stateless protocols are easier to scale (any server can answer any request) and easier to reason about (each request is self-contained). Stateful protocols are richer in expressive power but require careful state management at every endpoint.

The four service-model dimensions are summarized below — as a recap of the prose above.

| Dimension | Option A | Option B | Example A / B |
|-----------|----------|----------|---------------|
| Setup | Connection-oriented | Connectionless | TCP / UDP |
| Delivery guarantees | Reliable | Best-effort | TCP / IP |
| State | Stateful | Stateless | TCP, SSH / HTTP, DNS over UDP |
| Setup latency | One or more RTTs | Zero | TCP three-way handshake / UDP send |

## 3.7 In-Band and Out-of-Band Signaling

A more subtle service-model question concerns *how* a protocol carries control information. **In-band signaling** means control messages and data messages share the same channel — they travel through the same connection, in the same byte stream, distinguishable only by their content. TCP uses in-band signaling: acknowledgments are encoded in the TCP header of segments that may also carry data, and FIN flags announcing connection termination travel in the same stream as the bytes they end. HTTP/1.1 chunked transfer encoding is in-band signaling at the application layer.

**Out-of-band signaling** means control messages travel on a separate channel, distinct from the data channel. The classic example is FTP, which opens one TCP connection for control commands (`USER`, `PASS`, `LIST`, `RETR`) and a *separate* TCP connection for the file bytes themselves. SS7, the signaling network used in traditional telephone systems, was deliberately built as an out-of-band signaling network because mixing call setup with the voice circuits had created opportunities for fraud. Out-of-band signaling adds operational complexity (two channels to coordinate) but provides cleaner separation of control from data.

Networks rarely commit to one model exclusively. Modern protocols often use in-band signaling for ordinary control (acknowledgments, flow control) and out-of-band signaling for occasional rare events (BGP runs control protocol traffic over its own TCP connections, separate from the user data those routes carry). When you read about a new protocol, asking "is its signaling in-band or out-of-band?" tells you a great deal about how it composes with the rest of the stack.

## 3.8 The Four Addressing Scopes

A final architectural choice shapes how a sender names *who* a message is for. Networks support four addressing scopes, each defining the size of the receiver set.

**Unicast** addresses identify exactly one receiver. A unicast packet is delivered to one and only one network interface. Almost all Internet traffic is unicast: when your laptop opens an HTTP connection to a web server, your laptop sends unicast packets to that one server, and the server sends unicast packets back. Unicast is the default scope, and the simplest to implement.

**Multicast** addresses identify a group of receivers — every member of the group receives a copy of each packet sent to the multicast address. Multicast is the right tool when one sender wants to deliver the same data to many receivers efficiently, and the network can replicate packets at branching points rather than having the sender unicast a separate copy to each receiver. Live video streaming on a corporate network, IPTV systems, and routing protocols (OSPF and EIGRP send updates to multicast groups, not to every router individually) use multicast. The Internet supports multicast in principle but carries multicast routes only inside controlled networks; multicast across the public Internet has never become routine.

**Broadcast** addresses identify *every* receiver on a defined scope — typically every host on a single link or subnet. A broadcast packet is delivered to every interface within the broadcast scope. Broadcast is essential for protocols that must reach everyone without knowing who is there: ARP (Address Resolution Protocol) broadcasts a "who has IP X?" question on the local subnet. Broadcast does not generally cross routers — broadcasts are scoped to a single subnet, both because they would otherwise flood the whole Internet and because IPv6 has formally replaced broadcast with multicast for the same reason. IPv4 retains a per-subnet broadcast address, but IPv6 has no broadcast at all.

**Anycast** addresses identify exactly one receiver — but which receiver may be different on different occasions. Multiple physical hosts share the same anycast address, and the network's routing system delivers each packet to whichever copy is "closest" by routing-protocol metrics. Anycast is how modern DNS root servers, content delivery networks, and many cloud services achieve global reach with a single advertised address. A user in Tokyo who queries `8.8.8.8` (Google Public DNS, an anycast address) reaches a Google server in or near Tokyo; a user in Frankfurt querying the same address reaches a server in or near Frankfurt. Both got an answer; neither knows or cares that they reached different physical machines.

The four scopes are summarized below.

| Scope | Receivers | Used for |
|-------|-----------|----------|
| Unicast | Exactly one specific receiver | Most traffic — HTTP, SSH, email |
| Multicast | A group of receivers who joined the group | Live streaming, routing protocols |
| Broadcast | Every receiver on the local link/subnet | ARP, DHCP discovery |
| Anycast | Whichever copy is closest | DNS root servers, CDNs, public DNS resolvers |

#### Diagram: The Four Addressing Scopes

<details markdown="1">
<summary>Visualization comparing unicast, multicast, broadcast, and anycast packet delivery</summary>
Type: microsim
**sim-id:** addressing-scopes-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that animates the four addressing scopes side by side, letting students click each to see its delivery pattern.

Canvas: 960 px wide by 600 px tall, responsive down to 360 px. A 100 px control panel sits below.

Layout:

- The canvas is split into four quadrants, each ~480 × 300 px, labeled "Unicast", "Multicast", "Broadcast", "Anycast".
- Each quadrant contains the same simple topology: 1 sender on the left, 1 router in the middle, and 6 receivers arranged on the right.
- All four quadrants are inactive by default; only one animates at a time, selected by clicking its label or via a tab control.

Animation per quadrant:

- **Unicast**: the sender emits a single packet (honey-amber dot) addressed to receiver 3. The router forwards it; only receiver 3 lights up green; the others stay dim.
- **Multicast**: the sender emits a single packet addressed to a multicast group. The router replicates it at the branching point and forwards copies to receivers 2, 4, and 6 (a subset, the multicast group). Those three light up green; the others stay dim. Annotate "Group members only".
- **Broadcast**: the sender emits a single packet with broadcast destination. The router replicates and forwards to all six receivers; all six light up green.
- **Anycast**: three receivers (1, 3, 5) share the same anycast address; the others have unrelated addresses. The sender emits a single packet to the anycast address. The router selects the "closest" of the three (e.g., receiver 1 based on shortest path), and only that one lights up. A separate animation step shows the same packet, this time arriving via a different ingress router, being delivered to receiver 5 instead — demonstrating that the chosen receiver depends on routing topology.

Controls panel:

- Tab buttons: Unicast / Multicast / Broadcast / Anycast (one selected at a time).
- Step / Play / Reset buttons.
- "Topology source" toggle for the anycast animation: switches between two ingress routers to show that anycast routing depends on origin.

Visual style:

- Sender: hexagon in honey amber.
- Router: octagon in slate.
- Receivers: circles, default dim gray, lit receivers in vibrant green (#43a047).
- Packets: small filled circles in the layer color of the demonstration.
- A small legend in each quadrant summarizes the scope's rule.

Learning objectives:

- (Bloom — Remembering) Students recall that unicast goes to one, multicast to a group, broadcast to all on the link, anycast to the closest of many.
- (Bloom — Analyzing) Students compare the network resource cost of multicast versus unicast for delivering the same data to many receivers.
- (Bloom — Evaluating) Students judge which addressing scope is appropriate for a given application (live sports broadcast → multicast; DNS root server lookup → anycast).

The MicroSim should be implemented in pure p5.js with no external dependencies, using the existing MicroSim CSS theme. Animations should be smooth at 60 FPS and pause on tab switch.
</details>

## 3.9 Putting Layering and Service Models Together

Imagine a video call over the Internet. The application — a video conferencing app — needs to deliver tens of thousands of small audio and video packets per second to every participant. The right combination of architectural choices is now mostly forced by the requirements:

1. **Application layer** — a custom protocol for signaling who is on the call, what their codecs are, and how to map audio/video frames into packets.
2. **Transport layer** — connectionless and best-effort (UDP, or more recently QUIC), because retransmitting a lost video frame after the user has already moved past it adds latency without adding value.
3. **Network layer** — IP, which is itself best-effort and connectionless. IP's best-effort property is exactly what the application wants here.
4. **Link layer** — whatever the user's device is on. Wi-Fi for a laptop in a coffee shop; Ethernet for a desktop; 5G for a phone in transit. The application is unaffected by the choice.
5. **Addressing scope** — typically unicast between each pair of participants, sometimes routed through a central media server. A multi-party broadcast would use multicast in a controlled network or an SFU (Selective Forwarding Unit) replicating unicast on the public Internet.
6. **Signaling** — out-of-band: the call setup messages (who is calling whom, what codec, what session key) travel on a separate signaling channel, often over TCP or HTTPS, while the audio and video bytes travel on UDP.
7. **State** — stateless at the network layer (each packet is independently routed), stateful at the application layer (the call is a long-lived session with shared encryption keys).

Compare that with a request to a static web page:

1. **Application layer** — HTTP.
2. **Transport layer** — connection-oriented and reliable (TCP or QUIC). Losing a byte of HTML breaks the page.
3. **Network layer** — IP, best-effort. Reliability is the transport layer's job.
4. **Link layer** — whatever's available.
5. **Addressing scope** — unicast for the request itself; the destination IP may be an anycast address served by a CDN.
6. **Signaling** — in-band: HTTP carries control fields (method, status code, headers) inline with the body.
7. **State** — stateful TCP connection underneath; stateless HTTP request semantics on top.

#### Diagram: Layering Decision Tree

<details markdown="1">
<summary>Interactive decision tree that walks through the architectural choices for a new application</summary>
Type: infographic
**sim-id:** layering-decision-tree<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive decision-tree infographic that helps students choose the right layered architecture for a hypothetical new application.

Canvas: 900 px wide by 640 px tall, responsive down to 360 px.

Tree structure (top to bottom, branching as user clicks):

1. Root question: "What does your application send?" — branches: short request/response | continuous stream | one-to-many.
2. Short request/response branch → "Loss tolerable?" → No (TCP) | Yes (UDP).
3. Continuous stream branch → "Latency or correctness more important?" → Latency (UDP/QUIC, application-level FEC) | Correctness (TCP).
4. One-to-many branch → "Controlled network or public Internet?" → Controlled (multicast) | Public (unicast with replication or anycast).
5. Each leaf shows a recommended transport-layer protocol and an explanation paragraph citing the end-to-end principle.

Interactivity:

- Each tree node is a clickable rounded rectangle.
- When a node is clicked, the path from root to that node is highlighted in honey amber; off-path branches dim.
- A side panel updates with a one-paragraph rationale referring back to the service-model dimensions (connection-oriented vs. connectionless, reliable vs. best-effort, stateful vs. stateless, addressing scope).
- A "Show example apps" toggle annotates each leaf with two real-world apps that match (e.g., the Latency leaf labels "Zoom, FaceTime"; the Correctness leaf labels "Spotify offline download, Netflix").
- A reset button collapses the tree back to the root.

Visual style:

- Tree nodes: rounded rectangles, slate fill with white text.
- Active path: honey-amber edges and node borders.
- Side panel: white background with honey-amber accent on the recommended protocol.

Learning objectives:

- (Bloom — Applying) Students apply service-model criteria to recommend a transport-layer protocol for a new application.
- (Bloom — Evaluating) Students justify their choice by referencing the end-to-end principle and the trade-off between setup latency and reliability.

Implement in pure p5.js with the existing MicroSim CSS. The tree must remain readable on screens 360 px wide (horizontal scroll allowed).
</details>

The pattern is general. Once you can name the seven OSI layers (or five TCP/IP layers), classify a protocol along the four service-model dimensions, recognize whether its signaling is in-band or out-of-band, and identify which addressing scope it uses, you can read the design of almost any networking system. The rest of this textbook is filling in details inside this framework.

!!! mascot-encourage "If service-model dimensions feel mechanical — that's OK"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Buzz cheering you on">
    Connection-oriented vs. connectionless. Reliable vs. best-effort. Stateful vs. stateless. In-band vs. out-of-band. These look like a checklist now, but by Chapter 11 you will use them as second-nature shorthand. Every protocol you meet will get classified along these axes — and the classification will tell you immediately what kinds of failures to expect, what overhead to budget for, and what the protocol is *not* trying to do.

## 3.10 Key Takeaways

The layered architecture is the framework every later chapter slots into. Before moving on, make sure you can answer the following without looking back:

- What does it mean for a system to have a layered architecture? What is separation of concerns?
- Name the seven OSI layers in order, top to bottom or bottom to top, and the responsibility of each.
- Why does the TCP/IP model collapse session and presentation into the application layer?
- What does the end-to-end principle say? Give one example of a function that belongs in the end systems and one that must live in the network.
- For each of the four service-model dimensions, describe the two options and give one protocol that exemplifies each.
- What is the difference between in-band and out-of-band signaling? Why might a protocol designer prefer one over the other?
- Define unicast, multicast, broadcast, and anycast, and give one application that uses each.
- Why does IPv6 omit broadcast entirely?

If any of those answers feel shaky, re-read the corresponding section before continuing to Chapter 4, where we measure the network from the user's point of view — latency, throughput, jitter, packet loss, the bandwidth-delay product, and the quality-of-service mechanisms that constrain how much each application gets.

!!! mascot-celebration "Layers locked in"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Buzz celebrating">
    You now own the framework that organizes the rest of this textbook. Every protocol from here on lives at exactly one layer, offers a specific service model, and chooses one of the four addressing scopes. That is the *map*. The next chapter measures the *territory* — how fast, how lossy, and how fair real networks actually are. *Follow the packet.*
