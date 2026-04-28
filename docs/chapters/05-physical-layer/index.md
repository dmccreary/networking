---
title: The Physical Layer
description: How bits actually cross physical media — analog vs. digital signals, modulation and encoding, symbol vs. baud rate, channel capacity bounded by Shannon's theorem, the four transmission media (twisted pair, coax, fiber, wireless), and the impairments (attenuation, noise, interference, bit error rate) that motivate every layer above.
generated_by: claude skill chapter-content-generator
date: 2026-04-27 23:58:00
version: 0.07
---

# Chapter 5: The Physical Layer

## Summary

This chapter examines how bits actually cross physical media — analog versus digital signaling, modulation and demodulation, encoding schemes (Manchester, NRZ), symbol and baud rate, channel capacity bounded by Shannon's theorem, transmission media (twisted pair, coax, fiber, wireless), and the impairments (attenuation, noise, interference, bit error rate) that motivate everything above. By the end, students can explain why each medium fits its niche.

## Concepts Covered

This chapter covers the following 21 concepts from the learning graph:

1. Signal
2. Analog Signal
3. Digital Signal
4. Modulation
5. Demodulation
6. Encoding
7. Decoding
8. Manchester Encoding
9. NRZ Encoding
10. Symbol Rate
11. Baud Rate
12. Channel Capacity
13. Shannon Theorem
14. Twisted Pair Cable
15. Coaxial Cable
16. Fiber Optic Cable
17. Wireless Medium
18. Attenuation
19. Noise
20. Interference
21. Bit Error Rate

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Networks and Communication](../01-intro-to-networks/index.md)
- [Chapter 2: Standards, Data Units, and Encapsulation](../02-standards-and-encapsulation/index.md)
- [Chapter 3: Network Architecture and Layered Models](../03-architecture-and-layering/index.md)
- [Chapter 4: Network Performance and Quality of Service](../04-performance-and-qos/index.md)

---

!!! mascot-welcome "Down to the wire — and the air"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Buzz the bee waving welcome">
    Welcome back. Bees signal each other with vibrations on the comb, with pheromone molecules in the air, with light that bounces off polarized wax cells. Each medium has its own range, its own noise, its own carrying capacity. Computer networks face the same constraints. *Let's trace the route!* This chapter is where the abstractions of the upper layers finally meet copper, glass, and electromagnetic waves.

## 5.1 Why the Physical Layer Matters

The four chapters before this one talked about packets, frames, and protocols as if bits were a free abstraction — as if a "1" could simply travel from one machine to another and arrive intact. The physical layer is where that abstraction earns its keep. Every bit that traverses any network is, at its bottom, a fluctuation in voltage on a copper wire, a pulse of light in a glass fiber, a brief electromagnetic wave in the air, or a pattern of magnetism on a satellite uplink. These are all *signals* — physical phenomena propagating through media — and the physical layer's job is to convert bits into signals and back.

The physical layer matters because the constraints it imposes — finite bandwidth, finite signal-to-noise ratio, attenuation over distance, susceptibility to interference — set the absolute upper bounds on every higher layer. A 1 Gbps Ethernet connection cannot deliver more than 1 Gbps no matter how clever the routing or how well-tuned the TCP stack, and that ceiling exists because Shannon's theorem (introduced later in this chapter) says so. Understanding why the bandwidth ceiling exists, why bit errors occur, and why some media outperform others by orders of magnitude is essential context for everything above.

## 5.2 Signals: Analog and Digital

A **signal** is any physical quantity that varies in time and carries information. The variation might be in voltage, current, light intensity, electromagnetic field strength, sound pressure, or any other measurable property. A signal is "useful" precisely insofar as the receiver can recover the information from the variation.

