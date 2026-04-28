---
title: Course Description for Networking and Communication
description: A detailed course description for an ABET-aligned college-level Networking and Communication course, including overview, topics covered, and learning objectives in the format of the 2001 Bloom Taxonomy.
quality_score: 96
---

# Networking and Communication

**Title:** Networking and Communication

**Target Audience:** College undergraduate students (typically sophomore or junior year) pursuing degrees in Computer Science, Information Technology, Information Systems, Cybersecurity, Computer Engineering, or related computing disciplines. Suitable for programs seeking ABET Computing Accreditation Commission (CAC) accreditation.

**Prerequisites:**

- Introductory programming course (CS1 equivalent) in any modern language (Python, Java, C, C++, or similar)
- Discrete mathematics or equivalent exposure to graph theory, sets, and basic logic
- Familiarity with the command line on at least one operating system (Linux, macOS, or Windows)
- Basic understanding of computer organization (memory, processes, files) — recommended but not required

## Course Overview

Modern computing is networked computing. From the moment a student opens a laptop or unlocks a phone, dozens of protocols negotiate addresses, route packets, secure connections, and deliver data across continents in milliseconds. Yet most students treat the network as an invisible utility — until something breaks, performs poorly, or leaks data they meant to keep private. This course makes the invisible visible. It builds a working mental model of how networks are designed, how data moves between hosts, and why the layered architecture that emerged in the 1970s still governs the systems we deploy today.

The course is grounded in the **ABET Computing Accreditation Commission (CAC) 2025–2026 criteria**, which require Computer Science programs to provide exposure to "networking and communication" and Information Technology programs to provide "fundamentals and applied practice in networking." Topic depth and sequencing follow the **ACM/IEEE-CS/AAAI CS2023 Networking and Communication (NC) knowledge area**, ensuring curricular alignment with the most current authoritative standard. Students complete the course able to reason about networks at every layer of the stack, diagnose realistic failure modes, and design small-to-medium networked systems that are correct, performant, and secure.

The pedagogical approach emphasizes hands-on labs, packet-level inspection (Wireshark, tcpdump), socket programming, and short capstone-style design exercises. Where the textbook touches advanced areas — software-defined networking, edge computing, zero-trust architectures, low-latency wireless — it does so to give students a vocabulary for what comes next, not to replace specialized graduate coursework.

## Main Topics Covered

- **Network Architecture and the Layered Model** — OSI reference model, TCP/IP model, encapsulation, protocol stacks, end-to-end principle, separation of concerns
- **Physical and Link Layers** — signaling, encoding, bandwidth vs. throughput, framing, error detection (CRC, checksums), media access control, Ethernet (IEEE 802.3), Wi-Fi (IEEE 802.11)
- **Local Area Networks (LANs)** — switching and bridging, learning switches, Spanning Tree Protocol, VLANs, broadcast and collision domains
- **The Network Layer** — IPv4 and IPv6 addressing, subnetting, CIDR, NAT, ICMP, fragmentation, longest-prefix matching
- **Routing and Forwarding** — forwarding tables, distance-vector algorithms (RIP), link-state algorithms (OSPF), path-vector (BGP), interdomain vs. intradomain routing, Internet topology
- **Reliable Data Delivery (Transport Layer)** — UDP, TCP connection management, sliding window, flow control, congestion control (Reno, CUBIC, BBR), retransmission, timers
- **Resource Allocation and Quality of Service** — fair queuing, traffic shaping, scheduling disciplines, admission control, differentiated services, network neutrality tradeoffs
- **Application Layer Protocols** — DNS, HTTP/1.1, HTTP/2, HTTP/3 (QUIC), TLS, SMTP, SSH, WebSockets, gRPC, REST design
- **Network Security Fundamentals** — confidentiality, integrity, authentication, symmetric and public-key cryptography in transit, certificate authorities, common attacks (spoofing, MITM, DDoS, replay), defense in depth
- **Wireless and Mobility** — cellular generations (4G/5G), Wi-Fi roaming, mobile IP, handoff, link adaptation, link-layer retransmission strategies
- **Network Programming** — Berkeley sockets API, blocking vs. non-blocking I/O, asynchronous patterns, client-server and peer-to-peer architectures, designing wire protocols
- **Network Measurement and Performance** — latency, throughput, jitter, packet loss, bandwidth-delay product, traceroute, ping, iperf, packet capture analysis
- **Network Management and Operations** — DHCP, SNMP, network monitoring, logging, change control, configuration management
- **Software-Defined Networking and Network Function Virtualization** — control plane vs. data plane separation, OpenFlow, programmable networks, overlay networks (VXLAN), service meshes
- **Emerging Topics** — edge and fog computing, content delivery networks, IPv6 deployment, zero-trust networking, post-quantum cryptography in transport, low-latency networks for AI workloads

