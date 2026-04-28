# Quiz: Network Performance and Quality of Service

Test your understanding of bandwidth, throughput, goodput, the four sources of delay, RTT, jitter, packet loss, MTU, the bandwidth-delay product, and QoS mechanisms with these review questions.

---

#### 1. Which statement correctly distinguishes bandwidth, throughput, and goodput?

<div class="upper-alpha" markdown>
1. They are synonyms; the words are interchangeable
2. Bandwidth is a theoretical maximum capacity, throughput is the actual delivery rate including overhead, and goodput counts only useful application bytes
3. Bandwidth is measured in bytes; throughput and goodput are measured in bits
4. Goodput is always greater than bandwidth
</div>

??? question "Show Answer"
    The correct answer is **B**. The relationship is goodput ≤ throughput ≤ bandwidth. Bandwidth is the theoretical capacity (a property of the medium), throughput is what is actually being delivered (including all protocol overhead), and goodput is the useful application portion after subtracting headers, retransmissions, and discarded data. Confusing these three is one of the most common networking mistakes.

    **Concept Tested:** Bandwidth

---

#### 2. Which of the four delay components is determined by the speed of the signal in the medium and the physical length of the path, and cannot be reduced by faster link rates?

<div class="upper-alpha" markdown>
1. Transmission delay
2. Propagation delay
3. Queuing delay
4. Processing delay
</div>