Signals come in two flavors that matter for networking. An **analog signal** varies continuously — at any instant in time it can take on any value within some range, and small changes in the value carry useful information. The voltage on an old telephone line carrying a voice conversation is analog: a smooth, continuously-changing waveform whose shape *is* the speech. A microphone produces an analog signal; a vinyl record stores one. Analog signals are conceptually clean — what you measure is what was sent, more or less — but they degrade gradually with distance and noise, and small impairments accumulate without recovery.

A **digital signal** varies in discrete steps — its instantaneous value is restricted to a small finite set, typically two values (high and low) representing 0 and 1. The voltage on a Cat-6 Ethernet cable is digital: it flips between defined levels rather than sliding through a continuum. Digital signals are more verbose than the analog signals they replace (a single voltage level carries one bit, while an analog voltage could in principle carry many) but they are vastly more *robust*. A digital receiver must only decide whether the value is closer to "high" or "low" — even a noisy or attenuated signal can be regenerated cleanly as long as the high and low levels remain distinguishable. This robustness is why every modern network is digital end-to-end, even when the underlying physics involves continuous waveforms.

The relationship between the two kinds of signal is everywhere in networking. A wireless network transmits a digital bit stream by varying continuous-valued radio waves; the receiver sees a noisy analog waveform and recovers digital bits. The physical layer's job is exactly this conversion — at the sender, packing digital information onto analog signals suitable for the medium; at the receiver, unpacking analog signals back into digital bits.

| Property | Analog signal | Digital signal |
|----------|---------------|----------------|
| Values | Continuous within a range | Discrete (typically two) |
| Information density | High in principle | Low per symbol; high in aggregate |
| Noise tolerance | Poor — small noise → small error | Excellent — small noise → no error until threshold |
| Regeneration | Each amplifier adds noise | Receiver can perfectly regenerate |
| Examples | Voice on copper, FM radio, AM | Ethernet, USB, fiber-optic links |

## 5.3 Modulation and Encoding

Two related terms describe how digital information is impressed onto a physical signal. **Modulation** is the process of varying some property of an analog carrier wave — its amplitude, frequency, or phase — to encode digital data. Modulation is the technique used whenever the underlying medium is fundamentally continuous, such as a radio channel or a coaxial cable carrying signals in the megahertz range. **Demodulation** is the inverse: the receiver extracts the digital information from the modulated analog signal.

The simplest modulation schemes vary one property of the carrier wave at a time:

- **Amplitude modulation (AM)** — vary the carrier's amplitude (loudness). AM is simple and used in commercial AM radio, but it is highly susceptible to noise.
- **Frequency modulation (FM)** — vary the carrier's frequency. FM is more noise-resistant than AM, used in commercial FM radio and many wireless networking standards.
- **Phase modulation (PM)** — vary the carrier's phase. Phase modulation is the workhorse of modern digital wireless.

Real wireless protocols combine several techniques. **Quadrature Amplitude Modulation (QAM)**, used in Wi-Fi, cellular, and cable modems, varies both amplitude and phase together to pack many bits per symbol. A 64-QAM scheme arranges 64 distinct combinations of amplitude and phase, encoding 6 bits per transmitted symbol; 256-QAM encodes 8 bits per symbol; modern 1024-QAM and 4096-QAM schemes pack 10 and 12 bits respectively. Higher-order QAM increases throughput but requires a cleaner channel — small noise can flip the receiver's decision among neighboring constellation points.

**Encoding**, by contrast, refers to how digital bits are mapped onto a digital signal — a sequence of voltage levels or light pulses on a wire. Encoding is what happens on a digital medium where the physical signal is already a sequence of discrete levels. **Decoding** is the inverse: the receiver converts the sequence of voltage transitions back into a bit stream.

Two encoding schemes appear repeatedly in networking. **NRZ encoding (Non-Return-to-Zero)** is the simplest possible scheme: a 1 is one voltage level (say, +5 V) and a 0 is another (say, 0 V), and the level holds steady for the entire bit duration. NRZ uses bandwidth efficiently — one symbol per bit — but has a serious problem: a long run of 0s or 1s produces a constant voltage with no transitions, and the receiver loses track of where one bit ends and the next begins (a problem called *clock drift*).

