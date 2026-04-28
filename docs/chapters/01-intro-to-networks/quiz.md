# Quiz: Introduction to Networks and Communication

Test your understanding of foundational networking vocabulary, hosts, end systems, edge versus core, and the three identifiers (MAC, IP, port) with these review questions.

---

#### 1. Which of the following best defines a computer network?

<div class="upper-alpha" markdown>
1. A single computer running multiple applications simultaneously
2. A collection of independent computing devices that exchange data through shared communication channels using agreed-upon rules
3. A physical cable connecting two devices in the same room
4. The hardware inside a single router
</div>

??? question "Show Answer"
    The correct answer is **B**. A computer network is defined by three ingredients: devices that want to communicate, links that carry signals between them, and rules (protocols) that let the devices interpret what they receive. Option A describes a single host, not a network. Option C describes only one link, missing the device and protocol elements. Option D describes a single piece of network equipment, not a network.

    **Concept Tested:** Computer Network

---

#### 2. What is the difference between a host and a network node?

<div class="upper-alpha" markdown>
1. A host is hardware; a network node is software
2. A host is always faster than a network node
3. A host runs application software for users; a network node is any addressable participant, including routers and switches that forward data on behalf of others
4. They mean exactly the same thing
</div>

??? question "Show Answer"
    The correct answer is **C**. Every host is a network node, but not every node is a host. A router participates in the network as a node but does not run user-facing applications, so it is not a host. The terms describe roles, not hardware speeds or software-vs-hardware distinctions.

    **Concept Tested:** Host

---

#### 3. In a single web browsing session, your laptop opens a connection to a remote web server. What roles do the two end systems play?

<div class="upper-alpha" markdown>
1. The laptop is the server; the web server is the client
2. The laptop is the client; the web server is the server
3. Both are clients
4. Both are servers
</div>

??? question "Show Answer"
    The correct answer is **B**. A client is the end system that initiates a request; a server waits to be contacted, processes the request, and returns a response. The laptop opens the connection and asks for the page, so it is the client. The web server waits for incoming requests and serves the page back. Roles are defined per-conversation, not by hardware.

    **Concept Tested:** Client

---

#### 4. Which devices typically live in the network core rather than at the edge?

<div class="upper-alpha" markdown>
1. Smartphones and laptops
2. IoT sensors and smart thermostats
3. Routers and high-bandwidth switches
4. Web servers and database servers
</div>

??? question "Show Answer"
    The correct answer is **C**. The network core is the interior mesh of switches, routers, and high-bandwidth links that move data between edges. End systems like phones, laptops, sensors, and servers all live at the edge — they originate or consume data. Core devices optimize for aggregate throughput, while edge devices optimize for per-user experience.

    **Concept Tested:** Network Core

---

#### 5. A communication link has two important attributes that every link possesses. Which pair correctly names them?

<div class="upper-alpha" markdown>
1. Color and weight
2. Direction (full/half duplex) and sharing (point-to-point vs. multi-access)
3. IP address and MAC address
4. Operating system and CPU model
</div>

??? question "Show Answer"
    The correct answer is **B**. Every communication link has a direction property (full duplex, half duplex, or one-way) and a sharing property (point-to-point links connect exactly two nodes, while broadcast or multi-access links carry traffic for many nodes sharing the medium). Addresses belong to interfaces, not links. The other options describe irrelevant attributes.

    **Concept Tested:** Communication Link

---

#### 6. Why is a network interface, rather than a whole host, treated as the unit of address?

<div class="upper-alpha" markdown>
1. Interfaces are cheaper than hosts
2. Hosts cannot be addressed at all
3. A single host can have multiple interfaces, each with its own independent identifiers, queue, and link, so the network treats each interface as a separate node
4. Operating systems require it for security reasons
</div>

??? question "Show Answer"
    The correct answer is **C**. A laptop can have Wi-Fi, Bluetooth, Ethernet, and virtual VPN interfaces simultaneously, each with different addresses, speeds, and failure modes. From the network's perspective, each interface is a separate addressable participant. This is why MAC and IP addresses attach to interfaces, not to whole hosts.

    **Concept Tested:** Network Interface

---

#### 7. Which identifier is a 48-bit number burned into a network interface at the factory and used by the link layer to deliver frames between neighbors on the same link?

<div class="upper-alpha" markdown>
1. IP address
2. Port number
3. MAC address
4. Hostname
</div>

??? question "Show Answer"
    The correct answer is **C**. A MAC (Media Access Control) address is 48 bits long, conventionally written as six hexadecimal pairs, and is assigned at manufacture. It identifies an interface uniquely on its local link. IP addresses are routable across the Internet, port numbers identify applications, and hostnames are human-readable names that resolve to IP addresses.

    **Concept Tested:** MAC Address

---

#### 8. A web browser connects to https://example.com. The destination port number 443 in the packet identifies which of the following?

<div class="upper-alpha" markdown>
1. The specific application or service (HTTPS) on the destination host
2. The physical interface on the destination host
3. The next-hop router on the path
4. The version of IP being used
</div>

??? question "Show Answer"
    The correct answer is **A**. A port number is a 16-bit integer that identifies a specific application or service running on a host. Port 443 is the well-known port for HTTPS. The IP address identifies the host on the Internet, and the MAC address identifies the interface on the local link. Routing decisions and IP version are encoded in IP-layer fields, not the port number.

    **Concept Tested:** Port Number

---

#### 9. A router with twelve physical ports is plugged into twelve different network segments. From the network's point of view, how many nodes does this router represent?

<div class="upper-alpha" markdown>
1. One node, because it is one physical device
2. Twelve nodes, because each interface is separately addressable
3. Zero nodes, because routers are not nodes
4. Two nodes — one for inbound and one for outbound traffic
</div>

??? question "Show Answer"
    The correct answer is **B**. A node is any addressable participant in the network. Each interface has its own MAC and IP addresses, so each one is independently addressable and counts as a node. The phrase "a node is a role, not a thing" captures this idea: the network sees connections, not boxes. Routers are absolutely network nodes — they are simply not hosts.

    **Concept Tested:** Network Node

---

#### 10. Why does the Internet require three different identifiers (MAC, IP, port) instead of a single universal address?

<div class="upper-alpha" markdown>
1. Historical accident with no real reason
2. To make the network harder to attack
3. Each layer of the protocol stack has a different responsibility, and each identifier answers a different question (which neighbor on this link, which host on the Internet, which application on the host)
4. To slow down packet processing for fairness
</div>

??? question "Show Answer"
    The correct answer is **C**. The link layer needs to deliver frames between neighbors on a single link (MAC). The network layer needs to deliver packets across many links worldwide (IP). The transport layer needs to deliver bytes to the right application (port). Each layer keeps its own identifier and ignores the others, which is what allows independent layer evolution and replacement.

    **Concept Tested:** IP Address

---
