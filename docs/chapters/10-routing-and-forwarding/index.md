---
title: Routing and Forwarding
description: How packets find their way — the forwarding/routing distinction, longest-prefix match, distance-vector and link-state algorithms (RIP, OSPF), path-vector routing (BGP) and autonomous systems, Internet topology, peering vs. transit, and multicast/anycast routing.
generated_by: claude skill chapter-content-generator
date: 2026-04-28 00:40:00
version: 0.07
---

# Chapter 10: Routing and Forwarding

## Summary

This chapter traces the path of a packet through the Internet — the forwarding/routing distinction, forwarding and routing tables, longest-prefix match, static and default routes, distance-vector algorithms (Bellman-Ford, RIP, count-to-infinity, split horizon, poison reverse), link-state algorithms (Dijkstra, OSPF), path-vector routing (BGP, autonomous systems), Internet topology, peering and transit, and multicast/anycast routing. Students will trace convergence by hand on small topologies.

## Concepts Covered

This chapter covers the following 28 concepts from the learning graph:

1. Longest Prefix Match
2. Forwarding
3. Routing
4. Forwarding Table
5. Routing Table
6. Static Route
7. Default Route
8. Routing Algorithm
9. Distance Vector Routing
10. Bellman Ford Algorithm
11. RIP Protocol
12. Count To Infinity
13. Split Horizon
14. Poison Reverse
15. Link State Routing
16. Dijkstra Algorithm
17. OSPF Protocol
18. Path Vector Routing
19. BGP Protocol
20. Autonomous System
21. Intradomain Routing
22. Interdomain Routing
23. Internet Topology
24. Tier 1 ISP
25. Peering
26. Transit Provider
27. Multicast Routing
28. Anycast Routing

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Networks and Communication](../01-intro-to-networks/index.md)
- [Chapter 2: Standards, Data Units, and Encapsulation](../02-standards-and-encapsulation/index.md)
- [Chapter 3: Network Architecture and Layered Models](../03-architecture-and-layering/index.md)
- [Chapter 9: The Network Layer and IP Addressing](../09-network-layer-and-ip/index.md)

---

!!! mascot-welcome "Following the swarm-trail"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Buzz the bee waving welcome">
    Welcome back. When a forager finds a nectar source, the colony quickly converges on the best route to it — without any single bee knowing the whole map. Routers do something similar: each router knows only its neighbors, yet the network as a whole computes correct paths. *Let's trace the route!* This chapter is how that distributed magic works.

## 10.1 Forwarding vs. Routing

Two related but distinct activities happen at every router. **Forwarding** is the per-packet, fast-path operation: when a packet arrives, look up its destination address in a table, and send it out the corresponding interface. Forwarding happens at line rate — billions of packets per second on a backbone router — and is implemented in dedicated hardware (ASICs and TCAMs) so it can keep up.

**Routing** is the slower, control-plane operation that *builds* the table forwarding uses. Routing protocols exchange information among routers to compute, and re-compute, the right next hop for each destination. Routing happens on time scales of seconds to minutes; the table it produces feeds into forwarding's nanosecond-scale lookups.

The two tables involved are sometimes confused. The **routing table** (the **Routing Information Base**, or RIB) is the control plane's view of all known routes, including alternates and metadata. The **forwarding table** (the **Forwarding Information Base**, or FIB) is the data plane's optimized view, derived from the RIB and tuned for fast lookup. On a small router the two are essentially the same; on a large backbone router they are different data structures in different parts of the system.

| Activity | Time scale | Plane | Implemented in |
|----------|-----------|-------|----------------|
| Forwarding | Per-packet (ns) | Data plane | Hardware (ASIC, TCAM) |
| Routing | Per-event (s–min) | Control plane | Software (routing daemon) |
| Routing table (RIB) | Seconds to minutes | Control plane | RAM, complex data structure |
| Forwarding table (FIB) | Lookup-optimized | Data plane | TCAM or compressed trie |