**Manchester encoding** solves the clock-drift problem at the cost of using twice the bandwidth. Each bit is encoded as a *transition*: a 0 becomes a high-to-low transition in the middle of the bit period, a 1 becomes a low-to-high transition (or vice versa, depending on the convention). Every bit period contains exactly one transition, so the receiver can always recover the clock by watching for transitions. Classic 10 Mbps Ethernet used Manchester encoding for exactly this reason. Higher-speed Ethernet uses more elaborate schemes (8B/10B, 64B/66B, PAM-5, PAM-16) that pack more bits per symbol while still guaranteeing enough transitions for clock recovery.

#### Diagram: NRZ vs. Manchester Encoding

<details markdown="1">
<summary>Side-by-side waveforms showing how the same bit pattern looks under each encoding scheme</summary>
Type: microsim
**sim-id:** nrz-vs-manchester-encoding<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that lets students enter a bit pattern and see the resulting voltage waveform under NRZ and Manchester encoding side by side.

Canvas: 920 px wide by 520 px tall, responsive down to 360 px. A 100 px control panel sits below.

Layout:

- A text input box at the top accepts a bit string (e.g., "10110001") with a default of "10110001".
- Below the input, two stacked oscilloscope-style displays:
  - Top trace labeled "NRZ Encoding": a horizontal voltage axis with discrete levels (low and high). The waveform follows the bit pattern directly — high for 1, low for 0 — with no transitions during a run of identical bits.
  - Bottom trace labeled "Manchester Encoding": the same bit pattern, but each bit period contains a mid-bit transition. A 1 is a low-to-high transition; a 0 is a high-to-low transition.
- A vertical dashed line indicates each bit boundary, and a small numeric label above shows which bit (0/1) is being encoded in that period.

Interactivity:

- The user can edit the bit string and the waveforms update live.
- Toggle "Add noise": injects small random voltage offsets and shows how the receiver's decision threshold (a horizontal dashed line at the midpoint) tolerates the noise. Manchester's transition-based decoding is shown to be more robust because the receiver is comparing levels just before and after the mid-bit transition.
- Toggle "Long run of zeros": replaces the input with "00000000" and highlights how NRZ produces a flat line with no clock recovery, while Manchester continues to provide a transition each bit period.

Visual style:

- Voltage traces in honey amber on a slate grid background.
- Bit boundaries as thin vertical lines.
- Decision threshold as a horizontal dashed line in white.

Learning objectives:

- (Bloom — Understanding) Students explain why Manchester encoding always provides at least one transition per bit period.
- (Bloom — Analyzing) Students compare the bandwidth efficiency and clock-recovery properties of NRZ vs. Manchester.
- (Bloom — Evaluating) Students judge which encoding is appropriate for a given combination of distance, noise, and clock-recovery requirements.

Implement in pure p5.js with the existing MicroSim CSS theme. The waveform display should be responsive and remain readable at 360 px wide.
</details>

## 5.4 Symbol Rate, Baud Rate, and Bit Rate

Three closely-related rates show up in physical-layer specifications, and they are easy to confuse.

The **symbol rate** is the number of distinct signal symbols transmitted per second on a channel. A symbol is one indivisible unit of the modulation scheme — one QAM constellation point, one Manchester transition pair, one PAM-5 voltage level. Symbol rate is measured in symbols per second.

The **baud rate** is a synonym for symbol rate, named after the 19th-century telegraph engineer Émile Baudot. The two terms are interchangeable in modern usage. Older specifications typically use *baud*, modern wireless specifications typically use *symbols per second*, but they mean the same thing.

