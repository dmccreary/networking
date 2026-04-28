---
title: Standards, Data Units, and Encapsulation
description: The standards bodies that govern interoperability (IETF, IEEE, ISO, ICANN) and the universal vocabulary of bits, bytes, frames, packets, segments, datagrams, headers, payloads, and trailers, with a careful walkthrough of encapsulation and decapsulation.
generated_by: claude skill chapter-content-generator
date: 2026-04-27 23:43:00
version: 0.07
---

# Chapter 2: Standards, Data Units, and Encapsulation

## Summary

This chapter introduces the standards bodies that govern interoperability (IETF, IEEE, ISO, ICANN) and the universal vocabulary of bits, bytes, frames, packets, segments, datagrams, headers, payloads, and trailers. Students will see how encapsulation and decapsulation move data through a protocol stack. This chapter sets up the layered worldview that the rest of the book builds upon.

## Concepts Covered

This chapter covers the following 19 concepts from the learning graph:

1. Protocol
2. Standard
3. RFC Document
4. IEEE Standard
5. IETF
6. ISO
7. ICANN
8. Bit
9. Byte
10. Frame
11. Packet
12. Segment
13. Datagram
14. Message
15. Header
16. Payload
17. Trailer
18. Encapsulation
19. Decapsulation

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Networks and Communication](../01-intro-to-networks/index.md)

---

!!! mascot-welcome "How bees agree on a dance"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Buzz the bee waving welcome">
    Hi again, I'm **Buzz**. A waggle dance only works because every forager in the hive interprets the wiggles the same way — direction, distance, quality. That's a *protocol*. Networks need the same kind of agreement, written down in documents anyone can read. *Let's trace the route!* This chapter teaches you the standards behind those agreements and the vocabulary every later chapter assumes.

## 2.1 What Is a Protocol?

Chapter 1 ended with three identifiers — MAC, IP, port — that locate where data should go. This chapter answers a different question: once data arrives, what do the bits *mean*? The answer is a **protocol** — a precise, agreed-upon set of rules that governs the format, ordering, and timing of messages exchanged between two or more network entities. Without a shared protocol, two devices on the same link can pass bits back and forth and learn nothing from each other; with one, the same bits become a request, a response, an acknowledgment, or an error. Protocols are the meaning layered on top of the medium.

A protocol specifies three things at minimum. First, **syntax** — what bits go where, how long each field is, what values are valid. Second, **semantics** — what each field *means*, including how a receiver should react to it. Third, **timing** — when a message may be sent, how long the sender waits for a response, and what happens if the response never arrives. A protocol that pins all three down lets two independently written programs interoperate even though they were built by people who never met.

Real networks rely on dozens of protocols working together. HTTP defines how a browser asks a web server for a page; TCP defines how the bytes of that request get delivered reliably; IP defines how each packet finds its way across the Internet; Ethernet defines how the bits travel across one specific link along the way. Each of these is a separate document, written by a separate working group, governing a separate concern — and that separation only works because of an even more fundamental agreement called a **standard**.

## 2.2 Standards and Why They Exist

A **standard** is a published, formally-reviewed specification that any vendor or developer can implement to produce a compatible product. The crucial word is *published*. A protocol invented by one company and kept secret can still work, but only between systems that company controls. A protocol written down as a public standard becomes a contract: anyone can build hardware or software that conforms to it and expect their implementation to interoperate with everyone else's. The Internet works *because* its core protocols are open standards, free for anyone to read and implement without paying a license fee.

Standards exist because the alternative — every vendor inventing its own incompatible variant — has been tried and produces small, brittle, expensive networks. The 1970s saw a flowering of proprietary networking systems: IBM's SNA, DEC's DECnet, Apple's AppleTalk, Novell's IPX/SPX. Each worked beautifully *within* its own ecosystem and miserably across ecosystems. The TCP/IP protocols won out partly because they were technically capable, and partly because they were free and openly documented from the start. By the 1990s the lesson was clear: in networking, openness compounds.

