# Glossary of Terms

#### Accept Operation

The socket call that returns the next completed incoming TCP connection from a listening socket as a new socket, leaving the listening socket open for further connections.

**Example:** A web server's main loop typically calls `accept` to obtain a connected socket per client and hands it off to a worker thread or task.

#### Access Point

A wireless networking device that connects Wi-Fi clients to a wired network and coordinates medium access among them. Access points form the infrastructure side of a Wi-Fi deployment.

**Example:** An office ceiling-mounted access point bridges Wi-Fi clients onto the wired Ethernet LAN that connects to the rest of the corporate network.

#### Access Port

A switch port configured to carry traffic for exactly one VLAN, with frames untagged to and from end devices. Access ports typically connect to user workstations.

**Example:** A user's desktop plugged into an access port assigned to VLAN 10 sees normal untagged Ethernet frames but is logically isolated to VLAN 10.

#### Acknowledgment

A signal from the receiver to the sender indicating successful receipt of data up to a specific sequence number. Acknowledgments drive retransmission and congestion-control logic.

**Example:** A TCP receiver acknowledging up to byte 10000 with ACK = 10000 tells the sender that all bytes through 9999 have arrived in order.

#### Admission Control

A QoS mechanism that decides whether to accept or reject a new flow based on whether the network has enough resources to honor its requested service. It is a key part of guaranteed-service architectures.

**Example:** A voice gateway using admission control may refuse a new call when the network's voice-quality budget is already fully allocated.

#### AI Workload Networking

Networking designed for AI training and inference workloads, characterized by high bandwidth, low jitter, lossless or near-lossless behavior, and tight collective communication patterns among accelerators.

**Example:** A GPU training cluster uses RDMA over Converged Ethernet or InfiniBand fabrics with priority flow control so all-reduce operations complete predictably across thousands of GPUs.

#### ALOHA Protocol

An early random-access MAC protocol in which stations transmit whenever they have data, retrying after random delays if a collision occurs. Slotted ALOHA improves on it by aligning transmissions to time slots.

**Example:** Pure ALOHA achieves at most about 18% channel utilization; slotted ALOHA roughly doubles that to about 37% under heavy load.

#### Analog Signal

A signal whose value varies continuously over a range, representing information through smooth changes. Analog signals are vulnerable to cumulative noise and distortion.

**Example:** Traditional telephone voice was carried as an analog signal whose voltage tracked the air pressure of the speaker's voice.

#### Anycast

A communication pattern in which a single destination address is assigned to multiple hosts, and the network routes each request to the topologically nearest one. Anycast is widely used for resilience and load distribution.

**Example:** Major DNS root servers are deployed as anycast clusters so queries are answered by whichever instance is closest in routing terms.

#### Anycast Routing

The practice of advertising the same IP prefix from multiple locations so that BGP delivers each request to the topologically closest instance, providing locality and resilience.

**Example:** Public DNS resolvers like 1.1.1.1 use anycast routing so users worldwide reach a nearby data center automatically.

#### Application Layer

The top layer of a network architecture, where user-facing protocols and applications operate. Application-layer protocols define message formats and behaviors specific to a service.

**Example:** HTTP, SMTP, DNS, and SSH are all application-layer protocols that run on top of transport-layer connections.

#### ARP

The Address Resolution Protocol, used in IPv4 networks to map a target IPv4 address to its corresponding MAC address on a local broadcast network.

**Example:** Before sending an IPv4 packet to 192.168.1.5 on the same LAN, a host broadcasts an ARP request asking who has that address and learns the MAC from the reply.

#### ARP Spoofing

An attack in which an adversary sends forged ARP messages on a LAN, associating its own MAC address with the IP address of another host (often the gateway) to intercept or alter traffic.

**Example:** A laptop performing ARP spoofing on an open Wi-Fi can convince other clients that its MAC corresponds to the router, enabling man-in-the-middle interception.

#### Asynchronous IO

An I/O model in which the application initiates an operation and is later notified of completion through callbacks, completion ports, or futures, rather than blocking or polling for readiness.

**Example:** Linux's `io_uring` lets a program queue many read and write operations and receive completions on a shared ring buffer asynchronously.

#### Attenuation

The reduction in signal strength as it travels through a medium, caused by absorption, scattering, and dispersion. Attenuation increases with distance and limits how far a signal can travel before requiring amplification.

**Example:** A fiber optic signal might lose 0.2 dB per kilometer, allowing transmission over 80 km before regeneration becomes necessary.

#### Authoritative Server

A DNS server that holds the master records for a particular zone and responds with definitive answers for names within that zone.

**Example:** The authoritative servers for example.com hold the official A, AAAA, MX, and other records and provide the source of truth for that domain.

#### Automatic Repeat Request

A reliability strategy in which the receiver detects errors using a code such as a CRC and asks the sender to retransmit corrupted or missing data via acknowledgments.

**Example:** TCP uses automatic repeat request: if a segment is lost or corrupted, the receiver does not acknowledge it, prompting the sender to retransmit.

#### Autonomous System

A collection of IP prefixes under a single administrative domain that presents a unified routing policy to the rest of the internet, identified by a globally unique AS number.

**Example:** Cloudflare operates AS 13335, advertising its address space with a coherent routing policy across its global network.

#### Bandwidth

The maximum data transmission capacity of a link or path, usually measured in bits per second. Bandwidth is a property of the channel itself, independent of how much traffic is currently flowing.

**Example:** A residential cable modem might offer 500 Mbps of downstream bandwidth, the upper limit on data rate from the ISP to the home.

#### Bandwidth Delay Product

The product of a link's bandwidth and round-trip delay, expressed in bits or bytes, representing the amount of data in flight when the pipe is full. It sets a lower bound on the window size needed to saturate the path.

**Example:** A 1 Gbps link with 100 ms RTT has a bandwidth-delay product of 100 megabits, so TCP needs at least a 12.5 MB window to fill it.

#### Baud Rate

A synonym for symbol rate, measured in baud, equal to the number of signaling events per second on a channel. Baud rate equals bit rate only when each symbol carries exactly one bit.

**Example:** A 56 kbps modem operates at about 8000 baud, transmitting roughly seven bits per symbol over the telephone channel.

#### Bellman Ford Algorithm

An iterative shortest-path algorithm that updates path-cost estimates by relaxing edges, capable of handling negative weights and used as the basis for distance-vector routing protocols.

**Example:** Each iteration of Bellman-Ford in a routing protocol replaces a router's estimate to a destination with the minimum over all neighbor advertisements plus link cost.

#### Berkeley Sockets API

A widely adopted programming interface for network communication originally introduced in BSD Unix, providing functions like `socket`, `bind`, `listen`, `accept`, `connect`, `send`, and `recv`.

**Example:** A C program uses the Berkeley Sockets API to open a TCP server by calling `socket`, `bind`, `listen`, and then `accept` in a loop.

#### Best Effort Delivery

A service model that attempts to deliver each unit but provides no guarantees about loss, ordering, duplication, or delay. The Internet Protocol provides best effort delivery to higher layers.

**Example:** IP forwarding makes a best effort attempt to route a packet but may drop it during congestion, leaving recovery to TCP or the application.

#### BGP Protocol

The Border Gateway Protocol, the standard interdomain routing protocol of the internet, used between autonomous systems to exchange reachability information and apply policy.

**Example:** Two ISPs peering at an exchange use BGP to advertise the prefixes they can reach, deciding which paths to prefer based on commercial agreements.

#### Bind Operation

The socket call that associates a socket with a specific local IP address and port, reserving that endpoint for use by the calling process.

**Example:** A server program calls `bind` on a freshly created socket to claim port 8080 before listening for incoming connections.

#### Bit

The smallest unit of digital information, taking the value 0 or 1. Bits are the fundamental quantity used to measure data, bandwidth, and storage in computer networks.

**Example:** A 1 Gbps link transmits one billion bits per second, enough to send roughly 125 megabytes of data each second.

#### Bit Error Rate

The fraction of transmitted bits that arrive in error, typically expressed as a probability such as 10^-9. BER is a key quality metric for physical-layer links.

**Example:** A long-haul fiber link engineered for 10^-12 BER will see only one erroneous bit per terabit transmitted under normal conditions.

#### Bit Stuffing

A framing technique that inserts an extra bit into the transmitted stream after a fixed pattern of identical bits to prevent the bit pattern from being mistaken for a frame delimiter.

**Example:** HDLC inserts a 0 after every five consecutive 1 bits in the data so that the flag byte `01111110` can be reserved as a unique frame boundary.

#### Blocking IO

An I/O mode in which a system call (such as `recv` or `accept`) suspends the calling thread until the operation can complete or fails. Blocking I/O is the default for sockets.

**Example:** A blocking `recv` on a TCP socket sleeps the thread until data arrives or the connection closes, simplifying logic at the cost of concurrency.

#### Bluetooth

A short-range wireless technology operating in the 2.4 GHz band, designed for low-power personal-area connections such as headphones, keyboards, and IoT sensors.

**Example:** Wireless earbuds use Bluetooth to receive audio from a smartphone over a few meters, trading bandwidth and range for battery efficiency.

#### Bridge

A data link layer device that connects two or more network segments, learning MAC addresses and forwarding frames selectively. Modern Ethernet switches are essentially multiport bridges.

**Example:** A bridge between two Ethernet segments builds a forwarding table by observing source addresses, allowing each segment to remain a separate collision domain.

#### Broadcast

A communication pattern in which a single sender transmits data to all reachable nodes within a network segment using a special broadcast address. Broadcast is bounded to a single broadcast domain.

**Example:** ARP requests are broadcast to the Ethernet address `FF:FF:FF:FF:FF:FF` so that any host in the LAN can answer if it owns the queried IP.

#### Broadcast Domain

The set of network interfaces that will receive a broadcast frame sent from any one of them, typically corresponding to a single VLAN or IP subnet.

**Example:** All hosts in a single VLAN form one broadcast domain, so an ARP request from any host reaches every other host in that VLAN.

#### BSS

A Basic Service Set, the fundamental unit of an 802.11 Wi-Fi network, consisting of an access point and the clients associated with it within its coverage area.

**Example:** A single home access point and the laptops, phones, and smart devices connected to it form one BSS identified by the AP's BSSID (its MAC address).

#### Byte

A group of 8 bits treated as a single unit of storage or transmission. Bytes are the standard unit for measuring file sizes and protocol field lengths above the physical layer.

**Example:** An IPv4 address occupies 4 bytes (32 bits), while an IPv6 address occupies 16 bytes (128 bits).

#### Byte Stuffing

A framing technique that escapes occurrences of reserved framing bytes within data by inserting an escape byte before them, allowing arbitrary data to be transmitted between flags.

**Example:** PPP uses byte stuffing to escape the flag byte `0x7E` inside frames so that the unmodified flag remains a unique boundary marker.

#### Capstone Chat Server

A capstone project in which students implement a multi-client chat server using sockets, exercising concepts such as connection handling, message framing, concurrency, and protocol design.

**Example:** A chat server capstone might require supporting multiple chat rooms, broadcasting messages to clients, and handling disconnections gracefully under concurrent load.

#### Capstone Mini DNS

A capstone project in which students build a simplified DNS resolver or authoritative server, applying concepts of message framing, UDP transport, recursion, and caching.

**Example:** A mini DNS project might implement an iterative resolver that walks the hierarchy from root to authoritative servers and answers basic A and AAAA queries.

#### Capstone Network Design

A capstone project in which students design an end-to-end network for a realistic scenario, including topology, addressing, routing, security, and operational practices, and justify their decisions.

**Example:** Students might design a multi-site enterprise network, producing topology diagrams, IP plans, routing protocol choices, security posture, and a high-level cost estimate.

#### Capstone P2P File Share

A capstone project in which students implement a peer-to-peer file sharing application, applying concepts of overlay networks, NAT traversal, chunking, and integrity verification.

**Example:** A P2P file share capstone might require splitting files into hashed chunks, exchanging availability bitmaps with peers, and verifying integrity on download.

#### Capstone SDN Testbed

A capstone project in which students build or extend an SDN testbed, programming a controller and switches to enforce policies, demonstrating control- and data-plane separation in practice.

**Example:** Using Mininet and an OpenFlow controller, students might implement a learning switch and a basic firewall as controller applications.

#### Cellular Network

A wireless network organized into geographic cells, each served by a base station, that provides mobile voice and data services. Cellular networks support handoff as users move between cells.

**Example:** A smartphone uses a cellular network operated by a carrier such as Verizon or T-Mobile to make calls and access the internet anywhere there is signal.