The **bit rate**, measured in bits per second, is the symbol rate multiplied by the number of bits each symbol carries. Bit rate and baud rate are equal when each symbol carries exactly one bit (as in NRZ); they diverge when the modulation packs many bits into each symbol. A 64-QAM modulation running at 10 megabaud carries \(10 \times 10^6 \times 6 = 60\ \text{Mbps}\). The same 10 megabaud symbol rate at 256-QAM carries 80 Mbps. The relationship is

\[
\text{bit rate} = \text{symbol rate} \times \log_2(\text{symbols per modulation alphabet})
\]

This relationship is the central trade-off of modulation. Higher-order modulations pack more bits per symbol but require a cleaner channel; lower-order modulations are more robust but slower. A modern adaptive modem dynamically chooses the highest modulation order that the current channel can sustain, ramping up when conditions are good and dropping back when they degrade.

## 5.5 Channel Capacity and Shannon's Theorem

Why is there an upper bound on bit rate at all? The answer comes from one of the most beautiful results in 20th-century mathematics: **Shannon's theorem**, published by Claude Shannon in 1948, which gives the absolute maximum data rate achievable on a noisy channel with finite bandwidth.

Shannon's formula for **channel capacity** is

\[
C = B \log_2\!\left(1 + \frac{S}{N}\right)
\]

where \(C\) is the maximum bit rate in bits per second, \(B\) is the channel bandwidth in hertz, and \(S/N\) is the signal-to-noise ratio (a dimensionless ratio of signal power to noise power). The theorem says no encoding scheme, no matter how clever, can exceed this rate over a channel with the given bandwidth and noise. Every higher-layer technique must live within this ceiling.

Shannon's result has three important consequences. First, **bandwidth is intrinsically tied to capacity**: doubling \(B\) doubles \(C\). This is why fiber-optic links (with bandwidths of terahertz) can carry vastly more data than copper twisted pair (with bandwidths of hundreds of megahertz). Second, **adding power buys you only logarithmic gains**: doubling \(S/N\) adds only one bit per symbol of capacity. Pumping more transmit power into a noisy channel quickly hits diminishing returns. Third, **Shannon does not tell you how to *achieve* the capacity** — only that it cannot be exceeded. Designing modulation, coding, and equalization schemes that approach Shannon's bound has occupied the field of communications engineering for the past 75 years.

A worked example. A typical Wi-Fi channel has \(B = 20\ \text{MHz}\) and a signal-to-noise ratio of \(S/N = 30\ \text{dB}\). 30 dB corresponds to a power ratio of 1000. So the Shannon capacity is

\[
C = 20 \times 10^6 \times \log_2(1001) \approx 20 \times 10^6 \times 9.97 \approx 200\ \text{Mbps}
\]

Real Wi-Fi 5 (802.11ac) on a 20 MHz channel with one spatial stream achieves roughly 87 Mbps in good conditions — about 44% of the Shannon limit. Modern Wi-Fi 7 with multiple spatial streams, 320 MHz channels, and 4096-QAM gets much closer to the Shannon bound for its larger bandwidth. The gap between achieved bit rate and Shannon capacity is the room left for engineering improvement.

| Term | Symbol | Units | What it captures |
|------|--------|-------|------------------|
| Bandwidth | \(B\) | Hz | Frequency range of the channel |
| Signal-to-noise ratio | \(S/N\) | (ratio, often quoted in dB) | Power of useful signal vs. noise |
| Channel capacity | \(C\) | bits per second | Theoretical maximum bit rate |
| Symbol / baud rate | — | symbols per second | Distinct signal changes per second |
| Bit rate | — | bits per second | Symbol rate × bits per symbol |

## 5.6 Transmission Media

Networks run on four kinds of physical medium, each with different bandwidth, attenuation, and cost characteristics.