## 10.2 Longest-Prefix Match

When a packet arrives, the router must find which forwarding-table entry applies to its destination address. The Internet's forwarding rule is **longest-prefix match (LPM)**: among all entries whose prefix the destination matches, choose the one with the longest prefix.

LPM lets a router carry both general routes ("for anything in `10.0.0.0/8`, send out interface eth0") and specific overrides ("but for `10.0.5.0/24`, send out interface eth1"). A packet to `10.0.5.42` matches both entries, but the more-specific `/24` wins because its prefix is longer. This single rule is what makes CIDR (Chapter 9) interoperate cleanly with hierarchical routing — ISPs can advertise aggregated supernets and customers can override with specific subnets, and forwarding always does the right thing.

Implementing LPM efficiently is one of the central engineering problems in router design. A small router can scan the table linearly. A large router must use a Patricia trie, a binary search on prefix length, or a TCAM (a memory chip that can search by prefix in one cycle) — and the techniques chosen determine the router's lookup performance and cost.

A **static route** is a forwarding table entry configured manually by an operator, never updated by a routing protocol. A **default route** is a special static route written as `0.0.0.0/0` (in IPv4) or `::/0` (in IPv6) — a prefix that matches every destination. Because every other prefix is longer, the default route is used only when no more-specific entry matches. Home routers and stub networks typically have just one routed interface and a default route pointing at the ISP; the router has no idea what is "out there" and does not need to.

## 10.3 The Routing Algorithm Families

Routers use **routing algorithms** — distributed protocols that exchange information so each router can build a consistent forwarding table. Three algorithm families dominate.

- **Distance vector** algorithms compute shortest paths by having each router tell its neighbors what *distance* (cost) it has to each destination, and updating its own table based on what neighbors report.
- **Link state** algorithms compute shortest paths by flooding the entire topology to every router, after which each router computes paths locally with Dijkstra's algorithm.
- **Path vector** algorithms (used between organizations) extend distance vector by carrying the entire *path* (sequence of organizations) rather than just a numeric cost — supporting policy-based routing.

Each family has different convergence behavior, scalability properties, and operational complexity. The Internet uses all three: link state (OSPF, IS-IS) inside an organization's network, path vector (BGP) between organizations, and small specialized networks still using distance vector (RIP) at the edges.

## 10.4 Distance-Vector Routing and the Bellman-Ford Algorithm

A **distance-vector** routing algorithm asks every router to maintain a vector of distances — for each destination, the cost of reaching it and the next hop. Periodically, each router sends its current vector to its neighbors. When a neighbor receives a vector advertising a destination at cost `D`, the receiving router checks: is this better than my current cost? If so, update the table and remember that the next hop for this destination is the neighbor that sent the better path.

The mathematical foundation is the **Bellman-Ford algorithm**. Each router applies the recursion

\[
d_v(x) = \min_w \left\{ c(v, w) + d_w(x) \right\}
\]

where \(d_v(x)\) is router \(v\)'s estimated distance to destination \(x\), \(c(v, w)\) is the cost of the link from \(v\) to neighbor \(w\), and \(d_w(x)\) is what neighbor \(w\) advertised. Repeated rounds of message exchange converge on the actual shortest paths in the network (when the topology is stable).

The classical distance-vector protocol is **RIP (Routing Information Protocol)**, defined in RFC 2453. RIP is simple — easy to implement, easy to teach — and it was widely deployed in the 1980s and 1990s on small networks. Three properties of RIP show up in many homework problems:

- **Hop count metric.** Every link has cost 1; total cost is just the number of hops. This ignores bandwidth, latency, and load.
- **30-second update interval.** Routers exchange vectors every 30 seconds; missing six consecutive updates declares a route dead.
- **Maximum 15 hops.** A path of 16 hops is treated as infinity (unreachable). This caps RIP's diameter.

RIP is rarely deployed today on networks of any scale; OSPF replaced it for most use cases. But RIP is the archetypal distance-vector protocol and is essential for understanding the family.