#### Certificate Authority

A trusted entity that issues and signs digital certificates binding public keys to identities, forming the basis of the public-key infrastructure used by TLS and many other systems.

**Example:** A web server obtains an X.509 certificate from a CA such as Let's Encrypt, which browsers trust because the CA's root key is included in their trust stores.

#### Change Control

A process and policy for proposing, reviewing, scheduling, and tracking changes to network infrastructure, intended to reduce outages caused by uncoordinated modifications.

**Example:** A change control board reviews planned router upgrades before they are applied during an approved maintenance window, with documented backout procedures.

#### Channel Capacity

The maximum theoretical data rate at which information can be transmitted over a channel with arbitrarily small error probability, given its bandwidth and noise characteristics.

**Example:** Shannon's theorem says a 3 kHz telephone channel with 30 dB signal-to-noise ratio has a capacity of about 30 kbps.

#### Checksum

An error-detection value computed from a block of data, typically by summing fields modulo some power of two, that the receiver recomputes and compares. Checksums catch many but not all errors.

**Example:** TCP and UDP use a 16-bit checksum over a pseudo-header and payload to detect corruption introduced anywhere along the path.

#### CIDR Notation

Classless Inter-Domain Routing notation, which writes an IP address followed by a slash and a prefix length to denote a contiguous block of addresses sharing that prefix.

**Example:** The notation 192.0.2.0/24 denotes the block of 256 addresses from 192.0.2.0 through 192.0.2.255 sharing the leading 24-bit prefix.

#### Cipher Suite

A named combination of cryptographic algorithms negotiated during a TLS handshake, specifying key exchange, authentication, bulk encryption, and message authentication code.

**Example:** The cipher suite `TLS_AES_128_GCM_SHA256` combines AES-128-GCM for encryption and SHA-256 for hashing within TLS 1.3.

#### Client

A host that initiates communication with a server to request a service or resource. Clients typically run on demand, choose ephemeral source ports, and connect to a known server address.

**Example:** A mobile email app acts as a client when it connects to an IMAP server to download new messages from the user's inbox.

#### Client Server Model

An architectural pattern in which clients initiate requests and servers respond, with servers typically long-running, addressable, and shared by many clients.

**Example:** Web browsing, email, and database access all follow the client-server model, with browsers, mail clients, and applications acting as clients.

#### Cloud VPC

A Virtual Private Cloud, a logically isolated section of a public cloud provider's network in which a tenant defines IP ranges, subnets, route tables, and gateways for its resources.

**Example:** An AWS VPC lets a customer launch EC2 instances in private subnets with controlled routing to the internet through a NAT gateway and to on-premises networks via VPN or Direct Connect.

#### Coaxial Cable

A cable consisting of a central conductor surrounded by an insulating layer, a braided shield, and an outer jacket. Coax provides good shielding and high bandwidth and is used for cable TV and some legacy networks.

**Example:** Cable internet service delivers signals from the ISP to homes over coaxial cable using DOCSIS modulation.

#### Collision Domain

The set of devices that share a single shared channel and can therefore collide when transmitting at the same time. Switches and full-duplex links shrink collision domains to a single port each.

**Example:** Each port of a modern Ethernet switch operating in full duplex is its own collision domain, so collisions are essentially eliminated.

#### Communication Link

A physical or logical channel that carries signals between two network nodes. Links can be wired (copper, fiber) or wireless (radio, optical) and have characteristic bandwidth, propagation delay, and error rates.

**Example:** A 1 Gbps Ethernet cable between a laptop and a switch is a wired communication link with a maximum transmission rate of one billion bits per second.

#### Computer Network

A collection of interconnected computing devices that exchange data through shared communication links and protocols. Networks span scales from a single room to the global internet and enable resource sharing, communication, and distributed computation.

**Example:** A university campus network connects classroom computers, dormitory laptops, library servers, and Wi-Fi access points so students can access shared printers, course materials, and the internet.

#### Configuration Management

The discipline and tooling for tracking, automating, and auditing the configuration of network devices and hosts so that changes are reproducible and consistent.

**Example:** Tools like Ansible or NAPALM apply versioned configurations to dozens of switches identically, eliminating manual per-device drift.

#### Congestion Avoidance

A TCP congestion-control phase, entered after slow start, in which the congestion window grows roughly linearly (one MSS per RTT) to probe additional capacity gently. Loss triggers a multiplicative decrease.

**Example:** Once a TCP Reno flow exits slow start, its congestion window grows by one segment per RTT during congestion avoidance until a loss event occurs.

#### Congestion Control

A mechanism that adjusts a sender's transmission rate in response to perceived network congestion, aiming to share bandwidth fairly and avoid collapse. TCP's congestion control uses a congestion window and signals like loss or delay.

**Example:** TCP halves its congestion window after detecting a packet loss, slowing the sender so the network can recover from congestion.

#### Connect Operation

The socket call that initiates a transport-layer connection from a client socket to a specified remote endpoint. For TCP this triggers the three-way handshake.

**Example:** An HTTP client calls `connect` to a server's IP and port 443, blocking until the TCP connection is established or the attempt fails.

#### Connection Oriented

A communication style in which two endpoints establish state through a setup phase before data transfer and tear it down afterward, supporting per-flow features like sequencing and flow control.

**Example:** TCP is connection oriented: the three-way handshake establishes sequence numbers and state before any application data flows.

#### Connectionless

A communication style in which each protocol data unit is sent independently with no prior setup or shared per-flow state between sender and receiver. Each unit must carry full addressing.

**Example:** UDP is connectionless, so a DNS client can send a single query datagram without first establishing a session with the resolver.

#### Content Delivery Network

A geographically distributed system of servers that caches and serves content close to end users, reducing latency, bandwidth costs, and origin load.

**Example:** A streaming service uses a CDN like Akamai or Cloudflare so video segments are delivered from a server in the user's region instead of the original origin server.

#### Control Plane

The set of functions in a network device or system responsible for computing forwarding state and policies, such as running routing protocols, reacting to topology changes, and configuring rules.

**Example:** OSPF, BGP, and an SDN controller all live in the control plane, where they decide which routes and rules the data plane should enforce.

#### Cookie

A small piece of state set by a web server using the Set-Cookie header and returned by the browser on subsequent requests, used for session tracking, authentication, and personalization.

**Example:** A site stores a session ID in a cookie after login so it can recognize the same user on subsequent requests without requiring re-authentication.

#### Count To Infinity

A pathology of distance-vector routing in which broken routes are replaced by increasingly higher cost estimates from neighbors, slowly counting upward toward the protocol's "infinity" value.

**Example:** When a router loses a link, distance-vector neighbors may keep advertising stale routes back to it, causing the metric to climb hop by hop until it reaches RIP's value of 16 (infinity).

#### CRC

A Cyclic Redundancy Check, an error-detection code that treats data as the coefficients of a polynomial and computes the remainder when divided by a fixed generator polynomial. CRCs detect virtually all common error patterns.

**Example:** Ethernet's 32-bit CRC at the end of each frame catches single-bit errors, all 2-bit errors, and most longer burst errors with very high probability.

#### Cryptography Basics

The fundamental concepts of cryptography used in networking: confidentiality, integrity, authentication, and non-repudiation, achieved with symmetric and asymmetric algorithms, hash functions, and digital signatures.

**Example:** A TLS connection combines symmetric encryption for bulk data, asymmetric cryptography for key exchange, and hash-based message authentication to deliver these basic guarantees.

#### CSMA

Carrier Sense Multiple Access, a MAC protocol in which a station listens to the channel before transmitting and defers if another station is transmitting. CSMA reduces but does not eliminate collisions.

**Example:** A node using CSMA on a wired bus checks for activity on the medium before sending a frame, avoiding obvious clashes with active transmitters.

#### CSMA CA

CSMA with Collision Avoidance, used in Wi-Fi, where stations cannot reliably detect collisions while transmitting and instead use random backoff and acknowledgments to manage contention.

**Example:** Wi-Fi stations wait for a clear channel plus a random backoff interval before sending and require an ACK from the receiver to confirm success.

#### CSMA CD

CSMA with Collision Detection, used in classic shared Ethernet, where stations listen while transmitting and abort with a jam signal if they detect a collision, then back off randomly.

**Example:** On a 10BASE5 Ethernet bus, two stations transmitting simultaneously would detect the collision via voltage changes and reschedule their transmissions.

#### Data Link Layer

The layer above the physical layer that frames bits into addressable units, controls access to the shared medium, and detects (or sometimes corrects) bit errors on a single link. It uses MAC addresses for local delivery.

**Example:** Ethernet and Wi-Fi both operate at the data link layer, framing data and using MAC addresses to deliver frames across one network segment.

#### Data Plane

The set of functions that move packets through a network device based on state installed by the control plane, including header parsing, table lookups, and packet rewriting.

**Example:** A router's ASIC implements the data plane, looking up destinations in the forwarding table and performing TTL decrement and checksum updates per packet.

#### Datagram

A self-contained, independently routed protocol data unit, typically referring to UDP datagrams at the transport layer or IP datagrams at the network layer. Datagrams carry no state between successive units.

**Example:** A DNS query is sent as a single UDP datagram, and the reply arrives as a separate UDP datagram with no connection in between.

#### DDoS Attack

A Distributed Denial-of-Service attack in which many compromised or coordinating sources send traffic to overwhelm a victim's network, server, or application, denying service to legitimate users.

**Example:** A DDoS attack using thousands of botnet hosts can saturate a target's uplink with junk traffic, knocking the service offline regardless of how well-tuned the application is.

#### Decapsulation

The process by which each layer of a protocol stack removes the header (and trailer) added by the corresponding layer at the sender, then passes the remaining payload up to the next layer. Decapsulation is the inverse of encapsulation.

**Example:** When a frame arrives at a host, the NIC strips the Ethernet header, the OS removes the IP header, the kernel removes the TCP header, and the browser receives the HTTP message.

#### Decoding

The mapping of received signal patterns or symbols back into the original bits, reversing the sender's encoding. Decoding is performed by the receiver after demodulation.

**Example:** An Ethernet receiver decodes the line code on the wire to recover the binary stream that was originally encoded by the sender.

#### Default Route

A special route that matches any destination not covered by a more specific entry, typically written as 0.0.0.0/0 in IPv4 or ::/0 in IPv6. It directs unknown traffic to a designated next hop.

**Example:** A residential router uses 0.0.0.0/0 as the default route pointing to the ISP, sending any non-local destination upstream.

#### Defense In Depth

A security design strategy that uses multiple layered controls (network, host, application, identity, monitoring) so that the failure of any single control does not compromise the system.

**Example:** A defense-in-depth deployment might combine a perimeter firewall, host-based filtering, application authentication, encryption in transit and at rest, and continuous monitoring.

#### Demodulation

The process by which a receiver recovers the original information from a modulated carrier signal, reversing the operations applied by the sender's modulator.

**Example:** A cable modem's demodulator extracts the digital bit stream from the radio-frequency signal carried on the coaxial cable.

#### DHCP

The Dynamic Host Configuration Protocol, an application-layer protocol that automatically assigns IP addresses, subnet masks, default gateways, and DNS servers to hosts joining a network.

**Example:** When a laptop connects to a Wi-Fi network, it broadcasts a DHCP request and receives an IP address lease and configuration parameters from the DHCP server.

#### Differentiated Services

A scalable QoS architecture in which packets are marked at network edges with a Differentiated Services Code Point and treated according to their class at each hop, without per-flow state in the core.

**Example:** A campus network can mark VoIP packets as Expedited Forwarding and bulk traffic as Default, configuring routers to give the EF class priority handling.

#### Digital Signal

A signal that takes one of a finite, discrete set of values at each sampling instant, typically used to represent bits directly. Digital signals tolerate noise better than analog signals because receivers only need to distinguish levels.

**Example:** A binary digital signal alternates between two voltage levels representing 0 and 1, decoded by sampling at the agreed bit rate.

#### Digital Signature

A cryptographic value computed by a private key over a message (or its hash) and verifiable by anyone holding the corresponding public key, providing authenticity and integrity.

**Example:** A software vendor signs a release with its private key so users can verify with the public key that the binary was produced by the vendor and is not modified.

#### Dijkstra Algorithm

A shortest-path algorithm that computes the minimum-cost path from a single source to all other nodes in a graph with non-negative edge weights, used in link-state routing.

**Example:** OSPF runs Dijkstra's algorithm on the link-state database to compute the shortest path tree rooted at each router.

#### Distance Vector Routing

A routing approach in which each router exchanges with neighbors a vector of estimated distances to each destination, iteratively updating its own estimates. RIP is a classic example.

