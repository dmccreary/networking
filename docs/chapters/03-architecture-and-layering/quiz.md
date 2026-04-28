# Quiz: Network Architecture and Layered Models

Test your understanding of the OSI and TCP/IP reference models, the end-to-end principle, service models, and the four addressing scopes with these review questions.

---

#### 1. What does separation of concerns mean in the context of a layered network architecture?

<div class="upper-alpha" markdown>
1. Each layer addresses one well-defined concern and stays out of concerns belonging to other layers
2. Every layer must implement every function in the network
3. Concerns are randomly distributed across layers
4. Only the application layer has any concerns
</div>

??? question "Show Answer"
    The correct answer is **A**. Separation of concerns is the discipline that makes layering work: the link layer worries about delivering frames between neighbors, the network layer worries about routing across many links, the transport layer worries about end-to-end delivery, and the application layer worries about meaning. When each layer keeps its concerns to itself, the rest of the stack can evolve independently.

    **Concept Tested:** Separation Of Concerns

---

#### 2. How many layers are in the OSI Reference Model, and what is the bottom layer called?

<div class="upper-alpha" markdown>
1. Four layers; bottom layer is the Link layer
2. Seven layers; bottom layer is the Physical layer
3. Five layers; bottom layer is the Internet layer
4. Three layers; bottom layer is the Hardware layer
</div>

??? question "Show Answer"
    The correct answer is **B**. The OSI Reference Model defines seven layers: Physical (1), Data Link (2), Network (3), Transport (4), Session (5), Presentation (6), and Application (7). The Physical layer is at the bottom (closest to the wire) and the Application layer is at the top. The TCP/IP model uses four or five layers, but OSI is canonical for seven.

    **Concept Tested:** OSI Reference Model

---

#### 3. The TCP/IP model collapses which OSI layers into a single Application layer?

<div class="upper-alpha" markdown>
1. Application, Presentation, and Session
2. Transport and Network
3. Physical and Data Link
4. Network and Data Link
</div>

??? question "Show Answer"
    The correct answer is **A**. The TCP/IP model pushes OSI's Session and Presentation responsibilities up into the application itself, since most applications need bespoke session and encoding logic anyway. The Transport, Network, and Link layers stay roughly aligned with their OSI counterparts. This is why most modern networks use four or five layers rather than seven.

    **Concept Tested:** TCP IP Model

---

#### 4. Which OSI layer is responsible for grouping bits into frames, addressing them by MAC address, and detecting bit errors on a single link?

<div class="upper-alpha" markdown>
1. Physical layer
2. Data Link layer
3. Network layer
4. Transport layer
</div>

??? question "Show Answer"
    The correct answer is **B**. The data link layer (Layer 2) governs reliable communication between two directly-connected nodes. It groups bits into frames, addresses them by MAC, detects errors, and arbitrates access to shared media. Ethernet and Wi-Fi are link-layer protocols. The physical layer carries raw bits, and the network layer routes packets across many links.

    **Concept Tested:** Data Link Layer

---

#### 5. What does the end-to-end principle say about where network functions should be implemented?

<div class="upper-alpha" markdown>
1. Functions should be implemented in the network core, never in end systems
2. Functions should be implemented in end systems rather than in the network core, unless implementing them in the core is the only way to make them work
3. Functions should be implemented in every router on the path
4. Functions should always be implemented in hardware
</div>

??? question "Show Answer"
    The correct answer is **B**. The end-to-end principle, articulated by Saltzer, Reed, and Clark, argues for keeping the core simple and pushing functions to the edges. Reliability is the canonical example: TCP retransmission lives at the endpoints because only the receiving application can confirm delivery. The principle is a default that has shaped the Internet's flexibility.

    **Concept Tested:** End To End Principle

---

#### 6. A protocol that requires a setup handshake before any data flows, then exchanges messages through that established connection, is called what?

<div class="upper-alpha" markdown>
1. Connectionless
2. Stateless
3. Connection-oriented
4. Best-effort
</div>

??? question "Show Answer"
    The correct answer is **C**. Connection-oriented protocols establish shared state (sequence numbers, window sizes, security parameters) before sending data. TCP is the canonical example. Connectionless protocols like UDP send each message independently with no setup. The setup costs at least one round-trip of latency but buys ordering, reliability, and clean teardown.

    **Concept Tested:** Connection Oriented

---

#### 7. IP at the network layer is described as a best-effort protocol. What does best-effort delivery mean?

<div class="upper-alpha" markdown>
1. Packets are guaranteed to arrive in order without errors
2. The service tries to deliver but provides no guarantees — packets may be lost, reordered, corrupted, or duplicated
3. The network retries every packet automatically
4. Packets are encrypted by default
</div>

??? question "Show Answer"
    The correct answer is **B**. Best-effort delivery means the network attempts delivery but offers no guarantees. Reliability, ordering, and error recovery are the responsibility of higher layers (or the application). Keeping IP best-effort lets applications decide their own recovery behavior — a video chat skips lost frames, while a file transfer waits and retries.

    **Concept Tested:** Best Effort Delivery

---

#### 8. A real-time video conferencing application sends thousands of audio and video packets per second to several participants. Which combination of service-model choices is most appropriate?

<div class="upper-alpha" markdown>
1. Connection-oriented, reliable, in-band signaling
2. Connectionless, best-effort transport (UDP/QUIC), with stateful application-layer session
3. Connectionless, reliable, no addressing
4. Broadcast addressing for all participants
</div>

??? question "Show Answer"
    The correct answer is **B**. For real-time media, retransmitting a lost frame after the user has moved past it adds latency without value, so connectionless and best-effort transport (UDP or QUIC) is correct. The application layer maintains session state (codec, encryption keys, participants). Option A's reliable transport adds harmful latency, and broadcast does not work across the public Internet.

    **Concept Tested:** Connectionless

---

#### 9. Which addressing scope identifies exactly one receiver, but routes packets to whichever copy of that receiver is closest by routing-protocol metrics?

<div class="upper-alpha" markdown>
1. Unicast
2. Multicast
3. Broadcast
4. Anycast
</div>

??? question "Show Answer"
    The correct answer is **D**. Anycast lets multiple physical hosts share the same address; the routing system delivers each packet to the closest copy. DNS root servers and many CDN services use anycast — a query to 8.8.8.8 reaches a nearby Google server depending on origin. Unicast goes to one specific receiver, multicast to a group, broadcast to everyone on the local subnet.

    **Concept Tested:** Anycast

---

#### 10. Why does IPv6 omit broadcast entirely, replacing it with multicast?

<div class="upper-alpha" markdown>
1. Broadcast was too expensive to implement on modern hardware
2. Broadcast forces every host on the link to process every packet, wasting CPU and energy; multicast lets only group members receive the packet, achieving the same coordination tasks more efficiently
3. IPv6 has fewer addresses than IPv4
4. Broadcast was never used on IPv4 either
</div>

??? question "Show Answer"
    The correct answer is **B**. Broadcast wakes every interface on the subnet, even when most hosts have no interest in the message. Multicast lets only members of the relevant group process the packet, saving CPU, energy, and link bandwidth. IPv6 designers replaced broadcast with multicast for efficiency. IPv4 still retains a per-subnet broadcast address for ARP and DHCP.

    **Concept Tested:** Broadcast

---
