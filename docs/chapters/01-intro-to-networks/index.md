---
title: Introduction to Networks and Communication
description: The foundational vocabulary of networking — hosts, end systems, network nodes, edge versus core, communication links, network interfaces, and the three identifiers (MAC, IP, port) that locate every endpoint.
generated_by: claude skill chapter-content-generator
date: 2026-04-27 23:35:33
version: 0.07
---

# Chapter 1: Introduction to Networks and Communication

## Summary

This chapter introduces the foundational vocabulary of networking — the participants in any network (hosts, clients, servers, edges, cores), the physical and logical links that connect them, and the addresses and ports that identify endpoints. Students will build a working mental model of what a network is and recognize the standard identifiers used at every layer above. By the end, students can describe what every device on a network is doing and why.

## Concepts Covered

This chapter covers the following 13 concepts from the learning graph:

1. Computer Network
2. Host
3. End System
4. Server
5. Client
6. Network Node
7. Network Edge
8. Network Core
9. Communication Link
10. Network Interface
11. MAC Address
12. IP Address
13. Port Number

## Prerequisites

This chapter assumes only the prerequisites listed in the [course description](../../course-description.md).

---

!!! mascot-welcome "Welcome to the Hive"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Buzz the bee waving welcome">
    Hi, I'm **Buzz**. Networks move information between agents — bees, routers, servers, your phone — and the words we use to describe those agents matter more than you'd think. *Let's trace the route!* By the end of this chapter you'll know what every device on a network is doing and exactly how to point at it.

## 1.1 What Is a Computer Network?

A **computer network** is a collection of independent computing devices that exchange data through shared communication channels using agreed-upon rules. The definition is intentionally broad: two laptops connected by a single Wi-Fi router form a network, and so do the billions of devices that together form the global Internet. What every network has in common is three ingredients — devices that want to communicate, links that carry signals between them, and rules that let the devices interpret what they receive.

The simplest mental model treats a network as a graph. Devices sit at the vertices. Links sit on the edges. Data moves from one vertex to another by following one or more edges, and along the way other devices may forward it on its behalf. A great deal of the rest of this textbook elaborates on each of those words — what counts as a vertex, what kinds of links exist, who decides where to forward data, and how devices agree on the format of the messages they exchange. This first chapter pins down the cast of characters so the later chapters have something concrete to talk about.

Three properties separate computer networks from earlier communication systems:

- **Digital** — information is encoded as discrete bits, not continuous analog waveforms, which makes the same data perfectly reproducible and freely composable.
- **Packet-switched** — messages are broken into small units called packets that travel independently and are reassembled at the destination, instead of holding a dedicated end-to-end circuit open for the duration of a conversation.
- **Layered** — different concerns (signaling, addressing, reliability, application meaning) are separated into stacked protocols, so each layer can evolve independently.

We will treat layering formally in Chapter 3. For now, just notice that the network is engineered as a stack of cooperating mechanisms rather than a single monolithic system.

## 1.2 The Cast: Nodes, Hosts, and End Systems

Three closely related words name the things that participate in a network. Distinguishing them carefully now will save confusion in every later chapter.

A **network node** is any device that the network treats as an addressable participant — anything that can send, receive, or forward data over the network. Routers, switches, laptops, smartphones, web servers, smart thermostats, and the load balancers in front of a cloud service are all network nodes. The word *node* is deliberately broad: it does not say what the device does, only that the network sees it.

A **host** is a network node that runs the *applications* people care about — the browser you're reading this in, the database serving your school's registration system, the chat server your group uses. A host is the place where user-facing software actually executes. A router or a switch, by contrast, is a network node but not a host: it forwards data on behalf of others rather than running applications itself.

An **end system** is a host viewed from a particular vantage point. Specifically, it is a host that sits at one *end* of a communication, originating or terminating data flows rather than relaying them. The terms *host* and *end system* are often used interchangeably in informal writing, and we will follow that convention. The distinction matters when a single physical box does both jobs — for example, a Linux server that runs a database (acting as a host) while also forwarding packets between two interfaces (acting as an intermediate node). In this chapter and most of the rest of the book, "host" and "end system" mean the same thing: a device whose job is to be one end of a conversation.