**Twisted pair cable** consists of pairs of insulated copper wires twisted together, which cancels electromagnetic interference between the wires of a pair and reduces susceptibility to outside interference. Twisted pair is the most common physical medium in local area networks. It is cheap, easy to install, and supports modern Ethernet rates (1 Gbps over Cat-5e and Cat-6, 10 Gbps over Cat-6a, 25/40 Gbps over Cat-8) at distances up to 100 meters before signal regeneration is needed. Two main grades exist: **unshielded twisted pair (UTP)** for ordinary office wiring, and **shielded twisted pair (STP)** for harsher electromagnetic environments. Twisted pair's bandwidth ceiling — bounded by Shannon's theorem and by physical constants of copper — is the main reason it cannot scale arbitrarily high.

**Coaxial cable** is a single inner conductor surrounded by a cylindrical outer conductor, separated by an insulating dielectric. The geometry confines the electromagnetic field tightly within the cable, giving coax much better noise immunity and higher bandwidth than twisted pair at the cost of higher per-meter cost and more difficult installation. Cable Internet (DOCSIS) uses coax; legacy 10BASE-2 and 10BASE-5 Ethernet used coax in the 1980s; coax is rare in modern enterprise LANs but ubiquitous in residential broadband and broadcast applications.

**Fiber optic cable** is a thin strand of glass (or sometimes plastic) along which infrared light pulses travel. Fiber has bandwidth measured in tens to hundreds of terahertz — many orders of magnitude more than copper — and astonishingly low attenuation: a modern single-mode fiber loses only about 0.2 dB per kilometer at 1550 nm, allowing signals to travel hundreds of kilometers between amplifiers. Fiber is immune to electromagnetic interference (because it carries light, not current), and it does not radiate, making it harder to wiretap. Two main flavors are deployed: **multimode fiber** (a thicker core, used over short distances inside datacenters) and **single-mode fiber** (a thin core, used over long distances in carrier networks). Fiber dominates every long-haul link in the world.

**Wireless medium** refers to electromagnetic propagation through free space — radio waves, microwaves, infrared, or visible light. Wireless has the unique property of mobility: receivers can move freely through the propagation region. The cost is shared bandwidth (every device on the same channel competes for the same airtime), variable channel conditions (interference from microwave ovens, walls, and other transmitters), and power limits set by regulation and battery life. Wi-Fi (802.11), Bluetooth, cellular (4G/5G), satellite, and many specialized standards all use wireless. Chapter 8 develops wireless networking in detail; this chapter only places it among the four media.

The four media and their representative properties are summarized below. The numbers in the table are typical engineering values, not absolute limits.

| Medium | Typical bandwidth | Typical reach (no amp) | Cost | Mobility | EMI immunity |
|--------|-------------------|------------------------|------|----------|--------------|
| Twisted pair (Cat-6a) | 10 Gbps | 100 m | Low | None | Low |
| Coaxial | 1–10 Gbps | 500 m | Medium | None | Medium |
| Fiber (single-mode) | 100 Gbps – 100 Tbps | 80 km+ | Medium-high | None | Excellent |
| Wireless (Wi-Fi 6E) | 1–10 Gbps shared | 50 m indoors | Low | Yes | Poor |

#### Diagram: Choosing a Transmission Medium

<details markdown="1">
<summary>Decision tree comparing the four transmission media against deployment constraints</summary>
Type: infographic
**sim-id:** transmission-media-choice<br/>
**Library:** p5.js<br/>
**Status:** Specified

Render an interactive infographic that helps students choose a transmission medium based on deployment constraints (distance, mobility, EMI environment, cost budget).

Canvas: 920 px wide by 600 px tall, responsive down to 360 px.

Tree layout:

1. Root: "Need mobility?" → Yes (wireless branch) | No (continue).
2. "Distance > 1 km?" → Yes (fiber) | No (continue).
3. "EMI environment severe?" → Yes (fiber or shielded twisted pair / coax) | No (continue).
4. "Cost-sensitive bulk install?" → Yes (twisted pair) | No (consider fiber for future-proofing).

Each leaf is a labeled box with the recommended medium, a representative typical use case, and a small icon (twisted-pair icon, coax icon, fiber icon, antenna icon).

