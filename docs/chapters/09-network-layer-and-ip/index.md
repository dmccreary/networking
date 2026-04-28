---
title: The Network Layer and IP Addressing
description: The Internet's core design — IPv4 and IPv6 datagram services, header formats, address classes, CIDR, subnetting, IPv6 autoconfiguration, transition mechanisms (dual stack, tunneling, NAT64), control protocols (ICMP, ARP, NDP, ping, traceroute), NAT/PAT, and fragmentation.
generated_by: claude skill chapter-content-generator
date: 2026-04-28 00:30:00
version: 0.07
---

# Chapter 9: The Network Layer and IP Addressing

## Summary

This chapter is the core of the Internet's design — the IPv4 and IPv6 datagram services, header formats, address classes and ranges, CIDR, subnetting and supernetting, IPv6 address types and autoconfiguration, IPv4/IPv6 transition mechanisms (dual stack, tunneling, NAT64), control protocols (ICMP, ARP, NDP, ping, traceroute), NAT and PAT, and fragmentation/reassembly. Students will compute subnets and reason about address scarcity by the end.

## Concepts Covered

This chapter covers the following 29 concepts from the learning graph:

1. IPv4
2. IPv4 Header
3. IPv4 Address Format
4. IPv4 Address Class
5. Private IPv4 Range
6. Loopback Address
7. CIDR Notation
8. Subnet
9. Subnet Mask
10. Subnetting
11. Supernetting
12. IPv6
13. IPv6 Header
14. IPv6 Address Format
15. IPv6 Address Type
16. IPv6 Autoconfiguration
17. IPv4 IPv6 Transition
18. Dual Stack
19. Tunneling
20. NAT64
21. ICMP
22. Ping
23. Traceroute
24. ARP
25. NDP
26. NAT
27. Port Address Translation
28. Fragmentation
29. Reassembly

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Networks and Communication](../01-intro-to-networks/index.md)
- [Chapter 2: Standards, Data Units, and Encapsulation](../02-standards-and-encapsulation/index.md)
- [Chapter 3: Network Architecture and Layered Models](../03-architecture-and-layering/index.md)
- [Chapter 4: Network Performance and Quality of Service](../04-performance-and-qos/index.md)

---

!!! mascot-welcome "Mapping the world"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Buzz the bee waving welcome">
    Welcome back. A forager bee returns home to a hive whose location every other forager already knows. The waggle dance gives directions in a coordinate system the colony shares. The Internet works the same way: every host has a globally-meaningful address, and routers everywhere share enough geometry to find any destination. *Let's trace the route!* This chapter is the address book and the map.

## 9.1 What the Network Layer Does

Every link layer in this textbook so far — Ethernet, Wi-Fi, fiber, cellular — delivers frames between *immediate neighbors*. The **network layer** is the layer that delivers data across many links from an original source to a final destination, possibly traversing dozens of routers along the way. Three jobs define the network layer:

- **Global addressing** — every interface in the entire Internet has a unique address that any router anywhere can use to identify it.
- **Routing and forwarding** — routers maintain tables that map destination addresses to next-hop neighbors, so each packet takes a sensible path toward its destination.
- **Best-effort packet delivery** — packets travel independently across the network; loss, reordering, and corruption are tolerated by the layer above.

The Internet Protocol — **IP** — is the network-layer protocol that defines all three. IP comes in two versions, **IPv4** (deployed since 1983) and **IPv6** (deployed slowly since the late 1990s). Both are alive on the public Internet today; many networks run them in parallel. This chapter explains both, the transition between them, and the supporting protocols (ICMP, ARP, NDP, NAT) that make IP work in practice. Routing itself — *how* routers compute their forwarding tables — is the subject of Chapter 10.

## 9.2 The IPv4 Datagram and Header

**IPv4** is the original Internet Protocol, defined in RFC 791 (1981) and still carrying the majority of public Internet traffic in 2026. Every IPv4 packet begins with a fixed 20-byte header (longer if options are present), followed by payload. Before we examine the header diagram, here is what each major field does, defined in plain language.