**Example:** In a distance-vector protocol, a router learns it can reach destination X with cost 5 via neighbor A by adding 1 to A's reported cost of 4.

#### DNS

The Domain Name System, a hierarchical, distributed naming system that translates human-readable names like example.com into IP addresses and other resource records.

**Example:** When a user types www.example.com into a browser, DNS resolves the name to an IP address before any TCP connection is opened.

#### DNS Cache Poisoning

An attack that injects forged DNS records into a resolver's cache so that subsequent queries return attacker-controlled answers, redirecting victims to malicious destinations.

**Example:** A successful DNS cache poisoning attack can map a bank's domain name to an attacker's web server for every user of the affected resolver until the TTL expires.

#### DNS Caching

The practice of storing DNS responses for a time bounded by their TTL fields to reduce latency and load on authoritative servers. Both clients and resolvers cache.

**Example:** After a recursive resolver looks up example.com once, it caches the answer for the record's TTL, returning it to subsequent clients without contacting authoritative servers.

#### DNS Hierarchy

The tree-structured naming organization of DNS, with the root at the top, followed by top-level domains, second-level domains, and further subdomains, each delegated authority by its parent.

**Example:** The name www.example.com is read right to left in the DNS hierarchy: root, .com, example.com, then the host www within that zone.

#### DNS Record Type

A category of resource record stored in DNS, such as A (IPv4 address), AAAA (IPv6 address), MX (mail exchanger), CNAME (alias), TXT (text), and NS (name server).

**Example:** A domain's MX record tells senders which mail servers accept email for that domain, while its A and AAAA records map the domain to IP addresses.

#### DNSSEC

DNS Security Extensions, a set of standards that add cryptographic signatures to DNS records so resolvers can verify their authenticity and integrity, defending against forgery and cache poisoning.

**Example:** With DNSSEC, a resolver checks the chain of signatures from the root to a domain's records and rejects any answers that fail validation.

#### Dual Stack

A deployment strategy in which hosts and routers run both IPv4 and IPv6 simultaneously, choosing the appropriate protocol per destination based on DNS and configuration.

**Example:** A dual-stack laptop connects to IPv6 servers using AAAA records and IPv4 servers using A records, all over the same physical network interface.

#### Edge Computing

A computing paradigm that places computation and storage close to data sources or end users, often at the network edge, to reduce latency and bandwidth use compared with central cloud processing.

**Example:** A smart camera using edge computing performs object detection on a local appliance, sending only summary events to the cloud rather than full video.

#### Encapsulation

The process by which each layer of a protocol stack wraps the data unit from the layer above with its own header (and optionally trailer) before passing it down. Encapsulation enforces layer boundaries and supports modular protocol design.

**Example:** A browser's HTTP request is encapsulated by TCP into a segment, then by IP into a packet, then by Ethernet into a frame for transmission.

#### Encoding

The mapping of bits onto signal patterns or symbols suitable for transmission or storage. Encoding choices affect clock recovery, DC balance, error detection, and bandwidth efficiency.

**Example:** Manchester encoding represents each bit as a transition in the middle of the bit interval, ensuring frequent edges for clock recovery.

#### End System

A device at the network edge that runs application-layer software, generating or consuming data rather than merely forwarding it. End systems are the sources and destinations of communication, distinct from intermediate routers and switches.

**Example:** A web browser running on a desktop computer is an end system; the routers between it and the web server are not.

#### End To End Principle

A design guideline stating that functions requiring knowledge of an application should be implemented at the endpoints rather than in the network core, which should remain simple and general. The principle has shaped the internet's architecture.

**Example:** Reliable byte-stream delivery is provided by TCP at the endpoints rather than by routers, keeping the IP core simple and stateless.

#### Epoll And Kqueue

OS-specific event-notification interfaces (`epoll` on Linux, `kqueue` on BSD/macOS) that scale to large numbers of file descriptors by maintaining persistent interest sets in the kernel.

**Example:** A high-performance web server uses `epoll` to handle tens of thousands of concurrent connections in a single thread without per-call O(n) costs.

#### ESS

An Extended Service Set, a set of multiple BSSs sharing the same SSID and connected via a distribution system, allowing clients to roam between access points.

**Example:** A university campus with dozens of access points all advertising the SSID `Campus-WiFi` forms a single ESS, letting students walk between buildings without disconnecting.

#### Ethernet

A family of IEEE 802.3 wired LAN technologies that frame data using a common header format and use copper or fiber media at speeds from 10 Mbps to 400 Gbps and beyond.

**Example:** A modern office desk computer typically connects to a switch via a Cat 6 cable running 1 Gbps Ethernet according to IEEE 802.3.

#### Ethernet Frame

The protocol data unit of Ethernet, including a preamble, source and destination MAC addresses, an EtherType or length field, payload, and a 32-bit CRC trailer.

**Example:** A typical Ethernet frame carrying an IPv4 packet has a 14-byte header, up to 1500 bytes of payload, and a 4-byte CRC trailer.

#### Ethernet Switch

A multiport data link layer device that forwards Ethernet frames between ports based on learned MAC address tables, replacing the broadcast behavior of a hub with selective unicast forwarding.

**Example:** A 48-port enterprise Ethernet switch forwards frames only to the port behind the destination MAC address, isolating collision domains and reducing broadcast traffic.

#### Fair Queuing

A scheduling discipline that maintains a separate queue per flow and serves them in a round-robin fashion (often weighted), ensuring each flow gets a fair share of link capacity.

**Example:** Weighted fair queuing on a router prevents a single bulk download from starving interactive flows like SSH and voice traffic.

#### Fast Recovery

A TCP congestion-control technique that follows fast retransmit by reducing the congestion window and continuing in congestion avoidance instead of returning to slow start, exploiting that the network is still delivering data.

**Example:** TCP Reno enters fast recovery after fast retransmit, halving cwnd and inflating it temporarily by the number of duplicate ACKs received.

#### Fast Retransmit

A TCP mechanism that retransmits a missing segment after receiving three duplicate acknowledgments, without waiting for the retransmission timer to expire. It speeds recovery from isolated losses.

**Example:** When a TCP sender receives three duplicate ACKs for byte 10000, fast retransmit immediately resends the segment starting at byte 10000.

#### Fiber Optic Cable

A cable that carries information as light pulses along glass or plastic fibers, offering very high bandwidth, low attenuation, and immunity to electromagnetic interference. Fiber dominates long-distance and backbone links.

**Example:** Transoceanic submarine cables use bundles of fiber optic strands that each carry many wavelengths, totaling terabits per second.

#### Firewall

A network security device or software that filters traffic between zones according to a configured policy, allowing or denying packets based on addresses, ports, protocols, and sometimes deeper inspection.

**Example:** An enterprise edge firewall blocks all inbound traffic except specific ports such as 80 and 443 directed at designated public servers.

#### Flow Control

A mechanism that prevents a sender from overwhelming a receiver's buffer space, typically by having the receiver advertise its current available buffer size. TCP uses a sliding receive window for flow control.

**Example:** When a slow disk causes a TCP receiver's buffer to fill, it advertises a smaller window so the sender pauses transmission until space is freed.

#### Fog Computing

An extension of edge computing in which a hierarchy of compute resources between end devices and the central cloud (often at gateways and aggregation points) cooperatively process data.

**Example:** In a smart city deployment, fog computing nodes at traffic intersections aggregate sensor data and run local analytics before forwarding summarized results to the cloud.

#### Forward Error Correction

A coding technique in which the sender adds redundancy that allows the receiver to correct a bounded number of errors without retransmission. FEC is essential when retransmission is impractical.

**Example:** Deep-space probes use Reed-Solomon and turbo codes as forward error correction so that data can be recovered despite weak signals and long delays.

#### Forwarding

The router-local action of moving a single packet from an input port to the appropriate output port based on its forwarding table. Forwarding is fast and per-packet.

**Example:** A router forwards an arriving packet by looking up its destination in the forwarding information base and sending it out the matching interface.

#### Forwarding Table

A data structure on a router or switch that maps destinations (or destination prefixes) to outgoing interfaces and next-hop information. The forwarding table is consulted for every packet.

**Example:** A small router's forwarding table might list a default route via the ISP plus several specific routes for internal subnets reached through other interfaces.

#### Fragmentation

The process by which a router or sender splits an IP packet into smaller pieces to fit within the MTU of the next link. Each fragment is independently routed and reassembled at the destination.

**Example:** An IPv4 router forwarding a 4000-byte packet onto a link with 1500-byte MTU can fragment it into three smaller IP packets sharing the same identification.

#### Frame

The protocol data unit at the data link layer, consisting of a header, payload, and often a trailer. Frames are addressed using MAC addresses and are the units that travel over a single physical link.

**Example:** An Ethernet frame carries an IP packet inside its payload along with source and destination MAC addresses and a CRC trailer.

#### Framing

The data link layer mechanism that delineates the start and end of each frame in a continuous stream of bits, enabling the receiver to identify frame boundaries.

**Example:** Ethernet uses a fixed preamble and a start-of-frame delimiter to mark the beginning of each frame, plus a length or type field to find its end.

#### FTP

The File Transfer Protocol, an application-layer protocol for transferring files between hosts using separate control and data TCP connections. FTP is largely superseded by SFTP and HTTPS for security reasons.

**Example:** A legacy build system may still publish artifacts using `ftp.example.com`, with credentials and data transmitted in cleartext unless wrapped in TLS.

#### 4G LTE

The fourth-generation cellular standard known as Long-Term Evolution, providing IP-based packet-switched mobile broadband with peak data rates in the hundreds of megabits per second.

**Example:** A modern phone falling back from 5G typically uses 4G LTE to stream video and run apps with bandwidth around 10 to 100 Mbps in real-world conditions.

#### 5G NR

Fifth-generation New Radio, the cellular standard succeeding LTE, offering higher peak rates, lower latency, support for massive numbers of devices, and use of millimeter-wave bands.

**Example:** 5G NR can deliver multi-gigabit downlink speeds to phones near a millimeter-wave small cell, enabling new applications such as fixed wireless access.

#### Go Back N

A sliding-window ARQ protocol in which the receiver discards out-of-order frames and the sender retransmits the lost frame and all subsequent in-flight frames after a timeout.

**Example:** If frame 5 is lost in a Go-Back-N protocol with window 7, the sender retransmits 5, 6, and 7 after the timer expires, even if 6 and 7 arrived correctly.

#### Goodput

The rate at which useful application-level data is delivered, excluding protocol overhead, retransmissions, and duplicate bytes. Goodput is what end users actually experience.

**Example:** A file transfer with a measured throughput of 100 Mbps might have a goodput of only 90 Mbps once TCP, IP, and Ethernet headers are excluded.

#### GRPC

A high-performance remote procedure call framework developed by Google that uses Protocol Buffers for message encoding and HTTP/2 (or HTTP/3) for transport, supporting streaming and strongly typed service definitions.

**Example:** A microservice written in Go can call a Python service using gRPC, with both sides generated from a shared `.proto` definition.

#### Handoff

The process by which a mobile device transfers its association from one base station or access point to another as it moves, ideally without dropping ongoing sessions.

**Example:** A passenger on a moving train experiences a chain of handoffs as their phone hops between cellular base stations along the route.

#### Hash Function

A deterministic function that maps an input of arbitrary length to a fixed-length output, designed to be one-way and collision-resistant. Cryptographic hashes underpin signatures and integrity checks.

**Example:** SHA-256 produces a 256-bit hash used to fingerprint TLS certificates, sign software releases, and detect tampering of files.

#### Header

The leading portion of a protocol data unit that carries control information such as addresses, lengths, sequence numbers, and type fields. Headers tell the receiver how to interpret and route the payload.

**Example:** The IPv4 header includes source IP, destination IP, time-to-live, protocol number, and a checksum, totaling at least 20 bytes.

#### Host

Any device with a network interface and an assigned network address that can originate or receive traffic. Hosts include end-user computers, servers, smartphones, and embedded devices, but typically exclude purely intermediate devices like routers.

**Example:** A laptop with IP address 192.168.1.42 is a host on a home network and can run both client and server software.

#### HTTP Headers

Name-value metadata fields in HTTP requests and responses that describe the message, the resource, the client, the server, caching, content negotiation, authentication, and more.

**Example:** A browser may send `Accept-Language: en-US` and the server may reply with `Content-Type: text/html` and `Cache-Control: max-age=600`.

#### HTTP Methods

The verbs in HTTP requests that indicate the desired action on a resource, including GET, POST, PUT, DELETE, HEAD, OPTIONS, and PATCH. Methods convey semantics about safety and idempotence.

