---
title: Application Layer Protocols
description: The protocols that ride on TCP, UDP, and QUIC — DNS (hierarchy, records, resolvers, caching, DNSSEC), HTTP/1.1, HTTP/2, HTTP/3, HTTPS, REST design, WebSocket, gRPC, mail (SMTP, IMAP, POP3), file/remote access (FTP, SSH, Telnet), and infrastructure protocols (DHCP, SNMP, NTP).
generated_by: claude skill chapter-content-generator
date: 2026-04-28 01:08:00
version: 0.07
---

# Chapter 13: Application Layer Protocols

## Summary

This chapter covers the protocols that ride on TCP, UDP, and QUIC: DNS (hierarchy, record types, recursive vs. iterative resolvers, caching, DNSSEC, cache poisoning), HTTP/1.1, HTTP/2, HTTP/3, HTTPS, REST design, WebSockets, gRPC, mail (SMTP, IMAP, POP3), file/remote access (FTP, SSH, Telnet), and infrastructure protocols (DHCP, SNMP, NTP). Students will be able to read packet captures of real application traffic by the end.

## Concepts Covered

This chapter covers the following 30 concepts from the learning graph:

1. DNS
2. DNS Hierarchy
3. DNS Record Type
4. Recursive Resolver
5. Authoritative Server
6. Root Name Server
7. DNS Caching
8. DNSSEC
9. HTTP Protocol
10. HTTP Methods
11. HTTP Status Code
12. HTTP Headers
13. Cookie
14. HTTP One One
15. HTTP Two
16. HTTP Three
17. HTTPS
18. REST Architecture
19. WebSocket
20. GRPC
21. SMTP
22. IMAP
23. POP3
24. FTP
25. SSH Protocol
26. Telnet
27. DHCP
28. SNMP
29. NTP
30. DNS Cache Poisoning

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: Standards, Data Units, and Encapsulation](../02-standards-and-encapsulation/index.md)
- [Chapter 3: Network Architecture and Layered Models](../03-architecture-and-layering/index.md)
- [Chapter 9: The Network Layer and IP Addressing](../09-network-layer-and-ip/index.md)
- [Chapter 11: The Transport Layer](../11-transport-layer/index.md)
- [Chapter 12: Network Security](../12-network-security/index.md)

---

!!! mascot-welcome "What the network is actually carrying"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Buzz the bee waving welcome">
    Welcome back. The hive's lower layers move pollen and water; its upper layers — communication, larva care, hive defense — give those resources meaning. Networks are the same. Every TCP segment is carrying *something*: a web request, a DNS lookup, an email, a database query. *Let's trace the route!* This chapter is the catalog of what every byte you've followed is actually doing.

## 13.1 The Application Layer in Practice

Every protocol so far has been infrastructure: links, routes, addresses, transports. The **application layer** is where applications live, and it is by far the most heterogeneous layer in the stack. Every application chooses (or invents) its own message format, its own state machine, and its own naming conventions, and uses the transport layer to ship those messages around. This chapter walks through the application protocols that carry the overwhelming majority of Internet traffic.

The chapter clusters them by function: name resolution (DNS), web (HTTP/HTTPS, REST, WebSocket, gRPC), mail, remote access (SSH, Telnet, FTP), and infrastructure (DHCP, SNMP, NTP). The point is not encyclopedic coverage — it is to make sure you can recognize each protocol on a packet capture and name what it does.

## 13.2 DNS: The Internet's Phone Book

The **Domain Name System (DNS)** maps human-friendly names like `example.com` to the IP addresses that the network layer needs. DNS is, in a sense, the most-used Internet protocol — every TCP connection to a hostname starts with a DNS query — and yet most users never think about it.

DNS is organized as a **hierarchy** (the **DNS hierarchy**). The hierarchy is rooted at a special "." (the root), branches into top-level domains (`.com`, `.org`, `.us`, `.io`, ...), then second-level domains (`example.com`, `wikipedia.org`), then sub-domains (`mail.example.com`, `en.wikipedia.org`), and so on. Each level of the hierarchy delegates authority for the level below: the root delegates `.com` to a TLD operator (Verisign), the TLD delegates `example.com` to whoever registered it, and that registrant delegates further as they see fit.

Three kinds of server make DNS work:

