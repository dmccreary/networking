# Quiz: Standards, Data Units, and Encapsulation

Test your understanding of standards bodies (IETF, IEEE, ISO, ICANN), data units (bits, bytes, frames, packets, segments, datagrams), headers, payloads, trailers, and the encapsulation process with these review questions.

---

#### 1. A protocol is defined as a precise, agreed-upon set of rules for messages exchanged between network entities. Which three things must a protocol specify at minimum?

<div class="upper-alpha" markdown>
1. Vendor, price, and license
2. Syntax, semantics, and timing
3. Speed, distance, and color
4. Hardware, firmware, and software
</div>

??? question "Show Answer"
    The correct answer is **B**. A protocol specifies syntax (what bits go where, field lengths, valid values), semantics (what each field means and how a receiver should react), and timing (when messages may be sent and how long to wait). Pinning down all three lets independently written programs interoperate. Vendor or hardware details are deliberately outside the protocol spec.

    **Concept Tested:** Protocol

---

#### 2. Which standards body publishes RFC documents that define the core protocols of the Internet (IP, TCP, UDP, HTTP)?

<div class="upper-alpha" markdown>
1. IEEE
2. ISO
3. IETF
4. ICANN
</div>

??? question "Show Answer"
    The correct answer is **C**. The Internet Engineering Task Force (IETF) is responsible for the core Internet protocols above the link layer. It publishes its standards as RFC (Request for Comments) documents, all freely available. IEEE governs hardware-level standards like 802.3 Ethernet. ISO publishes the OSI reference model. ICANN administers globally unique identifiers like domain names.

    **Concept Tested:** IETF

---

#### 3. Which standards body publishes the 802 series, including 802.3 Ethernet and 802.11 Wi-Fi?

<div class="upper-alpha" markdown>
1. IETF
2. IEEE
3. ICANN
4. W3C
</div>

??? question "Show Answer"
    The correct answer is **B**. The Institute of Electrical and Electronics Engineers (IEEE) maintains the 802 series for local-area network standards at the link and physical layers. IEEE has the engineering culture for specifying physical phenomena like voltage levels, modulation, and antenna requirements. The IETF stays at the network layer and above. ICANN administers identifiers, not protocols.

    **Concept Tested:** IEEE Standard

---

#### 4. Which organization coordinates the Internet's globally unique identifiers, including domain name root delegation and IP address block allocation?

<div class="upper-alpha" markdown>
1. ICANN
2. IETF
3. ISO
4. IEEE
</div>

??? question "Show Answer"
    The correct answer is **A**. ICANN (Internet Corporation for Assigned Names and Numbers) coordinates uniqueness of names and numbers that protocols rely on. IANA, operated under ICANN, maintains the port number registry, top-level domains, and IP address block assignments to the five Regional Internet Registries. The IETF defines the protocols themselves, but ICANN administers the namespaces those protocols use.

    **Concept Tested:** ICANN

---

#### 5. A 1 Gbps link can transfer roughly how many megabytes per second?

<div class="upper-alpha" markdown>
1. 1000 megabytes per second
2. 8000 megabytes per second
3. 125 megabytes per second
4. 1 megabyte per second
</div>

??? question "Show Answer"
    The correct answer is **C**. Link speeds are quoted in bits per second, but file sizes are measured in bytes. Since one byte equals eight bits, 1 Gbps divided by 8 yields roughly 125 megabytes per second. This eight-fold conversion is a constant trap when comparing link speed to file size, and forgetting it leads to overestimating throughput by a factor of eight.

    **Concept Tested:** Bit

---

#### 6. Which data unit is the unit of transmission at the link layer, carrying source and destination MAC addresses and (usually) an error-check trailer?

<div class="upper-alpha" markdown>
1. Packet
2. Frame
3. Segment
4. Message
</div>

??? question "Show Answer"
    The correct answer is **B**. A frame is the link-layer data unit, shaped to travel across exactly one link. It begins with a link-layer header (MAC addresses) and usually ends with a trailer (Frame Check Sequence). A frame never crosses a router intact. Packets are network-layer units, segments are TCP transport-layer units, and messages are application-layer units.

    **Concept Tested:** Frame

---

#### 7. What is the difference between a TCP segment and a UDP datagram?

<div class="upper-alpha" markdown>
1. There is no difference; the words are interchangeable
2. A segment carries a TCP header (with sequence numbers and flags) and provides reliable, ordered delivery; a datagram carries a smaller UDP header and provides unreliable, unordered delivery
3. Segments travel only over Ethernet; datagrams only over Wi-Fi
4. Segments are encrypted; datagrams are not
</div>

??? question "Show Answer"
    The correct answer is **B**. TCP segments and UDP datagrams are both transport-layer units, but they carry different headers and provide different services. TCP segments include sequence numbers, acknowledgments, flags, and windows for reliable ordered byte streams. UDP datagrams have a tiny 8-byte header and provide best-effort delivery with no retransmission or ordering. The choice of transport determines which name applies.

    **Concept Tested:** Segment

---

#### 8. A header is a prefix of bytes carrying a protocol's control information. What is a trailer, and why is it sometimes used instead of including the same information in the header?

<div class="upper-alpha" markdown>
1. A trailer is the same as a header but on the back; there is no functional difference
2. A trailer is a suffix of bytes carrying information that can only be computed after the payload is finalized, such as an error-check value covering the entire frame including the header
3. A trailer is optional decoration with no real purpose
4. A trailer holds the application data
</div>

??? question "Show Answer"
    The correct answer is **B**. Some values, like the Ethernet Frame Check Sequence, must be computed over all preceding bytes — including the header itself. Such a value cannot live inside the header it is computing over, so it goes in a trailer. Most other protocols put their checksum in the header by zeroing the checksum field during calculation; the choice is a design trade-off.

    **Concept Tested:** Trailer

---

#### 9. An HTTP request leaves a laptop. In what order are the headers added during encapsulation, from outer to inner?

<div class="upper-alpha" markdown>
1. Ethernet header, IP header, TCP header, HTTP message
2. HTTP message, TCP header, IP header, Ethernet header
3. IP header, Ethernet header, TCP header, HTTP message
4. TCP header, HTTP message, Ethernet header, IP header
</div>

??? question "Show Answer"
    The correct answer is **A**. On the wire, the outer-most layer is the Ethernet header (which is read first by the receiving NIC), followed by the IP header, then the TCP header, with the HTTP message as the innermost payload. During encapsulation on the sender, headers are added bottom-up by layer, but viewed left-to-right on the wire, the link-layer header comes first.

    **Concept Tested:** Encapsulation

---

#### 10. A short 100-byte HTTP request crosses an Ethernet link with a 14-byte Ethernet header, a 20-byte IP header, a 20-byte TCP header, and a 4-byte FCS trailer. Approximately what percentage of the bytes on the wire are protocol overhead rather than application data?

<div class="upper-alpha" markdown>
1. Less than 5%
2. Roughly 25%
3. Roughly 60% — the 58 bytes of headers and trailer compared to 100 bytes of application data, in a total of 158 bytes
4. 100% — there is no application data on the wire
</div>

??? question "Show Answer"
    The correct answer is **C**. Adding 14 + 20 + 20 + 4 = 58 bytes of headers and trailer to 100 bytes of application data yields 158 total bytes; 58/158 is about 37% of the frame, but compared to the original 100 bytes of payload it is 58% overhead. For very short messages, header overhead dominates, which is why protocol designers spend serious effort minimizing header bytes.

    **Concept Tested:** Header

---