**Example:** GET retrieves a resource without side effects, while POST submits data that may create or modify resources on the server.

#### HTTP One One

HTTP/1.1, the long-dominant version of HTTP, introducing persistent connections, pipelining, host-based virtual hosting, and chunked transfer encoding over TCP.

**Example:** A browser using HTTP/1.1 may keep a TCP connection open and reuse it for several sequential requests to the same server.

#### HTTP Protocol

The Hypertext Transfer Protocol, the application-layer protocol used to fetch web resources. HTTP uses a request-response model over a transport connection, with methods, status codes, and headers.

**Example:** A browser issues an HTTP GET request for /index.html, and the server replies with a status line, headers, and the HTML body.

#### HTTP Status Code

A three-digit numeric code returned in HTTP responses indicating the result class (1xx informational, 2xx success, 3xx redirection, 4xx client error, 5xx server error).

**Example:** Status code 200 means OK, 301 means permanent redirect, 404 means not found, and 500 means internal server error.

#### HTTP Three

HTTP/3, the version of HTTP that runs over QUIC instead of TCP, eliminating cross-stream head-of-line blocking and providing faster connection setup with built-in encryption.

**Example:** A mobile user on a lossy network often perceives HTTP/3 page loads as faster than HTTP/2 because a single packet loss no longer stalls all streams.

#### HTTP Two

HTTP/2, a major revision that introduces binary framing, multiplexed streams over a single TCP connection, header compression (HPACK), and server push, reducing latency for complex pages.

**Example:** With HTTP/2, dozens of concurrent requests for images, scripts, and stylesheets share one TCP connection without the head-of-line blocking of HTTP/1.1 pipelining.

#### HTTPS

HTTP layered over TLS, providing confidentiality, integrity, and authentication for web traffic. HTTPS is the default protocol for modern web browsing.

**Example:** A URL beginning with https:// indicates that the connection uses TLS over TCP (or QUIC) so the data and the URL path are encrypted in transit.

#### Hub

A legacy physical-layer device that repeats incoming bits out all other ports, forming a single shared collision domain. Hubs have been almost entirely replaced by switches.

**Example:** A 10BASE-T hub from the 1990s broadcast every frame to all attached stations, forcing CSMA/CD on a single shared channel.

#### Hybrid Cloud Network

A network architecture that connects on-premises infrastructure with one or more public clouds so workloads and data can move and integrate across them with consistent addressing and policy.

**Example:** A bank running core systems on-premises and analytics in a public cloud uses a hybrid cloud network with private interconnect and shared identity to keep data flows secure.

#### ICANN

The Internet Corporation for Assigned Names and Numbers, a nonprofit that coordinates global allocation of IP address blocks, top-level domain names, and protocol parameter registries. ICANN delegates much routine work to regional registries.

**Example:** ICANN approves new top-level domains like `.app` and oversees the policies under which domain registrars sell second-level names.

#### ICMP

The Internet Control Message Protocol, a network-layer companion to IP that carries error reports and diagnostic messages such as destination unreachable and echo requests.

**Example:** When a router cannot deliver a packet because the destination host is unreachable, it sends an ICMP Destination Unreachable message back to the source.

#### IEEE Standard

A specification published by the Institute of Electrical and Electronics Engineers, often defining physical and data link layer technologies. IEEE standards are widely adopted in networking, especially for local-area technologies.

**Example:** IEEE 802.11 defines Wi-Fi wireless LAN protocols, while IEEE 802.3 defines wired Ethernet.

#### IETF

The Internet Engineering Task Force, an open international community that develops and publishes voluntary internet standards through working groups and the RFC publication process. The IETF focuses on protocols above the link layer.

**Example:** The IETF developed TCP, IP, HTTP, and TLS, with each protocol specified in one or more RFCs.

#### IMAP

The Internet Message Access Protocol, an application-layer protocol that allows email clients to access and manipulate messages on a mail server, keeping messages stored on the server with multi-folder support.

**Example:** A user reading the same inbox from a phone and a laptop benefits from IMAP because the server is the source of truth and changes sync across clients.

#### In Band Signaling

The practice of carrying control information in the same channel as user data, often by reserving special values or sequences. In-band signaling is simple but can be exploited by malicious payloads.

**Example:** Early telephone systems used in-band tones in the voice channel for switching, which led to abuse by phreakers using whistles.

#### Incident Postmortem

A structured retrospective document produced after a network or service incident that captures timeline, impact, root cause, contributing factors, and follow-up actions, with an emphasis on learning rather than blame.

**Example:** A postmortem after an outage might trace the failure to a faulty BGP filter change, identify monitoring gaps, and assign owners to remediation actions with deadlines.

#### Integrated Services

A QoS architecture that uses signaling such as RSVP to reserve per-flow resources at every router along a path, providing strong guarantees but with limited scalability.

**Example:** Integrated Services with RSVP was envisioned for guaranteeing bandwidth to individual video flows but proved difficult to deploy at internet scale.

#### Interdomain Routing

Routing between autonomous systems across the internet, governed by policy and commercial relationships rather than strict optimality. BGP is the dominant interdomain protocol.

**Example:** Interdomain routing decisions reflect peering agreements, transit contracts, and traffic engineering, not just shortest hop count.

#### Interference

Unwanted signals from other sources that overlap a desired signal in time, frequency, or space, causing decoding errors. Interference can be co-channel, adjacent-channel, or from external emitters.

**Example:** A microwave oven leaking energy at 2.4 GHz can cause Wi-Fi interference and significant packet loss in a nearby home network.

#### Internet Topology

The structure of how networks, ASes, and links interconnect across the internet, including hierarchies, peering exchanges, and content delivery infrastructure.

**Example:** Internet topology studies show the network is roughly hierarchical, with content providers, Tier 1 ISPs, regional ISPs, and access networks forming distinct layers.

#### Intradomain Routing

Routing within a single autonomous system, typically using a protocol like OSPF or IS-IS that optimizes for shortest paths within a trusted administrative boundary.

**Example:** A university uses an intradomain routing protocol such as OSPF among its campus routers, while using BGP only at its edge to talk to ISPs.

#### Intrusion Detection

A passive security monitoring system that inspects traffic, logs, or host activity for signs of malicious behavior and generates alerts, without actively blocking. Network and host variants exist.

**Example:** A network IDS such as Suricata watches mirrored traffic on a span port and alerts when it sees a known exploit pattern, leaving response to human operators.

#### Intrusion Prevention

An active security system that, like an IDS, detects malicious activity but is also placed inline so it can drop or modify offending traffic in real time.

**Example:** An inline IPS appliance can detect and immediately block a known SQL injection pattern in HTTP traffic before it reaches the web server.

#### IP Address

A numeric identifier assigned to a network interface for use at the Internet Protocol layer, written as four octets in IPv4 (e.g., 192.0.2.1) or eight 16-bit groups in IPv6. IP addresses identify hosts logically across internetworks.

**Example:** The address 142.250.80.46 identifies a Google web server that browsers can reach via the public internet.

#### Iperf

A tool for measuring achievable TCP and UDP throughput between two hosts by generating controlled traffic and reporting results, widely used to benchmark links and tune stacks.

**Example:** Running `iperf3 -s` on one host and `iperf3 -c server` on another reports the bandwidth, jitter, and loss observed between them.

#### IPsec

Internet Protocol Security, a suite of network-layer protocols that authenticates and optionally encrypts IP packets, used to build site-to-site VPNs and secure host-to-host tunnels.

**Example:** Two corporate offices link their networks with an IPsec tunnel so packets between them are encrypted as they traverse the public internet.

#### IPv4

Internet Protocol version 4, the original widely deployed Internet Protocol, using 32-bit addresses and providing connectionless, best-effort packet delivery across internetworks.

**Example:** The address 192.0.2.10 is an IPv4 address, written as four 8-bit decimal octets separated by dots.

#### IPv4 Address Class

A historical classification (A, B, C, D, E) of IPv4 addresses by leading bits, defining default network and host portions. Classful addressing has been replaced by CIDR but the terminology persists.

**Example:** Class A used the first 8 bits as the network prefix, Class B the first 16, and Class C the first 24, which proved too coarse for modern allocation.

#### IPv4 Address Format

The dotted-decimal notation in which a 32-bit IPv4 address is written as four decimal numbers from 0 to 255 separated by periods. Each decimal corresponds to one byte of the address.

**Example:** The address 203.0.113.45 is the IPv4 address whose binary form starts with 11001011 00000000 01110001 00101101.

#### IPv4 Header

The IPv4 packet header, normally 20 bytes long, containing fields such as version, IHL, total length, identification, flags, fragment offset, time-to-live, protocol, header checksum, and source and destination addresses.

**Example:** The TTL field in the IPv4 header is decremented at each router and prevents packets from looping forever in the network.

#### IPv4 IPv6 Transition

The set of mechanisms used to support coexistence and migration between IPv4 and IPv6 networks, including dual stack, tunneling, and translation. Transition allows incremental deployment of IPv6.

**Example:** During the long transition period, an ISP may run dual stack on its core, tunnel IPv6 over IPv4 in some segments, and translate at edges that still expect IPv4.

#### IPv6

Internet Protocol version 6, the successor to IPv4, using 128-bit addresses, a simplified header, and improved support for autoconfiguration and security. IPv6 was designed to eliminate IPv4 address exhaustion.

**Example:** The address 2001:db8::1 is an IPv6 address; its 128-bit space is large enough to assign unique addresses to many devices per square meter of Earth.

#### IPv6 Address Format

The textual representation of a 128-bit IPv6 address as eight 16-bit hexadecimal groups separated by colons, with consecutive zero groups optionally compressed using a single double-colon.

**Example:** The address 2001:0db8:0000:0000:0000:0000:0000:0001 can be compressed to 2001:db8::1.

#### IPv6 Address Type

The category of an IPv6 address based on scope and purpose, including global unicast, link-local, unique local, multicast, and loopback. The leading bits identify the type.

**Example:** Addresses starting with `fe80::/10` are link-local IPv6 addresses, valid only on a single link and used for neighbor discovery.

#### IPv6 Autoconfiguration

A mechanism by which IPv6 hosts automatically derive addresses and other parameters, often using router advertisements (SLAAC) and an interface identifier. It reduces dependence on manual configuration or DHCP.

**Example:** When a laptop joins an IPv6 network, it can build an address by combining the prefix advertised by the router with a 64-bit interface identifier.

#### IPv6 Header

The fixed 40-byte IPv6 header containing version, traffic class, flow label, payload length, next header, hop limit, and 128-bit source and destination addresses, with optional extension headers chained after it.

**Example:** A router examines only the IPv6 header's hop limit and destination address when forwarding, ignoring extension headers that are processed by endpoints.

#### ISO

The International Organization for Standardization, a global federation of national standards bodies that publishes standards across many fields. In networking, ISO is best known for the OSI Reference Model.

**Example:** ISO/IEC 7498-1 defines the seven-layer OSI Reference Model used as a teaching framework for network architecture.

#### Jitter

The variation in delay experienced by successive packets along a path, often computed as the standard deviation of inter-arrival times. Jitter degrades real-time applications even when average delay is low.

**Example:** A voice-over-IP call may sound choppy when network jitter exceeds the receiver's playout buffer, causing missed packets.

#### Karn Algorithm

An algorithm in TCP that excludes round-trip-time samples for retransmitted segments from RTT estimation and doubles the timeout on retransmission, avoiding ambiguity about which transmission was acknowledged.

**Example:** Karn's algorithm prevents a TCP sender from underestimating RTT after retransmissions caused by transient congestion, stabilizing its retransmission timer.

#### Latency

The time required for a single unit of data to travel from sender to receiver, often measured one-way or as round-trip time. Latency is the sum of propagation, transmission, queuing, and processing delays.

**Example:** A user in California pinging a server in Europe might see latency of about 150 milliseconds round-trip due mostly to propagation across the Atlantic.

#### Layered Architecture

A design principle in which network functionality is organized into stacked layers, each providing services to the layer above and using services from the layer below. Layering hides complexity and allows independent evolution of components.

**Example:** Replacing copper Ethernet with fiber changes the physical layer without affecting how TCP, IP, or HTTP behave above it.

#### Leaky Bucket

A traffic-shaping mechanism modeled as a bucket with a fixed-rate leak, in which arriving packets are queued and forwarded at the leak rate; overflow drops them. It produces a smooth, constant output rate.

**Example:** A leaky bucket policer at a router edge enforces a 2 Mbps output regardless of arrival burstiness, dropping or delaying excess packets.