Standards are written and maintained by **standards bodies** — organizations whose job is to convene experts, debate proposals, run trials, and publish the results. The next four sections introduce the four standards bodies that matter most for this textbook. We'll define each in prose first, then summarize them in a table.

## 2.3 The IETF and the RFC Document

The **Internet Engineering Task Force (IETF)** is the standards body responsible for the core protocols of the Internet — IP, TCP, UDP, HTTP, TLS, DNS, BGP, and several hundred more. The IETF is unusual among standards bodies because it has no formal membership: anyone can join a working group, propose a draft, comment on a specification, or attend a meeting. Decisions are made by what the IETF calls "rough consensus and running code" — proposals that gather broad agreement among engineers and that have been demonstrated to work in practice.

The IETF publishes its standards as **RFC documents** (Request for Comments). The name reflects the IETF's collaborative origins in the 1960s, when the earliest network designers circulated draft documents inviting discussion. Despite the tentative-sounding name, an RFC is the authoritative published form of an Internet standard once it has worked its way through the standards track. Each RFC has a number assigned in publication order — RFC 791 defines IPv4, RFC 793 defines TCP, RFC 8446 defines TLS 1.3, RFC 9114 defines HTTP/3. Once published, an RFC is never edited; if a standard needs changes, a new RFC is written that *obsoletes* or *updates* the old one, and the old one stays online forever as a historical record.

Not every RFC is a standard. The IETF assigns each document a status: *Standards Track* documents progress through the stages Proposed Standard, Internet Standard, and (rarely) full Standard. *Informational* RFCs document existing practice without standardizing it. *Experimental* RFCs describe protocols being trialed. *Best Current Practice (BCP)* RFCs codify operational guidance. And every April 1, the IETF publishes humorous *April Fools' RFCs* that are not standards in any sense — RFC 1149, "A Standard for the Transmission of IP Datagrams on Avian Carriers," is a famous example. Knowing which kind of RFC you are reading prevents a great deal of confusion.

!!! mascot-tip "Where to find an RFC"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Buzz with a tip">
    Every RFC ever published is free at `https://www.rfc-editor.org/rfc/rfcNNNN`, where `NNNN` is the RFC number. When this textbook cites a protocol, the canonical RFC is the source of truth — not the Wikipedia article, not a vendor whitepaper. Get comfortable reading RFCs early. They are dense, but they are the document the engineers writing your operating system's network stack are reading too.

## 2.4 The IEEE and Hardware-Level Standards

The **Institute of Electrical and Electronics Engineers (IEEE)** is a global professional organization that publishes standards covering electrical engineering, computing, and communications. Its 802 series, maintained by the IEEE 802 LAN/MAN Standards Committee, defines the protocols that govern most local-area networks. An **IEEE standard** is a numbered document such as IEEE 802.3 (Ethernet), IEEE 802.11 (Wi-Fi), IEEE 802.1Q (VLAN tagging), or IEEE 802.1D (Spanning Tree Protocol).

Where IETF standards mostly govern the network and transport layers and above, IEEE 802 standards govern the link and physical layers — the actual wires, radios, and frame formats that carry bits between neighbors. The split is no accident. The link layer is where the standard has to specify physical phenomena: voltage levels, pulse shapes, radio frequencies, modulation schemes, antenna requirements. The IEEE has the engineering culture for that work; the IETF has the engineering culture for higher-layer software protocols. The two organizations cooperate where their territories meet, and they generally stay out of each other's way.

A practical detail: IEEE standards are *not* free in the same way RFCs are. A finished IEEE 802 standard typically costs several hundred dollars to download from the IEEE store. The IEEE has, since 2007, made many 802 standards freely available through a "Get IEEE 802" program after a six-month embargo, but the most current revisions are usually paywalled. This is one of several practical differences between the IETF model and the IEEE model.

## 2.5 ISO and the Reference Models

The **International Organization for Standardization (ISO)** is a worldwide federation of national standards bodies. ISO publishes standards for everything from screw threads to medical devices to country codes; in networking, its most influential contribution is the **OSI Reference Model**, ISO 7498, published in 1984. The OSI model defines seven layers — Physical, Data Link, Network, Transport, Session, Presentation, Application — each with a clearly defined responsibility.