## Topics Not Covered

This is an undergraduate ABET-aligned foundation course. The following adjacent topics are explicitly **out of scope** and belong in dedicated follow-on courses:

- **RF and physical-layer engineering** — antenna design, modulation theory beyond a conceptual level, signal processing math (covered in EE/ECE courses)
- **Operating system internals of network stacks** — kernel bypass, DPDK, eBPF/XDP packet processing internals (graduate systems courses)
- **Advanced cryptanalysis** — algorithm design, formal proofs of cryptographic protocols (dedicated cryptography course)
- **Telecommunications business and policy** — spectrum auctions, common carrier law, FCC regulation (policy-track electives)
- **Production network engineering at carrier scale** — vendor-specific certification material (Cisco CCNP/CCIE, Juniper JNCIE) is referenced but not the focus
- **Distributed systems consensus algorithms** — Paxos, Raft, Byzantine fault tolerance (dedicated distributed systems course)
- **Web application development** — front-end frameworks, browser APIs, web security beyond the network layer
- **Machine learning for networking** — anomaly detection, traffic classification with ML (graduate research electives)

## Learning Outcomes

After completing this course, students will be able to:

### Remember
*Retrieving, recognizing, and recalling relevant knowledge from long-term memory.*

- Recall the seven layers of the OSI reference model and the four/five layers of the TCP/IP model and identify which protocols operate at each layer.
- Recognize standard port numbers for common protocols (HTTP, HTTPS, DNS, SSH, SMTP, FTP).
- List the fields of an IPv4 header, an IPv6 header, a TCP segment, and a UDP datagram.
- State the formats of MAC addresses, IPv4 addresses, IPv6 addresses, and CIDR notation.
- Identify common networking command-line tools (ping, traceroute, nslookup, dig, ip, netstat, ss, iperf, tcpdump).
- Recall the canonical ranges of private IPv4 address space (RFC 1918) and reserved IPv6 ranges.
- Recognize key IEEE 802 standards (802.3 Ethernet, 802.11 Wi-Fi, 802.1Q VLANs, 802.1D STP).
- Define core terms: latency, throughput, bandwidth, jitter, MTU, RTT, BDP, ACK, SYN, FIN, NAT, MTU.

### Understand
*Constructing meaning from instructional messages, including oral, written, and graphic communication.*

- Explain the end-to-end principle and why it shaped the design of the Internet.
- Describe how encapsulation moves a unit of data down through the protocol stack and back up at the receiver.
- Explain the difference between connection-oriented and connectionless protocols and when each is appropriate.
- Describe how DNS resolves a hostname through recursive and iterative queries, including caching behavior.
- Explain the purpose of the three-way handshake in TCP and the four-way termination sequence.
- Summarize how distance-vector and link-state routing algorithms differ in convergence behavior and information exchange.
- Explain why subnetting and CIDR were introduced and how they reduced routing table growth.
- Describe how TLS provides confidentiality, integrity, and authentication on top of TCP.
- Explain how a Wi-Fi client associates with an access point and the role of channel selection.
- Describe how NAT preserves IPv4 address space and the tradeoffs it imposes on end-to-end addressability.

### Apply
*Carrying out or using a procedure in a given situation.*

- Compute subnet masks, network addresses, broadcast addresses, and host ranges given a CIDR block.
- Use Wireshark or tcpdump to capture and decode traffic for a given application and identify each protocol layer.
- Write a client and a server program using the Berkeley sockets API in a chosen language, supporting both TCP and UDP.
- Configure a small Linux network namespace topology and verify connectivity with `ip`, `ping`, and `traceroute`.
- Use `iperf` to measure throughput between two hosts and reason about the result in terms of bandwidth-delay product.
- Generate and inspect a TLS certificate with `openssl` and trace a TLS handshake in a packet capture.
- Implement a simple application-layer protocol over TCP with framing and graceful shutdown.
- Calculate effective throughput given a window size, RTT, and packet loss rate.
- Apply distance-vector convergence by hand on a small network graph and detect count-to-infinity scenarios.
- Configure DNS records (A, AAAA, CNAME, MX, TXT) for a small domain and verify resolution with `dig`.