#### Learning Switch

An Ethernet switch that automatically populates its forwarding table by observing the source MAC address and ingress port of each received frame. Unknown destinations are flooded to all ports except the source.

**Example:** When a new device connects to a learning switch, it sends one frame and the switch immediately learns its location for future deliveries.

#### Link Adaptation

The dynamic adjustment of modulation, coding, and transmission parameters based on observed channel quality, used in cellular and Wi-Fi to maintain reliability while maximizing throughput.

**Example:** When a Wi-Fi client moves away from its access point, link adaptation lowers the modulation rate to keep packets decodable at the cost of throughput.

#### Link Aggregation

The IEEE 802.1AX technique of bundling multiple physical links between two devices into a single logical link to increase bandwidth and provide redundancy.

**Example:** Two 10 Gbps links between a server and a switch can be combined with LACP into a 20 Gbps logical link that survives the loss of either physical cable.

#### Link State Routing

A routing approach in which each router floods information about its directly connected links to all other routers, and each router independently computes shortest paths over the resulting topology graph. OSPF is the canonical example.

**Example:** In link-state routing, every router has the same map of the network and runs Dijkstra's algorithm locally to choose its own shortest paths.

#### Linux Bridge

A software layer-2 switch implemented in the Linux kernel that connects multiple network interfaces, performing MAC learning and frame forwarding among them.

**Example:** A virtualization host attaches each VM's virtual interface to a Linux bridge so the VMs share a single layer-2 segment with the physical network.

#### Listen Operation

The socket call that marks a TCP socket as passive, willing to accept incoming connections, and configures the kernel's backlog of pending connection requests.

**Example:** After `bind`, a server calls `listen(sockfd, 128)` to indicate readiness to accept connections, with up to 128 pending in the queue.

#### Longest Prefix Match

The forwarding rule that, among all routes whose prefix matches a destination address, selects the route with the longest prefix length. It enables hierarchical routing with overlapping aggregates.

**Example:** A router with routes 10.0.0.0/8 and 10.1.2.0/24 forwards a packet to 10.1.2.5 using the /24 entry because it is the longest matching prefix.

#### Loopback Address

The IPv4 address 127.0.0.1 (and the entire 127.0.0.0/8 block) used by a host to refer to itself for local network communication. The IPv6 equivalent is ::1.

**Example:** A developer running a web server locally can reach it at http://127.0.0.1:8080 without using any external network.

#### Low Latency Networking

A set of design and operational practices aimed at minimizing end-to-end delay for time-sensitive applications, including careful queuing, hardware acceleration, and proximity placement.

**Example:** High-frequency trading firms use low-latency networking with kernel bypass, FPGA NICs, and colocation in exchanges to shave microseconds off order paths.

#### MAC Address

A 48-bit hardware identifier assigned to a network interface for use at the data link layer, usually written as six hexadecimal pairs. MAC stands for Media Access Control, and the address is normally globally unique.

**Example:** The MAC address `00:1A:2B:3C:4D:5E` identifies a specific Ethernet card and is used by switches to forward frames within a LAN.

#### Man In The Middle

An attack in which an adversary positions itself between two communicating parties and intercepts, alters, or relays their messages while each side believes it is talking to the other.

**Example:** An attacker on an open Wi-Fi network can perform a man-in-the-middle attack by impersonating the gateway and forwarding (or modifying) traffic to and from clients.

#### Manchester Encoding

A line code in which each bit is represented by a transition in the middle of the bit period: a high-to-low or low-to-high edge. It guarantees clock recovery but doubles the required bandwidth.

**Example:** 10BASE-T Ethernet used Manchester encoding so receivers could lock onto the clock without a separate clock signal.

#### Media Access Control

The data link sublayer responsible for coordinating access to a shared medium so multiple stations can transmit without persistent collisions. MAC protocols include random access, controlled access, and channel partitioning.

**Example:** Ethernet's CSMA/CD and Wi-Fi's CSMA/CA are both media access control protocols designed for shared physical channels.

#### Message

The protocol data unit at the application layer, representing a complete logical exchange such as an HTTP request or an email body. Messages may be split across multiple transport-layer segments during transmission.

**Example:** An HTTP response message containing an HTML page may be carried by several TCP segments before being reassembled by the browser.

#### Mobile IP

A network-layer protocol that allows a host to keep its IP address while moving between networks, using a home agent and (optionally) a foreign agent to forward traffic.

**Example:** A laptop using Mobile IP can move between Wi-Fi networks at home and work while keeping the same IP-level identity for ongoing connections.

#### Modulation

The process of varying properties of a carrier signal, such as amplitude, frequency, or phase, to encode digital information for transmission over a physical medium.

**Example:** Wi-Fi uses orthogonal frequency-division multiplexing with quadrature amplitude modulation to pack many bits into each radio symbol.

#### MTU

The Maximum Transmission Unit, the largest payload size in bytes that a link layer can carry in a single frame. Packets larger than the path MTU must be fragmented or dropped.

**Example:** Ethernet has a default MTU of 1500 bytes, so IP packets above that size are fragmented or rejected when egressing an Ethernet interface.

#### Multicast

A communication pattern in which a single sender transmits data to a group of interested receivers using a group address. Multicast saves bandwidth when many receivers want the same data.

**Example:** IPTV providers use IP multicast so a single video stream can be distributed efficiently to many subscribers on a network.

#### Multicast Routing

The set of techniques and protocols, such as PIM, used to build distribution trees that deliver multicast traffic from sources to interested receivers efficiently across multiple networks.

**Example:** A live video conference using IP multicast relies on multicast routing protocols to construct delivery trees that fan out only where receivers exist.

#### Multipath TCP

An extension to TCP that allows a single logical connection to use multiple paths simultaneously by establishing additional subflows, increasing throughput and resilience.

**Example:** A smartphone using Multipath TCP can transmit data over both Wi-Fi and cellular at the same time, switching seamlessly if one path fails.

#### Nagle Algorithm

A TCP technique that buffers small writes to coalesce them into fewer, larger segments by delaying transmission while there is unacknowledged outstanding data, reducing the number of small packets on the network.

**Example:** Without Nagle's algorithm, an SSH session typing one character at a time would send a near-empty TCP segment per keystroke; with it, several keystrokes can be combined.

#### NAT

Network Address Translation, a technique in which a device rewrites IP addresses (and often ports) in packet headers as they cross a boundary, typically mapping many private addresses to one or a few public addresses.

**Example:** A home router performs NAT so that all devices behind it appear to the internet as a single public IPv4 address.

#### NAT Traversal

The set of techniques that allow peer-to-peer applications to establish connections across NAT boundaries, despite the difficulty of receiving unsolicited inbound traffic at endpoints behind NAT.

**Example:** WebRTC uses NAT traversal techniques like ICE to let two browsers behind home routers establish a direct media connection.

#### NAT64

A translation mechanism that enables IPv6-only clients to communicate with IPv4-only servers by mapping IPv4 addresses into a designated IPv6 prefix and rewriting headers.

**Example:** A mobile carrier with an IPv6-only access network uses NAT64 to let phones reach legacy IPv4 web servers without giving each phone an IPv4 address.

#### NDP

The Neighbor Discovery Protocol, used in IPv6 networks for functions such as address resolution, router discovery, and detecting unreachable neighbors. NDP replaces ARP and parts of ICMP from IPv4.

**Example:** An IPv6 host uses NDP Neighbor Solicitation messages to learn the link-layer address of a peer on the same link before sending packets to it.

#### Net Neutrality

The principle that networks should treat all traffic equally without favoring or discriminating among applications, content, or sources. It is both a technical and a policy concept.

**Example:** Under net neutrality, an ISP would not be allowed to slow down a competing video service while delivering its own service at full speed.

#### Network Benchmarking

The process of measuring network performance characteristics such as throughput, latency, jitter, and loss under controlled conditions, typically using standardized tools and methodologies.

**Example:** Benchmarking a new data-center fabric with iperf3, ping, and netperf across many host pairs validates that it meets target throughput and latency before production rollout.

#### Network Core

The interconnected mesh of high-capacity routers and links that carries traffic between access networks across regional, national, and global distances. The core focuses on fast forwarding rather than user-facing services.

**Example:** Traffic from a laptop in Boston to a server in Tokyo traverses backbone routers operated by Tier 1 ISPs that form the network core.

#### Network Edge

The portion of a network where end systems connect to access networks, including home routers, enterprise switches, and wireless access points. Edge devices form the boundary between user-facing networks and the network core.

**Example:** A home Wi-Fi router sitting between a laptop and the ISP's modem is part of the network edge.

#### Network Function Virtualization

The practice of running network functions such as firewalls, load balancers, and routers as software on commodity servers instead of in dedicated appliances, enabling flexible deployment and orchestration.

**Example:** A telecom operator uses NFV to deploy virtual firewalls and intrusion detection as VMs or containers on standard servers in its data centers.

#### Network Interface

The hardware and software component on a host that connects it to a communication link, including a network interface card (NIC) and its driver. Each interface typically has its own MAC address and one or more IP addresses.

**Example:** On Linux the command `ip addr` lists interfaces such as `eth0` (wired) and `wlan0` (wireless), each with distinct hardware and network addresses.

#### Network Layer

The layer responsible for forwarding packets across multiple links from a source host to a destination host, possibly across many networks. It uses logical addresses (IP addresses) and routing decisions made by routers.

**Example:** When a packet travels from a laptop in New York to a server in Singapore, the network layer chooses each next hop based on routing tables.

#### Network Logging

The collection of structured event records from network devices and software (interfaces, firewalls, DNS, proxies) for diagnostics, audit, and security analysis.

**Example:** Centralized syslog collection from routers and firewalls enables operators to correlate interface flaps, ACL drops, and authentication failures across an enterprise.

#### Network Namespace

A Linux kernel feature that gives a process its own view of network devices, addresses, routing tables, and firewall rules, isolating networking from other namespaces on the same host.

**Example:** Container runtimes use network namespaces so each container has its own loopback interface, IP addresses, and routing table independent of the host.

#### Network Node

Any addressable device that participates in a network, including hosts, routers, switches, and access points. The term is intentionally broad and includes both end systems and intermediate forwarding devices.

**Example:** In a diagram of a small office network, every PC, printer, switch, and router is drawn as a node connected by links.

#### Noise

Random or unwanted variations added to a signal during transmission, originating from thermal effects, electromagnetic interference, or other sources. Noise sets the lower bound on detectable signal strength.

**Example:** Thermal noise in a wireless receiver determines the minimum signal-to-noise ratio at which a Wi-Fi link can still decode frames correctly.

#### Non Blocking IO

An I/O mode in which a system call returns immediately, with an indicator (such as `EAGAIN`) when the operation cannot proceed. The application is expected to retry later, often using readiness notifications.

**Example:** A non-blocking `recv` on an empty socket returns `-1` with `errno = EWOULDBLOCK`, allowing the program to do other work or wait via `epoll`.

#### NRZ Encoding

Non-Return-to-Zero encoding represents bits by holding distinct voltage levels for the entire bit period without returning to a reference level between bits. NRZ is bandwidth-efficient but can lose clock synchronization on long runs of identical bits.

**Example:** Many high-speed serial links use NRZ variants combined with scrambling or 8b/10b coding to preserve clock recovery.

#### NTP

The Network Time Protocol, an application-layer protocol that synchronizes clocks across networked devices to within milliseconds of UTC by exchanging timestamped packets with stratum-organized servers.

**Example:** A laptop running NTP keeps its clock aligned with public time servers like time.google.com, which is essential for correct logs and TLS certificate validation.

#### OpenFlow

An early SDN southbound protocol that lets a controller install per-flow rules in switches' data planes, defining how packets matching specific header fields should be forwarded or modified.

**Example:** An OpenFlow controller can install a rule that matches all TCP traffic destined for port 80 and forwards it through a particular output port for inspection.

#### OSI Reference Model

A seven-layer conceptual framework defined by ISO that describes how distinct network functions interact: Physical, Data Link, Network, Transport, Session, Presentation, and Application. The OSI model is used primarily for teaching and terminology.

**Example:** When discussing whether a function belongs to routing or to applications, engineers often refer to OSI layers as a shared vocabulary.

#### OSPF Protocol

Open Shortest Path First, a link-state intradomain routing protocol standardized by the IETF that supports hierarchical areas and is widely used inside enterprise and ISP networks.

**Example:** A medium-sized enterprise might run OSPF in a single area for simplicity, with all routers sharing a complete link-state database.

#### Out Of Band Signaling

