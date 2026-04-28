# Concept Taxonomy

This taxonomy organizes the 338 concepts of the Networking and Communication learning graph into 15 coherent categories that follow the natural structure of the OSI/TCP-IP stack and the ABET CAC / CS2023 NC knowledge area. No category exceeds 10% of the total concept count, which keeps the graph visualization balanced and avoids any one bucket dominating the legend.

Each category has a short uppercase TaxonomyID (3–5 letters), a human-readable name, and a description of what kinds of concepts belong in it.

## FOUND — Foundation Concepts

The bedrock vocabulary every learner needs before encountering any layer in detail: what a network is, who its participants are (hosts, clients, servers, edge, core), how addresses and ports identify endpoints, what governs interoperability (RFCs, IETF, IEEE, ISO, ICANN), and what a unit of data looks like at the lowest level (bits, bytes, frames, packets, segments, datagrams, headers, payloads, encapsulation).

## ARCH — Architecture and Layering

The conceptual scaffolding of networking: the OSI seven-layer model, the TCP/IP four/five-layer model, the role of each layer, the end-to-end principle, separation of concerns, service models, connection-oriented vs. connectionless service, reliability semantics, and addressing scopes (unicast, multicast, broadcast, anycast).

## PERF — Performance and Quality of Service

How networks are measured and shaped: bandwidth, throughput, goodput, latency components (propagation, transmission, queuing, processing), RTT, jitter, packet loss, MTU, bandwidth-delay product — together with the QoS toolbox (traffic shaping, token/leaky bucket, fair queuing, scheduling disciplines, admission control, DiffServ/IntServ, net neutrality).

## PHYS — Physical Layer

How bits cross physical media: analog vs. digital signaling, modulation/demodulation, encoding schemes (Manchester, NRZ), symbol and baud rate, channel capacity and Shannon's theorem, transmission media (twisted pair, coax, fiber, wireless), and impairments (attenuation, noise, interference, bit error rate).

## LINK — Link Layer and LAN Switching

Framing and reliable transfer over a single link, plus the local-area network technologies that build on it: framing techniques, error detection (parity, checksum, CRC), forward error correction, ARQ variants (stop-and-wait, sliding window, Go-Back-N, selective repeat), MAC protocols (ALOHA, CSMA/CD, CSMA/CA, token passing), Ethernet, switches and bridges, learning switches, Spanning Tree Protocol, broadcast/collision domains, VLANs and tagging, and link aggregation.

## WIRE — Wireless and Mobility

Wireless and cellular networking: wireless LANs, Wi-Fi (802.11) including APs, SSIDs, BSS/ESS, channels, RTS/CTS, and roaming; Bluetooth; cellular generations (4G LTE, 5G NR); and mobility-related mechanisms such as Mobile IP, handoff, and link adaptation.

## NET — Network Layer and Addressing

The IP datagram service: IPv4 and IPv6 headers, address formats and classes, private and loopback ranges, CIDR, subnetting and supernetting, longest-prefix matching, IPv6 address types and autoconfiguration, IPv4/IPv6 transition mechanisms (dual stack, tunneling, NAT64), control and helper protocols (ICMP, ARP, NDP, ping, traceroute), NAT and PAT, and fragmentation/reassembly.

## ROUT — Routing and Forwarding

How packets find their way: the forwarding/routing distinction, forwarding and routing tables, static and default routes, distance-vector algorithms (Bellman–Ford, RIP, count-to-infinity, split horizon, poison reverse), link-state algorithms (Dijkstra, OSPF), path-vector routing (BGP, autonomous systems), intradomain vs. interdomain routing, Internet topology, tier-1 ISPs, peering and transit, and multicast/anycast routing.

## TRANS — Transport Layer

End-to-end reliable and unreliable delivery: UDP and its datagram, TCP segments, connection management (three-way handshake, termination), sequence numbers, acknowledgments, sliding windows, flow control, congestion control (slow start, congestion avoidance, fast retransmit/recovery, Reno, CUBIC, BBR), retransmission timers (Karn), the Nagle algorithm, SACK, QUIC, and Multipath TCP.

## APP — Application Layer Protocols

Protocols that run on top of TCP/UDP/QUIC: DNS (hierarchy, record types, recursive vs. authoritative resolvers, root servers, caching, DNSSEC); HTTP (methods, status codes, headers, cookies, HTTP/1.1, HTTP/2, HTTP/3, HTTPS); REST, WebSockets, gRPC; mail (SMTP, IMAP, POP3); file/remote access (FTP, SSH, Telnet); and infrastructure protocols (DHCP, SNMP, NTP).

## SEC — Network Security

Security primitives and their use in transit: cryptography basics, symmetric and public-key encryption, hash functions, digital signatures, certificate authorities, X.509 certificates, TLS (handshake, cipher suites), IPsec and VPNs, firewalls (stateful), intrusion detection and prevention, common attacks (spoofing, MITM, DDoS, replay, SYN flood, ARP spoofing, DNS cache poisoning), defense in depth, and zero-trust architectures.

## PROG — Network Programming

Building networked applications: the Berkeley sockets API, TCP and UDP sockets, socket addresses, connection-establishment operations (bind, listen, accept, connect, send/receive), I/O models (blocking, non-blocking, asynchronous, select/poll, epoll/kqueue), client–server and peer-to-peer architectures, and NAT traversal techniques (STUN, TURN).

## OPS — Network Operations and Measurement

Tools and practices for running and measuring networks: wire protocol design and versioning, packet capture (Wireshark, tcpdump), iperf, Linux network namespaces and bridges, tc netem, network logging, change control, and configuration management.

## SDN — SDN, NFV, and Emerging Topics

Programmable, virtualized, and forward-looking networking: SDN (control plane vs. data plane separation, OpenFlow, controllers), NFV, service meshes, overlay networks and VXLAN, content delivery networks, edge and fog computing, post-quantum cryptography, low-latency and AI-workload networking, cloud VPCs, and hybrid cloud networks.

## CAP — Capstone Projects

Integrative project ideas that draw on multiple categories above: a chat server and client over a custom protocol, a mini DNS resolver with caching and DNSSEC, a software-defined-network testbed with Mininet/OpenFlow, a small-business or campus network design, a peer-to-peer file-sharing application with NAT traversal, an incident postmortem, and a network benchmarking exercise.
