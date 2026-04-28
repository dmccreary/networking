---
title: Wireless and Mobile Networking
description: Wireless LANs (Wi-Fi 802.11), access points, SSIDs, BSS and ESS, channels, RTS/CTS, roaming, Bluetooth, cellular generations (4G LTE, 5G NR), Mobile IP, handoff, and link adaptation — what makes wireless links different from wired ones and how the upper layers cope.
generated_by: claude skill chapter-content-generator
date: 2026-04-28 00:21:00
version: 0.07
---

# Chapter 8: Wireless and Mobile Networking

## Summary

This chapter introduces wireless and cellular networking — Wi-Fi (IEEE 802.11) including access points, SSIDs, BSS/ESS, channels, RTS/CTS, and roaming; Bluetooth; cellular generations (4G LTE, 5G NR); and mobility mechanisms such as Mobile IP, handoff, and link adaptation. Students will reason about why wireless links behave differently from wired ones and how the upper layers cope with it.

## Concepts Covered

This chapter covers the following 16 concepts from the learning graph:

1. Wireless LAN
2. Wi Fi
3. Access Point
4. SSID
5. BSS
6. ESS
7. Wi Fi Channel
8. RTS CTS
9. Wi Fi Roaming
10. Bluetooth
11. Cellular Network
12. 4G LTE
13. 5G NR
14. Mobile IP
15. Handoff
16. Link Adaptation

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Networks and Communication](../01-intro-to-networks/index.md)
- [Chapter 2: Standards, Data Units, and Encapsulation](../02-standards-and-encapsulation/index.md)
- [Chapter 3: Network Architecture and Layered Models](../03-architecture-and-layering/index.md)
- [Chapter 5: The Physical Layer](../05-physical-layer/index.md)
- [Chapter 6: Link Layer Fundamentals and Reliable Transfer](../06-link-layer-fundamentals/index.md)

---

!!! mascot-welcome "Out of the hive, into the air"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Buzz the bee waving welcome">
    Welcome back. Foragers leave the hive and navigate by sun, polarized light, and pheromone trails — all wireless, all variable, all subject to interference. *Let's trace the route!* This chapter is about networks that work the same way: variable, mobile, and shared with everyone else's invisible signals. By the end you'll know why wireless works as well as it does *and* why it sometimes feels like it shouldn't.

## 8.1 Why Wireless Is Different

Every chapter to this point has worked through links you could touch — copper, fiber, the wires inside a switch. **Wireless** networks share electromagnetic spectrum that no one owns and that everyone radiates into. The contrasts with wired media show up at every layer.

- **Shared, not point-to-point.** A single Wi-Fi channel is heard by every receiver in range. Two laptops cannot both transmit at once on the same channel without their signals colliding. Wired switching gave each cable its own collision domain; wireless cannot.
- **Variable bit error rate.** A wired link's BER is set by the cable plant and is roughly stable. A wireless link's BER varies second-by-second with distance, walls, microwave ovens, weather, and other transmitters. Engineers never assume a fixed BER on radio.
- **Half-duplex, mostly.** Most wireless radios cannot transmit and receive on the same frequency at the same time — the transmitter's own signal swamps everything else. Wired Ethernet has been full-duplex for decades; Wi-Fi is still mostly half-duplex.
- **Mobile receivers.** A wireless device may move while in active conversation. Its identity (MAC, IP, port) must remain stable; the network underneath must change to match its new location.
- **Power and regulation.** Wireless transmitters must obey legal limits on power and frequency — limits set by national regulators (FCC in the US, Ofcom in the UK, etc.). Wired networks have no such constraint.

These differences shape every wireless design decision. The Wi-Fi MAC uses CSMA/CA (Chapter 6) instead of CSMA/CD because collision detection is impossible. Cellular networks devote vast complexity to handoff because users genuinely move while connected. Wireless protocols layer aggressive forward error correction over their physical layers because residual BER is too high for end-to-end retransmission alone. Wireless is harder than wired networking, and that difficulty is fundamentally physical, not just a temporary engineering shortcoming.

## 8.2 The Wireless LAN and the Wi-Fi Family