## 10.5 Count-to-Infinity, Split Horizon, and Poison Reverse

Distance vector has a famous failure mode: when a link goes down, routers can chase each other's stale information in a slow spiral that takes many rounds to terminate. The pattern is called **count-to-infinity**.

Imagine routers A, B, and C in a line. C is connected to a destination network at distance 1; B learns from C that the destination is at distance 2; A learns from B that it is at distance 3. Now C's link to the destination fails. C marks the destination unreachable. But before C's update reaches B, A — which still thinks B has a path at distance 2 — sends an update saying it has a path at distance 3. B trusts A and updates its table: "the destination is reachable through A at distance 4." B then sends this to C, which updates to distance 5. Then A sees B's distance 4 and updates to distance 5. Then B updates to 6, A to 7, and so on, "counting to infinity" one step at a time until they hit RIP's 15-hop maximum.

Two tricks dampen this failure mode:

**Split horizon** — when sending an update over interface \(i\), do not include any routes you learned from that same interface. This prevents A from telling B about a path that A only knows about because of B. Split horizon stops the simplest count-to-infinity loops.

**Poison reverse** is split horizon's stronger sibling: when sending an update over interface \(i\), include routes you learned from that interface, but advertise them with cost = infinity. This actively *kills* the route on the receiver rather than just omitting it. Poison reverse prevents some loops that split horizon alone misses.

Even with these tricks, distance vector has more pathologies than link-state algorithms. The trade-off is that distance vector uses much less memory and CPU per router, which is why it survived in early networks.

| Failure mode | Cause | Remedy |
|--------------|-------|--------|
| Slow convergence | Iterative neighbor exchange | Faster timers, triggered updates |
| Count-to-infinity | Stale information loops | Split horizon, poison reverse |
| Routing loops | Inconsistent state during convergence | Hold-down timers, route dampening |
| Limited diameter | Hop-count metric caps | Use a different metric (OSPF) |

## 10.6 Link-State Routing and Dijkstra's Algorithm

A **link-state** routing algorithm gives every router the full topology, then has each router run a shortest-path calculation locally. The procedure is roughly:

1. Each router floods a **Link State Advertisement (LSA)** describing its local links and their costs.
2. Every router collects LSAs from every other router, building a complete picture of the network graph.
3. Each router runs **Dijkstra's algorithm** on this graph, computing the shortest path to every destination.
4. The result populates the router's forwarding table.

Dijkstra's algorithm starts from the local router and incrementally finds the shortest path to each other node. At each step it picks the unvisited node with the lowest tentative cost, marks it visited, and updates the tentative costs of its neighbors. The result is a tree of shortest paths from the local router to every destination.

Link state has several advantages over distance vector:

- **Faster convergence.** Topology changes propagate as one flooding wave rather than iteratively step by step. Networks converge in seconds, not minutes.
- **No count-to-infinity.** Each router has the full topology and computes paths locally; stale neighbor information cannot cause loops the way it does in distance vector.
- **Richer metrics.** Bandwidth, latency, and administrative weights can be encoded in link costs. Hop count is no longer the only choice.

The dominant link-state protocol on the Internet is **OSPF (Open Shortest Path First)**, defined in RFC 2328 (OSPFv2 for IPv4) and RFC 5340 (OSPFv3 for IPv6). OSPF is used inside organizations as the **interior gateway protocol (IGP)** of choice; it is what most enterprise and ISP backbone networks run between their own routers. OSPF has features absent from RIP:

- **Areas** — large networks are subdivided into areas, with backbone Area 0 and several non-backbone areas. LSAs are flooded only within the area; summarized information crosses area boundaries. Areas keep the LSA database manageable.
- **Hierarchical addressing** — area design and CIDR cooperate to reduce LSA churn.
- **Authentication** — neighbors authenticate each other to prevent rogue routers from injecting false LSAs.
- **Equal-cost multipath (ECMP)** — when two paths to a destination have the same cost, OSPF can split traffic across both, doubling the available bandwidth.