Interactivity:

- Each tree node is clickable. When clicked, the path from root highlights in honey amber; off-path branches dim.
- Hover on a leaf shows a side panel with that medium's typical bandwidth, attenuation per km, EMI immunity, and approximate cost per meter.
- A reset button collapses the tree.

Visual style:

- Tree edges drawn as honey-amber arrows.
- Decision nodes: rounded rectangles in slate.
- Leaf nodes: rounded rectangles in honey amber.

Learning objective (Bloom — Applying): Students apply medium-selection criteria to a deployment scenario and justify their choice based on bandwidth, distance, mobility, EMI, and cost.
</details>

## 5.7 Why Signals Degrade: The Three Impairments

Every physical signal degrades as it propagates. Three impairments dominate, and each has predictable behavior that the higher layers must work around.

**Attenuation** is the loss of signal strength as it propagates through the medium. Attenuation has multiple causes — resistive loss in copper, absorption and scattering in fiber, free-space spreading in wireless — but the engineering effect is the same: the further the signal travels, the weaker it gets at the receiver. Attenuation is typically measured in decibels per kilometer (dB/km), and it is the reason long links require periodic amplification or regeneration. Twisted pair attenuates at roughly 20 dB/100 m at 100 MHz; single-mode fiber loses only 0.2 dB/km at 1550 nm — a difference of 1000× per kilometer. Attenuation also depends on frequency: copper loses much more at high frequencies than at low frequencies, which is why higher-rate copper standards specify shorter maximum cable lengths.

**Noise** is unwanted random variation in the signal that the receiver cannot distinguish from intended variation. Noise has several physical sources: **thermal noise** (random motion of electrons in conductors, present at any temperature above absolute zero), **shot noise** (statistical variation in the arrival of electrons or photons), **flicker noise** (low-frequency fluctuations in semiconductor devices), and **crosstalk** (signals from neighboring channels leaking into ours). Noise sets the denominator in Shannon's signal-to-noise ratio: more noise means less capacity. Some noise can be reduced by engineering (better shielding, lower-temperature amplifiers, differential signaling) but thermal noise is set by physical constants and cannot be eliminated.

**Interference** is unwanted signal energy from external sources that the receiver mistakes for intended signal. Interference is distinct from noise because it has structure — it is some other transmitter's signal, not random fluctuation — but its effect on the receiver is similar: lost or corrupted bits. In wireless networks, interference comes from other Wi-Fi networks on the same channel, microwave ovens, Bluetooth devices, and outright jammers. In wired networks, interference comes from power lines, fluorescent lights, and other cables in the same conduit. Mitigation strategies include frequency-hopping, channel selection, shielding, and adaptive modulation.

The consequence of all three impairments is that some bits arrive incorrectly. The frequency of incorrect bits is captured by a single number.

## 5.8 The Bit Error Rate

The **bit error rate (BER)** is the fraction of received bits that are incorrect, typically reported in scientific notation: a BER of \(10^{-9}\) means one bit in a billion arrives wrong. BER is the bottom-line measurement of physical-layer quality. It depends on signal-to-noise ratio, modulation order, and any forward error correction in use, and it varies widely across media:

- Modern fiber-optic links: \(10^{-12}\) to \(10^{-15}\) — essentially error-free.
- Modern Ethernet over twisted pair: \(10^{-10}\) to \(10^{-12}\).
- Wi-Fi in good conditions: \(10^{-6}\) to \(10^{-9}\).
- Wireless in difficult conditions: \(10^{-3}\) or worse — one error per thousand bits.

BER directly drives the design of every higher layer. A medium with very low BER (fiber) needs only minimal error checking — a CRC-32 in the link-layer trailer, computed in hardware, catches the rare error and discards the frame for the upper layer to retransmit. A medium with high BER (wireless) needs aggressive forward error correction at the physical layer (codes that add redundancy so the receiver can repair errors without a retransmission) and link-layer retransmission for residual errors. Wi-Fi's 802.11 link layer retransmits frames at the link layer specifically because the physical layer's BER is high enough that letting end-to-end TCP detect and recover would be prohibitively slow.