A **wireless LAN (WLAN)** is a local-area network whose links are wireless rather than wired. The dominant wireless LAN technology is **Wi-Fi**, the consumer brand for the IEEE 802.11 family of standards. The first 802.11 standard appeared in 1997 with a peak rate of 2 Mbps; the latest, Wi-Fi 7 (802.11be), reaches multiple gigabits per second per spatial stream. Wi-Fi has gone through eight generations, summarized below.

| Generation | IEEE standard | Year | Frequency band(s) | Peak rate (per stream) |
|------------|---------------|------|-------------------|------------------------|
| Wi-Fi 1 (legacy) | 802.11b | 1999 | 2.4 GHz | 11 Mbps |
| Wi-Fi 2 (legacy) | 802.11a | 1999 | 5 GHz | 54 Mbps |
| Wi-Fi 3 (legacy) | 802.11g | 2003 | 2.4 GHz | 54 Mbps |
| Wi-Fi 4 | 802.11n | 2009 | 2.4 / 5 GHz | 150 Mbps |
| Wi-Fi 5 | 802.11ac | 2013 | 5 GHz | 433 Mbps |
| Wi-Fi 6 / 6E | 802.11ax | 2019 / 2021 | 2.4 / 5 / 6 GHz | 600 Mbps |
| Wi-Fi 7 | 802.11be | 2024 | 2.4 / 5 / 6 GHz | 2.4 Gbps |

Each generation has improved on three axes: more bandwidth (wider channels), higher modulation order (more bits per symbol), and more spatial streams (multiple antennas working in parallel via MIMO). Wi-Fi 7's headline numbers — 320 MHz channels, 4096-QAM, up to 16 spatial streams — push the same Shannon-bound trade-offs introduced in Chapter 5 toward the ceiling.

The Wi-Fi MAC sits on top of these radios and handles the contention, framing, and reliability work introduced in Chapter 6. The frame format is similar to Ethernet but adds extra fields to identify the access point, the BSS, the QoS class, and the encryption state — Wi-Fi management is more complex than Ethernet's because the medium is more dynamic.

## 8.3 Access Points, BSS, and ESS

Wi-Fi networks come in two main topology modes: **infrastructure mode**, where one or more **access points (APs)** mediate communication, and **ad hoc mode**, where devices talk directly without an AP. Infrastructure mode dominates in production deployments; ad hoc mode is rare and used mostly for direct device-to-device transfers (Wi-Fi Direct).

An **access point** is a device that bridges the wireless medium and a wired backbone. APs receive frames from wireless clients, inspect their destination, and forward them either to another wireless client (rare) or out to the wired network through the AP's Ethernet port. In a typical deployment, each AP plugs into an enterprise switch over a single Ethernet cable (often Power-over-Ethernet) and provides wireless service to a small region.

A **Basic Service Set (BSS)** is one AP plus all the wireless clients currently associated with it. Every BSS has a unique 48-bit identifier called the **BSSID**, which is usually just the AP's MAC address. Every frame sent within a BSS includes the BSSID so that overlapping APs can distinguish their respective traffic.

An **Extended Service Set (ESS)** is a collection of multiple BSSes that present themselves as a single logical wireless network. The whole ESS shares a network name — the **Service Set Identifier (SSID)** — that is what users see when their device lists "available networks." Users connect to "Coffee_Shop_Wi-Fi" without knowing or caring which of the building's eight access points they are currently associated with. Behind the scenes, each AP runs its own BSS, but they share the SSID, the security configuration, and the network behind the wired backhaul.

The relationship between AP, BSS, ESS, and SSID is one of the most useful mental pictures of how Wi-Fi is administered:

- One AP forms one BSS.
- Many BSSes can share an SSID and form an ESS.
- A user's device sees the SSID; the device picks one of the BSSes (one AP) to associate with at any moment.
- When the user walks across the building, the device transitions from one BSS to another within the same ESS — a process called **roaming**.

#### Diagram: BSS and ESS Topology

<details markdown="1">
<summary>Visualization of multiple access points sharing one SSID, with a client roaming between them</summary>
Type: microsim
**sim-id:** bss-ess-roaming<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that visualizes a multi-AP enterprise Wi-Fi deployment, with a single client device that the user can drag through the floor plan to trigger roaming.

