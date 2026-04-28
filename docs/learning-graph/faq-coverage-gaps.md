# FAQ Coverage Gaps

Generated: 2026-04-28

This report lists concepts from the learning graph that are not directly referenced in the FAQ. Use it to plan future FAQ expansions.

## Summary

- Total concepts: 338
- Concepts referenced in FAQ entries: 161
- Concepts not yet referenced: 177
- Concept coverage: 47%

Note: many "uncovered" concepts are still discussed implicitly inside FAQ answers but are not tagged in the chatbot JSON `concepts` field. The lists below are the concepts that would most benefit from a dedicated question.

## High Priority Gaps (38)

Foundational or high-centrality concepts a student is likely to ask about directly.

- TCP IP Model
- End To End Principle
- Connection Oriented
- Reliable Delivery
- Sliding Window
- Ethernet Switch
- VLAN Tagging
- Wi Fi
- Wi Fi Channel
- Wi Fi Roaming
- IPv4 Header
- IPv6 Header
- Distance Vector Routing
- Link State Routing
- OSPF Protocol
- Path Vector Routing
- BGP Protocol
- Interdomain Routing
- Multicast Routing
- Anycast Routing
- TCP Segment
- TCP Three Way Handshake
- TCP Termination
- Multipath TCP
- DNS Record Type
- DNS Caching
- HTTP Protocol
- HTTP Status Code
- HTTP Headers
- HTTP One One
- HTTP Two
- HTTP Three
- Public Key Cryptography
- Hash Function
- X509 Certificate
- TLS Protocol
- DNS Cache Poisoning
- TCP Socket

## Medium Priority Gaps (129)

Useful but specialized terms; readers will encounter them but may not search for them in isolation.

- Network Edge
- Communication Link
- IEEE Standard
- Decapsulation
- Session Layer
- Presentation Layer
- Separation Of Concerns
- Service Model
- Best Effort Delivery
- In Band Signaling
- Out Of Band Signaling
- Round Trip Time
- Bandwidth Delay Product
- Analog Signal
- Digital Signal
- Demodulation
- Manchester Encoding
- NRZ Encoding
- Symbol Rate
- Baud Rate
- Shannon Theorem
- Twisted Pair Cable
- Coaxial Cable
- Fiber Optic Cable
- Wireless Medium
- Attenuation
- Bit Error Rate
- Bit Stuffing
- Byte Stuffing
- Parity Check
- Forward Error Correction
- Automatic Repeat Request
- Stop And Wait Protocol
- Go Back N
- Selective Repeat
- Media Access Control
- ALOHA Protocol
- CSMA CD
- CSMA CA
- Token Passing
- Hub
- Learning Switch
- Collision Domain
- Link Aggregation
- Wireless LAN
- SSID
- BSS
- RTS CTS
- Cellular Network
- 4G LTE
- 5G NR
- Mobile IP
- Handoff
- IPv4 Address Format
- IPv4 Address Class
- Private IPv4 Range
- Loopback Address
- Longest Prefix Match
- IPv6 Address Format
- IPv6 Address Type
- IPv6 Autoconfiguration
- IPv4 IPv6 Transition
- Port Address Translation
- Fragmentation
- Reassembly
- Static Route
- Bellman Ford Algorithm
- RIP Protocol
- Count To Infinity
- Dijkstra Algorithm
- Internet Topology
- Tier 1 ISP
- Transit Provider
- QUIC Protocol
- Quality Of Service
- Traffic Shaping
- Token Bucket
- Leaky Bucket
- Fair Queuing
- Scheduling Discipline
- Admission Control
- Differentiated Services
- Integrated Services
- Net Neutrality
- Cookie
- REST Architecture
- POP3
- FTP
- SSH Protocol
- SNMP
- NTP
- Cryptography Basics
- Spoofing Attack
- Man In The Middle
- DDoS Attack
- Replay Attack
- ARP Spoofing
- Zero Trust Network
- Socket Address
- Bind Operation
- Listen Operation
- Accept Operation
- Connect Operation
- Send Receive Operation
- Blocking IO
- Non Blocking IO
- Asynchronous IO
- Select And Poll
- Epoll And Kqueue
- Client Server Model
- Peer To Peer Model
- NAT Traversal
- Wire Protocol Design
- Protocol Versioning
- Iperf
- Linux Bridge
- Tc Netem
- Network Logging
- Change Control
- Configuration Management
- Network Function Virtualization
- Overlay Network
- VXLAN
- Post Quantum Cryptography
- Low Latency Networking
- AI Workload Networking
- Hybrid Cloud Network
- Incident Postmortem
- Network Benchmarking

## Low Priority Gaps (10)

Capstone projects, advanced congestion control variants, and edge cases. The glossary covers these adequately for most students.

- TCP Reno
- TCP BBR
- Karn Algorithm
- Nagle Algorithm
- SACK Option
- Capstone Chat Server
- Capstone Mini DNS
- Capstone SDN Testbed
- Capstone Network Design
- Capstone P2P File Share

## Recommendations

1. Add FAQ entries for each high-priority gap in a future expansion.
2. Tag existing answers more aggressively in the chatbot JSON so concept coverage statistics reflect the actual content.
3. Capstone projects do not need standalone FAQ entries — they are documented in Chapter 16.
