---
title: Ethernet, Switching, and VLANs
description: The dominant LAN technology — Ethernet frame format, hubs vs. bridges vs. learning switches, the Spanning Tree Protocol, broadcast and collision domains, VLANs and 802.1Q tagging, access vs. trunk ports, and link aggregation.
generated_by: claude skill chapter-content-generator
date: 2026-04-28 00:13:00
version: 0.07
---

# Chapter 7: Ethernet, Switching, and VLANs

## Summary

This chapter focuses on the dominant LAN technology: Ethernet frames, hubs, bridges, learning switches, the Spanning Tree Protocol, broadcast and collision domains, VLANs, VLAN tagging (802.1Q), trunk and access ports, and link aggregation. Students will understand how a modern enterprise LAN is built and why it behaves the way it does. The chapter closes the link-layer story before the network layer begins.

## Concepts Covered

This chapter covers the following 14 concepts from the learning graph:

1. Ethernet
2. Ethernet Frame
3. Ethernet Switch
4. Hub
5. Bridge
6. Learning Switch
7. Spanning Tree Protocol
8. Broadcast Domain
9. Collision Domain
10. VLAN
11. VLAN Tagging
12. Trunk Port
13. Access Port
14. Link Aggregation

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Networks and Communication](../01-intro-to-networks/index.md)
- [Chapter 2: Standards, Data Units, and Encapsulation](../02-standards-and-encapsulation/index.md)
- [Chapter 3: Network Architecture and Layered Models](../03-architecture-and-layering/index.md)
- [Chapter 6: Link Layer Fundamentals and Reliable Transfer](../06-link-layer-fundamentals/index.md)

---

!!! mascot-welcome "Inside the hive's wiring"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Buzz the bee waving welcome">
    Welcome back. Inside a beehive, comb cells are arranged so a worker can move quickly between them — short walks, not random wandering. Modern Ethernet does the same trick with switches: a frame goes only where it needs to, never to every corner of the network. *Let's trace the route!* This chapter shows you how a single LAN — desks, servers, IP phones, security cameras — is actually built.

## 7.1 Why Ethernet Won

Of every LAN technology proposed in the 1980s and 1990s — Token Ring, FDDI, ARCnet, AppleTalk LocalTalk, ATM-to-the-desktop — only one survives in volume today. **Ethernet**, originally invented by Bob Metcalfe at Xerox PARC in 1973 and standardized by the IEEE 802.3 working group, is the link-layer protocol on virtually every wired LAN drop in the world. Its ubiquity is no accident. Three properties drove its victory:

- **Cost.** Ethernet was always cheaper per port than its competitors. Mass-market silicon and inexpensive twisted-pair cabling pushed costs down a learning curve that proprietary alternatives could not match.
- **Scalability across speeds.** The same frame format and the same MAC addressing have carried Ethernet from 10 Mbps in 1983 to 400 Gbps and 800 Gbps in datacenter spines today. A 40-year-old Ethernet driver can still parse a frame from a brand-new 800 Gbps link.
- **Migration from shared to switched.** Early Ethernet was a shared bus with CSMA/CD; modern Ethernet is a network of point-to-point links connected by switches. The transition happened without changing the frame format — the same applications, the same operating system code, the same management tools all kept working.

This chapter develops Ethernet in two parts. First, the frame format and the evolution from hubs to switches. Then, the structures that switched networks need to scale: the Spanning Tree Protocol, broadcast and collision domains, VLANs, and link aggregation.

## 7.2 The Ethernet Frame

Every Ethernet frame, regardless of speed or medium, follows the format defined in IEEE 802.3. The frame is preceded by a 7-byte preamble (alternating 1s and 0s, used for bit-clock recovery) and a 1-byte start-of-frame delimiter (`10101011`). Then the actual frame begins:

| Field | Size | Purpose |
|-------|------|---------|
| Destination MAC | 6 bytes | The neighbor (or broadcast/multicast group) the frame is addressed to |
| Source MAC | 6 bytes | The interface that originated the frame |
| EtherType / Length | 2 bytes | Type of payload (0x0800 = IPv4, 0x86DD = IPv6, 0x0806 = ARP, 0x8100 = 802.1Q tag) |
| Payload | 46 – 1500 bytes | The encapsulated network-layer packet |
| Frame Check Sequence | 4 bytes | CRC-32 over header and payload |

The minimum payload of 46 bytes is a historical artifact: classic 10 Mbps Ethernet's collision-detection mechanism required frames to be at least 64 bytes total (including header and trailer) so that the sender could still be transmitting when a colliding signal arrived. Smaller payloads are padded out. The maximum payload of 1500 bytes — the standard MTU — is large enough to amortize the 14-byte header overhead but small enough that one corrupted frame does not cost too much retransmission. **Jumbo frames** of up to 9000 bytes are common in datacenter networks, where end-to-end paths consist entirely of switches and links that all support the larger size.

A MAC address is 48 bits. The leftmost 24 bits form the **Organizationally Unique Identifier (OUI)** assigned to the manufacturer by the IEEE; the rightmost 24 bits are assigned by the manufacturer to each interface they ship. Two flag bits in the leftmost byte modify behavior: the **I/G bit** distinguishes individual (unicast) from group (multicast/broadcast) addresses, and the **U/L bit** distinguishes universally-administered (factory-assigned) from locally-administered addresses. The all-ones MAC address `ff:ff:ff:ff:ff:ff` is the **broadcast** address, delivered to every interface on the local segment.

The frame format has been remarkably stable for 40 years. Higher-rate Ethernet variants change the *physical* layer extensively (different signaling, different cabling, different connectors) but leave the frame format alone. This stability is what lets a 100 Gbps datacenter switch and an embedded sensor running 10 Mbps over a serial line speak the same link-layer dialect.

#### Diagram: Ethernet Frame Format

<details markdown="1">
<summary>Annotated byte-level layout of an Ethernet frame, with hover details for each field</summary>
Type: infographic
**sim-id:** ethernet-frame-format<br/>
**Library:** p5.js<br/>
**Status:** Specified

Render an interactive infographic that shows the byte-level layout of an Ethernet frame, with hoverable annotations explaining each field.

Canvas: 920 px wide by 480 px tall, responsive down to 360 px.

Layout:

- A horizontal "byte ruler" at the top shows positions 0-1517 (with breaks for the variable payload).
- Below the ruler, a frame is rendered as a series of color-coded blocks, each labeled with its field name and size:
  - Preamble (7 bytes) — pale gray
  - SFD (1 byte) — slate
  - Destination MAC (6 bytes) — honey amber
  - Source MAC (6 bytes) — honey amber
  - EtherType / Length (2 bytes) — green
  - Payload (46–1500 bytes) — light blue (variable width)
  - FCS (4 bytes) — brown
- Each block has a small label above showing field name and offset; below, an example value (e.g., `f0:18:98:01:23:45` for source MAC, `0x0800` for EtherType).

Interactivity:

- Hover any block raises a callout with a one-paragraph explanation of the field's purpose, the values commonly seen, and the standard reference (IEEE 802.3 section).
- A toggle "Add 802.1Q tag" inserts a 4-byte VLAN tag between source MAC and EtherType, with explanatory text — preview for the VLAN section later in the chapter.
- A toggle "Show pad bytes" highlights the padding bytes added when payload is below the 46-byte minimum.
- A toggle "Jumbo frame" extends the payload field up to 9000 bytes and adjusts the byte ruler accordingly.

Visual style:

- Blocks share rounded corners and a subtle drop shadow.
- Hovered block: 2 px deep purple border (#4a148c).
- The byte ruler uses a fixed-width font.

Learning objective (Bloom — Remembering and Understanding): Students recall the byte layout of an Ethernet frame and explain the purpose of each field.
</details>

## 7.3 From Hub to Bridge to Switch

The earliest commercial Ethernet was a literal coaxial bus: every device tapped into the same length of coax, and CSMA/CD arbitrated access. As Ethernet moved to twisted-pair cabling in the 1990s, the bus topology was preserved logically by a device called a **hub**.

A **hub** is a multi-port repeater. Bits arriving on any port are immediately retransmitted on every other port — there is no buffering, no addressing logic, and no awareness that frames exist. A hub turns a star-topology of Cat-5 cables into a logically-shared bus: every collision still affects every device, and every frame still traverses every link. Hubs are essentially extinct today, but they served an important role in the 1990s because they made the cabling switch from coax to twisted pair without requiring software changes anywhere.

A **bridge** is a smarter device. A bridge has two (or sometimes more) ports, examines each arriving frame's destination MAC address, and forwards the frame only out the port leading toward that destination. Bridges learn which MAC addresses are reachable through which port by passively watching source MAC addresses on incoming frames — a process called **MAC learning**. Bridges first appeared as two-port devices used to extend collision domains (joining two coax segments) without merging them; the concept later generalized.

A modern **Ethernet switch** is, conceptually, a bridge with many ports. Each port is its own collision domain — typically just one device on the other end — so collisions essentially never happen. The switch maintains a **MAC address table** (sometimes called a **CAM table** or forwarding table) that maps each known MAC address to the port on which it was last heard. When a frame arrives:

1. The switch reads the source MAC and updates its table: "I just heard MAC X on port P; remember that for the next 5 minutes."
2. The switch reads the destination MAC and looks it up in the table.
3. If the destination is in the table, the switch forwards the frame out only that one port (**unicast forwarding**).
4. If the destination is not in the table — or is a broadcast address — the switch floods the frame out every port except the one it arrived on.

This learning-and-flooding behavior is what makes a switch a **learning switch**: it bootstraps its forwarding knowledge without any configuration, simply by observing traffic. Within a few seconds of plugging in, a switch knows where every active device on its ports is.

| Device | Awareness | Forwarding | Collision domain |
|--------|-----------|------------|------------------|
| Hub | None — bit repeater | Every port (always) | Whole hub is one domain |
| Bridge | Per-port MAC learning | Selective by destination MAC | Each port is its own domain |
| Switch | Per-port MAC learning, full table | Selective; flood when unknown | Each port is its own domain |

The transition from hubs to switches in the late 1990s gave LANs a quiet revolution: collision domains shrank from "whole network" to "single port," CSMA/CD essentially stopped firing, and full-duplex communication became the norm. A modern gigabit switch can carry simultaneous full-rate traffic on every port at once with no contention, simply because each port is a private link.

## 7.4 Loops, Floods, and the Spanning Tree Protocol

Switches have one operational hazard: **loops in the topology cause broadcast storms**. Imagine three switches, A, B, and C, all connected in a triangle. A device on A sends a broadcast frame. Switch A floods it out to B and C. B floods it back to C and to A. C floods it back to A and B. The frame has now multiplied to several copies, and each copy is itself flooded again. Within milliseconds, the network is saturated with copies of one broadcast and no legitimate traffic can flow. Ethernet has no TTL field — there is no mechanism in the frame itself for a copy to "expire" — so loops are catastrophic.

Loops cannot simply be avoided by careful design. Network operators want redundancy: if one switch-to-switch link fails, traffic should automatically fail over to a backup. Redundancy means *physical* loops in the cabling. The trick is to ensure that even though the wires form loops, the *active forwarding paths* do not.

The **Spanning Tree Protocol (STP)**, defined in IEEE 802.1D and refined as Rapid STP in 802.1w, solves this by computing a logical tree on top of an arbitrary physical topology. Switches exchange special frames called **BPDUs (Bridge Protocol Data Units)** to elect a single **root bridge**, then each non-root switch computes the shortest path to the root. Ports on shortest paths are kept active; ports that would create a loop are placed in a *blocked* state where they can pass BPDUs but not user data. The result is a spanning tree of active links rooted at the elected switch. Loops are still physically present, but inactive — and the moment an active link fails, STP recomputes and unblocks a previously-blocked port to restore connectivity.

The original STP had two famous flaws: convergence was slow (30+ seconds when topology changed) and it used the bandwidth of only one path even when many existed. Rapid Spanning Tree (RSTP, IEEE 802.1w) cut convergence to a few seconds, and modern data-center switches often skip Ethernet's spanning tree entirely in favor of Layer-3 routing protocols or proprietary fabric protocols (TRILL, SPB, VXLAN with EVPN). But STP/RSTP is still running on most enterprise switches today, quietly preventing loops in the background.

#### Diagram: Spanning Tree in Action

<details markdown="1">
<summary>Animated demonstration of STP electing a root bridge and blocking redundant links</summary>
Type: microsim
**sim-id:** spanning-tree-protocol<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that animates the Spanning Tree Protocol building a loop-free tree from a redundant switch topology.

Canvas: 940 px wide by 600 px tall, responsive down to 360 px. A 120 px control panel sits below.

Topology:

- 5 switches arranged in a partial mesh with redundant links (e.g., a triangle with a tail and a diagonal). Each switch is labeled S1–S5 with a small bridge ID (priority + MAC).
- Hosts are not shown; this is a switch-only topology.

Animation steps:

1. All ports start in a "listening" state, drawn in yellow.
2. Each switch begins emitting BPDUs. The animation shows pulses traveling along each link.
3. Switches compare bridge IDs and elect the lowest-ID switch as root (highlighted with a crown icon).
4. Each non-root switch computes its shortest path to the root; ports on the path are turned green (forwarding), ports that would create loops are turned red (blocking).
5. A scenario button "Link failure" lets students click any link to disable it; the simulation re-runs RSTP and shows convergence as a previously-blocked port turns green.

Controls panel:

- Buttons: Step / Play / Reset.
- Toggle: "Show BPDU contents" — clicking a BPDU pulse displays the proposed root bridge ID and root path cost.
- Buttons: "Inject failure" (random link fails), "Inject root failure" (root bridge goes down).
- Speed slider.

Visual style:

- Switches: rounded rectangles in slate.
- Root bridge: highlighted with a crown icon and honey-amber border.
- Forwarding ports: green dots at link endpoints.
- Blocked ports: red dots.
- BPDUs: small pulsing circles traveling along links.

Learning objectives:

- (Bloom — Understanding) Students explain how STP elects a root and decides which ports to block.
- (Bloom — Analyzing) Students examine convergence behavior under link or root failure.
- (Bloom — Evaluating) Students judge the trade-off between STP simplicity and the bandwidth-efficient alternatives used in modern datacenter fabrics.

Implement in pure p5.js with the existing MicroSim CSS theme.
</details>

## 7.5 Broadcast Domains and Collision Domains

Two terms describe the *scope* of certain link-layer events on a network. The distinction is essential for understanding why VLANs exist.

A **collision domain** is the set of ports on which a transmission could collide with another transmission. On a hub, every port is in the same collision domain because a hub physically merges all signals. On a switch, each port is its own collision domain because each port has its own dedicated link with one device on the far end. The shrinking of collision domains from "whole network" to "single port" is what made full-duplex Ethernet possible and effectively retired CSMA/CD.

A **broadcast domain** is the set of ports that will receive a broadcast frame. Every port reachable through switches without crossing a router is in the same broadcast domain. A single switch is one broadcast domain; two switches connected by a cable form one broadcast domain; ten switches connected in any spanning-tree topology form one broadcast domain. Routers, by contrast, do *not* forward broadcast frames — broadcasts are scoped to a Layer-2 segment.

Why does broadcast scope matter? Three reasons. First, **performance**: every host receives every broadcast, so a network with 5,000 hosts in one broadcast domain spends a lot of CPU on broadcasts. Second, **security**: a single misconfigured device can flood the entire broadcast domain with traffic that all hosts must process. Third, **administrative isolation**: hosts in the same broadcast domain are by default visible to each other on the link layer, which may not match the organizational reality (HR computers and engineering computers should probably not share a broadcast domain even if they share a building).

The natural answer would be to subdivide the network into smaller broadcast domains by cabling each subdivision to its own router-isolated segment. That works, but it forces the cabling to match the segmentation: HR people sit on the HR cable, engineering on the engineering cable. VLANs let the same physical switch cabling carry multiple logical broadcast domains, each treated independently.

| Term | Defined as | Affected by |
|------|-----------|-------------|
| Collision domain | Set of ports where transmissions can collide | Hub vs. switch; full-duplex links |
| Broadcast domain | Set of ports that receive each broadcast | Switches (extend it); routers and VLANs (limit it) |

## 7.6 VLANs and 802.1Q Tagging

A **Virtual LAN (VLAN)** is a logical broadcast domain defined within a switch (or across switches) without requiring separate physical cabling. A switch can be configured with, say, four VLANs — VLAN 10 for engineering, VLAN 20 for HR, VLAN 30 for guests, VLAN 99 for management — and each VLAN behaves like an independent network. Broadcasts in VLAN 10 reach only ports assigned to VLAN 10; hosts on VLAN 10 cannot see traffic on VLAN 20 unless a router explicitly bridges between them.

VLANs are not a security boundary by themselves (the switch is enforcing the segmentation, and a misconfigured switch can leak frames between VLANs), but they are an essential structural tool. They let one physical infrastructure carry many logical networks, each with its own broadcast scope, addressing scheme, and access-control policy.

Two port roles support VLANs.

An **access port** is configured to belong to exactly one VLAN. The end device plugged into an access port has no idea VLANs exist — it sends and receives untagged Ethernet frames as usual, and the switch attaches the VLAN association automatically based on which port the frame entered. Access ports are how desktops, phones, and servers participate in a VLAN.

A **trunk port** is configured to carry traffic for multiple VLANs at once. Trunk ports connect switch to switch (or switch to router or switch to virtualization host). To distinguish frames belonging to different VLANs on the same physical link, the switch *tags* each frame with a VLAN ID before sending it down the trunk. The receiving switch reads the tag, removes it, and treats the frame as belonging to the indicated VLAN.

The dominant tagging standard is **IEEE 802.1Q**. An 802.1Q tag is a 4-byte field inserted into the Ethernet frame between the source MAC and the EtherType field. The tag contains a 12-bit VLAN ID (giving 4094 usable VLANs — IDs 0 and 4095 are reserved), a 3-bit priority field (used by 802.1p QoS), and a few flag bits. With 4094 VLANs available, even very large enterprises can give every department, every lab, every floor its own broadcast domain.

| Port type | Carries | Tagging | Typical use |
|-----------|---------|---------|-------------|
| Access port | One VLAN | Frames untagged on the wire | Desktop, phone, server attachment |
| Trunk port | Many VLANs | Frames tagged with 802.1Q | Switch-to-switch, switch-to-router |

A VLAN can span multiple switches: assign access ports on Switch A to VLAN 10, assign access ports on Switch B to VLAN 10, configure the Switch-A-to-Switch-B link as a trunk that includes VLAN 10. Now any device on either switch's VLAN 10 access ports can reach any other device on either switch's VLAN 10 access ports — and broadcast traffic stays within VLAN 10 across the trunk, never crossing into VLAN 20 or any other VLAN.

A subtle wrinkle: by default, traffic between VLANs requires a router (or a "Layer-3 switch" with routing built in). The router has an interface on each VLAN it serves and applies whatever access-control policy is desired between them. This routed boundary is also where IP subnetting begins — every VLAN is typically also its own IP subnet. Chapter 9 develops IP subnetting in detail.

## 7.7 Link Aggregation

What if a single 10 Gbps link between two switches is not enough capacity, and the next-step-up (40 Gbps or 100 Gbps) is too expensive or unavailable? **Link aggregation**, also called LAG, port-channel, EtherChannel, or bonding, lets multiple parallel links be treated as one logical link. Four 10 Gbps cables between Switch A and Switch B can be configured as one 40 Gbps logical link, spreading frames across the four physical members.

Link aggregation provides three benefits. **Higher aggregate bandwidth** is the obvious one. **Redundancy**: if one of the four cables fails, the other three keep carrying traffic with no STP reconvergence. **Per-port fairness**: a single flow does not consume more than one physical link's capacity (because aggregation uses a hash-based load balancer on flow-identifying fields), so a heavy flow does not starve other flows on the same logical link.

The standard control protocol for link aggregation is **LACP (Link Aggregation Control Protocol)**, defined in IEEE 802.3ad (now part of 802.1AX). LACP lets the two switches negotiate which ports are members of the bundle, detect failures, and add or remove members dynamically. Link aggregation can also be configured statically, but LACP is preferred because it gracefully handles miscabling and partial failures.

A typical hashing scheme uses a combination of source MAC, destination MAC, and IP and port headers to choose a member link. Two flows between the same pair of MACs will always traverse the same physical link (preserving order); different flows are spread across the bundle. If the network's traffic is dominated by a single elephant flow, link aggregation does not help — that one flow will use only one physical member at a time. For mostly-small-flow workloads, aggregation gives near-linear bandwidth gain.

#### Diagram: VLANs and Link Aggregation Together

<details markdown="1">
<summary>Interactive topology showing how VLANs flow across trunk ports built on aggregated links</summary>
Type: microsim
**sim-id:** vlans-and-link-aggregation<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that visualizes a small enterprise switching topology with VLANs and link aggregation, letting students click frames to trace their paths.

Canvas: 980 px wide by 620 px tall, responsive down to 360 px. A 120 px control panel sits below.

Topology:

- Two switches, S1 and S2, connected by a 4-port LAG (drawn as four parallel lines bundled together).
- 4 hosts attached to S1: H1 in VLAN 10, H2 in VLAN 20, H3 in VLAN 10, H4 in VLAN 30.
- 4 hosts attached to S2: H5 in VLAN 10, H6 in VLAN 20, H7 in VLAN 30, H8 in VLAN 10.
- A router R connects to S1 via a trunk port carrying VLANs 10, 20, and 30, providing inter-VLAN routing.

Animation:

- Click on any host to send a frame from that host to a chosen destination.
- The frame is rendered as a colored rectangle traveling along links; its color reflects its source VLAN.
- When the frame crosses the LAG, it follows one of the four physical members based on a hash of source/destination — the chosen member is highlighted.
- When the frame arrives at a trunk port, an "802.1Q tag" badge appears on it; the badge disappears when the frame egresses on an access port.
- Inter-VLAN frames (e.g., H1 → H6) route through R; the frame is shown changing VLAN tag at the router.

Controls panel:

- Source / destination dropdowns.
- "Send broadcast" button — shows the frame flooding only within its VLAN.
- "Disable LAG member" button — fails one of the four physical links and shows that the LAG keeps working at reduced capacity.
- VLAN visibility toggles.

Visual style:

- VLAN 10: amber. VLAN 20: blue. VLAN 30: green.
- Trunk links: thicker, dashed.
- LAG members: drawn as four parallel lines with a "LAG" label.

Learning objectives:

- (Bloom — Understanding) Students explain how 802.1Q tagging keeps multiple VLANs on one trunk link.
- (Bloom — Applying) Students predict which physical LAG member a given flow will traverse based on a hash function.
- (Bloom — Analyzing) Students decompose an inter-VLAN flow into its access, trunk, and routed segments.

Implement in pure p5.js with the existing MicroSim CSS theme.
</details>

## 7.8 Putting It Together: A Modern Office LAN

Consider a small office with 80 employees across four departments — Engineering, HR, Finance, and Guest. The network is built like this:

1. **Cabling.** Cat-6a runs from each desk back to a wiring closet on each floor. Each wiring closet contains an access switch (typically 48 gigabit ports plus four 10-gigabit uplinks). Access switches in each closet uplink to a core switch in the basement.
2. **VLANs.** Four VLANs are configured: VLAN 10 (Engineering), VLAN 20 (HR), VLAN 30 (Finance), VLAN 99 (Guest). Each VLAN corresponds to its own IP subnet.
3. **Access ports.** Every desk port is an access port assigned to the appropriate VLAN — engineering desks to VLAN 10, HR to VLAN 20, etc. Voice over IP phones add a wrinkle: the phone is in a voice VLAN, the desktop is in the data VLAN, and the access port carries both via a feature called *voice VLAN* (or via 802.1Q tagging configured at the phone).
4. **Trunk ports.** Every uplink between an access switch and the core is a trunk port carrying all four VLANs as 802.1Q-tagged traffic. Each uplink uses 4× 10 Gbps link aggregation for redundancy and capacity.
5. **Core router (or Layer-3 switch).** The core has an interface on each VLAN. Inter-VLAN traffic (Engineering reaching the file server in another VLAN) is routed by the core. The core also provides the default gateway for each VLAN's IP subnet.
6. **Spanning tree.** RSTP runs across all switches and trunks. The core switch is configured as the root bridge. Redundant paths exist (each access switch has uplinks to two core devices) and STP keeps one blocked unless the active path fails.
7. **Guest isolation.** Guest VLAN 99 has access only to the Internet, never to internal subnets. The router enforces this with access control lists.

This pattern — access switches at the edge, a core that does both Layer-2 trunking and Layer-3 routing, VLANs for segmentation, link aggregation for capacity, RSTP for loop prevention — is the dominant enterprise LAN architecture and has been for two decades. Datacenter and cloud network designs (introduced briefly in Chapter 16) use different fabrics, but enterprise LANs still look largely the way Chapter 7 describes.

!!! mascot-thinking "Why VLANs are not a security boundary"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Buzz thinking carefully">
    A correctly-configured VLAN keeps unicast and broadcast traffic isolated, but it relies on the switch to enforce that isolation. A misconfigured trunk port, a vulnerability in the switch firmware, or a *VLAN hopping* attack (where an attacker forges 802.1Q tags to inject frames into a different VLAN) can bypass the separation. Treat VLANs as a *segmentation* tool, not a *security* tool. Real isolation comes from routers and firewalls between VLANs, not from VLAN tags alone.

## 7.9 Key Takeaways

The link layer's universal vocabulary applies everywhere; this chapter pinned it down to the dominant LAN technology. Before moving on, make sure you can answer the following without looking back:

- Name the fields of an Ethernet frame and the size of each.
- Why does the minimum payload have to be at least 46 bytes?
- Compare a hub, a bridge, and a switch on awareness, forwarding behavior, and collision domain.
- What does a learning switch learn, and from what?
- What problem does the Spanning Tree Protocol solve? What is a root bridge?
- Define collision domain and broadcast domain. Which one is bounded by switches? Which by routers?
- What is a VLAN, and what problem does it solve?
- Compare access ports and trunk ports. What does an 802.1Q tag carry?
- Why might two switches be connected by an aggregated link instead of one fast cable?
- Why are VLANs not a security boundary by themselves?

If any of those answers feel shaky, re-read the corresponding section before continuing to Chapter 8, where we move on to wireless and mobile networks — Wi-Fi, cellular, hand-off between access points, and the special challenges of supporting devices that move while they communicate.

!!! mascot-celebration "Switched LAN — built and routed"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Buzz celebrating">
    You can now read an enterprise LAN diagram and explain every line on it: the access ports, the trunks, the LAGs, the VLANs, the spanning tree. The next chapter takes the same link-layer story and adds the most volatile medium of all — the air. *Follow the packet.*