Canvas: 940 px wide by 600 px tall, responsive down to 360 px. A 100 px control panel sits below.

Layout:

- A simple floor plan: a horizontal rectangle representing a building with three rooms separated by walls (rendered as gray bars that attenuate signal).
- Three APs, one per room, each labeled AP-1, AP-2, AP-3. Each AP has a circular signal-strength region drawn in pale color extending around it; regions overlap at room boundaries.
- One client device (laptop icon) that the user can click and drag through the floor plan.
- All three APs share the same SSID "Office_Wi-Fi" but each has its own BSSID (MAC address) shown on hover.

Interactivity:

- The client device automatically associates with whichever AP has the strongest signal at its current position.
- A "current AP" indicator shows the BSSID of the AP the client is associated with.
- When the client crosses into another AP's stronger region, an animation visualizes the roaming handoff: probe request, association response, brief connection drop indicator, reassociation.
- A signal-strength meter shows RSSI from each of the three APs to the client in real time.
- A toggle "Show wired backbone" reveals the switch behind the APs and the path data takes through the wired network.

Controls panel:

- "Drag to move" instruction.
- Toggle: "Auto-walk client" — automatically moves the client along a predefined path so students can watch handoffs.
- Toggle: "Slow handoff" — delays the reassociation to show the brief connectivity gap that real roaming can incur.
- Speed slider for auto-walk.

Visual style:

- APs: rounded rectangles with antenna icons.
- Signal regions: pale concentric circles fading outward.
- Walls: gray bars with reduced signal strength on the far side.
- Client: laptop icon with a small antenna indicator showing current BSSID.

Learning objectives:

- (Bloom — Understanding) Students explain how an SSID is shared across many BSSes to form an ESS.
- (Bloom — Analyzing) Students trace what happens during a Wi-Fi roam, including the brief disconnection and reassociation.
- (Bloom — Evaluating) Students judge how AP placement affects roaming behavior in a building floor plan.

Implement in pure p5.js with the existing MicroSim CSS theme.
</details>

## 8.4 Channels and Spectrum

Wi-Fi shares unlicensed spectrum with many other devices. Three primary frequency bands matter today: **2.4 GHz**, **5 GHz**, and **6 GHz** (the latter added in 2020 and used by Wi-Fi 6E and Wi-Fi 7). The bands have very different characteristics.

The 2.4 GHz band has only 11 channels in most countries (1–11 in the US, 1–13 in Europe, 1–14 in Japan), each 22 MHz wide. The channels overlap so heavily that only three of them — 1, 6, and 11 — are non-overlapping. This is a tiny number for any real deployment: in a city apartment building, dozens of nearby networks all crowd onto the same three usable channels. The 2.4 GHz band also overlaps Bluetooth, microwave ovens, baby monitors, and many other consumer devices, producing high interference. On the other hand, 2.4 GHz signals propagate further and pass through walls more easily than higher frequencies, which is why it remains useful for long-range and through-wall coverage.

The 5 GHz band has 25+ non-overlapping 20 MHz channels (depending on region), can bond pairs into 40 MHz channels or quads into 80 MHz, and so on. More channels mean less crowding and less interference. The trade-off is shorter range — 5 GHz signals don't propagate through walls as well — and some channels carry **DFS (Dynamic Frequency Selection)** restrictions because they share spectrum with weather radar and some military systems.

The 6 GHz band, opened to Wi-Fi by the FCC in 2020 and others worldwide since, adds 1200 MHz of fresh spectrum with seven non-overlapping 160 MHz channels (or one 320 MHz channel for Wi-Fi 7). The 6 GHz band is currently mostly empty, which is why Wi-Fi 6E and Wi-Fi 7 deliver dramatic real-world performance improvements over older Wi-Fi 5 — not because the radios are intrinsically better, but because there is room to breathe.

A **Wi-Fi channel** is a specific frequency range that a BSS uses for its transmissions. Each AP picks a channel (manually or automatically) on which to operate, and adjacent APs in an ESS are usually configured on different channels to minimize co-channel interference. A site survey for a new office uses a spectrum analyzer to find the cleanest channels in the building's RF environment and assigns APs accordingly.