The relationship between Shannon capacity and BER is fundamental. Shannon's theorem says that for any channel with capacity \(C\), there exists *some* coding scheme achieving arbitrarily low error rate at any rate below \(C\). Modern error-correcting codes (LDPC, polar codes, turbo codes) approach this bound closely. The design effort goes into trading complexity (how hard the code is to encode and decode) against gap to Shannon (how close to the bound the code reaches).

| Impairment | Physical cause | Typical mitigation |
|------------|----------------|--------------------|
| Attenuation | Resistive / absorption losses | Amplifiers, regenerators, lower frequency |
| Noise | Thermal motion, shot noise, crosstalk | Shielding, differential signaling, cooling |
| Interference | Other transmitters | Channel selection, frequency hopping, filters |
| → Resulting BER | Combination of the above | Modulation choice, forward error correction |

#### Diagram: Signal Quality Across Distance

<details markdown="1">
<summary>Animated signal-quality plot showing how attenuation and noise produce bit errors over distance</summary>
Type: microsim
**sim-id:** ber-vs-distance<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that visualizes how attenuation, noise, and interference produce bit errors as signal traverses a medium of variable length.

Canvas: 920 px wide by 580 px tall, responsive down to 360 px. A 120 px control panel sits below.

Layout:

- Top half: an oscilloscope-style display showing the signal at the sender (clean digital pulse train) and at the receiver (degraded waveform). A vertical "decision threshold" line indicates how the receiver decides 0 vs. 1.
- Bottom half: a horizontal "channel" rendered as a long rectangle with a small graph showing signal amplitude vs. distance. The amplitude curve drops exponentially with distance (attenuation), and a noise floor is added as scattered random fluctuations.
- A bit-error indicator shows received bits in two colors: green (correctly received) and red (errored).

Controls panel:

- Sliders: distance (0–100 km), transmit power (0–30 dBm), noise floor (-100 to -30 dBm), interference level (off / low / high).
- Modulation dropdown: NRZ (1 bit/symbol), 4-QAM (2 bits/symbol), 16-QAM (4 bits/symbol), 64-QAM (6 bits/symbol).
- "Add forward error correction" toggle — when on, errors below a threshold are corrected by the receiver and shown in yellow.
- "Show Shannon capacity" toggle — annotates the current configuration's Shannon capacity and the achieved bit rate.

Behavior:

- As distance increases, signal amplitude shrinks; the receiver's decision threshold becomes harder to apply, and red error bits start to appear.
- As modulation order increases, the constellation diagram shows tighter spacing between points, and small noise produces many more errors.
- The bit-error rate (BER) is computed live and displayed as a numeric readout.

Visual style:

- Sender waveform: clean honey-amber pulses.
- Receiver waveform: noisy version of the same, with the noise tinted in slate.
- Errored bits highlighted in red on a strip below the receiver display.

Learning objectives:

- (Bloom — Understanding) Students explain how attenuation, noise, and modulation order interact to produce bit errors.
- (Bloom — Analyzing) Students decompose a high-BER scenario into its contributing factors.
- (Bloom — Evaluating) Students judge whether a deployment requires a different medium or just a different modulation, given a target BER.

The MicroSim should be implemented in pure p5.js with the existing MicroSim CSS theme.
</details>

## 5.9 Putting It Together: Why Each Medium Wins Where It Wins

The four transmission media are not interchangeable. Each one's bandwidth, attenuation, cost, and EMI properties make it the right answer in some niche.