The practice of carrying control information on a channel separate from user data, improving security and clarity at the cost of additional infrastructure.

**Example:** SS7 in modern telephony uses a dedicated signaling network, separate from voice channels, to set up and tear down calls.

#### Overlay Network

A logical network built on top of an existing physical network using encapsulation, providing services such as multi-tenant isolation or virtual L2 over L3.

**Example:** Cloud platforms create overlay networks per tenant, encapsulating each tenant's traffic in tunnels so they share the underlying physical fabric without interfering.

#### Packet

The protocol data unit at the network layer, containing a network-layer header (such as IPv4) and a payload. Packets are routed end-to-end across multiple links and are independently addressable.

**Example:** When a browser fetches a web page, the request travels in IP packets that may take different routes across the internet.

#### Packet Capture

The process of recording network packets passing through an interface for later analysis, typically using libpcap and saving to .pcap or .pcapng files.

**Example:** Storing a packet capture during an outage allows engineers to replay it later in Wireshark to identify retransmissions, resets, or malformed messages.

#### Packet Loss

The fraction of packets sent that fail to reach the destination, due to errors, congestion drops, or buffer overflows. Even small loss rates can drastically reduce TCP throughput on long paths.

**Example:** A Wi-Fi link with 1% packet loss may cut a TCP file transfer's throughput by an order of magnitude on a high-RTT path.

#### Parity Check

An error-detection technique that adds a single bit to a group of data bits to make the count of 1 bits even (even parity) or odd (odd parity). Parity detects single-bit errors but cannot correct them.

**Example:** Old asynchronous serial links sometimes added an even parity bit per byte, allowing the receiver to detect any single bit flip during transmission.

#### Path Vector Routing

A routing approach in which each route advertisement includes the full path of autonomous systems traversed, allowing routers to detect loops and apply policy decisions.

**Example:** BGP is a path-vector protocol; each prefix announcement carries an AS_PATH listing the autonomous systems through which the route propagated.

#### Payload

The data carried by a protocol data unit, distinct from its header and trailer. The payload of one protocol layer is typically the entire protocol data unit (header plus payload) of the layer above.

**Example:** The payload of an IP packet is a TCP or UDP segment, which itself contains application data such as an HTTP request as its payload.

#### Peer To Peer Model

An architectural pattern in which participants act as both clients and servers, sharing resources directly with one another without a central server. Peer-to-peer systems can be more resilient and scalable for some workloads.

**Example:** BitTorrent uses a peer-to-peer model in which each downloader also uploads to other peers, distributing load away from a single source.

#### Peering

A bilateral agreement under which two networks exchange traffic between their respective customers directly, often without monetary settlement, typically at internet exchange points.

**Example:** Two regional ISPs peer at an internet exchange to keep local traffic between their subscribers off more expensive transit paths.

#### Physical Layer

The lowest layer of a network architecture, responsible for transmitting raw bits over a physical medium using signals such as voltage, light, or radio waves. It defines connectors, voltages, encoding, and timing.

**Example:** The physical layer of 1000BASE-T Ethernet specifies how signals are encoded on Category 5e cable using four twisted pairs.

#### Ping

A diagnostic utility that sends ICMP Echo Request messages and reports replies, used to test reachability and measure round-trip time. The name comes from sonar terminology.

**Example:** Running `ping example.com` typically reports four replies with their round-trip times in milliseconds, indicating the host is reachable.

#### Poison Reverse

A distance-vector loop-mitigation technique in which a router explicitly advertises an unreachable (infinite cost) route back toward the neighbor it learned the route from. It strengthens split horizon.

**Example:** Router B uses poison reverse by sending router A a metric of 16 for destinations learned via A, ensuring A never tries to route through B for those destinations.

#### POP3

Post Office Protocol version 3, an older application-layer protocol that downloads email from a server to a client, typically removing it from the server after retrieval.

**Example:** A POP3 user reading mail on one device may not see the same messages on another device because POP3 traditionally moves messages off the server.

#### Port Address Translation

A NAT variant that maps multiple internal hosts to a single external IP by also translating transport-layer port numbers. It is the dominant form of NAT for residential and small-business networks.

**Example:** A PAT-enabled home router maps an internal connection from 192.168.1.10:54321 to its public address with a unique external port, demultiplexing replies back to the right host.

#### Port Number

A 16-bit integer used by transport layer protocols (TCP and UDP) to identify a specific endpoint within a host. Ports allow multiple network applications on the same machine to share a single IP address.

**Example:** Port 443 is the well-known port for HTTPS, so browsers connecting to https://example.com target TCP port 443 on the server.

#### Post Quantum Cryptography

Cryptographic algorithms designed to remain secure against attackers equipped with large-scale quantum computers, used to replace algorithms vulnerable to Shor's algorithm and related attacks.

**Example:** TLS implementations are beginning to add post-quantum key encapsulation mechanisms such as ML-KEM (Kyber) alongside classical algorithms to defend long-lived sessions.

#### Presentation Layer

The OSI layer responsible for translating data formats between the network and applications, including character encoding, compression, and encryption. In practice, these functions live in libraries like TLS or in application code.

**Example:** TLS performs presentation-layer-style encryption and is often described as occupying a sublayer between transport and application.

#### Private IPv4 Range

The IPv4 address blocks reserved by RFC 1918 for use within private networks: 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16. These addresses are not routable on the public internet.

**Example:** A home router typically gives devices addresses such as 192.168.1.10 from the private range 192.168.0.0/16, hidden behind NAT.

#### Processing Delay

The time a router or host spends examining a packet's headers, performing lookups, and making forwarding decisions before transmitting. Modern hardware keeps processing delay to microseconds.

**Example:** A router performing a longest-prefix-match lookup and rewriting the time-to-live field incurs a processing delay measured in microseconds per packet.

#### Propagation Delay

The time required for a signal to travel the length of a physical medium at the speed of signals in that medium, depending only on distance and medium properties. It is independent of bit rate.

**Example:** A signal traveling over fiber across a 3,000 km path takes about 15 milliseconds of propagation delay regardless of link speed.

#### Protocol

A set of rules that defines the format, ordering, and meaning of messages exchanged between communicating entities, plus the actions taken on transmission and receipt. Protocols make interoperable communication possible across diverse implementations.

**Example:** HTTP specifies that a client request begins with a method like `GET /index.html HTTP/1.1` followed by headers and an empty line.

#### Protocol Versioning

The mechanisms by which a protocol evolves over time while preserving interoperability, including version fields, capability negotiation, and rules for ignoring unknown extensions.

**Example:** TLS includes a version field in its ClientHello and uses extensions and supported_versions negotiation to evolve from TLS 1.0 to 1.3 without breaking older clients.

#### Public Key Cryptography

Asymmetric cryptography in which each party holds a public-private key pair, where data encrypted with the public key can only be decrypted with the private key, and vice versa for signatures.

**Example:** SSH and TLS use public key cryptography to authenticate servers and to securely exchange the symmetric session keys used for bulk encryption.

#### Quality Of Service

A set of mechanisms that distinguish among traffic classes and provide differentiated treatment, such as bandwidth guarantees, lower latency, or priority forwarding for selected flows.

**Example:** A corporate network may use QoS to prioritize voice-over-IP packets ahead of bulk file transfers so calls remain clear under load.

#### Queuing Delay

The time a packet spends waiting in a router or switch buffer before being transmitted, varying with traffic load. Heavy congestion produces large and variable queuing delays.

**Example:** During an evening usage peak, packets at an ISP's router may wait tens of milliseconds in queues, increasing observed latency.

#### QUIC Protocol

A transport protocol layered over UDP that provides multiplexed, encrypted, reliable streams with low connection-setup latency. QUIC is the foundation of HTTP/3 and avoids head-of-line blocking across streams.

**Example:** A modern browser fetching a complex web page over HTTP/3 uses QUIC streams so a single packet loss does not stall unrelated HTTP requests.

#### Reassembly

The process by which the destination host combines IP fragments into the original packet using the identification and fragment offset fields. Reassembly happens only at the destination, not intermediate routers.

**Example:** When all three fragments of an oversized packet arrive at the destination host, IP reassembles them into the original datagram before delivery to TCP or UDP.

#### Recursive Resolver

A DNS server that takes a client's query and performs the full lookup process by following referrals from root to authoritative servers, then returns the final answer to the client.

**Example:** A home router typically forwards DNS queries to an ISP's recursive resolver, which performs all the heavy lifting of name resolution.

#### Reliable Delivery

A service model that ensures every unit of data is delivered to the receiver in order and without duplication, typically through acknowledgments, retransmissions, and sequence numbers.

**Example:** TCP provides reliable delivery on top of best-effort IP by retransmitting lost segments and reordering arrivals before handing data to the application.

#### Replay Attack

An attack in which an adversary records valid messages and later retransmits them, attempting to trigger duplicate effects or impersonate a legitimate sender.

**Example:** Without replay protection, an attacker could capture an authenticated command to unlock a smart lock and replay it later to gain entry.

#### REST Architecture

Representational State Transfer, an architectural style for networked systems that emphasizes stateless requests, resource-oriented URIs, uniform interfaces, and use of standard HTTP methods.

**Example:** A REST API might expose `GET /users/42` to fetch a user record and `PUT /users/42` to replace it, using HTTP semantics to convey intent.

#### Retransmission Timer

A TCP timer that triggers retransmission if no acknowledgment arrives within an estimated round-trip-time-based timeout. The timer adapts using smoothed RTT and RTT variation estimates.

**Example:** TCP sets the retransmission timer based on smoothed RTT plus four times the variation, so it tolerates jitter without spuriously retransmitting.

#### RFC Document

A Request for Comments document published by the Internet Engineering Task Force that defines internet standards, best practices, or informational guidance. Once approved, RFCs are immutable and identified by a permanent number.

**Example:** RFC 9110 specifies HTTP semantics and supersedes older RFCs that defined earlier versions of the protocol.

#### RIP Protocol

The Routing Information Protocol, an early distance-vector routing protocol using hop count as its metric, with a maximum hop count of 15. RIP is simple but converges slowly and is now mostly historical.

**Example:** Small legacy networks sometimes still run RIPv2 because of its simplicity, even though OSPF is preferred for modern intradomain routing.

#### Root Name Server

One of a small set of DNS servers (organized into 13 letter-named clusters) that answers queries about the top-level domains, anchoring the global DNS hierarchy.

**Example:** When a recursive resolver does not know which servers handle .com, it asks a root name server, which directs it to the authoritative .com servers.

#### Round Trip Time

The total time for a small probe to travel from a sender to a receiver and back, including propagation, transmission, queuing, and processing in both directions. RTT is critical for protocols like TCP that use it to set timers.

**Example:** The `ping` command measures round-trip time to a destination, often reporting values like 25 ms within a country and 200 ms across continents.

#### Routing

The process by which routers exchange information and compute paths through the network, populating the forwarding tables that govern per-packet decisions. Routing is slower-timescale than forwarding.

**Example:** OSPF and BGP are routing protocols that decide which paths to use; the resulting routing decisions are then loaded into each router's forwarding table.

#### Routing Algorithm

The procedure used by a routing protocol to compute paths through the network from each router's local view, balancing optimality, convergence speed, and scalability.

**Example:** Distance-vector routing uses the Bellman-Ford algorithm, while link-state routing uses Dijkstra's shortest-path algorithm.

#### Routing Table

The control-plane structure that holds all routes known to a router, including those learned from routing protocols, static configuration, and directly connected interfaces. The best routes are installed into the forwarding table.

**Example:** The routing table on an edge router may contain several thousand BGP routes, of which only the best per prefix populate the active forwarding table.

#### RTS CTS

A Wi-Fi optional handshake using Request-To-Send and Clear-To-Send control frames to reserve the channel before larger data frames, reducing collisions caused by hidden terminals.

**Example:** When RTS/CTS is enabled, a station first sends a small RTS, the AP replies with a CTS heard by all neighbors, and only then is the data transmitted.

#### SACK Option

The TCP Selective Acknowledgment option, which allows a receiver to inform the sender of non-contiguous blocks of data that have been received, enabling more efficient retransmission decisions.

**Example:** With SACK, a sender that has lost segments 5 and 8 out of a window of 10 can retransmit only those two specific segments, not all subsequent ones.

#### Scheduling Discipline

The algorithm a router or switch uses to decide which queued packet to transmit next on an outgoing link, including FIFO, priority queuing, fair queuing, and deficit round-robin.

**Example:** A router configured with strict-priority queuing always serves voice packets ahead of best-effort traffic when both are queued at the same interface.

#### SDN