## 8.5 The Hidden Terminal Problem and RTS/CTS

Wireless adds a problem that wired networks never have. Imagine three devices: A on the left, B in the middle, C on the right. A and C are out of radio range of each other but both can hear B. If A is transmitting to B, C cannot detect A's signal — C senses the channel as idle and may transmit to B as well. The two transmissions collide at B, both fail, and neither sender knows why. This is the **hidden terminal problem**, and CSMA/CA's listen-before-transmit logic does not solve it.

The IEEE 802.11 standard provides an optional fix: the **RTS/CTS handshake**. Before transmitting a long frame, a sender may first send a short **Request to Send (RTS)** frame to its intended receiver. The receiver replies with a **Clear to Send (CTS)** frame, which is heard by every station within range of the receiver — including the otherwise-hidden terminals. The CTS contains a duration value that tells listeners "stay quiet for the next N microseconds while the upcoming data frame transmits." Hidden terminals defer based on the CTS even though they could not hear the RTS.

RTS/CTS adds two short frames of overhead per data frame, which is wasteful for short frames and dense networks. Most Wi-Fi deployments enable RTS/CTS only for frames above a configurable threshold (e.g., 2300 bytes), so the handshake is used for big frames where the cost of a collision is high but skipped for small frames where the overhead would dominate. RTS/CTS is essential in any deployment with significant hidden-terminal probability, and it is mandatory for some Wi-Fi rate-control modes.

| Aspect | Without RTS/CTS | With RTS/CTS |
|--------|-----------------|--------------|
| Hidden terminal collisions | Common, expensive | Avoided |
| Short-frame overhead | Low | High (two extra frames) |
| Long-frame overhead | (collision risk) | Modest (handshake amortized) |
| Typical configuration | Disabled or threshold-based | Enabled above a frame-size threshold |

## 8.6 Roaming and Handoff

When a Wi-Fi client moves out of one AP's coverage and into another's, it must transition associations — a process called **Wi-Fi roaming**. The basic algorithm is simple: the client monitors signal strength to its current AP, scans for nearby APs in the same ESS that are stronger, and reassociates with the new AP when the signal-strength advantage exceeds a threshold.

Roaming has historically been slow because the client typically authenticates anew with the new AP — full 802.1X EAP exchanges and key derivation can take several hundred milliseconds, during which the client cannot send or receive data. Several extensions reduce this gap:

- **Pre-authentication** lets the client authenticate with neighboring APs before it needs to roam.
- **Opportunistic Key Caching (OKC)** lets multiple APs share an authenticated session, so reassociation does not require a full handshake.
- **802.11r (Fast BSS Transition)** standardizes a handshake-elision scheme that gets handoff time below 50 ms.
- **802.11k** lets APs exchange "neighbor reports" so the client knows where to look for a better AP.
- **802.11v** lets the network *suggest* to a client that it should roam, rather than waiting for the client to decide.

These extensions are now standard in enterprise deployments. Voice over Wi-Fi (VoWiFi), where sub-50-ms handoff is essential to avoid audible glitches, drove their adoption.

The general term for any transition between network attachment points is **handoff** (also spelled handover). Handoff applies in cellular networks too — when a phone moves from one tower's coverage to another's — and the cellular industry has spent four decades engineering handoff to be invisible to the user.

## 8.7 Bluetooth: Personal-Area Networking

**Bluetooth** is a short-range wireless standard designed for personal-area networking — connecting headphones, keyboards, mice, fitness trackers, and other small devices to a host. It operates in the 2.4 GHz band (yes, the same band as Wi-Fi, sharing all the interference) and uses **frequency hopping** across 79 channels (Bluetooth Classic) or 40 channels (Bluetooth Low Energy) to mitigate interference: rather than camping on one channel, a Bluetooth link rapidly hops among channels in a pseudo-random sequence shared between the two endpoints.

Bluetooth's key trade-off is short range and low power. A typical Bluetooth Classic radio reaches about 10 meters at 2.5 mW; Bluetooth Low Energy (BLE) can reach further at lower data rates and very low power consumption — a coin-cell battery can power a BLE sensor for a year or more. Bluetooth's data rates are modest by Wi-Fi standards (peak rates of 1–3 Mbps for Classic, 1–2 Mbps for BLE), but they are appropriate for the workloads it serves.