??? question "Show Answer"
    The correct answer is **B**. Propagation delay is the time for a single bit to physically travel across the medium, set by the speed of light (or the medium's propagation speed) and the distance. A 1000 km fiber adds about 5 ms one-way no matter what link rate is used. Transmission delay scales with link rate. Queuing delay depends on load, processing delay on hardware.

    **Concept Tested:** Propagation Delay

---

#### 3. A 1500-byte packet is transmitted on a 1 Gbps link. What is the transmission delay?

<div class="upper-alpha" markdown>
1. About 12 microseconds
2. About 12 milliseconds
3. About 1.5 seconds
4. About 1500 nanoseconds
</div>

??? question "Show Answer"
    The correct answer is **A**. Transmission delay equals packet size in bits divided by link rate. 1500 bytes × 8 bits = 12,000 bits; 12,000 / 10^9 = 12 microseconds. On a 1 Mbps link, the same packet would take 12 milliseconds — a thousand times longer. This calculation is fundamental to comparing link technologies and predicting packet timing.

    **Concept Tested:** Transmission Delay

---

#### 4. A path between two hosts has 1 Gbps bandwidth and 80 ms round-trip time. What is its bandwidth-delay product, and what does this number represent?

<div class="upper-alpha" markdown>
1. 8 megabytes; the maximum packet size that can be sent
2. 10 megabytes; the amount of data that can be in flight on the path at any moment
3. 80 megabytes; the total transmission delay
4. 1 megabyte; the smallest TCP window that achieves full utilization
</div>

??? question "Show Answer"
    The correct answer is **B**. BDP = bandwidth × RTT = 10^9 × 0.080 = 8 × 10^7 bits = 10 megabytes. This is the volume of the pipe — the amount of data outstanding when the path is fully utilized. To keep the link saturated, the sender's window must hold at least one BDP. A smaller window under-utilizes the link, capping throughput at window/RTT.

    **Concept Tested:** Bandwidth Delay Product

---

#### 5. Why does even small packet loss have an outsized effect on TCP throughput?

<div class="upper-alpha" markdown>
1. TCP retransmits the entire connection from scratch on any loss
2. TCP's congestion control treats loss as a congestion signal and halves its sending rate; recovery takes many RTTs, especially on long fat networks
3. TCP cannot recover from any loss
4. Lost packets corrupt all subsequent packets
</div>

??? question "Show Answer"
    The correct answer is **B**. TCP interprets a missing packet as congestion and cuts its window in half, then slowly grows it back over many RTTs. On a long high-bandwidth path, even 1% loss can cap TCP throughput at around 12 Mbps regardless of the link's underlying capacity. This is why high-loss paths feel disproportionately slow.

    **Concept Tested:** Packet Loss

---

#### 6. A media-streaming application observes that audio packets, normally arriving 20 ms apart, sometimes arrive only 5 ms apart and other times 60 ms apart. Which performance metric describes this?

<div class="upper-alpha" markdown>
1. Bandwidth
2. Throughput
3. Jitter
4. Goodput
</div>

??? question "Show Answer"
    The correct answer is **C**. Jitter is the variation in delay across a sequence of packets, often measured as the standard deviation of inter-arrival times. Real-time applications are highly sensitive to jitter because they cannot recover from packets that arrive at unpredictable intervals. Receivers smooth jitter with a playout buffer, trading latency for steadiness.

    **Concept Tested:** Jitter

---

#### 7. Which traffic shaping algorithm enforces an average rate while still permitting short bursts up to the bucket's capacity?

<div class="upper-alpha" markdown>
1. Leaky bucket
2. Token bucket
3. Round-robin scheduler
4. Priority queue
</div>

??? question "Show Answer"
    The correct answer is **B**. The token bucket generates tokens at a fixed rate; each packet consumes one token. If the source has been silent, tokens accumulate, allowing a burst up to the bucket's capacity. The leaky bucket, by contrast, produces a constant output rate regardless of input bursts. Token bucket matches real workloads better, so most modern shapers use it.

    **Concept Tested:** Token Bucket

---

#### 8. On a router with FIFO scheduling shared by a greedy UDP flow and a small voice flow, what problem does fair queuing solve?

<div class="upper-alpha" markdown>
1. It eliminates packet loss entirely
2. It gives each flow its own queue and serves them in round-robin or weighted order, so no flow can monopolize the link
3. It speeds up the link's bandwidth
4. It encrypts traffic between flows
</div>

??? question "Show Answer"
    The correct answer is **B**. Under FIFO, a single high-rate flow can starve every other flow on the shared link. Fair queuing (or its weighted variant WFQ) gives each flow a separate queue and serves the queues in turn, so no flow can monopolize capacity. This protects well-behaved flows from greedy ones and is implemented in most production routers.

    **Concept Tested:** Fair Queuing

---

#### 9. Which QoS architecture stores per-flow state in every router along the path and uses RSVP signaling to reserve resources end-to-end?

<div class="upper-alpha" markdown>
1. Differentiated Services (DiffServ)
2. Integrated Services (IntServ)
3. Best-effort delivery
4. Token-bucket shaping
</div>

??? question "Show Answer"
    The correct answer is **B**. IntServ uses RSVP to request specific service quality (peak rate, average rate, max delay) along the entire path; each router decides whether to accept and stores per-flow state. This provides strong guarantees but does not scale — backbone routers may carry hundreds of millions of flows. DiffServ avoids per-flow state by using a small number of traffic classes marked via DSCP.

    **Concept Tested:** Integrated Services

---

#### 10. A user complains a large upload is slow over a transcontinental 1 Gbps path. Measurements show 90 ms RTT and the receiver advertises a 1 MB TCP window. What is the most likely cause of the observed throughput cap, and what fix should be tried first?

<div class="upper-alpha" markdown>
1. The link bandwidth is too low; nothing can be done
2. The TCP window is much smaller than the BDP (about 11 MB), so throughput is capped near 90 Mbps; enable TCP window scaling on both endpoints
3. The DNS server is slow; switch to a different DNS resolver
4. The Ethernet MTU is wrong; reduce it to 576 bytes
</div>

??? question "Show Answer"
    The correct answer is **B**. BDP = 10^9 × 0.090 = 11 MB. With only a 1 MB window, throughput is capped at 1 MB / 0.090 s ≈ 11 MB/s ≈ 90 Mbps, even though the link supports 1 Gbps. Enabling TCP window scaling (RFC 1323) raises the window from 64 KB up to many megabytes, removing the cap. This is a classic long-fat-network diagnosis.

    **Concept Tested:** Round Trip Time

---