Software-Defined Networking, an architectural approach that separates the control plane from the data plane, with logically centralized controllers programming forwarding state on simpler switches.

**Example:** Large data centers use SDN to push routing and policy decisions from a controller into top-of-rack switches, simplifying operations and enabling rapid feature deployment.

#### SDN Controller

The logically centralized software component in an SDN that maintains a network-wide view, runs control-plane logic, and pushes forwarding state to switches via southbound protocols.

**Example:** Open-source SDN controllers like ONOS and OpenDaylight use OpenFlow and other interfaces to manage data-plane devices across an enterprise or data center.

#### Segment

The protocol data unit at the transport layer in TCP, consisting of a TCP header and an application-layer payload. Segments carry sequence numbers and acknowledgments to support reliable, ordered delivery.

**Example:** A large file transfer is broken into many TCP segments, each fitting within the path MTU after IP and link-layer headers are added.

#### Select And Poll

POSIX system calls (`select`, `poll`) that let a single thread wait for I/O readiness on many file descriptors, scaling roughly linearly with the number of monitored descriptors.

**Example:** A simple chat server uses `poll` to watch many client sockets in one thread, processing each socket only when it becomes readable.

#### Selective Repeat

A sliding-window ARQ protocol in which the receiver buffers out-of-order frames and the sender retransmits only those individual frames identified as lost. It is more efficient than Go-Back-N at the cost of more receiver state.

**Example:** TCP with selective acknowledgments behaves like selective repeat, retransmitting only specific lost segments while keeping later ones.

#### Send Receive Operation

Socket calls (`send`, `recv`, `sendto`, `recvfrom`, and their variants) that transfer bytes through a socket between application and kernel buffers, encapsulating the underlying transport.

**Example:** A chat client calls `send` to push a message into the TCP send buffer and `recv` in a loop to read replies until the connection closes.

#### Separation Of Concerns

A design principle that partitions a system into modules, each responsible for one well-defined aspect, so that modules can evolve independently. In networking it underlies layering and the split between control and data planes.

**Example:** Splitting routing decisions (control plane) from packet forwarding (data plane) lets each be optimized and replaced independently.

#### Sequence Number

A 32-bit field in the TCP header indicating the byte offset within the sender's stream of the first data byte in the segment. Sequence numbers enable ordering, deduplication, and acknowledgment.

**Example:** If a TCP sender transmits 1000 bytes starting at sequence 5000, the next segment will use sequence 6000, allowing the receiver to detect gaps and reorder data.

#### Server

A host that provides a service to other hosts by accepting and responding to incoming requests over the network. Servers typically run continuously, listen on well-known port numbers, and handle many simultaneous clients.

**Example:** A web server running Apache listens on TCP port 80 and returns HTML pages in response to HTTP GET requests from browsers.

#### Service Mesh

An infrastructure layer for microservice communication that provides features such as routing, encryption, retries, and observability through sidecar proxies, transparently to applications.

**Example:** Istio uses Envoy sidecars per service to implement mTLS, traffic shifting, and metrics collection without changing the service code.

#### Service Model

The abstract description of what a layer or protocol provides to its users, including delivery semantics, ordering, error handling, and addressing. The service model hides implementation while exposing observable behavior.

**Example:** UDP's service model is unreliable, unordered datagram delivery, while TCP's service model is a reliable, ordered byte stream.

#### Session Layer

The OSI layer that establishes, manages, and terminates dialogues between applications, including synchronization and recovery features. In the TCP/IP model these functions are typically handled inside applications or libraries.

**Example:** Some remote procedure call frameworks provide session-layer features such as resuming an interrupted transfer from a checkpoint.

#### Shannon Theorem

A foundational result by Claude Shannon stating that the capacity of a noisy channel is C = B log2(1 + S/N), where B is bandwidth and S/N is the signal-to-noise ratio. It bounds the achievable error-free data rate.

**Example:** Shannon's theorem explains why doubling signal-to-noise ratio raises capacity by only one bit per symbol, while doubling bandwidth doubles capacity.

#### Signal

A physical quantity, such as voltage, current, or light intensity, that varies over time to represent information. Signals are the medium-level representation of bits during transmission.

**Example:** In 1000BASE-T Ethernet, four pairs of copper wires carry pulse-amplitude-modulated signals encoding the bits of each frame.

#### Sliding Window

A flow- and error-control technique in which the sender may have multiple unacknowledged frames or bytes outstanding, up to a window size, while the receiver acknowledges them in order.

**Example:** TCP uses a sliding window measured in bytes, allowing many segments to be in flight at once and improving throughput on high-bandwidth, high-delay paths.

#### Slow Start

A TCP congestion-control phase in which the congestion window doubles roughly each round-trip time, ramping up quickly from a small initial value until the slow-start threshold is reached.

**Example:** A new TCP connection starts with a small congestion window of about 10 segments and doubles it each RTT until loss occurs or the threshold is reached.

#### SMTP

The Simple Mail Transfer Protocol, the application-layer protocol used to send and relay email between mail servers and from clients to outgoing mail servers.

**Example:** When a user clicks Send in an email client, the message is delivered to the outgoing server using SMTP, which then forwards it toward the recipient's domain.

#### SNMP

The Simple Network Management Protocol, an application-layer protocol used to monitor and manage network devices by reading and writing variables organized in a Management Information Base.

**Example:** A monitoring system polls switches and routers via SNMP to collect interface counters, CPU utilization, and uptime values for dashboards and alerts.

#### Socket Address

A structure that combines an IP address and a port number (and an address family) to identify a transport-layer endpoint. Socket addresses are passed to functions like `bind` and `connect`.

**Example:** In C, a `struct sockaddr_in` with `sin_addr` 192.0.2.1 and `sin_port` 80 represents the socket address of an HTTP server.

#### Spanning Tree Protocol

An IEEE 802.1D protocol that prevents loops in a switched Ethernet topology by electing a root bridge and disabling redundant links, leaving an active spanning tree.

**Example:** When two switches are wired with two cables for redundancy, spanning tree protocol blocks one of the links so frames do not circulate forever.

#### Split Horizon

A distance-vector loop-mitigation technique in which a router does not advertise a route back out the same interface from which it learned that route.

**Example:** With split horizon, router B does not tell router A about a destination it learned from A, preventing trivial two-router loops.

#### Spoofing Attack

An attack in which an adversary sends packets or messages with forged identifying fields, such as a source IP address, MAC address, or email sender, to impersonate another party.

**Example:** A DDoS attacker may use IP spoofing to send UDP queries with the victim's address as the source, causing reflectors to flood the victim with replies.

#### SSH Protocol

The Secure Shell protocol, a cryptographically protected application-layer protocol for remote login, command execution, and tunneling, using public-key authentication and symmetric encryption.

**Example:** A system administrator runs `ssh user@server` to obtain an authenticated, encrypted shell session on a remote machine over the internet.

#### SSID

A Service Set Identifier, the human-readable name advertised by a Wi-Fi network and used by clients to select which network to join. The SSID can be up to 32 octets long.

**Example:** A home router might broadcast the SSID `Smith-Family-WiFi`, which appears in the list of available networks on a phone's Wi-Fi settings.

#### Standard

A formally documented and approved specification, typically published by a recognized standards body, that defines how a technology must behave to ensure interoperability among independent implementations.

**Example:** IEEE 802.3 is the standard that defines Ethernet, ensuring that network cards from different vendors can communicate over the same cable.

#### Stateful Firewall

A firewall that tracks the state of active connections and applies rules based on the connection context, allowing return traffic only for previously approved outbound flows.

**Example:** A stateful firewall permits return TCP segments of an established outbound connection while rejecting unsolicited inbound segments to the same internal port.

#### Stateful Protocol

A protocol in which endpoints maintain information about prior interactions, so that the meaning of a message depends on context built up over time.

**Example:** FTP is stateful because the server remembers the current working directory and login status across successive client commands.

#### Stateless Protocol

A protocol in which each request is processed independently, without reference to prior requests, simplifying server design and improving scalability.

**Example:** HTTP is fundamentally stateless; each request stands on its own, although cookies and tokens can layer state on top.

#### Static Route

A route entered manually by an administrator and not learned from a dynamic routing protocol. Static routes are simple and predictable but do not adapt to topology changes.

**Example:** A small office router may have a static default route pointing to the ISP and one or two static routes to remote sites over a VPN.

#### Stop And Wait Protocol

A simple ARQ protocol in which the sender transmits one frame, waits for an acknowledgment, and only then sends the next frame. It is easy to implement but uses link capacity poorly when delays are large.

**Example:** Stop-and-wait over a satellite link with 500 ms RTT can achieve only a few frames per second regardless of link bandwidth.

#### STUN And TURN

Protocols supporting NAT traversal: STUN (Session Traversal Utilities for NAT) lets a host discover its public IP and port mapping, and TURN (Traversal Using Relays around NAT) provides a relay server when direct connections are impossible.

**Example:** A WebRTC client first uses STUN to discover its NAT mapping and falls back to TURN as a relay when the peer's NAT is too restrictive.

#### Subnet

A subdivision of a larger IP network defined by a longer prefix, used to organize hosts into smaller, more manageable groups for routing and administration.

**Example:** Splitting 10.0.0.0/16 into /24 subnets creates 256 separate subnets, each with up to 254 usable host addresses, that can be assigned to different VLANs.

#### Subnet Mask

A bitmask that identifies which bits of an IPv4 address denote the network portion versus the host portion, with 1 bits in network positions and 0 bits in host positions.

**Example:** The subnet mask 255.255.255.0 corresponds to a /24 prefix, marking the first 24 bits of the address as the network portion.

#### Subnetting

The practice of dividing an IP network into smaller subnetworks by extending the prefix length. Subnetting improves administration, security, and routing efficiency.

**Example:** A company allocated 172.16.0.0/16 might subnet it into /24s for each department, giving HR 172.16.10.0/24 and Engineering 172.16.20.0/24.

#### Supernetting

The aggregation of contiguous IP networks into a larger block with a shorter prefix, used to reduce the size of routing tables. Supernetting is the inverse of subnetting.

**Example:** Combining 192.0.2.0/24 and 192.0.3.0/24 into 192.0.2.0/23 supernets two adjacent networks into a single advertised prefix.

#### Symbol Rate

The number of distinct signal changes (symbols) transmitted per second over a channel, regardless of how many bits each symbol encodes. Symbol rate is constrained by the channel's bandwidth.

**Example:** A modem operating at 2400 symbols per second using 16-level encoding transmits 4 bits per symbol for a bit rate of 9600 bps.

#### Symmetric Encryption

Encryption in which the same secret key is used for both encryption and decryption, providing high performance for bulk data. Modern algorithms include AES and ChaCha20.

**Example:** TLS uses symmetric encryption such as AES-GCM with a session key to protect application data after the asymmetric handshake establishes the key.

#### SYN Flood

A denial-of-service attack that sends many TCP SYN segments without completing handshakes, exhausting a server's half-open connection table and preventing legitimate connections.

**Example:** A SYN flood is mitigated by SYN cookies, which let a server respond without storing per-connection state until the handshake completes.

#### Tc Netem

A Linux traffic control module that emulates network impairments such as delay, jitter, loss, duplication, and corruption on a chosen interface, used to test applications under realistic network conditions.

**Example:** `tc qdisc add dev eth0 root netem delay 100ms loss 1%` makes outgoing traffic on eth0 see 100 ms of delay and 1% packet loss.

#### TCP

The Transmission Control Protocol, a connection-oriented transport-layer protocol that provides a reliable, in-order byte stream between two endpoints through sequence numbers, acknowledgments, retransmissions, flow control, and congestion control.

**Example:** Web browsing, file transfer, and SSH all use TCP because they require complete, ordered delivery of data.

#### TCP BBR

A TCP congestion-control algorithm developed at Google that models the bottleneck bandwidth and round-trip propagation time directly, pacing data based on these estimates rather than reacting only to loss.

**Example:** TCP BBR can maintain higher throughput than loss-based algorithms over paths with random non-congestive loss, such as some wireless or shallow-buffered links.

#### TCP CUBIC

A TCP congestion-control algorithm in which the congestion window grows as a cubic function of time since the last loss, designed to scale well on high-bandwidth, long-RTT paths. It is the default in many Linux kernels.

**Example:** A 10 Gbps long-distance file transfer using TCP CUBIC ramps back up to high windows much faster than Reno after a loss event.

#### TCP IP Model

A four- or five-layer architectural model that describes the internet protocol suite: Link, Internet, Transport, and Application (sometimes split into Physical and Link). It reflects how real internet protocols are deployed.