Bluetooth has its own naming: a **piconet** is a small group of one master device (the host) and up to seven slaves (the peripherals). A **scatternet** is multiple piconets sharing some devices. Bluetooth's scope ends at the personal area; it is not intended to compete with Wi-Fi for general LAN connectivity.

## 8.8 Cellular Networks: 4G LTE and 5G NR

A **cellular network** is a wide-area wireless network organized into geographic cells, each served by a cellular base station (also called a cell tower or eNodeB/gNodeB). A user's phone associates with one base station at a time; as the user moves, the network hands the connection from one base station to another. Modern cellular networks reach effectively every populated area on Earth, carry the majority of the world's mobile data, and increasingly compete with fixed broadband for residential service.

**4G LTE (Long-Term Evolution)** standardized cellular data networking in 2009 and remained the dominant mobile data technology through the 2010s. LTE introduced an all-IP architecture (no separate circuit-switched voice path), used OFDMA modulation similar to Wi-Fi, and reached peak rates of around 100 Mbps downlink in real-world conditions. LTE-Advanced (2013) and LTE-Advanced Pro (2017) pushed peak rates above 1 Gbps with carrier aggregation and higher-order MIMO. LTE remains widely deployed today and will coexist with 5G for many years.

**5G NR (New Radio)**, standardized by 3GPP starting in 2018, is the current generation of cellular technology. 5G's headline goals are three: extreme mobile broadband (multi-Gbps peak rates), ultra-reliable low-latency communication (single-digit milliseconds end-to-end, intended for industrial and vehicular applications), and massive machine-type communications (a million devices per square kilometer, intended for IoT). Three frequency ranges are used:

- **Sub-6 GHz** — provides broad coverage and reasonable capacity, similar to LTE bands.
- **Mid-band (3–7 GHz)** — provides the best balance of capacity and range, where most 5G traffic actually flows.
- **mmWave (24–47 GHz)** — provides enormous capacity over very short range (typically under 200 meters), used in dense urban deployments and stadiums.

5G's architecture also separates the user plane from the control plane more cleanly than LTE, supports network slicing (creating logically separate virtual networks for different applications on the same physical infrastructure), and can run a fully cloud-native core.

| Generation | Year | Peak rate | Latency | Key feature |
|------------|------|-----------|---------|-------------|
| 2G GSM | 1991 | 100 Kbps | ~500 ms | Digital voice + SMS |
| 3G UMTS | 2001 | 2 Mbps | ~150 ms | Mobile data |
| 4G LTE | 2009 | 100 Mbps – 1 Gbps | 30–50 ms | All-IP networking |
| 5G NR | 2019 | 1–10 Gbps | 1–10 ms | Slicing, mmWave, URLLC |

## 8.9 Mobility: Mobile IP and Beyond

Wi-Fi roaming and cellular handoff handle mobility within a single layer-2 administrative scope. But the deeper question is: when a device moves *between* networks (from your home Wi-Fi to your office Wi-Fi to a cellular network), how does the rest of the Internet keep its TCP connections alive?

The classic answer is **Mobile IP**, defined in RFC 5944 (IPv4) and RFC 6275 (IPv6, called "Mobile IPv6"). Mobile IP gives each mobile device two addresses: a permanent **home address** (which is what the rest of the Internet uses to reach the device) and a temporary **care-of address** (which reflects its current network). A **home agent** in the device's home network captures traffic destined for the home address and tunnels it to the device at its current care-of address. The mobile device tells the home agent which care-of address to use as it moves.

Mobile IP works in principle but has never seen wide deployment on the public Internet, mostly because the indirection through the home agent adds latency that real applications would rather avoid. In practice, three other approaches dominate:

- **Re-establishing connections** — most mobile applications simply retry their TCP/QUIC connections after a network change. This is invisible because modern stacks notice the network change and reconnect within seconds.
- **Multipath transports (MPTCP, QUIC connection migration)** — newer transport protocols can move a connection between IPs without disrupting it. QUIC, in particular, identifies connections by a connection ID rather than by 4-tuple, so it can survive an IP change cleanly.
- **VPNs** — corporate VPNs put the mobile device on a stable virtual address that does not change as the device moves, hiding mobility from applications.