- **Version (4 bits)** — always `4` for IPv4.
- **IHL — Internet Header Length (4 bits)** — header length in 32-bit words; usually 5 (= 20 bytes) when no options are present.
- **DSCP / ECN (8 bits)** — Differentiated Services Code Point (Chapter 4) and Explicit Congestion Notification.
- **Total Length (16 bits)** — total packet length including header, in bytes (max 65,535).
- **Identification, Flags, Fragment Offset (32 bits combined)** — used for fragmentation and reassembly (Section 9.13).
- **TTL — Time To Live (8 bits)** — decremented at each router; packet discarded when it reaches 0. Prevents infinite forwarding loops.
- **Protocol (8 bits)** — what kind of payload follows the IP header (6 = TCP, 17 = UDP, 1 = ICMP, 41 = IPv6 over IPv4 tunnel, etc.).
- **Header Checksum (16 bits)** — Internet checksum over the IP header only (not payload).
- **Source IP Address (32 bits)** — sender's IP address.
- **Destination IP Address (32 bits)** — receiver's IP address.
- **Options (variable, rarely used)** — for source routing, record route, and similar legacy features.

The IPv4 header is compact (20 bytes) and historically has been processed in software at line rate; modern routers do so in hardware. Two of its design choices have aged poorly: the header checksum must be recomputed at every hop (because TTL changes), and fragmentation in transit creates well-known reliability problems (see Section 9.13). IPv6 fixes both.

#### Diagram: IPv4 vs. IPv6 Header Comparison

<details markdown="1">
<summary>Side-by-side annotated header layouts for IPv4 and IPv6 with hover details</summary>
Type: infographic
**sim-id:** ipv4-vs-ipv6-headers<br/>
**Library:** p5.js<br/>
**Status:** Specified

Render an interactive side-by-side comparison of the IPv4 and IPv6 fixed headers, with hoverable annotations explaining each field.

Canvas: 940 px wide by 580 px tall, responsive down to 360 px.

Layout:

- Two stacked headers, top is IPv4 (20 bytes), bottom is IPv6 (40 bytes).
- Each header is rendered as a grid: rows are 32 bits wide; each field is shown as a colored cell labeled with its name and bit width.
- A small "removed in IPv6" label appears on IPv4 fields that have no IPv6 counterpart (Header Checksum, Identification/Flags/Fragment Offset, IHL, Options).
- A small "new in IPv6" label appears on IPv6 fields that did not exist in IPv4 (Flow Label).
- IP addresses: IPv4 source/dest are 32 bits each; IPv6 source/dest are 128 bits each (rendered as four 32-bit rows for visual symmetry).

Interactivity:

- Hover any cell raises a callout with the field's purpose, typical values, and relevant RFC.
- Toggle "Show example values" populates each field with a sample value (TTL = 64, Hop Limit = 64, Protocol/Next Header = 6 for TCP, etc.).
- Toggle "Show byte ruler" overlays a byte-position label below each row.

Visual style:

- IPv4 fields: honey-amber palette.
- IPv6 fields: signal-blue palette.
- Removed fields: striped slate background.
- New fields: glowing green border.

Learning objective (Bloom — Remembering and Understanding): Students recognize each IPv4 and IPv6 header field, can name what was removed, what was added, and what the redesign accomplished.
</details>

## 9.3 IPv4 Address Format and Classes

An **IPv4 address** is a 32-bit number, conventionally written as four decimal numbers (each 0–255) separated by dots — for example, `192.0.2.10`. This dotted-decimal notation is human-friendly; routers and operating systems work with the underlying 32-bit integer.

The original IPv4 address scheme used **address classes**, defined in RFC 791. Each class fixed the boundary between the network-prefix bits (which all hosts on the same network share) and the host bits.

| Class | Leading bits | First octet range | Network bits | Host bits | Example |
|-------|--------------|-------------------|--------------|-----------|---------|
| A | `0` | 1–126 | 8 | 24 | `10.0.0.0/8` |
| B | `10` | 128–191 | 16 | 16 | `172.16.0.0/16` |
| C | `110` | 192–223 | 24 | 8 | `192.168.1.0/24` |
| D | `1110` | 224–239 | (multicast) | (group) | `239.0.0.1` |
| E | `1111` | 240–255 | (reserved) | — | `255.255.255.255` |