**Example:** The TCP/IP model maps Ethernet to the Link layer, IP to the Internet layer, TCP to Transport, and HTTP to Application.

#### TCP Reno

A widely deployed TCP congestion-control algorithm that combines slow start, congestion avoidance, fast retransmit, and fast recovery with an additive-increase, multiplicative-decrease behavior.

**Example:** TCP Reno's behavior produces the characteristic sawtooth pattern of congestion window over time on a loss-driven path.

#### TCP Segment

A TCP protocol data unit, consisting of a TCP header (with sequence and acknowledgment numbers, flags, window, and options) and a payload of bytes from the sending application's stream.

**Example:** When a browser sends a 4 KB HTTP request, TCP may carry it as a single segment or several segments depending on path MTU and congestion window.

#### TCP Socket

An endpoint of a TCP connection identified by the four-tuple of local and remote IP addresses and ports, exposed to applications as a file-descriptor-like handle.

**Example:** A web server creates a listening TCP socket on port 443 and obtains a new connected TCP socket per accepted client.

#### TCP Termination

The connection-teardown exchange in TCP, typically a four-segment sequence using FIN and ACK flags to close each direction independently. TCP also supports abrupt RST-based termination.

**Example:** When a client finishes downloading a file, it sends a FIN segment; the server acknowledges, then sends its own FIN, which the client acknowledges to fully close the connection.

#### TCP Three Way Handshake

The connection-establishment exchange in TCP consisting of SYN, SYN-ACK, and ACK segments that synchronize initial sequence numbers and confirm both endpoints can send and receive.

**Example:** When a browser connects to https://example.com, TCP performs a three-way handshake before TLS or HTTP data is exchanged, costing one round-trip time.

#### TCP Window

The number of bytes a TCP sender is permitted to have outstanding (unacknowledged) at any moment, set by the minimum of the receive window (flow control) and congestion window.

**Example:** If the receiver's advertised window is 64 KB and the congestion window is 32 KB, the sender may have at most 32 KB unacknowledged in flight.

#### Tcpdump

A command-line packet capture and display tool built on libpcap, used to record traffic to files or print summaries directly to the terminal. It is ubiquitous on Unix-like systems.

**Example:** Running `tcpdump -i eth0 'tcp port 443'` shows a live summary of HTTPS traffic on the eth0 interface.

#### Telnet

A legacy application-layer protocol for remote terminal access that transmits all data, including credentials, in cleartext. Telnet is generally replaced by SSH and used today mainly for diagnostic raw-socket testing.

**Example:** A network engineer might use `telnet smtp.example.com 25` to manually test an SMTP server, even though logins should never use Telnet on the public internet.

#### Throughput

The actual rate at which data is successfully delivered over a link or path during a given interval, including all bits at the chosen layer of measurement. Throughput is always less than or equal to bandwidth.

**Example:** A user with a 1 Gbps link may measure only 600 Mbps of throughput when downloading a file because of TCP overhead and competing traffic.

#### Tier 1 ISP

A large internet service provider that can reach the entire IPv4 and IPv6 internet solely through settlement-free peering, without paying any other network for transit.

**Example:** Companies such as Lumen and NTT operate Tier 1 networks and peer with each other to form the global routing fabric.

#### TLS Handshake

The negotiation phase of TLS in which the client and server agree on a protocol version, cipher suite, and shared keys, and the server (and optionally the client) authenticates via certificates.

**Example:** A TLS 1.3 handshake completes in one round trip, after which encrypted application data flows over the established session.

#### TLS Protocol

Transport Layer Security, a cryptographic protocol that provides confidentiality, integrity, and authentication for transport-layer connections, primarily TCP. TLS is the basis of HTTPS and many other secure protocols.

**Example:** Modern web browsers connect to https:// URLs using TLS 1.3, encrypting the application data and authenticating the server via its X.509 certificate.

#### Token Bucket

A traffic-shaping mechanism in which tokens are added to a bucket at a fixed rate, and a packet may be transmitted only when enough tokens are available. It allows controlled bursts up to the bucket size.

**Example:** A token bucket with 1 Mbps refill rate and 100 KB burst size lets short bursts of 100 KB pass immediately while limiting long-term throughput to 1 Mbps.

#### Token Passing

A MAC protocol in which a special token frame circulates among stations, and only the station holding the token may transmit. Token passing avoids collisions and provides bounded access delay.

**Example:** IEEE 802.5 Token Ring used token passing so each station knew exactly when it was its turn to transmit, supporting deterministic latency.

#### Traceroute

A diagnostic utility that discovers the routers along a path by sending packets with progressively increasing time-to-live values and recording the source of each ICMP Time Exceeded reply.

**Example:** `traceroute www.example.com` lists the IP addresses and hostnames of each hop from the user's machine to the destination web server.

#### Traffic Shaping

A QoS technique that delays packets at the sender or at network edges to enforce a maximum sustained rate or smoother burst profile, often using token or leaky bucket algorithms.

**Example:** An ISP may shape a customer's outbound traffic to 50 Mbps by buffering and pacing packets that would exceed the contracted rate.

#### Trailer

A field appended to the end of a protocol data unit, often used for error detection or framing. Trailers are less common than headers but appear in technologies like Ethernet.

**Example:** An Ethernet frame ends with a 4-byte Frame Check Sequence trailer containing a CRC over the rest of the frame.

#### Transit Provider

A network that sells access to the rest of the internet to a smaller network, typically for a fee based on bandwidth. Transit relationships involve announcing the customer's prefixes globally.

**Example:** A small regional ISP buys transit from a Tier 1 provider, gaining a route to every destination in the global routing table.

#### Transmission Delay

The time required to push all bits of a frame onto a link, equal to the frame size divided by the link's bandwidth. Transmission delay shrinks as bandwidth increases.

**Example:** Sending a 1500-byte frame on a 100 Mbps link takes 120 microseconds of transmission delay (12,000 bits divided by 10^8 bits per second).

#### Transport Layer

The layer that provides end-to-end communication services between processes on hosts, including multiplexing via port numbers and optionally reliability, ordering, and flow control. TCP and UDP are the main transport protocols.

**Example:** TCP at the transport layer turns the unreliable IP datagram service into a reliable, ordered byte stream usable by applications like HTTP.

#### Trunk Port

A switch port configured to carry frames from multiple VLANs, distinguished by 802.1Q tags. Trunk ports interconnect switches and connect to virtualization hosts.

**Example:** A trunk port between two switches transports tagged frames from VLANs 10, 20, and 30 over a single physical link.

#### Tunneling

The encapsulation of one network protocol's packets inside another's payload to traverse intermediate networks that do not natively support the inner protocol. Tunneling builds virtual links over existing infrastructure.

**Example:** 6in4 tunneling encapsulates IPv6 packets inside IPv4 packets so they can cross IPv4-only ISPs to reach an IPv6 endpoint.

#### Twisted Pair Cable

A copper cable made of pairs of insulated wires twisted together to reduce electromagnetic interference and crosstalk. Twisted pair is the dominant medium for short-range wired LANs.

**Example:** Category 6 twisted pair cable supports 1 Gbps Ethernet up to 100 meters and 10 Gbps over shorter distances.

#### UDP

The User Datagram Protocol, a connectionless transport-layer protocol providing best-effort, unordered delivery of independent datagrams with port-based multiplexing and an optional checksum.

**Example:** DNS queries, real-time game packets, and video conferencing audio commonly use UDP because they prefer low overhead over reliability.

#### UDP Datagram

A UDP protocol data unit consisting of a small 8-byte header (source port, destination port, length, checksum) and a payload, transported inside a single IP packet.

**Example:** A typical DNS query is one UDP datagram of about 50 to 100 bytes, with the response usually fitting in another single datagram.

#### UDP Socket

An endpoint for sending and receiving UDP datagrams, identified by a local IP address and port. UDP sockets are connectionless but can be "connected" to fix a default peer.

**Example:** A DNS server creates a UDP socket bound to port 53 and uses `recvfrom` to receive queries from arbitrary clients.

#### Unicast

A communication pattern in which a single sender transmits data to exactly one receiver identified by a unique address. Most internet traffic uses unicast delivery.

**Example:** A laptop fetching a web page from a single server uses unicast IP packets addressed to that server's IP address.

#### VLAN

A Virtual Local Area Network, a logical Layer 2 broadcast domain defined by configuration on switches rather than by physical wiring. VLANs allow segmentation without rewiring.

**Example:** A campus switch might place faculty machines in VLAN 10 and student machines in VLAN 20 so the two groups cannot directly send broadcast traffic to each other.

#### VLAN Tagging

The IEEE 802.1Q technique of inserting a 4-byte tag into Ethernet frames to indicate VLAN membership, enabling multiple VLANs to share trunk links between switches.

**Example:** A frame leaving an access port for VLAN 20 receives an 802.1Q tag with VID 20 when traversing a trunk between two switches.

#### VPN

A Virtual Private Network, a logical secure network built over a public infrastructure using tunneling and cryptography, giving remote users or sites the appearance of a single private network.

**Example:** An employee uses a VPN client to connect to a corporate network from home, gaining access to internal services as if directly on the office LAN.

#### VXLAN

Virtual Extensible LAN, a standard overlay encapsulation that tunnels Ethernet frames inside UDP packets with a 24-bit VNI (virtual network identifier), supporting up to 16 million logical L2 segments.

**Example:** Data center fabrics use VXLAN to extend layer-2 domains across racks and pods over a routed IP underlay, far beyond the 4096-VLAN limit of 802.1Q.

#### WebSocket

An IETF protocol that upgrades an HTTP connection into a full-duplex, message-oriented channel over a single TCP connection, enabling efficient bidirectional communication for web applications.

**Example:** A browser-based chat application uses WebSocket so the server can push new messages to the client instantly without polling.

#### Wi Fi

A family of wireless LAN technologies based on the IEEE 802.11 standards, used to connect devices to access points over unlicensed radio bands. Wi-Fi is the dominant wireless LAN technology.

**Example:** The latest Wi-Fi standards (Wi-Fi 6 and Wi-Fi 7) can deliver multi-gigabit throughput in dense home and enterprise deployments.

#### Wi Fi Channel

A specific frequency range within a Wi-Fi band on which transmissions occur. Channels are numbered (e.g., 1 to 11 in the 2.4 GHz band) and may overlap or be non-overlapping.

**Example:** In dense deployments, neighboring access points are configured on non-overlapping 2.4 GHz channels 1, 6, and 11 to minimize co-channel interference.

#### Wi Fi Roaming

The process by which a Wi-Fi client moves between access points in the same ESS, re-associating with a stronger AP without losing its IP address or transport connections.

**Example:** A user walking through a hospital sees their voice-over-Wi-Fi call continue uninterrupted as their phone roams from one ceiling AP to the next.

#### Wire Protocol Design

The discipline of designing the on-the-wire format of messages between systems, including framing, encoding, versioning, error handling, and extensibility.

**Example:** Good wire protocol design specifies fixed field sizes, length-prefixed payloads, and explicit version numbers so future revisions can be parsed by older implementations.

#### Wireless LAN

A local area network using wireless transmission, typically based on IEEE 802.11 (Wi-Fi). Wireless LANs replace fixed cabling with radio links and provide mobility within their coverage area.

**Example:** A coffee shop's wireless LAN allows customers' laptops and phones to connect to the internet through a single Wi-Fi access point.

#### Wireless Medium

The atmosphere or space through which radio, microwave, infrared, or optical signals propagate without a guided physical conductor. Wireless media are shared, broadcast in nature, and subject to interference and attenuation.

**Example:** Wi-Fi access points and client devices share the unlicensed 2.4 GHz and 5 GHz bands as their wireless medium.

#### Wireshark

A widely used open-source graphical packet analyzer that captures and dissects network traffic, decoding hundreds of protocols for visual inspection and debugging.

**Example:** A network engineer uses Wireshark to capture a TCP session and inspect the SYN, SYN-ACK, ACK handshake and subsequent segments to diagnose a connection problem.

#### X509 Certificate

A standardized data structure that binds a public key to an identity (such as a domain name) and is signed by a certificate authority, used widely in TLS, S/MIME, and code signing.

**Example:** A typical website's X.509 certificate contains the domain name, public key, validity period, issuer, and the CA's digital signature.

#### Zero Trust Network

A security model that abandons implicit trust based on network location and instead authenticates and authorizes every request based on identity, device posture, and context.

**Example:** In a zero-trust deployment, an employee on the corporate LAN must still authenticate strongly and pass policy checks for each application, just as if connecting from the public internet.