The deeper insight is that the original Internet architecture identified hosts by their IP address, which is also their location. When hosts move, the identifier changes, breaking connections that assumed otherwise. Modern protocols (QUIC's connection ID, Mobile IP's home address, even simple application-level reconnection) all decouple identity from location to make mobility tractable.

## 8.10 Link Adaptation: Choosing the Right Modulation

A wireless channel is not stationary. Its signal-to-noise ratio changes second-by-second as the user moves, walls block signals, and other transmitters come and go. A static modulation choice would be either too aggressive (failing whenever conditions degrade) or too conservative (wasting capacity whenever conditions improve).

**Link adaptation** is the practice of dynamically choosing the modulation and coding scheme based on observed channel quality. Both Wi-Fi and cellular use it. The radio measures signal strength and error rate in real time; when the channel is clean, it ramps up to a high-order modulation (256-QAM, 1024-QAM, 4096-QAM in Wi-Fi 7) and a high coding rate; when the channel degrades, it drops back to a lower-order modulation and a stronger code rate.

The practical effect is that Wi-Fi peak rates (the headline numbers in marketing) are achieved only in a small region near the access point, in a clean RF environment. As you move away, your data rate drops in steps as the radio shifts modulation. A device at the edge of an AP's coverage might get 6 Mbps even though the same AP can deliver 2.4 Gbps to a device next to it.

| Distance from AP | Typical signal strength | Modulation chosen | Data rate (Wi-Fi 6, 80 MHz, 2 streams) |
|------------------|--------------------------|-------------------|----------------------------------------|
| Close (≤ 5 m) | Strong | 1024-QAM, rate 5/6 | ~1.2 Gbps |
| Medium (10–15 m) | Medium | 256-QAM, rate 3/4 | ~600 Mbps |
| Far (20–25 m) | Weak | 16-QAM, rate 1/2 | ~120 Mbps |
| Edge (30 m+) | Very weak | BPSK, rate 1/2 | ~6 Mbps |

Link adaptation is invisible to the user: the device just shows "connected" while the underlying rate fluctuates. But it explains why network engineers spend so much time on AP placement: the goal is to keep every user in a region where the chosen modulation is high.

#### Diagram: Wireless Performance vs. Distance

<details markdown="1">
<summary>Interactive plot of Wi-Fi data rate as a function of distance, showing the link-adaptation steps</summary>
Type: microsim
**sim-id:** wireless-link-adaptation<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that visualizes how link adaptation steps Wi-Fi modulation down as distance from the access point increases, and how interference further degrades the choice.

Canvas: 940 px wide by 600 px tall, responsive down to 360 px. A 120 px control panel sits below.

Layout:

- Top: a horizontal floor plan with an AP on the left and a draggable client device. The line between them is annotated with current SNR (dB) computed from a path-loss model.
- Middle: a stepped data-rate plot vs. distance, showing the discrete modulation/coding-scheme (MCS) steps as the client moves further from the AP.
- Bottom: a constellation diagram showing the currently-active modulation (BPSK / QPSK / 16-QAM / 64-QAM / 256-QAM / 1024-QAM / 4096-QAM) with noise-induced jitter on the constellation points.

Interactivity:

- Drag the client to change distance; the SNR, modulation, and data rate update live.
- Add walls (drag from a "wall" palette) between AP and client to simulate attenuation.
- Inject interference (slider for interference power) and see modulation step down accordingly.
- "Compare Wi-Fi 5 / Wi-Fi 6 / Wi-Fi 7" toggle changes the modulation set and recomputes data rates at the same SNRs.

Controls panel:

- Distance display (live).
- SNR display.
- Active MCS index and name.
- "Show Shannon limit" toggle that overlays the Shannon-bound capacity curve on the data-rate plot, showing the gap to optimal.
- "Add neighbor AP" button that introduces co-channel interference and shows further degradation.

Visual style:

- AP: amber rounded rectangle.
- Client: laptop icon.
- Constellation diagram: classic circular layout with constellation points and noise clouds.
- Data-rate plot: stepped staircase with each step labeled by modulation name.