### Analyze
*Breaking material into constituent parts and determining how the parts relate to one another and to an overall structure or purpose.*

- Decompose a packet capture of a real web page load (HTTP/3 over QUIC) and identify each protocol's contribution to total page load time.
- Diagnose a connectivity failure by isolating the layer at which it occurs (physical, link, network, transport, application).
- Analyze a TCP congestion control trace and explain the behavior of slow start, congestion avoidance, fast retransmit, and fast recovery.
- Compare the tradeoffs of TCP versus UDP versus QUIC for a real-world workload (video streaming, online gaming, file transfer, RPC).
- Examine a routing convergence event and identify which links flapped and how the topology stabilized.
- Decompose the security model of a given protocol (SSH, TLS, IPsec) into its authentication, key exchange, and bulk encryption components.
- Analyze the latency contributors in a request that traverses a CDN, a load balancer, and a backend service.
- Differentiate between IPv6 transition mechanisms (dual stack, tunneling, NAT64) and identify which fits a given deployment.

### Evaluate
*Making judgments based on criteria and standards through checking and critiquing.*

- Critique a proposed network design against criteria for scalability, fault tolerance, security, and operational cost.
- Evaluate competing congestion control algorithms (Reno, CUBIC, BBR) for fairness, throughput, and behavior under loss.
- Judge whether a given application protocol design (e.g., a custom RPC scheme) is well-suited to its workload, citing layering and end-to-end principle considerations.
- Assess the security posture of a small network deployment and identify the highest-priority weaknesses.
- Compare IPv4 NAT-based architectures to native IPv6 architectures for a given organization and recommend a migration path.
- Evaluate the appropriateness of TCP, UDP, QUIC, or WebSockets for a new application and defend the choice.
- Critique published network performance benchmarks for methodological soundness (warmup, fairness, statistical reporting).
- Assess whether a vendor's claims about a "5G" or "Wi-Fi 7" deployment translate to user-visible improvements for a given workload.

### Create
*Putting elements together to form a coherent or functional whole; reorganizing elements into a new pattern or structure.*

- **Capstone — Build a chat server and client** that implements a custom application-layer protocol over TCP with framing, authentication, multi-room support, and graceful failure handling.
- **Capstone — Design and implement a mini DNS resolver** that supports recursive resolution, caching with TTL, and DNSSEC validation for a subset of record types.
- **Capstone — Construct a software-defined network testbed** using Mininet and an OpenFlow controller to demonstrate dynamic flow installation and failover.
- **Capstone — Network architecture proposal** for a fictional small business or campus, including IP plan, VLAN segmentation, security zones, monitoring strategy, and budget estimate.
- **Capstone — Build a peer-to-peer file-sharing application** with chunked transfer, integrity verification, and NAT traversal techniques.
- Design a wire protocol with explicit versioning, extension fields, and a deprecation strategy, and document it in an RFC-style specification.
- Develop an automated test harness that injects packet loss, latency, and reordering using `tc netem` and validates application robustness.
- Produce a written incident postmortem for a simulated network outage that traces root cause, contributing factors, detection gaps, and remediations.
- Synthesize a recommendation memo comparing on-premises networking, cloud VPC architectures, and hybrid models for a stakeholder audience.

## Course Importance and Relevance

Every modern computing role — software engineering, site reliability, data engineering, security, machine learning operations, and product engineering — assumes baseline networking literacy. ABET-accredited programs identify networking and communication as one of the small set of topic areas every computing graduate must encounter, because debugging modern systems is impossible without it. A backend engineer who cannot read a packet capture, a security analyst who cannot reason about TLS, or an SRE who cannot interpret BGP convergence is at a permanent disadvantage on any team.

This course also serves as a critical gateway to specialization. Students drawn toward cybersecurity will use this foundation in dedicated network security and offensive security courses. Students drawn toward distributed systems will rely on it when they study consensus, replication, and global-scale storage. Students entering industry will recognize the same protocols whether they work on cloud infrastructure, embedded IoT devices, mobile applications, or the autonomous vehicles and AI training clusters that are reshaping computing today.

By grounding the curriculum in the ABET CAC topic area requirements and the CS2023 NC knowledge area, the course produces graduates whose foundation is recognized by employers and by graduate programs across the United States and internationally. The hands-on labs, packet-level analysis, and capstone design work give students artifacts they can show in interviews and a working understanding that survives long after the final exam.

## Disclaimer

This course is aligned with the ABET CS2023 Networking and Communications course objectives but is not endorsed by the ABET.org organization.