The OSI *protocols* never won market adoption. Today's Internet runs on the simpler four-or-five-layer TCP/IP model, not on the seven-layer OSI stack. But the OSI *vocabulary* is everywhere. When network engineers casually refer to a "Layer 2 problem" or a "Layer 7 load balancer," they are using the OSI numbering even when the underlying protocols are TCP/IP. ISO 7498 is one of those rare standards whose conceptual contribution outlived its technical contribution. Chapter 3 develops the layered architecture in full; this chapter only introduces ISO so the reference is in place.

ISO works through national standards bodies — ANSI in the United States, BSI in the United Kingdom, DIN in Germany, JISC in Japan, and so on. Each national body sends delegates to ISO technical committees, where standards are debated, drafted, voted on, and ultimately published. The process is slower and more formal than the IETF's, with explicit voting at multiple stages. ISO and IEEE often co-publish a standard — the same Ethernet specification appears as both IEEE 802.3 and ISO/IEC 8802-3.

## 2.6 ICANN and the Internet's Unique Identifiers

The **Internet Corporation for Assigned Names and Numbers (ICANN)** is the nonprofit organization that coordinates the Internet's globally unique identifiers — the domain name system root, IP address allocations, and protocol parameter assignments. Where the IETF *defines* protocols and the IEEE *defines* physical-layer standards, ICANN *administers* the namespaces those protocols use. If two organizations both claimed the domain `example.com`, or both used the same IP address block, the network would break; ICANN's job is to make sure that does not happen.

ICANN delegates much of the actual day-to-day work. The **Internet Assigned Numbers Authority (IANA)**, operated under ICANN, maintains the registries of port numbers (port 80 for HTTP, port 443 for HTTPS), the top-level domains in the DNS root (`.com`, `.org`, `.us`, `.io`), and the assignment of IP address blocks to the five **Regional Internet Registries** — ARIN (North America), RIPE NCC (Europe), APNIC (Asia-Pacific), LACNIC (Latin America), and AFRINIC (Africa) — which in turn assign smaller blocks to ISPs and end-user organizations.

The four standards bodies introduced above each occupy a distinct niche. The following table summarizes them — but only as a recap of what the prose above already explained.

| Body | Founded | Scope | Output | Free to read? |
|------|---------|-------|--------|---------------|
| **IETF** | 1986 | Internet protocols (network layer and above) | RFC documents | Yes — all RFCs are free |
| **IEEE** | 1963 (802 committee) | Local-area network and physical-layer standards | IEEE 802.x standards | Mostly paywalled; "Get IEEE 802" releases after 6 months |
| **ISO** | 1947 | Cross-industry international standards, including the OSI reference model | ISO/IEC numbered standards | Paywalled |
| **ICANN** | 1998 | Coordination of unique Internet identifiers (names, numbers, parameters) | Policy documents and registry data | Yes — registries are public |

#### Diagram: Standards Bodies and What They Govern

<details markdown="1">
<summary>Map showing which standards body governs which part of the network stack</summary>
Type: infographic
**sim-id:** standards-bodies-map<br/>
**Library:** p5.js<br/>
**Status:** Specified

Render an infographic that maps the four standards bodies introduced in this chapter to the parts of the network they govern.

Canvas: 900 px wide by 540 px tall, responsive down to 360 px wide.

Layout:

- Render five horizontal layer bands stacked vertically, top to bottom: "Application", "Transport", "Network", "Link", "Physical". Color the bands in graduated honey amber (lightest at top, darkest at bottom). Each band fills the full canvas width and is roughly 70 px tall. Place a band label on the left edge.
- On the right side of each band, render colored badges showing which standards body governs that layer. Badges should overlap layers vertically when a body's scope spans multiple layers.
  - IETF badge: signal blue (#1976D2). Spans the top three bands (Application, Transport, Network).
  - IEEE badge: deep hive brown (#5D4037). Spans the bottom two bands (Link, Physical).
  - ISO badge: slate gray (#546e7a). A vertical badge on the far right that spans all five bands, labeled "OSI reference model — vocabulary".
  - ICANN badge: forest green (#2e7d32). A separate horizontal badge floated above the canvas labeled "Names, numbers, ports — across all layers".

Interactivity:

- Hover on a body's badge raises a callout listing 2-3 example outputs (e.g., IETF: "RFC 791 IPv4, RFC 9114 HTTP/3"; IEEE: "802.3 Ethernet, 802.11 Wi-Fi"; ISO: "ISO 7498 OSI model"; ICANN: ".com domain, port 443 registry").
- Hover on a layer band raises a callout naming the data unit at that layer (Application: message, Transport: segment/datagram, Network: packet, Link: frame, Physical: bit).

Use the existing MicroSim CSS theme. The infographic should have a 1 px slate border between bands. No text overlaps badges.

Learning objective (Bloom — Understanding): Students explain which standards body to consult when researching a specific networking concern, and which layer of the stack that concern belongs to.
</details>

## 2.7 The Vocabulary of Data: Bits and Bytes

Standards specify what bits *do*. To talk about that, we need a precise vocabulary for the bits themselves. A **bit** is the smallest unit of digital information — a single binary value, either 0 or 1. Every signal that travels across a wire, a fiber, or a radio link can be reduced to a sequence of bits, and every protocol's specification ultimately tells you what each bit means in context. When a network engineer says "the destination address field is 32 bits long" or "the link runs at 10 gigabits per second," each of those bits is one of these elementary 0-or-1 values.

A **byte** is a group of eight contiguous bits, treated as a single unit by virtually all modern computers and network protocols. Eight bits can encode 256 distinct values (\(2^8 = 256\)), enough to represent every character in early text encodings and a wide range of small integers. Almost every protocol field length is a multiple of 8 bits, partly for historical reasons and partly because computer memory and CPU instructions naturally manipulate data in byte-sized chunks. The IETF community uses the more precise term **octet** in its standards — an octet is exactly eight bits, even on hypothetical machines where a "byte" might mean something else — but in everyday networking conversation, "byte" and "octet" are synonymous.

Two consequences of byte-sized fields show up constantly in protocol specifications. First, addresses and counts are usually quoted as multiples of bytes: an IPv4 address is 4 bytes (32 bits), a MAC address is 6 bytes (48 bits), an IPv6 address is 16 bytes (128 bits). Second, the units used to describe link speed and data quantity differ in important ways. **Link speeds are quoted in bits per second** (10 Mbps, 1 Gbps, 100 Gbps), because the physical layer transmits one bit at a time. **Storage and file sizes are quoted in bytes** (a 12 MB photograph). A 1 Gbps link can therefore transfer roughly 125 megabytes per second — eight times less than a careless reading of the units would suggest. Whenever you compare a link speed to a file size, multiply or divide by eight.

| Quantity | Unit | Where you see it |
|----------|------|------------------|
| Single binary digit | bit | Field lengths, link speeds |
| Eight bits | byte (octet) | Memory, file sizes, protocol field counts |
| Bits per second | bps, Kbps, Mbps, Gbps | Link bandwidth |
| Bytes per second | B/s, KB/s, MB/s, GB/s | File transfer speeds, application throughput |

## 2.8 Data Units at Each Layer

Different protocol layers have different names for the chunks of data they handle, even though all those chunks are ultimately just sequences of bytes. The naming is not arbitrary: each name tells you which layer is responsible for that chunk and what kind of formatting it has. Five names are essential, and we'll define each one before showing how they fit together.

A **frame** is the data unit at the **link layer**. A frame is a sequence of bytes shaped to travel across exactly one link — for example, the unit of transmission across an Ethernet cable or a Wi-Fi channel. Every frame begins with a link-layer header that names the immediate sender and receiver by their MAC addresses, and most frames end with a link-layer trailer carrying an error-check value. A frame never crosses a router; once a router receives a frame, it strips the link-layer header and trailer, processes the contents, and constructs a *new* frame for the next link.

A **packet** is the data unit at the **network layer**. A packet is a sequence of bytes carrying a network-layer header (most importantly the source and destination IP addresses) followed by a payload. The defining property of a packet is that it is *routable end-to-end*: the same packet, or a faithful copy of its contents, can travel from the original sender to the final receiver across many links and many routers. The link-layer header changes at every hop; the packet's IP header (mostly) does not.

A **segment** is the data unit at the **transport layer** when the transport protocol is **TCP**. A segment carries a TCP header (source port, destination port, sequence number, acknowledgment number, flags, window size, checksum) followed by application payload. Segments are reliable and ordered: the transport layer guarantees that what one application writes arrives in order at the other application, even if the underlying packets are lost, reordered, or corrupted.

A **datagram** is the data unit at the **transport layer** when the transport protocol is **UDP**. A datagram carries a much smaller UDP header (source port, destination port, length, checksum) followed by application payload. Datagrams are unreliable and unordered: each datagram is delivered independently, with no retransmission, no acknowledgment, and no ordering guarantee. Some texts use "datagram" loosely to mean any standalone, self-contained packet; in this textbook we reserve the word for UDP, and we use "packet" only at the network layer.

A **message** is the data unit at the **application layer**. The contents and structure of a message depend entirely on the application protocol — an HTTP message is a request line, headers, and a body; an SMTP message is an envelope plus a MIME-formatted email; a DNS message is a query or response with question and answer sections. The transport layer treats every application message as a sequence of bytes to be carried; only the application understands what those bytes mean.

The five terms relate to each other in a strict hierarchy. The table below summarizes — but only as a recap of the prose definitions above.

| Layer | Data unit | Header you'll see | Travels across |
|-------|-----------|-------------------|----------------|
| Application | Message | Application-specific (HTTP, SMTP, DNS, etc.) | End-to-end (logically) |
| Transport (TCP) | Segment | TCP header | End-to-end |
| Transport (UDP) | Datagram | UDP header | End-to-end |
| Network | Packet | IP header | End-to-end across routers |
| Link | Frame | Ethernet, Wi-Fi, or other link header (and trailer) | One link only |

## 2.9 Headers, Payloads, and Trailers

Every data unit, at every layer, has a small number of structural parts. A **header** is the prefix of bytes at the front of a data unit that carries the protocol's control information — addresses, sequence numbers, flags, lengths, checksums, type fields. Headers are how a protocol communicates *about* the data without modifying it. Each layer adds its own header when sending and consumes its own header when receiving.

A **payload** is the body of bytes that the data unit carries on behalf of the layer above. A payload is opaque to the layer carrying it: an Ethernet frame's payload is an entire IP packet, but the Ethernet hardware does not look inside that payload to interpret the IP fields. This opacity is what lets each layer evolve independently — a new application protocol does not require any change to the network or link layers, because those layers see only an opaque payload either way.

A **trailer** is a suffix of bytes at the end of a data unit that carries information that can only be computed *after* the payload is finalized. The most common reason for a trailer is an error-check value that must cover the entire data unit, including the header — by definition, that value cannot be placed in the header itself. Ethernet frames carry a 4-byte **Frame Check Sequence (FCS)** trailer; most other protocols put their checksum in the header (where the checksum is computed over the rest of the data unit and the checksum field itself is set to zero during the calculation). Whether a protocol uses a trailer or a header-only checksum is a design choice with engineering consequences we'll revisit in Chapter 6.

!!! mascot-thinking "Why bother with three names?"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Buzz thinking carefully">
    The header–payload–trailer split is the *single most important pattern* in networking. Every layer follows it. Once you see this shape, you can read any protocol specification quickly: the header is where you look for "who, what, and how long," the payload is where you look for "what's the layer above doing," and the trailer (when present) is where you look for "did anything get corrupted?" Three jobs, three regions of bytes — every time.

## 2.10 Encapsulation: How Layers Stack Data

We now have all the vocabulary needed to describe the central operation of a layered network: encapsulation. **Encapsulation** is the process by which each layer, on the sending side, takes the data unit handed down from the layer above, adds its own header (and optionally trailer), and hands the larger result down to the next layer. The result is that by the time a single byte of application data reaches the wire, it is sandwiched between several headers and trailers, each addressing a different concern.

To see encapsulation concretely, follow a single HTTP request as it leaves your laptop. The browser builds an HTTP **message** — a request line, some headers, an empty body. It hands that message to the operating system's TCP implementation, which adds a TCP header (with source port, destination port, sequence number) on the front, producing a TCP **segment** whose payload is the HTTP message. The TCP segment is handed to the IP implementation, which adds an IP header (source IP, destination IP, protocol number) on the front, producing an IP **packet** whose payload is the TCP segment. The IP packet is handed to the Ethernet driver, which adds an Ethernet header (source MAC, destination MAC, EtherType) on the front and a Frame Check Sequence trailer on the back, producing an Ethernet **frame** whose payload is the IP packet. The frame's bits then go out the network interface as electrical signals on copper or radio symbols on Wi-Fi.

Each header is opaque to the layers below it. The Ethernet driver does not care that the bytes it is wrapping happen to contain a TCP segment containing an HTTP request; it sees only an opaque sequence of bytes and a length. This opacity is what allows the same Ethernet hardware to carry IPv4, IPv6, ARP, and any future network-layer protocol with no changes — Ethernet does not look above its own layer.

The reverse process happens on the receiving side. **Decapsulation** is the process by which each layer, on the receiving side, removes its own header (and trailer, if present) from the front (and back) of the data unit it receives, and hands the remaining payload up to the layer above. The receiving Ethernet driver verifies the FCS trailer, strips the Ethernet header and trailer, and hands the remaining IP packet up to the IP implementation. IP strips the IP header and hands the remaining TCP segment up to TCP. TCP strips the TCP header and hands the remaining HTTP message up to the web server application. Each layer performs its checks (address matches my own? checksum valid? sequence number expected?) and either passes the payload up or drops the data unit.

#### Diagram: Encapsulation Walkthrough

<details markdown="1">
<summary>Animated stack of headers added on the sender and removed on the receiver</summary>
Type: microsim
**sim-id:** encapsulation-walkthrough<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that animates the encapsulation of an HTTP request from sender to receiver and back up the stack at the destination, with a Step / Play / Reset controller.

Canvas: 960 px wide by 600 px tall, responsive down to 360 px wide. A 100 px control panel sits below the canvas.

Layout:

- The canvas is divided into three vertical regions: Sender (left third), Wire (middle third), Receiver (right third).
- Each side stacks four protocol layers vertically, top to bottom: Application, Transport, Network, Link. Use the same color coding as the standards-bodies infographic (gradient honey amber).
- The Wire region is a horizontal line in the middle of the canvas labeled "Communication Link". A small packet glyph travels left-to-right along this line during playback.

Animation steps (one step per click of "Step", or auto-advanced by "Play"):

1. The Application layer on the sender shows a small rectangle labeled "HTTP message" (yellow).
2. Transport layer on the sender adds a "TCP header" (blue) on the left, producing a "TCP segment".
3. Network layer on the sender adds an "IP header" (green) on the left, producing an "IP packet".
4. Link layer on the sender adds an "Ethernet header" (brown) on the left and a "FCS trailer" (brown) on the right, producing an "Ethernet frame".
5. The frame slides into the Wire region as a sequence of bits and travels left to right.
6. The frame arrives at the Receiver Link layer, which strips the Ethernet header and FCS trailer, leaving an IP packet.
7. The Network layer on the receiver strips the IP header, leaving a TCP segment.
8. The Transport layer on the receiver strips the TCP header, leaving an HTTP message.
9. The Application layer on the receiver displays the HTTP message and labels it "Delivered".

Each header rectangle should display its layer name and a sample value (e.g., the IP header rectangle shows "src 192.0.2.10 → dst 198.51.100.5"). Hovering on a header reveals an info tooltip listing 2-3 of its key fields.

Controls panel:

- Step button — advance one step at a time
- Play button — auto-advance with adjustable speed slider (0.5×, 1×, 2×, 4×)
- Reset button — return to step 0
- Layer toggle — checkboxes to skip animation of any layer (useful for showing what UDP looks like with only Transport-Network-Link, or for highlighting the link layer alone)
- "Show byte counts" toggle — when enabled, each header rectangle shows its size in bytes (HTTP message: variable; TCP header: 20 bytes; IP header: 20 bytes; Ethernet header: 14 bytes; FCS trailer: 4 bytes)

Visual style:

- Honey-amber background gradient for layer bands.
- Header rectangles use distinct colors per layer (per the color codes above) with a subtle drop shadow.
- Wire bits should briefly twinkle as the frame travels.

Learning objectives:

- (Bloom — Understanding) Students explain how each layer wraps the layer above and unwraps on receipt.
- (Bloom — Analyzing) Students decompose a frame on the wire into its constituent headers and identify the original application payload.
- (Bloom — Evaluating) Students judge how skipping a layer (e.g., switching TCP for UDP, or running over Wi-Fi rather than Ethernet) changes the encapsulation diagram.

The MicroSim should be implemented in pure p5.js with no external dependencies, using the existing MicroSim CSS theme. All controls must be touch-friendly and keyboard-accessible.
</details>

A useful mental image: encapsulation is like nesting envelopes. The application's data is a letter. The transport layer puts the letter in an envelope addressed by port number. The network layer puts that envelope inside a larger envelope addressed by IP. The link layer puts that envelope inside a still larger envelope addressed by MAC. At the destination, each envelope is opened in turn — the link layer's envelope first, then the network layer's, then the transport layer's — until the original letter is read by the application. The letter itself never changes; only the wrappings around it.

#### Diagram: The Nesting Envelope Model

<details markdown="1">
<summary>Concentric rectangles showing how each protocol's data unit nests inside the next</summary>
Type: diagram
**sim-id:** encapsulation-envelope-model<br/>
**Library:** p5.js<br/>
**Status:** Specified

Render a static diagram that visualizes encapsulation as a series of concentric rectangles, one per layer.

Canvas: 800 px wide by 480 px tall, responsive to container width down to 360 px.

Layout:

- Five concentric rectangles centered on the canvas, drawn from outside to inside:
  - Outermost (largest): Ethernet Frame, brown border (#5D4037), with a small "Header" tab on the left and "Trailer (FCS)" tab on the right.
  - Next: IP Packet, green border (#2e7d32), with a "Header" tab on the left.
  - Next: TCP Segment, blue border (#1976D2), with a "Header" tab on the left.
  - Next: HTTP Message, amber background (#F5A623), labeled "Application Payload".
  - The innermost region is the actual payload bytes (e.g., "GET /index.html HTTP/1.1").
- To the left of the diagram, render a vertical legend listing each layer name, the data unit at that layer, and the typical header size: Application (message, variable); Transport TCP (segment, 20-byte header); Network (packet, 20-byte IPv4 header); Link (frame, 14-byte Ethernet header + 4-byte FCS).
- Below the diagram, render a single horizontal byte ruler showing the running total of header bytes added by each layer — this lets students see the per-layer overhead concretely.

Interactivity:

- Hover on any concentric rectangle's border highlights that layer in the legend and pops a tooltip with the header's most important fields.
- A toggle button at the top labeled "TCP / UDP" switches the second-innermost rectangle between TCP segment (blue, 20 bytes) and UDP datagram (purple, 8 bytes), updating the byte ruler accordingly.

The diagram should be implemented in p5.js using the existing MicroSim styling. Use a 2 px border for each layer rectangle and a 6 px gap between layers so the nesting is visually unambiguous.

Learning objective (Bloom — Remembering and Understanding): Students recognize the canonical encapsulation order and recall the typical header size at each layer.
</details>

Two practical consequences of encapsulation are worth pinning down. First, **per-packet overhead is not free**. A short HTTP request might be 100 bytes of actual application data, but adding a 20-byte TCP header, a 20-byte IP header, and an 18-byte Ethernet header-plus-trailer brings the total to 158 bytes on the wire — almost 60% overhead. For protocols carrying small messages (DNS queries, ACK-only TCP segments, voice over IP frames), header overhead dominates. Designers of efficient protocols spend serious effort minimizing header bytes — IPv6 added a fixed 40-byte header partly to make hardware processing faster, and HTTP/2 introduced header compression specifically because HTTP headers had grown disproportionately large.

Second, **each layer's header is independent of the others**. You can replace TCP with UDP without touching the IP or Ethernet code. You can replace Ethernet with Wi-Fi without touching IP or TCP. You can replace IPv4 with IPv6, and as long as the transport layer asks IP "please carry these bytes," the transport layer code does not need to know which IP version is underneath. This independence is the engineering payoff that makes the layered model worth the per-packet overhead cost. Chapter 3 makes that argument explicitly.

## 2.11 Putting It Together: Reading a Frame

Imagine a packet capture tool such as Wireshark shows you a single Ethernet frame on the wire. Reading from left to right (which is how the bytes arrive at the receiver), you would see:

1. **14 bytes** of Ethernet header — destination MAC address, source MAC address, and a 2-byte EtherType field announcing what kind of payload follows. If EtherType is `0x0800`, the payload is an IPv4 packet; if `0x86DD`, IPv6; if `0x0806`, ARP.
2. **20 bytes** of IPv4 header (or 40 bytes for IPv6) — version, header length, total length, source IP address, destination IP address, and a Protocol field announcing what kind of transport-layer payload follows. If Protocol is 6, the payload is TCP; if 17, UDP; if 1, ICMP.
3. **20 bytes** of TCP header (or 8 bytes for UDP) — source port, destination port, sequence and acknowledgment numbers (TCP only), flags, window size, checksum.
4. **The application message** — for HTTP, the request or response bytes themselves, starting with `GET /…` or `HTTP/1.1 200 OK`.
5. **4 bytes** of Ethernet FCS trailer at the very end.

This is a complete recipe for decoding any packet capture you will see in this course. The fields named here are governed by RFCs (IETF) for everything except the Ethernet header and trailer, which are governed by IEEE 802.3. The port numbers are administered by IANA (under ICANN). Every standards body introduced in this chapter is doing real work in this single 158-byte sequence.

!!! mascot-encourage "If this still feels overwhelming — that's normal"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Buzz cheering you on">
    Encapsulation is the single most important idea in this textbook, and you do not have to memorize every header field today. What matters is that you can see the *shape* of a frame on the wire — header, header, header, payload, trailer — and know which layer each piece belongs to. *One hop at a time.* Every later chapter zooms in on one of these headers and explains it in detail.

## 2.12 Key Takeaways

The vocabulary in this chapter is the running glossary for the rest of the book. Before moving on, make sure you can answer the following without looking back:

- What three things does a protocol specify? Why does each matter?
- What is a standard, and why does the Internet rely on open standards rather than proprietary ones?
- What does the IETF produce, and where can you read it for free?
- What does the IEEE 802 committee govern, and at which layers of the network stack?
- What is the OSI Reference Model, who published it, and why is its vocabulary still used?
- What does ICANN coordinate? What does IANA do under ICANN?
- What is a bit? What is a byte? Why are link speeds in bits per second but file sizes in bytes?
- Name the data unit at each of the five layers — application, transport (TCP), transport (UDP), network, link.
- What are the three structural parts of a data unit? Which one carries control information, which one carries the layer above, and which one carries values that can only be computed last?
- What is encapsulation? What is decapsulation? Why does each layer's header stay opaque to the layers below?

If any of those answers feel shaky, re-read the corresponding section before continuing to Chapter 3, where we use the vocabulary from this chapter to develop the layered architecture itself — explaining *why* the OSI seven-layer model and the TCP/IP four-layer model split responsibilities the way they do, and what design principles those splits embody.

!!! mascot-celebration "Vocabulary locked in"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Buzz celebrating">
    You now know the words every later chapter assumes. Frames, packets, segments, datagrams, messages, headers, payloads, trailers — and the four standards bodies that publish the documents defining them. Encapsulation is the move you'll see, in some form, in every chapter that follows. *Follow the packet.* Onward to Chapter 3 and the layered architecture.