The other major link-state protocol is **IS-IS (Intermediate System to Intermediate System)**, originally defined for OSI networking and adapted for IP. IS-IS is similar in algorithm to OSPF but encodes its messages differently; it is widely used by tier-1 ISPs because of better scalability properties for very large networks. For most enterprise networks, OSPF is the default choice.

#### Diagram: Distance-Vector vs. Link-State Convergence

<details markdown="1">
<summary>Side-by-side animation of RIP and OSPF converging on the same topology after a link failure</summary>
Type: microsim
**sim-id:** dv-vs-ls-convergence<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that animates how a small network converges under distance-vector and link-state algorithms when a link fails.

Canvas: 960 px wide by 620 px tall, responsive down to 360 px. A 100 px control panel sits below.

Layout:

- A network of 6 routers arranged in a partial mesh, with link costs labeled.
- The canvas is split into two side-by-side mirrors of the same topology: left is "RIP (distance vector)", right is "OSPF (link state)".
- Each router displays its current routing table — destination, next hop, cost — updated as messages flow.

Animation:

- Step 1: Both networks converge on identical routing tables.
- Step 2: A specific link fails (user clicks to choose).
- RIP side: routers exchange vectors round by round; count-to-infinity may visible appear and the update interval is shown as a slow tick.
- OSPF side: a flooding wave of LSAs propagates immediately; each router runs Dijkstra and updates within seconds.
- A side-by-side "convergence time" counter increments.

Controls panel:

- Dropdown: link to fail.
- Buttons: Step / Play / Reset.
- Toggle: "Enable split horizon" (RIP side only) — turns on/off the loop-prevention.
- Toggle: "Enable poison reverse".
- Speed slider for RIP update interval.

Visual style:

- Routers as rounded rectangles with router IDs.
- Active links: green; failed link: red dashed; flooding wave: pulsing blue.
- Routing table cells: highlight changed entries in honey amber.

Learning objectives:

- (Bloom — Understanding) Students explain how each protocol family responds to a topology change.
- (Bloom — Analyzing) Students compare convergence time, message overhead, and CPU cost.
- (Bloom — Evaluating) Students judge which family is appropriate for a given network size.

Implement in pure p5.js with the existing MicroSim CSS theme.
</details>

## 10.7 Path-Vector Routing and BGP

Distance vector and link state both work well *within* an organization. They do not scale to the whole Internet, and they do not respect the policy preferences that make Internet inter-connection work. **Path-vector** routing extends distance vector to handle both problems.

A **path vector** is a route advertisement that lists the entire sequence of organizations the route traverses, not just the cost. When organization X advertises to organization Y, the message says "to reach destination D, you can go through me, then through me, then..., then to D" — the full path. The receiver knows exactly which organizations it would be relying on, can apply policy decisions ("avoid routes through organization Z"), and can detect loops by checking that its own organization is not already in the path.

The path-vector protocol used between organizations on the Internet is **BGP (Border Gateway Protocol)**, currently at version 4 (RFC 4271). BGP is the protocol that holds the global Internet together. It is the **interdomain routing** protocol — running between **autonomous systems** rather than within them.

An **autonomous system (AS)** is an organization that operates one or more networks under a single administrative routing policy. Each AS has a unique 32-bit AS number (originally 16-bit; expanded as exhaustion approached). Examples: Comcast (AS 7922), Google (AS 15169), Cloudflare (AS 13335), the home institution where you are reading this. BGP exchanges messages between routers at the boundaries of autonomous systems, advertising prefixes the AS can reach and listening to advertisements from neighbors.

BGP is *not* a shortest-path protocol. It is a *policy* protocol. When AS X has multiple routes to AS Y, BGP picks among them based on a complex preference algorithm influenced by:

- Local preference (how much the AS values the route).
- AS path length (shorter paths preferred, all else equal).
- Origin type, MED, and several tiebreakers.
- Community tags (administrative metadata used to communicate policy intent).

The result is that BGP routes do not always follow the geographically shortest or fastest path. They follow the path that satisfies the operator's commercial and policy preferences. Two ISPs that exchange traffic on a peering arrangement will route their customers' traffic to each other, but they will *not* route a third party's traffic between them — BGP policy enforces that.

| Property | Distance vector (RIP) | Link state (OSPF) | Path vector (BGP) |
|----------|------------------------|--------------------|--------------------|
| Information shared | Distance vector | Full topology (LSAs) | AS path |
| Convergence | Slow, iterative | Fast (seconds) | Slow, policy-driven |
| Loop prevention | Split horizon, poison reverse | Topology gives full picture | AS path inspection |
| Scope | Small networks | Within one organization | Between organizations |
| Metric | Hop count | Cost (configurable) | Policy + path length |

## 10.8 Intradomain vs. Interdomain Routing

The split between routing inside and between organizations gives the Internet two routing scopes.

**Intradomain routing** (also called **interior** or **IGP**) operates within a single AS. The operator controls every router and can pick any algorithm they like. OSPF and IS-IS dominate; some networks still use RIP at the edges or for legacy reasons; some use proprietary protocols (Cisco's EIGRP) on equipment from a single vendor.

**Interdomain routing** (also called **exterior** or **EGP**) operates between ASes. There is no single operator; ASes have commercial relationships, policy preferences, and sometimes adversarial interests. BGP is the only practical protocol at this scope.

The boundary between intradomain and interdomain is a **border router** that speaks BGP to neighbor ASes (an external BGP, or eBGP, session) and OSPF/IS-IS to its own AS (the IGP). The border router redistributes information between the two protocols carefully — too freely, and a routing loop is created; too restrictively, and reachability is lost. Designing this redistribution is one of the most consequential operational tasks in network engineering.

## 10.9 Internet Topology, Tier-1 ISPs, Peering, and Transit

The Internet is not flat. It is structured as a hierarchy (more accurately, a partial hierarchy with substantial cross-connections) shaped by the commercial relationships among ASes.

A **tier-1 ISP** is a network that can reach every destination on the Internet *without* paying any other network for transit. Tier-1 ISPs achieve this by peering with every other tier-1 ISP — exchanging routes for free, in roughly equal volume. There are perhaps a dozen tier-1 ISPs globally (AT&T, Verizon, Lumen/CenturyLink, NTT, Telia, Tata, Deutsche Telekom, GTT, and a few others). They form the de facto core of the Internet.

Below the tier-1s are **tier-2 ISPs** that pay one or more tier-1s for transit to destinations they cannot reach via peering. Tier-2 ISPs typically peer with one another regionally and serve large portions of a continent or a country. Below them are **tier-3 ISPs** (regional and local providers) that buy transit from tier-2s and serve end customers.

Two commercial relationships structure the network:

**Peering** is a settlement-free exchange of routes between two ASes that exchange roughly comparable volumes of traffic. Each side advertises its own customers' prefixes to the other; neither side advertises a third party's prefixes (which would be free transit). Peering happens at **Internet Exchange Points (IXPs)** — physical facilities where many networks meet — and over private cross-connects. Major IXPs (DE-CIX in Frankfurt, AMS-IX in Amsterdam, LINX in London, Equinix Ashburn in Virginia) carry terabits per second of peering traffic and are essential infrastructure.

**Transit** is a paid relationship where one AS pays another to carry its traffic to and from any destination on the Internet. The customer pays per-megabit or per-95th-percentile-bandwidth. The provider advertises the customer's prefixes to the rest of the world and accepts the customer's outbound traffic. Transit prices have fallen dramatically over the past two decades; in many markets a gigabit of transit costs less than a dollar per Mbps per month.

The interplay between peering and transit shapes BGP policy. An AS prefers to route traffic over peering links (free) rather than transit links (paid), and over its customers' links (revenue) above all. The standard preference order is **customer > peer > transit** for outbound traffic, with similar preferences applied symmetrically.

#### Diagram: Internet Topology and BGP Relationships

<details markdown="1">
<summary>Interactive diagram of tier-1, tier-2, and tier-3 ASes with peering and transit links</summary>
Type: microsim
**sim-id:** internet-topology-bgp<br/>
**Library:** vis-network<br/>
**Status:** Specified

Render an interactive node-link diagram of a small Internet showing autonomous systems and the BGP relationships between them.

Canvas: 960 px wide by 620 px tall, responsive down to 360 px.

Topology:

- 4 tier-1 ISPs at the top, fully meshed with peering links.
- 6 tier-2 ISPs in the middle, each connected to one or two tier-1s via transit, and to several other tier-2s via peering.
- 8 tier-3 ISPs and content providers at the bottom, each with one or two transit providers.
- Special nodes: a tier-1 anchored CDN (e.g., Cloudflare, AS 13335) directly peering with most others; a major content network (e.g., Google, AS 15169) with many peering links.

Edge styles:

- Transit links: thick honey-amber arrows pointing from customer to provider; transit traffic flows in both directions.
- Peering links: dashed slate edges, no arrow direction.
- Each link has a hover tooltip showing the relationship type and the typical traffic volume.

Interactivity:

- Click any AS to see its full set of relationships and the AS path it would use to reach any other AS in the diagram.
- Click any pair of ASes (source and destination) to highlight the BGP-preferred path in green and other available paths in dim gray.
- Toggle "Hide transit relationships" to show only peering links — useful for understanding the dense peering mesh among large networks.
- "Add IXP" toggle introduces a virtual IXP node to which many ASes connect; demonstrate that one IXP can replace dozens of pairwise peering links.

Visual style:

- Tier-1 ASes: rounded rectangles in deep slate.
- Tier-2 ASes: rounded rectangles in mid-slate.
- Tier-3 ASes / content: rounded rectangles in honey amber.
- Currently-selected path: green highlight.

Learning objectives:

- (Bloom — Understanding) Students explain the difference between peering and transit relationships.
- (Bloom — Analyzing) Students decompose a BGP-preferred AS path into its commercial relationships.
- (Bloom — Evaluating) Students judge how IXPs and direct peering with content providers reduce transit costs and improve performance.

Implement in vis-network with the existing learning-graph viewer styling.
</details>

## 10.10 Multicast and Anycast Routing

Two specialized routing modes complement the dominant unicast routing introduced above.

**Multicast routing** delivers a single packet to a *group* of receivers. The receivers join a multicast group identified by a multicast address; the sender transmits one copy and the network replicates the packet at branching points so that every group member receives it. The classical multicast routing protocols are **PIM (Protocol Independent Multicast)** in two flavors — PIM-DM (dense mode) for densely-populated groups, PIM-SM (sparse mode) for sparsely-populated groups. Multicast can deliver enormous bandwidth savings when one source has many receivers (live IPTV, live sports broadcast, financial market data feeds), but it has never become routine on the public Internet. Most multicast deployments are inside controlled networks (enterprises, ISPs, content delivery networks).

**Anycast routing** uses unicast addresses but advertises the same prefix from multiple geographic locations. Routing protocols select whichever advertisement they consider closest, and packets to that prefix go to the nearest copy. Anycast is invisible at the application layer — clients just send to a single address and the network does the rest — but it provides massive geographic distribution and DDoS resistance. The classic anycast deployments are the DNS root servers (each labeled `a.root-servers.net`, `b.root-servers.net`, etc., is actually hundreds of physical servers worldwide sharing one anycast address) and modern public DNS resolvers (`8.8.8.8`, `1.1.1.1`). CDNs use anycast at their edge to deliver content from the nearest of hundreds of points of presence.

The difference between multicast and anycast is the receiver set. Multicast delivers to *many* receivers from one sender; anycast delivers to *one* receiver chosen from many candidates.

## 10.11 Putting It Together: Tracing a Packet Through the Internet

Consider a packet sent from a laptop in Boston to a web server in Tokyo:

1. **Local subnet.** The laptop checks if the destination is on its own subnet. It is not, so the packet goes to the default gateway — the home router.
2. **ISP edge router.** The home router forwards to the ISP. The ISP's edge router consults its forwarding table and sends the packet up the ISP's hierarchy.
3. **ISP core, OSPF.** Within the ISP, OSPF computes shortest paths. The packet traverses several core routers, each looking up the destination prefix and forwarding to the next hop with the shortest OSPF cost.
4. **AS boundary, BGP.** The ISP's border router speaks BGP to a tier-1 transit provider. BGP-learned routes tell the border router that the destination prefix is reachable via this transit provider's AS path: e.g., `ISP → Tier-1 → Tier-1 (Asia) → Japanese ISP → AS 12345 (the destination AS)`.
5. **Trans-Pacific transit.** The packet crosses an undersea cable through the tier-1's network. At each AS boundary, BGP policy chose the next-hop AS. Within each AS, OSPF or IS-IS chose the path through that AS's routers.
6. **Destination AS.** The Japanese ISP's border router receives the packet, applies its local IGP, and forwards through its core network to the customer-facing edge.
7. **Last hop.** The customer-facing edge router forwards to the data center's network, where another IGP (OSPF, BGP, or a datacenter fabric protocol) takes over for the last few hops.
8. **Destination link.** The packet arrives on a switch port; the link layer delivers it to the web server's interface.

Every step uses concepts from this chapter. Forwarding lookups happen at every router. OSPF or IS-IS computes paths inside each AS. BGP exchanges routes between ASes and applies policy at each boundary. The whole journey takes 100–200 ms and routes through perhaps 20 routers and 5–10 ASes — and as long as no link fails along the way, every packet of the conversation follows nearly the same path.

!!! mascot-thinking "Why the Internet is hard to fix"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Buzz thinking carefully">
    BGP is the most consequential protocol on the Internet, and it has only weak built-in security. False route advertisements have caused multi-hour outages of major services more than once. Operators have responded with **RPKI (Resource Public Key Infrastructure)** — a cryptographic registry that says "AS X is authorized to originate prefix Y" — and route filtering at AS boundaries. Adoption is uneven; the Internet's routing system is still not as secure as a globally-critical system should be.

## 10.12 Key Takeaways

Routing is the discipline that makes a network of networks navigable. Before moving on, make sure you can answer the following without looking back:

- What is the difference between forwarding and routing?
- What is longest-prefix match? What is a default route?
- Compare distance vector and link state in convergence speed and information shared.
- Trace count-to-infinity by hand on a 3-router chain. What does split horizon do? What about poison reverse?
- What is OSPF? What does Dijkstra's algorithm compute, and what does it require as input?
- What is an autonomous system? What does AS-level routing add that intradomain routing does not?
- What does BGP compute that link-state cannot, and why does the Internet need it?
- Explain the difference between peering and transit.
- What is a tier-1 ISP, and what defines it?
- Compare unicast, multicast, and anycast routing.

If any of those answers feel shaky, re-read the corresponding section before continuing to Chapter 11, where we move up to the transport layer — TCP and UDP, connection setup, sliding windows, congestion control, and the protocols that turn IP's best-effort delivery into reliable application-to-application byte streams.

!!! mascot-celebration "From Boston to Tokyo, fully traced"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Buzz celebrating">
    You can now read a `traceroute` output and explain every hop. You know which routers belong to which AS, which protocols run between them, and why one path was preferred over another. The next chapter zooms in on what happens *between* the endpoints — TCP and UDP, the protocols that make the chaotic packet-by-packet network feel like a stable connection. *Follow the packet.*
