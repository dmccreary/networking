# Quiz: The Physical Layer

Test your understanding of analog and digital signals, modulation, encoding, channel capacity, transmission media, and the impairments that limit physical-layer performance with these review questions.

---

#### 1. Which property best distinguishes a digital signal from an analog signal?

<div class="upper-alpha" markdown>
1. A digital signal varies continuously while analog signals vary in discrete steps
2. A digital signal varies in discrete steps (typically two values for 0 and 1) while an analog signal varies continuously through any value in a range
3. Digital signals always travel faster than analog signals
4. Analog signals carry more bits per second than digital signals on every medium
</div>

??? question "Show Answer"
    The correct answer is **B**. Digital signals take values from a small finite set (often just two), making them robust to noise — the receiver only has to decide whether the value is closer to high or low. Analog signals take continuous values within a range. The robustness of digital signaling is why every modern network is digital end-to-end, even when the underlying physics involves continuous waveforms.

    **Concept Tested:** Digital Signal

---

#### 2. What is the difference between modulation and encoding?

<div class="upper-alpha" markdown>
1. They are synonyms; the words mean the same thing
2. Modulation varies a property of an analog carrier wave to encode digital data, while encoding maps digital bits onto a digital signal of voltage levels or pulses
3. Modulation is used only on fiber while encoding is used only on copper
4. Encoding works at the application layer, modulation at the physical layer
</div>

??? question "Show Answer"
    The correct answer is **B**. Modulation impresses digital information onto an analog carrier (used on radio, cable, and other continuous media) by varying amplitude, frequency, or phase. Encoding maps bits to discrete voltage levels or transitions on a digital medium (like Ethernet). Both are physical-layer operations, but they apply to different kinds of underlying signal.

    **Concept Tested:** Modulation

---

#### 3. Why does Manchester encoding always provide at least one transition per bit period, and what does that buy compared to NRZ?

<div class="upper-alpha" markdown>
1. Manchester transitions are random and do not help the receiver
2. Manchester encodes each bit as a mid-bit transition, which lets the receiver recover the clock even during long runs of identical bits, at the cost of doubling the required bandwidth
3. Manchester encoding uses less bandwidth than NRZ
4. Manchester transitions only occur when bit values change
</div>

??? question "Show Answer"
    The correct answer is **B**. NRZ holds steady during runs of 0s or 1s, causing clock drift at the receiver. Manchester encodes each bit as a transition (low-to-high or high-to-low) at the bit's midpoint, guaranteeing one transition per bit and allowing reliable clock recovery. The trade-off is that Manchester needs twice the bandwidth of NRZ for the same bit rate.

    **Concept Tested:** Manchester Encoding

---

#### 4. A 64-QAM modulation runs at 10 megabaud. What bit rate does it achieve?

<div class="upper-alpha" markdown>
1. 10 Mbps
2. 60 Mbps
3. 640 Mbps
4. 64 Mbps
</div>

??? question "Show Answer"
    The correct answer is **B**. Bit rate equals symbol rate (baud rate) multiplied by bits per symbol. 64-QAM packs log2(64) = 6 bits per symbol. So 10 megabaud × 6 bits/symbol = 60 Mbps. Higher-order QAM (256-QAM at 8 bits/symbol, 1024-QAM at 10 bits/symbol) packs more bits but requires a cleaner channel because constellation points are closer together.

    **Concept Tested:** Symbol Rate

---

#### 5. Shannon's theorem states that the channel capacity of a noisy channel is C = B log2(1 + S/N). What does the theorem fundamentally say is impossible?

<div class="upper-alpha" markdown>
1. Building any reliable digital channel
2. Achieving a bit rate higher than C on a channel with bandwidth B and signal-to-noise ratio S/N, no matter how clever the encoding scheme
3. Encoding multiple bits per symbol
4. Using fiber optic cables
</div>

??? question "Show Answer"
    The correct answer is **B**. Shannon's theorem provides an absolute upper bound: no encoding, no matter how clever, can exceed C bits per second on a channel with given bandwidth and SNR. Doubling bandwidth doubles capacity, but doubling SNR adds only one bit per symbol — the gains from raw power are logarithmic. Modern codes (LDPC, polar) approach this bound closely.

    **Concept Tested:** Shannon Theorem