!!! mascot-thinking "A node is a role, not a thing"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Buzz thinking carefully">
    A laptop with two network cards plugged into two different networks is *one host* but *two nodes*, because each interface is separately addressable. A router with twelve ports is one device but participates as twelve nodes from the network's point of view. Always ask: who is the network *talking to* — the box, or one of its connections?

The list below summarizes the three terms in pedagogical order, narrowest at the top:

- **End system** — a host considered as the source or destination of data; the human-visible endpoint of a conversation.
- **Host** — a network node that runs application software for users.
- **Network node** — any addressable participant in the network, including routers and switches that move data on behalf of others.

Every end system is a host, and every host is a network node, but the reverse is not true.

## 1.3 Two Roles for End Systems: Clients and Servers

End systems play one of two roles during a given communication. A **client** is an end system that *initiates* a request. A **server** is an end system that *waits* for requests, processes them, and returns a response. The roles describe behavior in a single exchange, not the hardware itself: the same laptop can act as an HTTP client when you load a web page and as an SSH server when a colleague connects to it remotely. Most production systems are designed around this asymmetry — large server farms wait quietly until clients ask for something, then handle a flood of small, simultaneous requests.

Before the comparison table below, note what we are comparing: each row of the table contrasts a single property (who initiates, how many sit behind one address, whether the public can reach them) between the two roles, using the definitions we just established. Tables in this textbook always summarize material the prose has already covered.

| Property | Client | Server |
|----------|--------|--------|
| Initiates the conversation? | Yes — sends the first message | No — waits to be contacted |
| Typical scale | One per user | One serving many users |
| Network reachability | Often behind NAT, may have no public address | Usually has a stable, publicly reachable address |
| Lifetime of a connection | Short — opened for one task | Long — process runs continuously |
| Identification on the wire | Ephemeral port numbers | Well-known port numbers (e.g., 80, 443) |
| Failure tolerance | One client failure affects one user | One server failure can affect thousands |

A small but important refinement: in a **peer-to-peer (P2P)** architecture, end systems play *both* roles — each peer is both a client (asking other peers for data) and a server (answering requests from other peers). BitTorrent and many video-conferencing protocols use this model. Chapter 14 develops the P2P architecture in detail; for now, simply remember that "client" and "server" are roles in a conversation, not labels glued to hardware.

## 1.4 Where the Action Happens: The Edge and the Core

It is helpful to imagine a network as having two distinct regions. The **network edge** is where end systems live — the laptops, phones, IoT sensors, and servers that originate and consume data. The **network core** is the interior — the mesh of switches, routers, and high-bandwidth links that move data between edges. End systems are guests at the edge of the network; routers and switches are full-time residents of the core.

The edge and the core have different design priorities. Edge devices optimize for the experience of a single user or single application: latency, battery life, security, ease of configuration. Core devices optimize for the *aggregate* — the highest possible throughput, the lowest possible per-packet processing cost, the smallest possible chance of dropping traffic on the floor when the network is busy. Understanding which side of this divide a particular concept lives on tells you a great deal about the engineering trade-offs that drove its design.

#### Diagram: Edge versus Core in a Small Network

<details markdown="1">
<summary>Edge and core regions of a network with end systems, links, and interior nodes</summary>
Type: diagram
**sim-id:** edge-vs-core-topology<br/>
**Library:** vis-network<br/>
**Status:** Specified

Render a node-link diagram of a small network showing the edge–core distinction.

Layout:

- A horizontal canvas, 900 px wide by 500 px tall, responsive (scale to container width).
- Two visual zones with subtle background tints: a pale honey-amber band on the left and right thirds (the edges) and a pale slate band in the middle third (the core). Label the bands with large semi-transparent text "Network Edge", "Network Core", "Network Edge".

Nodes:

- Left edge: 4 end systems labeled "Laptop", "Phone", "Desktop", "IoT Sensor". Use a simple device icon (circle with a small monitor glyph) in honey amber (#F5A623).
- Right edge: 3 servers labeled "Web Server", "DNS Server", "Database". Use a server-rack glyph in honey amber.
- Core: 5 router nodes labeled "R1" through "R5", arranged in a partial mesh. Use a hexagonal glyph in slate (#546e7a).

Edges:

- Each end system on the left connects to either R1 or R2. Each server on the right connects to R4 or R5. The five core routers form a partial mesh: R1–R2, R1–R3, R2–R3, R3–R4, R3–R5, R4–R5.
- Style edge links (end-system-to-router) as thin honey-amber lines and core links (router-to-router) as thicker slate lines, to communicate that the core typically uses higher-bandwidth links.

Interactivity:

- Hover on any node shows a tooltip with the node's role: "End System (host)" for left/right edge devices, "Network Node (router)" for core devices.
- Hover on any edge shows a tooltip "Communication Link".

The diagram should be implemented with vis-network. Use the existing learning-graph viewer styling (rounded boxes, soft shadows). Disable physics-based jitter; lay out the graph deterministically.
</details>

The transition from edge to core is not a sharp line in real deployments — your home router, for example, sits at the very last hop of the core for an ISP and also at the first hop of your home edge. The distinction is conceptual but useful: it predicts which kinds of decisions a device is built to make.

| Property | Edge | Core |
|----------|------|------|
| Who lives here | End systems (hosts) | Routers and switches |
| Primary job | Run applications | Forward data on behalf of others |
| Optimized for | Per-user experience | Aggregate throughput |
| Typical link speed | 1 Gbps Ethernet, Wi-Fi, cellular | 10 Gbps and up, increasingly 100/400 Gbps fiber |
| State stored per flow | A lot (sockets, connection state) | Very little (just enough to forward) |
| Who pays for outages | The user whose app broke | Everyone whose traffic crosses the failed device |

## 1.5 What Connects Everything: Communication Links

A **communication link** is the physical or logical channel that carries bits between two network nodes. It can be a length of copper twisted-pair cable, a fiber-optic strand, a radio channel between a Wi-Fi client and an access point, or even a virtual tunnel running over another network. From the perspective of the nodes at the two ends, the link delivers a stream of bits and provides certain measurable properties — bandwidth, latency, error rate, and so on.

Every link has two important attributes you should keep in mind from the start:

- **Direction** — most links carry data in both directions, either simultaneously (full duplex) or one direction at a time (half duplex). A few specialized links are inherently one-way.
- **Sharing** — some links connect exactly two nodes (point-to-point), while others carry traffic for many nodes that share access through a contention protocol (broadcast or multi-access links, like classic Ethernet or Wi-Fi).

We treat the engineering of links — the signaling techniques, the encoding schemes, the physical media — formally in Chapters 5 and 6. For this chapter you only need the abstraction: a link is a pipe between two nodes that delivers bits with some bandwidth, some delay, and occasional errors.

## 1.6 Where the Host Meets the Wire: The Network Interface

A host does not connect to a link directly; it connects through a **network interface**. A network interface is the hardware component on a host (a Wi-Fi radio, an Ethernet card, a cellular modem) plus the operating-system software that drives it. The interface is the doorway between the host's CPU-and-memory world and the link's physical signals. Every interface has its own independent identifiers and its own independent queue of pending packets.

A single host can have many interfaces. Your laptop has at least two — Wi-Fi and Bluetooth — and probably more if you count the loopback interface, virtual interfaces created by VPN software, and any wired Ethernet ports. A datacenter server may have four high-speed network interfaces bonded together for redundancy and bandwidth. From the network's perspective, *each interface is a separate network node*, even when they all live inside the same physical box.

!!! mascot-tip "One host, many doors"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Buzz with a tip">
    When you read a packet capture and see traffic to or from "your computer," remember that the operating system chose *one specific interface* to send it through. Two interfaces on the same machine usually have different addresses, different speeds, and different failure modes. Always ask which interface a problem is happening on before assuming the host as a whole is at fault.

Unique identifiers attach to interfaces, not to hosts. That is why the next section talks about how each interface is named at three different layers of the protocol stack.

## 1.7 Three Identifiers, Three Layers

To send data to "the right place," the network needs to name *what* the right place is. Modern networks use three different identifiers at three different layers, and each one answers a different question about the destination. The three are the **MAC address**, the **IP address**, and the **port number**. Together, they form an address triple that locates a specific application running on a specific interface on a specific machine.

Before we examine the diagram below, here is what each identifier names, defined in plain language so the diagram has nothing left to introduce.

A **MAC address** (Media Access Control address) is a 48-bit number burned into a network interface at the factory. It identifies the *interface* uniquely on a local link. Every Ethernet card and every Wi-Fi radio in the world carries a MAC address, conventionally written as six hexadecimal pairs separated by colons — for example, `f0:18:98:01:23:45`. MAC addresses are used by the link layer to deliver frames between neighbors on the same physical or virtual link. They do not travel beyond a single link; once a packet crosses a router, the MAC addresses are rewritten.

An **IP address** is a numerical label assigned to a network interface for the purpose of *internetwork* delivery. IP addresses come in two versions: IPv4 (32 bits, written as four decimal numbers, e.g., `192.0.2.10`) and IPv6 (128 bits, written as eight hexadecimal groups, e.g., `2001:db8::1`). Unlike MAC addresses, IP addresses are *routable* — routers anywhere in the world can use them to forward a packet toward its destination. IP addresses are typically assigned by the network operator and may change over time, especially on mobile devices.

A **port number** is a 16-bit integer that identifies a specific *application or service* on a host. A host might be running dozens of network applications simultaneously — a browser, an email client, a chat application, a remote-desktop server. Each is identified by a port number on its host's IP address. Common services use **well-known ports**: port 80 for HTTP, port 443 for HTTPS, port 22 for SSH, port 53 for DNS. Outgoing connections from clients use **ephemeral ports**, drawn from a high-numbered range that the operating system assigns automatically and reuses after the connection closes.

The combination of an IP address and a port number is called a **socket** — the unique name of one end of an active conversation. Sockets get their own chapter (Chapter 14), but the term is worth knowing now.

#### Diagram: The Three Identifiers Across the Protocol Stack

<details markdown="1">
<summary>How MAC, IP, and port locate an application across the link, network, and transport layers</summary>
Type: infographic
**sim-id:** address-triple-stack<br/>
**Library:** p5.js<br/>
**Status:** Specified

Render an infographic that visually stacks the three identifiers against the three lower protocol layers they belong to.

Canvas: 800 px wide by 520 px tall, responsive to container width down to 360 px.

Layout:

- Three horizontal bands stacked vertically. From top to bottom: "Transport Layer (port number)", "Network Layer (IP address)", "Link Layer (MAC address)". Each band fills the full canvas width and is roughly 140 px tall.
- Color-code each band: transport in honey amber (#F5A623), network in signal blue (#1976D2), link in deep hive brown (#5D4037). Each band has a contrasting white label on the left edge.
- On the right side of each band, render an example value in large monospace font: `443` for transport, `2001:db8::1` for network, `f0:18:98:01:23:45` for link.
- On the left side of each band, render a one-sentence plain-English description: "Which application?" for transport, "Which host on the Internet?" for network, "Which neighbor on this link?" for link.

Interactivity:

- Hover on a band raises a callout that explains what the identifier looks like and gives a second example value.
- A small toggle button at the top labeled "IPv4 / IPv6" switches the network band's example between `192.0.2.10` and `2001:db8::1`.

The infographic should be implemented in p5.js using the existing MicroSim styling. Use a 1 px slate border between bands. Ensure the toggle is touch-friendly on mobile.

Learning objective (Bloom — Understanding): Students explain why three different identifiers are used together and which question each one answers.
</details>

The reason the network needs three identifiers — instead of one universal address — comes from the layered design. The link layer needs to deliver frames between neighbors; it does not need to know about the global Internet. The network layer needs to deliver packets across many links worldwide; it does not need to care which specific application on the destination host the data is for. The transport layer needs to deliver bytes to the right application on the destination host; it does not need to redo the routing work the network layer already did. Each layer keeps its own identifier and ignores the others.

!!! mascot-encourage "If three identifiers feels like a lot — that's normal"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Buzz cheering you on">
    Most networking confusion comes from blurring the three identifiers together. Whenever something seems mysterious — a connection that "should work but doesn't" — the first move is to ask which identifier is wrong: the MAC, the IP, or the port. *One hop at a time.* By the end of the book you will recognize each one on sight in a packet capture.

## 1.8 Putting It All Together: A Walkthrough

Imagine you open your browser and type `https://example.com`. Tracing the sentence we just wrote against the vocabulary of this chapter:

1. Your laptop is an **end system** (a host playing the client role).
2. Your laptop has at least one **network interface** — say, a Wi-Fi radio — with its own MAC address.
3. That interface is connected by a **communication link** (a Wi-Fi channel) to your home router, which is a **network node** sitting at the boundary of your home edge and your ISP's core.
4. Your laptop's IP address gets the request from the local network out to the broader Internet.
5. The packet traverses several router-to-router links in the **network core**, hopping from one network node to the next.
6. It reaches the **server** for `example.com`, another end system, sitting at the edge of a datacenter network.
7. The packet's destination IP address picks the right server interface; the destination **port number** (443) picks the right application — the web server software listening for HTTPS connections.

Every chapter that follows refines a piece of this story. Chapter 3 explains the layered architecture that made each step possible. Chapter 5 explains the physical signals on the Wi-Fi link. Chapter 9 explains how IP addresses are assigned and structured. Chapter 11 explains what HTTPS-over-TCP actually does on top of all this. The vocabulary in *this* chapter is the scaffolding everything else is built on.

#### Diagram: Interactive Network Explorer

<details markdown="1">
<summary>Click on hosts, links, and routers in a small network to inspect their identifiers</summary>
Type: microsim
**sim-id:** network-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that lets students click on elements of a small network and see their identifiers and role.

Canvas: 900 px wide by 600 px tall (responsive), with a 120 px control panel below the canvas.

Topology:

- 3 client end systems on the left (a laptop, a phone, a tablet), each with one labeled interface.
- 1 home router in the lower-left core, connected to all three clients.
- 2 ISP routers in the middle (R-ISP-1 and R-ISP-2) connected by core links.
- 1 web server on the right with two interfaces (one to the public network, one to a private backend).

Initial state: every node and link is rendered, but only the labels "Click an element to inspect" appear in the side panel.

Interactivity:

- Click on a host: the side panel shows "Role: End System (Host, Client)" and lists the host's interface(s), each with a generated MAC, IP, and one example port (80, 443, or an ephemeral 50000-range port for the client).
- Click on a router: the side panel shows "Role: Network Node (Router)", lists each interface with its MAC and IP, and notes "No port numbers — routers don't run user applications."
- Click on a link: the side panel shows "Communication Link", lists the two interfaces it connects, and indicates whether it is a wired Ethernet or Wi-Fi link.
- Click on the server: the side panel shows "Role: End System (Host, Server)" and lists the listening ports (80, 443) plus the IP and MAC of each interface.
- A "Reset" button clears the selection.
- A "Quiz Me" button enters a quiz mode: a question appears ("Which element here is a network node but not a host?") and the student must click the correct element to advance.

Visual styling:

- End systems: honey-amber circles with a device glyph.
- Routers: slate hexagons.
- Links: thin slate lines for wired, dashed honey-amber lines for Wi-Fi.
- Selected element: highlighted with a thick deep-purple border (#4a148c) and the side panel updates immediately.

Learning objectives:

- (Bloom — Remembering) Identify which devices in a topology are hosts, end systems, and network nodes.
- (Bloom — Understanding) Explain which identifiers (MAC, IP, port) belong to which kind of device.
- (Bloom — Applying) Distinguish a client port number from a server port number in a sample socket pair.

The MicroSim should be implemented in p5.js with no external dependencies. Use the existing MicroSim CSS theme. The side panel must remain visible on screens 480 px wide or wider; on narrower screens it stacks below the canvas.
</details>

## 1.9 Key Takeaways

The vocabulary in this chapter is the scaffolding for every later chapter. Before moving on, make sure you can answer the following without looking back:

- What three ingredients does *every* computer network have?
- What is the difference between a network node, a host, and an end system?
- In a single conversation, what role does a client play and what role does a server play?
- Where does the network edge end and the core begin? Why is the distinction useful?
- A communication link connects what to what? What two attributes does every link have?
- Why is a network interface a more useful unit of address than a whole host?
- Of the three identifiers — MAC, IP, port — which one identifies a neighbor on a link? Which one identifies a host on the Internet? Which one identifies an application on a host?

If any of those answers feel shaky, re-read the corresponding section before continuing to Chapter 2, where we add the next layer of vocabulary — the standards bodies that govern interoperability, and the data units (bits, bytes, frames, packets, segments, datagrams) that move through every network.

!!! mascot-celebration "First flight complete"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Buzz celebrating">
    You now have the complete cast of characters. Every later chapter will refer back to *hosts*, *interfaces*, *links*, and the three identifiers — so the vocabulary you just learned is doing real work from this point forward. Onward to Chapter 2 and the standards that make all of this interoperable. *Follow the packet.*