**Fiber wins long-haul.** Bandwidth in the terabits per second over distances measured in tens of kilometers per amplifier hop, with BER below \(10^{-12}\) and complete EMI immunity. Every transoceanic cable, every backbone link between major cities, and most metro-area carrier links are fiber. The cost of laying fiber is high upfront but the cost per delivered bit-kilometer is the lowest of any medium. When the numerator of bandwidth × distance is large, fiber is the only sensible answer.

**Twisted pair wins last-meter LAN.** A 100-meter twisted-pair drop to a desk costs a few dollars per meter, terminates with a cheap RJ45 connector, and supports 10 Gbps with off-the-shelf switches. No other medium delivers such bandwidth to such inexpensive endpoints over short distances. Every office, classroom, and lab on Earth is wired primarily with twisted pair.

**Coax wins residential broadband and broadcast.** The cable Internet plant deployed over decades reaches almost every home in the developed world; running fiber to each home is feasible only where it has been done over decades of investment. Coax's higher bandwidth-per-meter than twisted pair, combined with the existing infrastructure, gives it a long tail in residential networking even as fiber-to-the-home expands.

**Wireless wins anywhere mobility, ad hoc deployment, or installation cost rules out cable.** Phones, laptops in a coffee shop, sensors on a wind turbine, vehicles in motion — none of these can use cable. Wireless has worse bandwidth and worse BER than any wired medium of the same era, and that gap is the price of mobility. Engineers make wireless work by accepting these compromises and aggressively engineering around them: forward error correction, multiple antennas (MIMO), wider channels, higher-order modulation, dynamic adaptation. Chapter 8 develops the wireless layer in depth.

A network engineer's job is to choose the right medium for each link in a topology. A datacenter spine is fiber. A datacenter rack-to-server drop is twisted pair (or short fiber for the highest-rate links). A residential connection is coax or fiber. A mobile device is wireless. A submarine cable across an ocean is fiber. Each choice is justified by the bandwidth-attenuation-cost-mobility trade-off the medium offers.

!!! mascot-encourage "If Shannon's theorem feels intimidating — that's reasonable"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Buzz cheering you on">
    Most networking courses do not derive Shannon's theorem; this one does not either. What you need is the *consequence*: there is a hard ceiling on bit rate set by bandwidth and signal-to-noise ratio, and every higher layer respects it. *One hop at a time.* Every time you read a Wi-Fi spec ("up to 6.9 Gbps"), you are reading a number that came from a Shannon calculation.

## 5.10 Key Takeaways

The physical layer is where the network's promises meet physical reality. Before moving on, make sure you can answer the following without looking back:

- What is a signal? What is the difference between an analog and a digital signal?
- What is modulation? What is the difference between modulation and encoding?
- Compare NRZ and Manchester encoding. Why does Manchester always provide a transition per bit period? What does that buy?
- What is the difference between symbol rate (baud) and bit rate? When are they equal?
- State Shannon's theorem. What does it say is the maximum achievable bit rate on a channel of bandwidth \(B\) with signal-to-noise ratio \(S/N\)?
- Name the four transmission media and one application for each.
- Compare twisted pair, coaxial, fiber, and wireless on bandwidth, attenuation, mobility, and cost.
- Define attenuation, noise, and interference. Which of the three is reduced by shielding? Which by amplification?
- What is the bit error rate? Why is it the bottom-line measurement of physical-layer quality?
- Why do high-BER media (e.g., wireless) need link-layer retransmission while low-BER media (e.g., fiber) often do not?

If any of those answers feel shaky, re-read the corresponding section before continuing to Chapter 6, where we move up one layer to the link layer — how bits are grouped into frames, how frames are addressed and error-checked, and how multiple devices share a single physical medium.

!!! mascot-celebration "Wires and waves — handled"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Buzz celebrating">
    You now know what bits *physically are*, what bounds their rate, and which medium fits which job. The rest of the textbook treats the physical layer as a pipe with a known bandwidth and BER — but underneath that pipe, the math you saw here is doing the work. *Follow the packet.*