---

#### 6. Which transmission medium offers the lowest attenuation per kilometer, the highest bandwidth, and complete immunity to electromagnetic interference?

<div class="upper-alpha" markdown>
1. Twisted pair cable
2. Coaxial cable
3. Fiber optic cable
4. Wireless medium
</div>

??? question "Show Answer"
    The correct answer is **C**. Single-mode fiber loses only about 0.2 dB/km at 1550 nm and supports terabit-per-second bandwidths. Because it carries light rather than current, it is immune to EMI and does not radiate. These properties make fiber the dominant medium for long-haul, backbone, and submarine cable links worldwide.

    **Concept Tested:** Fiber Optic Cable

---

#### 7. A network engineer must connect a remote sensor on a moving vehicle to a control center. Which transmission medium is appropriate, and what is the main trade-off accepted?

<div class="upper-alpha" markdown>
1. Twisted pair, accepting only the limited 100 m reach
2. Wireless, accepting lower bandwidth and higher BER in exchange for mobility
3. Fiber, accepting that fiber has the worst BER of any medium
4. Coax, accepting that coax has zero EMI immunity
</div>

??? question "Show Answer"
    The correct answer is **B**. Wireless is the only medium that supports mobile receivers. The trade-off is real: wireless has lower bandwidth, higher attenuation, susceptibility to interference, and worse bit-error rates than any wired medium of the same generation. Engineers compensate with forward error correction, multiple antennas (MIMO), and adaptive modulation. Cables cannot connect to moving endpoints.

    **Concept Tested:** Wireless Medium

---

#### 8. Which physical-layer impairment is reduced by shielding cables and using differential signaling, but cannot be eliminated entirely because some of it is set by physical constants like temperature?

<div class="upper-alpha" markdown>
1. Attenuation
2. Noise
3. Modulation
4. Bit error correction
</div>

??? question "Show Answer"
    The correct answer is **B**. Noise has multiple physical sources — thermal motion of electrons, shot noise, crosstalk, flicker noise. Shielding and differential signaling reduce some categories, but thermal noise is set by physical constants and cannot be eliminated above absolute zero. Attenuation is mitigated by amplification or shorter cables. Modulation is a technique, not an impairment.

    **Concept Tested:** Noise

---

#### 9. A wireless link in difficult conditions has a bit error rate of 10^-3 — one error per thousand bits. Why does this medium need link-layer retransmission while a fiber link with BER 10^-12 typically does not?

<div class="upper-alpha" markdown>
1. Wireless protocols are slower in general
2. With high BER, letting end-to-end TCP detect and retransmit each lost frame would be prohibitively slow because of the long RTT, so the link layer recovers locally; with very low BER, the rare error is caught by the CRC and left for upper layers
3. Fiber has no error checking at all
4. TCP cannot run over wireless
</div>

??? question "Show Answer"
    The correct answer is **B**. BER directly drives error-recovery design. On a high-BER wireless link, most frames would have errors if left unaided, so 802.11 retransmits at the link layer for fast recovery. On a low-BER fiber link, errors are so rare that link-layer retransmission would add cost without saving much; the CRC catches them and TCP handles the few that get through.

    **Concept Tested:** Bit Error Rate

---

#### 10. Why does Shannon's bound limit how much one can improve throughput by simply increasing transmit power?

<div class="upper-alpha" markdown>
1. More power always increases capacity proportionally
2. Capacity scales as log2(1 + S/N), so doubling signal power adds only about one bit per symbol of capacity — gains from raw power are logarithmic, while bandwidth scales linearly
3. Higher power damages the receiver
4. Power has no effect on capacity at all
</div>

??? question "Show Answer"
    The correct answer is **B**. Shannon's formula puts S/N inside a logarithm, so doubling the signal-to-noise ratio adds only one bit per symbol. Bandwidth, by contrast, multiplies capacity directly. This is why bigger pipes (more bandwidth) outperform stronger signals once a reasonable SNR is reached, and why fiber's huge bandwidth makes it dominant for high-rate links.

    **Concept Tested:** Channel Capacity

---