Learning objectives:

- (Bloom — Understanding) Students explain how link adaptation chooses a modulation based on channel quality.
- (Bloom — Analyzing) Students decompose a real-world Wi-Fi connection's effective rate into the SNR, modulation, and coding contributions.
- (Bloom — Evaluating) Students judge how AP placement decisions affect effective data rate across a building.

Implement in pure p5.js with the existing MicroSim CSS theme.
</details>

## 8.11 Putting It Together: A Mobile Phone's Day

A typical phone on a normal day uses every concept in this chapter:

1. **Morning at home.** The phone is associated with a home Wi-Fi access point — an infrastructure-mode BSS, with the home Wi-Fi router's SSID. Bluetooth connects it to the user's wireless earbuds (a separate Bluetooth piconet).
2. **Commute.** The phone roams from home Wi-Fi to a 5G cellular network as the user walks out of range. A handoff transfers the active connection from the residential Wi-Fi BSS to the carrier's 5G base station.
3. **Highway driving.** The phone hands off between cell towers every few minutes as the car moves. The TCP and QUIC connections survive because connection IDs and reconnection logic absorb the IP changes.
4. **Office Wi-Fi.** Inside the office building, the phone associates with the corporate Wi-Fi ESS — a single SSID covering many APs. The phone roams between APs as the user walks the corridor; 802.11r fast-transition keeps each handoff under 50 ms so an in-progress voice call does not glitch.
5. **Conference room.** Bluetooth connects to the conference room speakerphone. Wi-Fi 6E and 5G are both present; the phone's policy chooses Wi-Fi when signal is strong because data is unmetered, and falls back to 5G when Wi-Fi degrades.
6. **Evening at the cafe.** A public Wi-Fi network with a captive portal and unknown security. The phone's VPN automatically tunnels all traffic through a corporate gateway, hiding the network change from corporate applications.

Every step in this story uses something from this chapter: an SSID, a BSS, a roam, a handoff, link adaptation responding to changing distance, RTS/CTS in dense areas, frequency hopping in Bluetooth, and tunnels (Mobile IP-style or VPN-style) when the underlying network changes. Wireless is *not* simpler than wired networking; it is at least as complex, and most of that complexity is hidden inside well-engineered protocol stacks so it stays invisible to users.

!!! mascot-encourage "If wireless feels chaotic — that's because it is"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Buzz cheering you on">
    Every variable a wired link controls — distance, SNR, contention, interference, who else is talking — is fluid in wireless. The protocols cope with constant adaptation. *One hop at a time.* When your Wi-Fi seems slow, you now have the vocabulary to ask the right diagnostic questions: how far am I from the AP, what channel are we on, is there a hidden terminal, what modulation is the radio currently using.

## 8.12 Key Takeaways

Wireless networking adds a layer of variability and mobility that wired networks never face. Before moving on, make sure you can answer the following without looking back:

- Why does Wi-Fi use CSMA/CA instead of CSMA/CD?
- What is the difference between an AP, a BSS, an ESS, and an SSID?
- Why are only three 2.4 GHz channels (1, 6, 11) typically used?
- What problem does the RTS/CTS handshake solve, and why is it not always enabled?
- What happens during a Wi-Fi roam? What protocols (802.11r/k/v) make it fast?
- Compare Wi-Fi and Bluetooth in range, data rate, and intended use cases.
- Compare 4G LTE and 5G NR in peak rate, latency, and frequency bands.
- What is mobile IP, and why has it not been widely deployed on the public Internet?
- What is link adaptation, and why does Wi-Fi data rate vary so much within a single coverage area?
- Why does AP placement matter so much for wireless performance?

If any of those answers feel shaky, re-read the corresponding section before continuing to Chapter 9, where we move up one layer to the network layer — IP addressing, subnetting, and the global routing fabric that connects every link this chapter covered.

!!! mascot-celebration "Wireless — handled"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Buzz celebrating">
    You can now reason about Wi-Fi, Bluetooth, and cellular as one family of variable, mobile, shared-medium links. Every later chapter assumes packets emerge from these radios into a wired network where the rest of the Internet takes over. *Follow the packet.*