- **Root name servers** sit at the top of the hierarchy. There are 13 logical root servers (`a.root-servers.net` through `m.root-servers.net`), each implemented as hundreds of physical servers anycast worldwide. Root servers answer queries about TLD delegation.
- **Authoritative servers** are the source of truth for some specific zone. The authoritative servers for `example.com` know everything about `example.com` and its subdomains; they were configured by the domain owner.
- **Recursive resolvers** are the workhorses that clients actually talk to. A recursive resolver receives a query from a client, walks the hierarchy on the client's behalf (asking the root, then the TLD, then the authoritative server), and returns the final answer. The well-known public resolvers `8.8.8.8` (Google), `1.1.1.1` (Cloudflare), and `9.9.9.9` (Quad9) are recursive resolvers.

A typical DNS query goes:

1. Client asks its configured recursive resolver for `www.example.com`.
2. Recursive resolver checks its cache. Cache miss; proceed.
3. Resolver asks a root name server: "where do I find `.com`?"
4. Root replies with the TLD servers for `.com`.
5. Resolver asks a `.com` TLD server: "where do I find `example.com`?"
6. TLD replies with the authoritative servers for `example.com`.
7. Resolver asks the authoritative server: "what's the address for `www.example.com`?"
8. Authoritative server replies with an A record (e.g., `93.184.216.34`).
9. Resolver caches the answer and returns it to the client.

DNS uses UDP for most queries (fast, simple, low overhead) and TCP for responses larger than 512 bytes or for AXFR (zone transfers). DNS over TLS (DoT) and DNS over HTTPS (DoH) are increasingly common alternatives that protect query privacy from network observers.

## 13.3 DNS Record Types

A **DNS record type** specifies what kind of information is being requested or returned. The most common types:

| Type | What it stores | Example |
|------|----------------|---------|
| A | IPv4 address | `example.com → 93.184.216.34` |
| AAAA | IPv6 address | `example.com → 2606:2800:220:1::1946` |
| CNAME | Alias to another name | `www.example.com → example.com` |
| MX | Mail exchange (mail server name + priority) | `example.com → 10 mail.example.com` |
| NS | Name server for the zone | `example.com → ns1.example.com` |
| TXT | Free-form text (SPF, DKIM, verification records) | `example.com → "v=spf1 -all"` |
| SOA | Start of authority (zone metadata) | (zone admin info) |
| PTR | Reverse mapping (IP → name) | `34.216.184.93.in-addr.arpa → example.com` |
| SRV | Service location with priority and weight | `_sip._tcp.example.com → 10 5 5060 sipserver.example.com` |
| CAA | Certificate authority authorization | `example.com → 0 issue "letsencrypt.org"` |

Every name in DNS can have multiple records of different types attached to it. A web server might have an A and AAAA record for its IP addresses, an MX record for its mail, a TXT record for SPF, and a CAA record limiting which CAs can issue certificates for it.

## 13.4 DNS Caching and TTL

If every DNS query had to walk the full hierarchy, DNS would be far too slow. **DNS caching** at every level of the system makes the protocol practical. Recursive resolvers cache answers for the duration specified by each record's **Time To Live (TTL)** — typically minutes to days. Within an organization, cached answers serve thousands of queries from one walk of the hierarchy.

TTL is a tradeoff. Long TTLs (24 hours) reduce traffic and load on authoritative servers but slow down propagation when records change (e.g., a server migration). Short TTLs (60 seconds) propagate changes quickly but multiply the query load. Modern operations teams typically use medium TTLs (5–60 minutes) and shorten them temporarily before planned changes.

Browsers and operating systems also cache DNS answers. Even a small amount of caching dramatically reduces effective latency: a name lookup that takes 50 ms uncached takes effectively zero on a cache hit.

## 13.5 DNSSEC and Cache Poisoning

DNS was designed without authentication. A response packet that arrives at a resolver is trusted as long as it claims to be from the right server and has the right transaction ID. This makes DNS vulnerable to **DNS cache poisoning**: an attacker who can inject a forged response (or just guess the transaction ID and timing) tricks the resolver into caching a wrong answer. The poisoned cache then redirects every client's traffic for that name to a server of the attacker's choice.

Two responses to this risk:

**Source-port randomization** (Dan Kaminsky's 2008 fix). Resolvers issue queries from a random source port, multiplying the attacker's guess space by the size of the port range. This made cache poisoning much harder but did not eliminate it.

**DNSSEC (DNS Security Extensions)**, defined in RFCs 4033/4034/4035, adds cryptographic signatures to DNS records. Each zone signs its records with a private key; the parent zone signs the child's public key in a chain of trust rooted at the DNS root key. A DNSSEC-validating resolver verifies the chain of signatures and rejects any answer that doesn't match. DNSSEC adoption is uneven — the root and most TLDs are signed, but only a minority of second-level domains have enabled it. The deployment friction is real: DNSSEC adds operational complexity, and the consequences of a misconfiguration (a signed zone that fails to validate) is total unreachability of the domain.

DoT and DoH (DNS over TLS / HTTPS) protect query *privacy* but not record *authenticity* — the resolver still has to be trusted to give honest answers. DNSSEC and DoH/DoT solve different problems.

#### Diagram: DNS Resolution Walkthrough

<details markdown="1">
<summary>Animated DNS query traversing root, TLD, and authoritative servers with caching</summary>
Type: microsim
**sim-id:** dns-resolution-walkthrough<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that animates a DNS resolution from the user's laptop through their recursive resolver and the DNS hierarchy.

Canvas: 960 px wide by 620 px tall, responsive down to 360 px. A 100 px control panel sits below.

Layout:

- Five labeled nodes arranged top to bottom: "Laptop", "Recursive Resolver", "Root", "TLD Server (.com)", "Authoritative Server (example.com)".
- Bidirectional arrows show queries (down) and answers (up). Each query/answer is labeled with the question/answer.
- A "cache" panel beside the recursive resolver shows currently-cached records with their remaining TTLs.

Animation:

- Step 1: Laptop sends "A example.com?" to resolver. Cache miss.
- Step 2: Resolver asks Root: "Where can I find .com?" Root returns NS records for .com TLD.
- Step 3: Resolver asks .com TLD: "Where can I find example.com?" TLD returns NS records.
- Step 4: Resolver asks Authoritative: "A example.com?" Authoritative returns the IP.
- Step 5: Resolver caches each answer with its TTL and returns the final IP to the laptop.

Subsequent queries: a second query for the same name is answered from cache instantly, demonstrating caching benefits. A third query for `www.example.com` walks only to the authoritative server (TLD info already cached).

Controls panel:

- Buttons: Step / Play / Reset.
- Toggle: "Enable DNSSEC" — adds signature exchanges and verification steps.
- Toggle: "Cache poisoning attack" — shows an attacker injecting a forged response and the resolver caching it (without DNSSEC); with DNSSEC the forged response is rejected.
- Speed slider for animation pace.

Visual style:

- Nodes: rounded rectangles with role-specific icons.
- Queries: honey-amber arrows.
- Answers: slate arrows.
- Cache panel: yellow background with timestamps counting down.

Learning objectives:

- (Bloom — Understanding) Students explain the DNS hierarchy and the role of each tier.
- (Bloom — Analyzing) Students decompose a DNS resolution and identify which queries are answered from cache vs. fresh lookups.
- (Bloom — Evaluating) Students judge how DNSSEC and randomization defend against cache poisoning.

Implement in pure p5.js with the existing MicroSim CSS theme.
</details>

## 13.6 HTTP: The Web's Application Protocol

The **HTTP (HyperText Transfer Protocol)** is the protocol of the web. Originally designed to deliver hypertext documents, HTTP has grown into the universal request-response protocol for almost every modern client-server application — browsers, mobile apps, microservice APIs, IoT firmware updates, and more.

HTTP is **request-response**: the client sends a request, the server returns a response, and the exchange is complete. HTTP is also (officially) stateless — every request stands on its own, and the protocol does not preserve information between requests. Stateful behavior (login sessions, shopping carts) is layered on top through cookies and tokens.

Three versions of HTTP are in active use:

- **HTTP/1.1** (1997, RFC 7230 et al.) — text-based protocol over a TCP connection, with persistent connections and pipelining. Still widely used.
- **HTTP/2** (2015, RFC 7540) — binary framing, header compression (HPACK), and multiplexing of many streams over one TCP connection. Solved most of HTTP/1.1's performance problems but still subject to TCP head-of-line blocking.
- **HTTP/3** (2022, RFC 9114) — runs over QUIC instead of TCP. Solves head-of-line blocking and adds 0-RTT setup. Now the dominant protocol for major sites.

**HTTPS** is HTTP over TLS — there is no separate "HTTPS protocol," just HTTP wrapped in encryption. Modern browsers and operating systems push aggressively for HTTPS by default; HTTP without TLS is increasingly treated as a security warning.

### HTTP Methods

An **HTTP method** is the verb in a request — the action being performed. The standard methods:

| Method | Purpose | Idempotent? |
|--------|---------|-------------|
| GET | Retrieve a resource | Yes |
| POST | Create or submit data | No |
| PUT | Replace a resource | Yes |
| DELETE | Remove a resource | Yes |
| PATCH | Partially update a resource | No (typically) |
| HEAD | Like GET, but headers only | Yes |
| OPTIONS | Inquire about supported methods | Yes |

Idempotency is a useful property: GET, PUT, and DELETE can be safely retried because doing them twice produces the same result as doing them once.

### HTTP Status Codes

Every HTTP response carries a **status code** — a three-digit number with a standardized meaning. Codes are grouped by their first digit:

- **1xx — Informational** (rare): `100 Continue`, `101 Switching Protocols`.
- **2xx — Success**: `200 OK`, `201 Created`, `204 No Content`.
- **3xx — Redirection**: `301 Moved Permanently`, `302 Found`, `304 Not Modified`.
- **4xx — Client error**: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `429 Too Many Requests`.
- **5xx — Server error**: `500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`.

A network engineer or web developer reads status codes constantly. A flood of 5xx codes signals server-side problems; 4xx codes indicate client-side or auth issues; 3xx redirects are usually harmless but can chain into infinite loops.

### HTTP Headers and Cookies

**HTTP headers** are key-value pairs that accompany each request and response. Headers carry an enormous amount of metadata: content type and length, cache directives, encoding (compression), authentication credentials, language preferences, user agent, and dozens of others. The header is text in HTTP/1.1 and binary-compressed in HTTP/2 and HTTP/3, but the conceptual model is the same.

A **cookie** is a small piece of state that the server sends in a `Set-Cookie` response header, which the client then echoes back in subsequent requests' `Cookie` header. Cookies are how login sessions, preferences, and tracking work on the web. Modern security practice attaches several attributes (`HttpOnly`, `Secure`, `SameSite`) to cookies to protect against XSS and CSRF attacks.

## 13.7 REST and the Web API Style

The dominant architectural style for designing HTTP APIs is **REST (Representational State Transfer)**, articulated by Roy Fielding in his 2000 dissertation. REST is not a protocol; it is a set of constraints on how to use HTTP for application APIs:

- Resources are identified by URLs.
- Operations on resources use the standard HTTP methods (GET to read, POST to create, PUT/PATCH to update, DELETE to remove).
- Representations of resources are typically JSON or XML.
- Stateless: each request contains all the information the server needs to process it.
- Uniform interface: all resources are accessed through the same idiom.

A REST API for a blog might expose `/posts` (collection of all posts), `/posts/42` (specific post), `/posts/42/comments` (comments on that post). `GET /posts/42` reads it; `PUT /posts/42` replaces it; `DELETE /posts/42` removes it; `POST /posts/42/comments` adds a comment. The URL paths and HTTP methods together name the operation, and the body carries data when needed.

REST is the dominant style for new APIs but not the only one. **GraphQL** (a single endpoint that accepts queries describing what data the client wants) and **gRPC** (next section) are alternative approaches with their own strengths.

## 13.8 WebSocket and gRPC

Two specialized application protocols solve problems HTTP cannot.

**WebSocket**, defined in RFC 6455, is a bidirectional, persistent communication channel between client and server, established by upgrading an HTTP connection. Once established, both sides can send messages at any time without the request-response constraint of HTTP. WebSockets are how live chat, collaborative editing, real-time dashboards, and game backends typically deliver low-latency updates. The handshake reuses HTTP's port 80/443 (so it traverses firewalls and proxies that pass HTTP), but after the upgrade, the protocol is its own thing.

**gRPC** is a high-performance RPC (remote procedure call) framework built on HTTP/2. gRPC defines services and message types in **Protocol Buffers** (a compact binary serialization format), generates client and server code in many languages, and supports streaming in both directions. gRPC's strengths over REST are efficiency (binary encoding is much smaller than JSON), cross-language schema sharing, and built-in streaming. Its costs are tooling complexity and the lack of human-readable wire format. gRPC dominates internal microservice communication at large companies (Google, Netflix, Square) and is increasingly common in public APIs as well.

| Property | HTTP/REST | WebSocket | gRPC |
|----------|-----------|-----------|------|
| Direction | Request-response | Bidirectional | Bidirectional, streaming |
| Encoding | JSON / text | Application-defined | Protocol Buffers (binary) |
| Schema | Documentation | Application-defined | `.proto` files |
| Browser support | Native | Native | Limited (gRPC-Web) |
| Typical use | Public APIs, web frontends | Live updates, chat, games | Internal microservices |

## 13.9 Email Protocols: SMTP, IMAP, POP3

Email is the oldest large-scale application on the Internet. Three protocols dominate.

**SMTP (Simple Mail Transfer Protocol)**, defined in RFC 5321, is the protocol that delivers mail between mail servers. When you send an email, your mail client (or web frontend) hands the message to your outgoing SMTP server, which uses SMTP to relay it to the recipient's mail server, which delivers it to the recipient's mailbox. SMTP runs on port 25 (server-to-server), 587 (authenticated client submission), or 465 (TLS-wrapped SMTPS). SMTP itself has no authentication; modern deployments add SPF, DKIM, and DMARC to prevent spoofing and the relays do TLS to prevent eavesdropping.

**IMAP (Internet Message Access Protocol)**, RFC 3501, is the protocol mail clients use to read messages stored on a server. IMAP keeps the canonical copy of a mailbox on the server, and the client synchronizes a local cache. Messages stay on the server until deleted; folders, flags, and threading are server-side. IMAP is the right choice when users want to access the same mailbox from multiple devices.

**POP3 (Post Office Protocol version 3)**, RFC 1939, is the older alternative to IMAP. POP3 downloads messages to the client and (typically) deletes them from the server. It's a one-device-at-a-time model that has largely been superseded by IMAP, but is still encountered in legacy systems and in some lightweight environments.

The end-to-end picture: SMTP carries mail between servers; IMAP or POP3 lets a client read what's in its mailbox.

## 13.10 Remote Access: SSH and Telnet, Plus FTP

Three classic protocols handle remote access and file transfer.

**Telnet** (RFC 854) is the original interactive remote-shell protocol. It opens a TCP connection on port 23 and exchanges keystrokes and screen output as plain text. Telnet has no encryption and no authentication beyond a username and password sent in cleartext. It is used today only for dedicated console-server access on local networks; on the public Internet it is essentially extinct because of its security properties.

**SSH (Secure Shell)**, RFC 4251, is Telnet's modern replacement. SSH provides encrypted shell access, secure file transfer (`scp`, `sftp`), port forwarding, and tunneling. The protocol authenticates servers by their host keys (cached on first connection — the famous "known hosts" prompt) and clients by passwords or, more commonly, by public-key authentication. SSH listens on port 22 and is the universal protocol for administrative access to Linux and Unix systems.

**FTP (File Transfer Protocol)**, RFC 959, is a 1971-vintage protocol for transferring files. FTP uses a control connection (port 21) for commands and a separate data connection for each file or directory listing. FTP also has no encryption; FTP-over-TLS (FTPS) and SFTP-over-SSH are the modern replacements. FTP retains a long tail in some industries (publishing, scientific data) but is rarely used in new systems.

| Protocol | Port | Encryption | Modern alternative |
|----------|------|------------|--------------------|
| Telnet | 23 | None | SSH |
| SSH | 22 | Always | (this is the modern one) |
| FTP | 21 + data ports | None (unless FTPS) | SFTP / SCP / HTTPS file APIs |

## 13.11 Infrastructure Protocols: DHCP, SNMP, NTP

Three protocols quietly keep networks operational.

**DHCP (Dynamic Host Configuration Protocol)**, RFC 2131, automatically assigns IP addresses (and other configuration: subnet mask, default gateway, DNS servers, NTP servers) to hosts on a network. When a client boots and joins a network, it broadcasts a DHCP Discover; a DHCP server responds with an Offer; the client accepts with a Request; the server confirms with an Ack. The exchange takes a fraction of a second and is the default way every device gets its IP configuration.

**SNMP (Simple Network Management Protocol)**, RFC 3411 et al., is the protocol network operators use to monitor and configure routers, switches, and servers. SNMP exposes a managed device's state as a tree of variables (the **MIB**, Management Information Base) and lets monitoring systems read those variables periodically. Most enterprise monitoring (Nagios, Zabbix, PRTG) collects SNMP data. SNMPv3 added authentication and encryption; older versions (SNMPv1, SNMPv2c) used cleartext community strings and are appropriate only on protected management networks.

**NTP (Network Time Protocol)**, RFC 5905, synchronizes clocks across the Internet. NTP servers form a hierarchy of strata, with stratum 0 being authoritative time sources (atomic clocks, GPS) and each stratum below synchronizing from the one above. NTP achieves accuracy of milliseconds across the Internet and microseconds on a local network — accuracy that is essential for log correlation, certificate validation, and any cryptographic protocol that uses timestamps. Clock skew of more than a few minutes typically breaks TLS (because certificates fail validation) and Kerberos (which has a ±5-minute clock-skew tolerance by default).

## 13.12 Putting It Together: A Single Page Load

Open a browser and type `https://example.com`. In the moments before the page renders, the application protocols of this chapter coordinate in roughly this order:

1. **DNS lookup.** The browser asks the operating system for `example.com`'s IP. The OS asks the recursive resolver. The resolver returns A and AAAA records (cached or freshly fetched).
2. **TCP / QUIC connection.** The browser opens a connection to the chosen IP on port 443. With HTTP/3, this is a QUIC connection over UDP; with HTTP/2 or HTTP/1.1, it's TCP.
3. **TLS handshake.** Inside the TCP/QUIC connection, TLS negotiates the session. The server presents its X.509 certificate; the browser validates the chain. (Or for HTTP/3, all of TLS happens in the same QUIC handshake.)
4. **HTTP request.** The browser sends `GET / HTTP/2\r\n` plus headers — including any cookies it has for `example.com`. Headers are HPACK-compressed.
5. **HTTP response.** The server returns `200 OK` with content-type, content-length, cache-control, and other headers, plus the HTML body.
6. **Subresource loading.** The browser parses the HTML, identifies images, scripts, stylesheets, and fonts, and (re)issues HTTP requests for each. HTTP/2 and HTTP/3 multiplex these over the existing connection.
7. **WebSocket or fetch.** If the page uses real-time features, it may upgrade to a WebSocket or open additional fetch streams.
8. **Cookies and analytics.** Background requests send cookies, analytics events, and telemetry to various domains the page references.
9. **Connection idle.** The HTTP/2 or HTTP/3 connection stays open for further interactions; eventually the browser closes it.

Every protocol from this chapter shows up in some way. You can confirm by opening your browser's developer tools (Network tab) on any modern site and watching the requests and responses. The exact pattern of which version, which methods, which headers, and which connections are reused tells the whole performance story of the page.

!!! mascot-encourage "If the catalog feels overwhelming — that's normal"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Buzz cheering you on">
    The application layer is the most heterogeneous layer in the stack. Nobody memorizes every protocol on first read. *One hop at a time.* Keep this chapter as a reference — when you see a strange port number on a packet capture, look it up here. The recurring patterns (request-response over TCP, datagram over UDP, hierarchy with caching) will become second nature.

## 13.13 Key Takeaways

The application layer is what the rest of the stack exists to carry. Before moving on, make sure you can answer the following without looking back:

- Walk through a DNS resolution for a name your local resolver has never seen.
- Name five DNS record types and what each is used for.
- What is DNSSEC, and what attack does it prevent? Why is its adoption uneven?
- Compare HTTP/1.1, HTTP/2, and HTTP/3 on transport, multiplexing, and head-of-line blocking.
- Name five HTTP methods and one status code from each of the 2xx, 3xx, 4xx, 5xx classes.
- What is REST? How does it use HTTP methods?
- Compare WebSocket and gRPC on direction, encoding, and typical use case.
- Compare SMTP, IMAP, and POP3 on what each does and where each runs.
- Why has SSH almost completely replaced Telnet?
- For DHCP, SNMP, and NTP, name what each protocol does and one consequence of it failing.

If any of those answers feel shaky, re-read the corresponding section before continuing to Chapter 14, where we move from *using* protocols to *writing* them — sockets, blocking vs. non-blocking I/O, and designing your own application-layer protocol over TCP.

!!! mascot-celebration "The catalog of carried bytes"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Buzz celebrating">
    You can now read a packet capture and name what every flow is. The next chapter shifts gears: how do you *write* a program that talks to these protocols, or designs new ones? The Berkeley sockets API is one of the most enduring interfaces in computing. *Follow the packet.*