Classes A, B, and C were used for unicast addresses; class D was multicast (Chapter 3); class E was reserved for future use and never deployed. The class boundary determined how many networks of each type existed and how many hosts each could hold: 128 class A networks (with 16 million hosts each), 16,384 class B networks (with 65,534 hosts each), and 2 million class C networks (with 254 hosts each). Within a few years it became clear that this allocation was wasteful — most organizations needed something between a class B and a class C — and the inflexibility was exhausting the address space prematurely. The classful scheme was retired in the early 1990s in favor of CIDR (Section 9.4).

A handful of address ranges have special meanings and never leave the local host:

- **Loopback** — the entire `127.0.0.0/8` block, but conventionally `127.0.0.1`, refers to the local host. Packets sent here never leave the machine; they are processed by the network stack and delivered locally.
- **Private IPv4 ranges** — defined by RFC 1918 for use inside private networks: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`. These addresses are not globally routable; they are reused by every home, office, and datacenter in the world. NAT (Section 9.12) bridges them to the public Internet.
- **Link-local** — `169.254.0.0/16` is auto-assigned by hosts that cannot reach a DHCP server.
- **Limited broadcast** — `255.255.255.255` is broadcast on the local link only.

## 9.4 CIDR, Subnets, and Subnet Masks

The class-based scheme was replaced in 1993 by **Classless Inter-Domain Routing (CIDR)**, defined in RFCs 1518/1519. CIDR drops the fixed class boundaries and lets the network/host split fall at any bit position.

A **CIDR notation** address consists of an IP address followed by a slash and a prefix length: `192.0.2.0/24`. The prefix length tells you how many leading bits identify the network; the remaining bits identify hosts within that network. So `192.0.2.0/24` is a network with 24 network bits and 8 host bits, yielding 256 addresses (254 usable for hosts, one reserved as the network address and one as the directed broadcast).

A **subnet** is a contiguous range of IP addresses sharing the same prefix. A **subnet mask** is a 32-bit value that has 1s in the network-prefix positions and 0s in the host positions; for `/24` the mask is `255.255.255.0`. Hosts use the subnet mask to compute, by bitwise AND of an IP address with the mask, whether two addresses are on the same subnet.

**Subnetting** is the practice of dividing a larger address block into multiple smaller blocks. An organization assigned `10.0.0.0/16` (65,536 addresses) might subnet it into `10.0.0.0/24`, `10.0.1.0/24`, ..., `10.0.255.0/24` — 256 subnets of 256 addresses each — and assign one subnet to each VLAN, building, or department.

**Supernetting** is the inverse — combining many small adjacent blocks into one larger advertisement. ISPs supernet customer prefixes when announcing routes to other ISPs, so the global routing table sees one aggregated entry instead of hundreds of specific ones. Supernetting is the engine that keeps the Internet's routing tables tractable.

A worked CIDR example. You are given the block `198.51.100.0/24` (256 addresses) and need to carve out four smaller subnets, one for each department. The natural partition is into four `/26` subnets (64 addresses each):

| Subnet | First address | Last address | Network bits | Host bits |
|--------|---------------|--------------|--------------|-----------|
| `198.51.100.0/26` | `198.51.100.0` | `198.51.100.63` | 26 | 6 |
| `198.51.100.64/26` | `198.51.100.64` | `198.51.100.127` | 26 | 6 |
| `198.51.100.128/26` | `198.51.100.128` | `198.51.100.191` | 26 | 6 |
| `198.51.100.192/26` | `198.51.100.192` | `198.51.100.255` | 26 | 6 |

Within each `/26`, the lowest address is the network address (cannot be assigned to a host), the highest is the broadcast address (also reserved), and the 62 in between are usable host addresses. Subnetting calculations show up everywhere in network design and on every networking certification exam.

#### Diagram: CIDR Subnet Calculator

<details markdown="1">
<summary>Interactive subnet calculator that visualizes how a CIDR block splits into subnets</summary>
Type: microsim
**sim-id:** cidr-subnet-calculator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that lets students enter a CIDR block, choose a subnet prefix length, and see the resulting subnets visualized as colored bands on an address-space ruler.

Canvas: 940 px wide by 540 px tall, responsive down to 360 px. A 120 px control panel sits below.

Layout:

- A horizontal address-space ruler at the top showing the entire input CIDR block as a long colored bar with binary, dotted-decimal, and hexadecimal labels at each major boundary.
- Below the ruler, a stacked breakdown of the subnets — each subnet is a colored band labeled with its network address, broadcast address, usable host range, and number of usable hosts.
- A binary view of the network/host bit split: bits in the network portion shown in dark blue, host bits in pale yellow, with the slash position highlighted.

Controls panel:

- Input box for the parent CIDR block (e.g., `198.51.100.0/24`).
- Dropdown for new subnet prefix length (must be ≥ parent's prefix).
- Toggle: "Show subnet mask in dotted decimal" alongside CIDR.
- Toggle: "Variable-length subnetting" — lets the user define mixed-size subnets (e.g., one `/25`, two `/26`s, four `/28`s) and shows how they tile the parent block.

Interactivity:

- As the user changes inputs, the ruler updates live.
- Hover any subnet band to see its first/last addresses and host count.
- Clicking on a host bit toggles it, demonstrating how individual host addresses change while the subnet stays the same.

Visual style:

- Network bits: dark blue.
- Host bits: pale yellow.
- Subnet bands: alternating honey amber and slate.
- Reserved network/broadcast addresses highlighted in red.

Learning objectives:

- (Bloom — Applying) Students compute subnet boundaries given a CIDR block and a target subnet size.
- (Bloom — Analyzing) Students examine the bit-level structure of an address and identify network vs. host portions.
- (Bloom — Evaluating) Students judge whether a given subnetting plan efficiently uses the parent block.

Implement in pure p5.js with the existing MicroSim CSS theme.
</details>

## 9.5 IPv4 Address Exhaustion

The 32-bit address space provides about 4.3 billion unique addresses, which seemed inexhaustible in 1981. By the 2010s, mobile phones, IoT devices, and growing Internet adoption had effectively exhausted IPv4. The five Regional Internet Registries (Chapter 2) progressively ran out of allocatable blocks; ARIN exhausted its general pool in 2015, RIPE NCC in 2019, APNIC and LACNIC even earlier. New address allocations now happen through transfers, leases, and a small reserved pool used for specific purposes.

Two main responses to exhaustion have shaped the modern Internet. **NAT** (Section 9.12) lets many private IPv4 addresses share one public address, postponing exhaustion at the cost of breaking end-to-end addressability. **IPv6** is the long-term solution: a much larger address space designed to never run out.

## 9.6 IPv6: A Larger Address Space and a Cleaner Design

**IPv6**, defined in RFC 8200 (the current revision; the original was RFC 1883 in 1995), uses 128-bit addresses — \(2^{128} \approx 3.4 \times 10^{38}\) unique addresses, enough to give every star in every galaxy in the observable universe its own address several times over. IPv6 also takes the chance to clean up several IPv4 design choices that have aged poorly.

The **IPv6 header** is fixed at 40 bytes (twice IPv4's, because addresses are four times as long but everything else got smaller). Compared to IPv4:

- **No header checksum.** IPv6 routers do not compute a per-hop checksum; the link layer's CRC and the transport layer's checksum together cover it.
- **No Identification/Flags/Fragment Offset.** Fragmentation is no longer done by routers in transit; only the source can fragment, using a Path-MTU Discovery mechanism.
- **No IHL.** The header is always 40 bytes; extension headers, when present, chain via the Next Header field rather than expanding the fixed header.
- **New: Flow Label.** A 20-bit field that lets a sender mark packets belonging to the same logical flow, so routers can apply per-flow QoS without examining transport-layer headers.

The result is a header that routers can parse and forward more efficiently than IPv4, a critical property as link rates have grown into hundreds of gigabits per second.

An **IPv6 address** is conventionally written as eight groups of four hexadecimal digits separated by colons: `2001:0db8:85a3:0000:0000:8a2e:0370:7334`. Two compression rules make these less verbose:

- Leading zeros within a group can be dropped: `2001:db8:85a3:0:0:8a2e:370:7334`.
- A single run of all-zero groups can be replaced with `::` (only one such replacement allowed per address): `2001:db8:85a3::8a2e:370:7334`.

The leftmost 64 bits are typically the **network prefix**; the rightmost 64 bits are the **interface identifier**. This 64/64 split is conventional, not absolute — IPv6 supports any prefix length — but it is universal in practice and enables the autoconfiguration scheme below.

## 9.7 IPv6 Address Types

IPv6 defines several **address types**, each scoped to a different range and used for different purposes:

- **Global unicast** — globally routable, equivalent to a public IPv4 address. The block `2000::/3` is the unicast assignment region.
- **Link-local** — automatically assigned to every interface from the `fe80::/10` block. Used for link-only communication (neighbor discovery, autoconfiguration). Not routed.
- **Unique local (ULA)** — the IPv6 equivalent of RFC 1918 private addresses, from the `fc00::/7` block. Routable within an organization but not on the public Internet.
- **Multicast** — `ff00::/8`. IPv6 has no broadcast address; what was broadcast in IPv4 is multicast in IPv6 (e.g., `ff02::1` is the all-nodes-on-this-link multicast).
- **Anycast** — uses the same syntax as unicast; the network distinguishes anycast addresses by where they are advertised.
- **Loopback** — `::1`.
- **Unspecified** — `::`. Used as a source address before an interface has acquired any.

Two special addresses worth knowing: `::1` is the IPv6 loopback (analogous to `127.0.0.1`), and the `2001:db8::/32` block is reserved for documentation — addresses you see in textbooks and tutorials.

## 9.8 IPv6 Stateless Autoconfiguration (SLAAC)

IPv6 introduced a feature that fundamentally changes how hosts join networks: **stateless autoconfiguration (SLAAC)**, defined in RFC 4862. A host plugged into an IPv6 network needs no DHCP server to acquire an address. The procedure runs roughly:

1. The host generates a tentative link-local address from `fe80::/10` plus an interface ID derived from its MAC (modified EUI-64) or randomly.
2. The host performs **Duplicate Address Detection (DAD)** to make sure no one else on the link uses the same address.
3. The host listens for **Router Advertisements** broadcast periodically by the local router, which include the network prefix in use.
4. The host concatenates the prefix with its interface ID to form a global unicast address.
5. The host repeats DAD on the new address, and once verified, starts using it.

The whole sequence takes a few hundred milliseconds with no server, no broadcast lease negotiation, and no operational configuration on the network. SLAAC coexists with DHCPv6 (used when an organization wants a registry of every device's address); some networks use one, some use both.

| Property | IPv4 (DHCP) | IPv6 (SLAAC) |
|----------|-------------|--------------|
| Server required | Yes | No |
| Configuration time | ~hundreds of ms (broadcast + lease) | ~hundreds of ms (Router Advertisement) |
| Per-device record | Yes (lease database) | Optional |
| Address randomization | No | Privacy extensions randomize the interface ID |

## 9.9 IPv4 / IPv6 Transition Mechanisms

Because IPv4 and IPv6 are not interoperable on the wire — an IPv4 packet cannot be routed by an IPv6-only router and vice versa — the migration from one to the other has required transition mechanisms. Three approaches dominate.

**Dual stack** is the simplest: every host and router runs both IPv4 and IPv6 simultaneously, using whichever the destination supports. Most modern operating systems and home routers are dual-stack by default. Dual stack is operationally clean but requires every device to maintain two address families and uses both pools' addresses. It is a transition strategy, not an end state.

**Tunneling** carries IPv6 packets inside IPv4 packets (or vice versa), allowing one protocol's traffic to traverse a network that only natively supports the other. The original transition strategy, **6to4** (RFC 3056), automatically tunneled IPv6 over the IPv4 Internet using a special prefix; it is now mostly deprecated in favor of explicit operator-managed tunnels. Tunneling is a workaround, not a long-term plan.

**NAT64** (RFC 6146) lets IPv6-only clients reach IPv4-only servers through a translator that rewrites IPv6 addresses to IPv4 addresses (and back) at a network boundary. NAT64 is the strategy of choice for IPv6-only mobile networks (which include T-Mobile US and many European carriers): clients run only IPv6, and the carrier's NAT64 gateway translates to IPv4 for any destinations that haven't yet adopted IPv6. **DNS64** is the companion service that synthesizes IPv6 addresses for IPv4-only DNS records, so applications work transparently.

The transition is slow but ongoing. As of 2026, roughly 45% of public Internet traffic is IPv6, with the rate continuing to climb. New networks (especially mobile and datacenter) often start IPv6-first; legacy networks (especially in the enterprise) remain dual-stack for years.

## 9.10 ICMP, Ping, and Traceroute

The network layer needs a way to report errors and probe paths. The **Internet Control Message Protocol (ICMP)**, defined in RFC 792 for IPv4 and RFC 4443 for IPv6, is the network-layer signaling protocol. ICMP messages are encapsulated in IP packets and travel as ordinary network-layer traffic, but they carry network-layer control content rather than transport-layer data.

ICMP message types include:

- **Destination Unreachable** — a router cannot deliver a packet (no route, host down, port unreachable, fragmentation needed but DF set).
- **Time Exceeded** — TTL reached zero in transit.
- **Echo Request / Echo Reply** — used by `ping`.
- **Redirect** — a router tells a host that it has chosen a suboptimal next hop and should use a different one.
- **Parameter Problem** — a malformed header field.

Two diagnostic tools make ICMP visible to ordinary users.

**`ping`** sends an ICMP Echo Request to a target and waits for an Echo Reply. The round-trip time of the reply is the path's RTT (Chapter 4); a missing reply suggests loss or unreachability. `ping` is the universal first-step diagnostic — "can I reach that host?" — and every networking student will run it thousands of times.

**`traceroute`** (or `tracert` on Windows, `traceroute6` for IPv6) discovers the routers along a path. It works by deliberately violating TTL: send a packet with TTL=1, which the first router decrements to 0 and discards while sending an ICMP Time Exceeded back. Then send a packet with TTL=2, eliciting a Time Exceeded from the second router. And so on, until the destination is reached. Each Time Exceeded reveals one hop's IP address; the running sequence reveals the path. `traceroute` is the universal "where does my packet go?" tool, and reading its output well is one of the small practical skills every network engineer needs.

Real diagnostic chains often combine the two: run `ping` to confirm reachability, then `traceroute` to find where in the path latency or loss appears, then more specific tests on the suspect hop.

## 9.11 ARP and NDP: Mapping IP to MAC

The network layer hands a packet to the link layer, but the link layer addresses by MAC, not IP. Some mechanism must translate "I want to send to IP `192.0.2.10`" into "the next hop is the device with MAC `f0:18:98:01:23:45`." Two protocols do this work, one for each address family.

The **Address Resolution Protocol (ARP)**, defined in RFC 826, is IPv4's translator. When a host wants to send to a local IPv4 address whose MAC it does not know, it broadcasts an ARP request: "Who has IP `X`?" The host with that IP replies unicast: "I have IP `X`; my MAC is `Y`." Both sides cache the answer in an ARP table for several minutes. ARP runs only within a single broadcast domain — for off-subnet destinations, the host ARPs for its default gateway's MAC, and the gateway forwards.

The **Neighbor Discovery Protocol (NDP)**, defined in RFC 4861, is IPv6's translator. NDP uses ICMPv6 multicast rather than broadcast (because IPv6 has no broadcast). The mechanism is otherwise similar: a Neighbor Solicitation message asks "who has IPv6 `X`?", and a Neighbor Advertisement carries the answer. NDP also handles router discovery, prefix advertisement (used by SLAAC), and duplicate address detection — features that IPv4 split across multiple separate protocols.

| Function | IPv4 | IPv6 |
|----------|------|------|
| Map IP → MAC | ARP (broadcast request) | NDP Neighbor Solicitation (multicast) |
| Discover routers | (DHCP option) | NDP Router Advertisement |
| Discover prefix | DHCP | NDP Router Advertisement |
| Verify uniqueness | (none) | NDP Duplicate Address Detection |

## 9.12 NAT and Port Address Translation

**Network Address Translation (NAT)** is a mechanism that lets many devices share one public IP address. A NAT device — typically a home router or carrier-grade NAT — sits between a private network (using RFC 1918 addresses) and the public Internet. It translates source addresses on outbound packets and destination addresses on inbound replies, maintaining a translation table that maps each active flow.

The most common variant is **Port Address Translation (PAT)**, also called **NAPT** or simply "NAT overload," which uses transport-layer port numbers to disambiguate flows. When two private hosts both connect to the same external server, the NAT box assigns each a unique source port on the public address, so replies can be routed back to the right private host. A typical home router with one public IP can support tens of thousands of simultaneous flows from many private hosts using this trick.

NAT has costs:

- **Breaks the end-to-end principle.** A device behind NAT cannot be reached unsolicited from outside; only outbound-initiated flows work without help. This is a security feature and a feature limitation.
- **Breaks some protocols.** Application protocols that embed IP addresses in their payload (FTP, SIP, some peer-to-peer protocols) need application-layer gateways to rewrite the addresses correctly.
- **Introduces state.** The NAT box must track every active flow and time it out when idle.
- **Limits inbound services.** Hosting a public service behind NAT requires explicit port forwarding configuration.

Despite these costs, NAT is universal on consumer Internet connections because it postponed IPv4 address exhaustion by an order of magnitude. IPv6 was designed to remove the need for NAT, and IPv6-only networks generally do not use it. As IPv6 deployment grows, NAT's role will gradually shrink — but not for many years.

## 9.13 Fragmentation and Reassembly

Sometimes a packet is too large for the next link's MTU. The network layer must do something — either split the packet into smaller pieces (**fragmentation**) and let the destination put them back together (**reassembly**), or drop the packet and signal the sender to send smaller ones.

In **IPv4**, both options exist. A packet's Don't Fragment (DF) bit, if set, prevents in-transit routers from fragmenting; if a router cannot forward without fragmenting, it returns ICMP Destination Unreachable (Fragmentation Needed) with the link's MTU, and the sender retries with smaller packets. If DF is unset, in-transit routers may fragment freely. Reassembly happens at the destination: the destination buffers fragments by their (source, destination, protocol, ID) tuple and reassembles when all pieces have arrived.

In-transit fragmentation is a well-known source of operational headaches: fragments can be lost (and must be retransmitted by the upper layer, since the network does not retransmit them); reassembly state at the destination consumes memory and is a denial-of-service vector; and security middleboxes have historically had bugs handling fragments. Modern IPv4 deployments almost always set DF and rely on Path-MTU Discovery instead.

In **IPv6**, in-transit fragmentation is forbidden. Only the source can fragment, using an extension header. If a packet is too large for any link on the path, the router returns ICMPv6 Packet Too Big and the source retries. This eliminates the worst pathologies of IPv4 fragmentation and is one of the most concrete user-visible improvements IPv6 brings.

| Property | IPv4 | IPv6 |
|----------|------|------|
| Who can fragment | Source or any router (unless DF set) | Source only |
| MTU discovery | Optional (Path-MTU Discovery) | Effectively required |
| Reassembly | At destination | At destination |
| Header field | Identification + Flags + Fragment Offset | Fragment extension header |

#### Diagram: Packet Fragmentation Walkthrough

<details markdown="1">
<summary>Animation showing how a large packet fragments across hops with smaller MTUs</summary>
Type: microsim
**sim-id:** packet-fragmentation<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that animates a packet traversing a multi-hop path with mismatched MTUs, showing fragmentation in IPv4 and Path-MTU Discovery in IPv6.

Canvas: 940 px wide by 600 px tall, responsive down to 360 px. A 100 px control panel sits below.

Layout:

- A horizontal path: Sender — Link 1 (MTU 9000) — Router R1 — Link 2 (MTU 1500) — Router R2 — Link 3 (MTU 576) — Receiver.
- A large packet (e.g., 4000 bytes) starts at the sender; the animation shows what happens at each MTU mismatch.

Animation modes (selectable from a tab control):

- **IPv4 with DF=0 (legacy):** the packet is fragmented at R1 (4000 → 2× 1500 + 1× 1000 + headers). Fragments reach R2 where each is again fragmented to fit MTU 576. Receiver buffers all fragments and reassembles. A counter tracks fragments and reassembly buffer use.
- **IPv4 with DF=1:** R1 cannot fragment, returns ICMP "Fragmentation Needed" with MTU=1500. Sender retries with 1500-byte packet; R2 returns ICMP "Fragmentation Needed" with MTU=576. Sender retries with 576-byte packets; all reach the receiver intact. PMTU is now 576.
- **IPv6:** sender starts at 4000 bytes; R1 returns ICMPv6 "Packet Too Big" with MTU=1500. Sender retries with 1500-byte packets using Fragment Extension Header (source-only fragmentation) chunks of 1500 bytes carried by the source. Same workflow for R2. PMTU converges to 576.

Controls panel:

- Tab control for the three modes.
- Sliders: link MTU values (per-link).
- Buttons: Step / Play / Reset.
- Counters: fragments created, ICMP messages exchanged, total bytes on each link.

Visual style:

- Original packet: large honey-amber rectangle.
- Fragments: smaller honey-amber rectangles labeled with offset.
- ICMP messages: red arrows traveling backward.
- MTU labels above each link.

Learning objectives:

- (Bloom — Understanding) Students explain what happens at an MTU mismatch in each of the three modes.
- (Bloom — Analyzing) Students decompose the trade-offs between in-transit fragmentation and Path-MTU Discovery.
- (Bloom — Evaluating) Students judge why IPv6 deliberately removed in-transit fragmentation.

Implement in pure p5.js with the existing MicroSim CSS theme.
</details>

## 9.14 Putting It Together: A Packet's Address Story

Imagine a laptop on a home network sending an HTTP request to `example.com`:

1. **DNS resolution.** The laptop asks its DNS resolver for `example.com`. The resolver returns both an IPv4 (`93.184.216.34`) and an IPv6 (`2606:2800:220:1:248:1893:25c8:1946`) address. The laptop's network stack picks IPv6 if both endpoints support it (the dual-stack default).
2. **Subnet match.** The laptop computes whether the destination is on its local subnet by AND-ing the destination IP with its subnet mask. It is not — the destination is far away.
3. **Default gateway.** The laptop sends the packet to its default gateway (the home router). For IPv6, it ARPs (NDP-equivalent) for the gateway's MAC; for IPv4, it ARPs.
4. **Home router.** The router receives the packet. If IPv4, the router performs NAT, rewriting the source IP from `192.168.1.42` to its public IP, and assigning a new source port. If IPv6, no NAT is needed; the laptop's address is already global.
5. **Internet routers.** Each router examines the destination IP, looks it up in its forwarding table (Chapter 10 covers how the table is built), decrements the TTL/Hop Limit, and forwards out the chosen next-hop interface. Each forward generates a fresh link-layer header with the next-hop MAC.
6. **Destination network.** The packet arrives at `example.com`'s ISP, then at the web server's edge router, then at the web server's link-layer segment. ARP (or NDP) maps the destination IP to the server's MAC, and the link layer delivers the frame.
7. **Reverse path.** The reply traverses a similar — but possibly different — path back. NAT rewrites are unwound on inbound traffic.

Every concept in this chapter — addressing, CIDR, ARP/NDP, NAT, fragmentation, ICMP — is doing real work in this single transaction. The next chapter explains how the routers in step 5 know which interface to send each packet out.

!!! mascot-encourage "If subnetting feels like arithmetic homework — that's normal"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Buzz cheering you on">
    Subnet masks, CIDR boundaries, prefix lengths — they all reduce to a few bit operations. *One hop at a time.* Every networking student computes a few hundred subnet examples before the patterns become muscle memory. The CIDR Subnet Calculator above is a friendly drilling tool. Spend an hour with it; you will not regret it.

## 9.15 Key Takeaways

The network layer is the heart of the Internet. Before moving on, make sure you can answer the following without looking back:

- What three jobs does the network layer do that the link layer cannot?
- Name the major fields of an IPv4 header. Which were removed in IPv6, and why?
- What is CIDR notation? How does a `/24` differ from a `/26`?
- Given `203.0.113.0/24`, partition it into four equal subnets and write each in CIDR notation.
- Why are private IPv4 ranges used? Name the three RFC 1918 ranges.
- What is the loopback address in IPv4? In IPv6?
- Compare IPv4 and IPv6 addressing: bit length, notation, and the major address types.
- What is SLAAC? How does it differ from DHCP?
- Compare dual stack, tunneling, and NAT64 as IPv4/IPv6 transition mechanisms.
- What does ICMP do? How do `ping` and `traceroute` use it?
- What does ARP do, and what is its IPv6 equivalent?
- Explain how NAT works and why PAT (port translation) extends it. What does NAT break?
- Why did IPv6 forbid in-transit fragmentation?

If any of those answers feel shaky, re-read the corresponding section before continuing to Chapter 10, where we move from "what is an address" to "how do routers actually find each other" — distance vector, link state, BGP, and the practical realities of Internet routing.

!!! mascot-celebration "Addresses, masks, and the global map"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Buzz celebrating">
    You can now compute subnets, read an IPv6 address, trace a packet through NAT, and explain why IPv6 was worth the trouble. The next chapter is about the millions of routers that look at the destination address you just learned and pick the right next hop. *Follow the packet.*
