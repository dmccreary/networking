---
title: Network Programming with Sockets
description: Building networked applications — the Berkeley sockets API, TCP and UDP sockets, the bind/listen/accept/connect lifecycle, blocking and non-blocking I/O, asynchronous patterns (select, poll, epoll, kqueue), client-server and peer-to-peer architectures, and NAT traversal (STUN, TURN).
generated_by: claude skill chapter-content-generator
date: 2026-04-28 01:18:00
version: 0.07
---

# Chapter 14: Network Programming with Sockets

## Summary

This chapter teaches students to build networked applications: the Berkeley sockets API, TCP and UDP sockets, socket addresses, the bind/listen/accept/connect lifecycle, send and receive operations, blocking and non-blocking I/O, asynchronous patterns (select, poll, epoll, kqueue), client-server and peer-to-peer architectures, and NAT traversal techniques (STUN, TURN). Hands-on socket programming bridges theory and practice.

## Concepts Covered

This chapter covers the following 18 concepts from the learning graph:

1. Berkeley Sockets API
2. TCP Socket
3. UDP Socket
4. Socket Address
5. Bind Operation
6. Listen Operation
7. Accept Operation
8. Connect Operation
9. Send Receive Operation
10. Blocking IO
11. Non Blocking IO
12. Asynchronous IO
13. Select And Poll
14. Epoll And Kqueue
15. Client Server Model
16. Peer To Peer Model
17. NAT Traversal
18. STUN And TURN

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Introduction to Networks and Communication](../01-intro-to-networks/index.md)
- [Chapter 3: Network Architecture and Layered Models](../03-architecture-and-layering/index.md)
- [Chapter 9: The Network Layer and IP Addressing](../09-network-layer-and-ip/index.md)
- [Chapter 11: The Transport Layer](../11-transport-layer/index.md)

---

!!! mascot-welcome "Now you write the code"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Buzz the bee waving welcome">
    Welcome back. The previous chapters explained how the network *works*. This chapter is how *you* talk to it. Every networked application — your browser, your editor's syntax server, the chat client you used yesterday — sits on top of the same Berkeley sockets API that has been more or less stable since 1983. *Let's trace the route!* By the end of this chapter you can write a working TCP server in any language.

## 14.1 The Berkeley Sockets API

The **Berkeley sockets API** is the system-call interface every modern operating system provides for network programming. It originated in BSD Unix at UC Berkeley in 1983 and has been faithfully reimplemented or wrapped in essentially every language and runtime since: C, C++, Python, Java, Go, Rust, Node.js, .NET, and many more. The vocabulary is universal — even when the syntax differs, the operations are the same.

The core abstraction is the **socket** — an operating system handle that represents one endpoint of a network conversation. A socket has a type (TCP or UDP, plus a few less-common ones), an address family (IPv4 or IPv6), and, once active, a bound or connected pair of socket addresses (local and remote). The OS manages the protocol state machine; the application reads and writes bytes through the socket as if it were a file.

Socket programming has the same shape in every language. The differences are syntactic; the underlying behavior is governed by the OS. If you can write a Python TCP server, you can read a C TCP server, and vice versa. The function names line up almost exactly: `socket()`, `bind()`, `listen()`, `accept()`, `connect()`, `send()`, `recv()`, `close()`.

## 14.2 Socket Addresses

A **socket address** identifies one endpoint of a connection. For IPv4 sockets, the socket address is a `(host_ip, port)` pair packed into a `struct sockaddr_in`. For IPv6, it is `(host_ip, port, flow_info, scope_id)` in a `struct sockaddr_in6`. The two structures share a common prefix (the address family) so generic socket calls can take either kind of address.

Every operating system provides helper functions to convert between human-readable strings and packed `sockaddr` structures: `inet_pton`, `inet_ntop`, `getaddrinfo`. Modern code uses `getaddrinfo` exclusively because it handles both IPv4 and IPv6 transparently and resolves DNS names along the way.

Two key socket addresses appear at every endpoint:

- **Local socket address** — the IP and port the socket is bound to on this host.
- **Remote socket address** — the IP and port of the other end (set by `connect()` on a client, or by `accept()` on a server).

A connected TCP socket is uniquely identified by the 4-tuple `(local IP, local port, remote IP, remote port)`. The OS uses this 4-tuple to route incoming packets to the right socket.

## 14.3 TCP Sockets: The Server Lifecycle

A **TCP socket** carries the reliable byte-stream service introduced in Chapter 11. Server-side TCP socket programming follows a well-defined lifecycle:

1. `socket()` — create a fresh socket, specifying TCP and an address family.
2. `bind()` — associate the socket with a specific local address (typically `0.0.0.0` for "any interface" plus a chosen port).
3. `listen()` — mark the socket as a listening socket and set the backlog (queue depth for incoming connections waiting to be accepted).
4. `accept()` — block until an incoming connection arrives; return a new socket representing that connection plus the client's remote address. The original listening socket continues to listen for more connections.
5. `recv()` and `send()` (or `read()` / `write()`) — read incoming bytes and write outgoing bytes on the per-connection socket.
6. `close()` — close the per-connection socket when the conversation ends.

Below is a minimal Python TCP server. Before reading the code, here is what each part does in plain language: the server creates a listening socket on port 8080, accepts one connection at a time, echoes any received bytes back to the client, and closes when the client disconnects.

```python
import socket

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server.bind(('0.0.0.0', 8080))
server.listen(5)
print("Listening on port 8080")

while True:
    client, addr = server.accept()
    print(f"Connected: {addr}")
    while True:
        data = client.recv(4096)
        if not data:
            break
        client.sendall(data)
    client.close()
```

The `SO_REUSEADDR` socket option lets the server restart immediately after a previous instance crashed, even if the port is still in TIME_WAIT (Chapter 11). Without it, you would have to wait for the kernel to clear the TIME_WAIT state before the bind succeeds.

## 14.4 TCP Sockets: The Client Lifecycle

Client-side TCP is simpler:

1. `socket()` — create a socket.
2. `connect()` — initiate a TCP handshake with a remote address. The OS sends SYN, waits for SYN+ACK, sends ACK, and returns when the connection is established (or fails).
3. `send()` and `recv()` — exchange bytes.
4. `close()` — close.

A matching Python TCP client to talk to the server above:

```python
import socket

client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect(('127.0.0.1', 8080))
client.sendall(b"hello, server\n")
response = client.recv(4096)
print(f"Server replied: {response!r}")
client.close()
```

The `connect()` call hides the entire three-way handshake. The OS does the SYN, SYN+ACK, ACK exchange, sets up the connection state, and returns once `ESTABLISHED`. The application never sees the handshake itself.

## 14.5 UDP Sockets: Connectionless Programming

A **UDP socket** is even simpler because there is no connection to set up. The lifecycle:

1. `socket()` — create a UDP socket.
2. `bind()` — associate with a local address (servers; clients can skip this and let the OS pick).
3. `sendto()` — send a datagram to a specified destination address.
4. `recvfrom()` — receive a datagram and learn its source address.
5. `close()` — close.

A minimal Python UDP server:

```python
import socket

server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
server.bind(('0.0.0.0', 8080))

while True:
    data, addr = server.recvfrom(4096)
    print(f"Received {data!r} from {addr}")
    server.sendto(data, addr)
```

Notice the absence of `listen()`, `accept()`, and per-client sockets — UDP has no connection state, so a single socket handles all clients. UDP servers typically include the client's address with each datagram and respond to whatever address sent the request. UDP-server design is structurally simpler than TCP-server design but pushes more responsibility (reliability, ordering, framing) into the application.

## 14.6 The Send/Receive Operations

The **send/receive operations** look simple — pass a buffer of bytes — but several subtleties matter in production code.

For **TCP**, `send()` may not transfer all the bytes you ask. It returns the number actually sent, and your application must loop until everything has been written. The `sendall()` convenience function (in Python; equivalent to a loop in C) does this automatically. Similarly, `recv()` may return fewer bytes than the buffer size — TCP is a *byte stream*, not a message protocol, so the application must define its own message framing (length prefix, delimiter, fixed-size record). Treating each `recv()` as one application message is a classic networking-newcomer bug.

For **UDP**, `sendto()` either delivers a whole datagram or fails. Datagrams that exceed the path's MTU may be fragmented (IPv4) or rejected (IPv6 without source fragmentation). `recvfrom()` returns one whole datagram at a time, never split or merged. UDP message boundaries are preserved; TCP's are not.

| Property | TCP `send()` | UDP `sendto()` |
|----------|--------------|-----------------|
| Atomic with respect to message boundaries | No | Yes |
| Partial transfer possible | Yes | No (whole datagram or failure) |
| Application-level framing required | Yes (length prefix, delimiter, etc.) | No |
| Maximum message size | Effectively unlimited (byte stream) | Path MTU minus overhead |

#### Diagram: TCP and UDP Socket Lifecycle

<details markdown="1">
<summary>Side-by-side state diagrams of the TCP server, TCP client, and UDP socket lifecycles</summary>
Type: infographic
**sim-id:** socket-lifecycle-diagram<br/>
**Library:** p5.js<br/>
**Status:** Specified

Render an interactive infographic that shows the system-call sequence for TCP server, TCP client, and UDP socket programs side by side, with arrows indicating the cross-process synchronization points (e.g., the SYN exchange between TCP client connect and TCP server accept).

Canvas: 960 px wide by 640 px tall, responsive down to 360 px.

Layout:

- Three vertical lanes labeled "TCP Server", "TCP Client", and "UDP (peer)".
- Each lane lists system calls in order from top to bottom: TCP Server (`socket → bind → listen → accept → recv/send → close`), TCP Client (`socket → connect → send/recv → close`), UDP peer (`socket → bind (optional) → sendto/recvfrom → close`).
- Synchronization arrows: dashed arrows between the TCP client `connect` and the TCP server `accept` indicating the three-way handshake. Smaller arrows between client `send` and server `recv` indicating data flow.

Interactivity:

- Click any system call in any lane to see a side panel with: the C function signature, the Python equivalent, what the call blocks on (if anything), and what error conditions to handle.
- Toggle "Show non-blocking variants" inserts the `O_NONBLOCK` versions and the `EAGAIN`/`EWOULDBLOCK` error path for each blocking call.
- Toggle "Show kernel state machine" overlays the TCP state transitions (CLOSED → LISTEN → SYN_RCVD → ESTABLISHED → CLOSE_WAIT → ...) on the TCP server lane.

Visual style:

- Each system call as a labeled rounded rectangle.
- Synchronization arrows in honey amber (TCP) and slate (UDP).
- Side panel with monospace function signatures.

Learning objective (Bloom — Understanding): Students explain the order of system calls for TCP and UDP and identify which calls block on network events.
</details>

## 14.7 Blocking I/O: The Default Mode

By default, socket operations are **blocking**: they suspend the calling thread until the operation completes. `accept()` blocks until a connection arrives. `recv()` blocks until at least one byte is available. `connect()` blocks until the handshake completes (or fails). `send()` blocks if the kernel's send buffer is full.

Blocking I/O is the simplest programming model. Each thread handles one connection from `accept()` to `close()`, calling `recv()` and `send()` in straightforward sequence. The downside is one thread per connection — fine for a chat server with 10 concurrent users, expensive for a web server with 10,000.

The traditional solution to blocking-IO scaling is the **thread-per-connection** model: spawn a new thread (or reuse one from a thread pool) for each accepted connection, so each connection's blocking calls only block its own thread. Apache HTTP Server's classic prefork and worker MPMs work this way. Modern operating systems can scale to thousands of threads, but each thread has memory and scheduling overhead, and locking overhead grows with thread count.

## 14.8 Non-Blocking I/O

A **non-blocking** socket operation returns immediately, even if it would have blocked: `recv()` returns `EAGAIN` / `EWOULDBLOCK` if no data is yet available, `connect()` returns `EINPROGRESS` if the handshake is still in flight, `send()` returns the number of bytes that could be queued without waiting (which may be zero). The application is responsible for retrying when the socket becomes ready.

To put a socket in non-blocking mode in C, set the `O_NONBLOCK` flag with `fcntl()`. In Python, call `sock.setblocking(False)`. The socket's behavior on every subsequent operation is now non-blocking until the flag is cleared.

Non-blocking I/O is rarely useful by itself — repeatedly retrying a non-blocking `recv()` in a loop just busy-waits. It becomes useful when combined with an *event notification* mechanism that tells the application when to retry.

## 14.9 The Event-Loop Pattern: select, poll, epoll, kqueue

The classic high-performance server pattern is the **event loop**: maintain a set of sockets, ask the OS which ones are ready for I/O, do work on those, and repeat. Four mechanisms have been used over the years.

**`select`** is the original POSIX event-notification call. The application passes three sets of file descriptors (read-ready, write-ready, exception) plus a timeout; `select()` blocks until any descriptor is ready or the timeout expires, then returns which ones. `select()` is portable and simple but has well-known limits: the maximum descriptor number is small (typically 1024), and the entire set must be passed and re-walked on every call, so cost grows linearly with the number of watched descriptors.

**`poll`** is `select`'s improved cousin. The application passes an array of `pollfd` structures, each specifying a descriptor and the events of interest. `poll` has no fixed maximum descriptor and is slightly more efficient than `select`, but still re-walks the array each call.

**`epoll`** (Linux-specific) is the modern high-performance event-notification mechanism. The application registers descriptors of interest once, then calls `epoll_wait()` to receive only the events that have occurred since the last call. `epoll` cost scales with the number of *active* descriptors, not the total set, making it suitable for servers with hundreds of thousands of mostly-idle connections. Most modern Linux servers (nginx, HAProxy, Node.js, Redis) use `epoll` underneath.

**`kqueue`** is the BSD/macOS equivalent of `epoll`, with similar scalability properties and a slightly different API. Like `epoll`, it provides edge-triggered or level-triggered notification.

| Mechanism | Platform | Cost per call | Edge-triggered? |
|-----------|----------|---------------|-----------------|
| `select` | All POSIX | O(N) where N is set size | Level-triggered only |
| `poll` | All POSIX | O(N) where N is array size | Level-triggered only |
| `epoll` | Linux | O(active events) | Both supported |
| `kqueue` | BSD, macOS | O(active events) | Both supported |
| `io_uring` | Linux (modern) | O(active events) | Asynchronous I/O completion |

Most languages and frameworks abstract these mechanisms. Python's `asyncio`, Node.js's libuv, Go's runtime scheduler, and Rust's tokio all build on one or more of them. Application code uses higher-level constructs (`async`/`await`, channels) and the runtime translates to the right OS mechanism for the platform.

## 14.10 Asynchronous I/O

**Asynchronous I/O** is a more aggressive programming model: instead of polling for *readiness* and then doing the I/O yourself, the application *initiates* an I/O operation and is later notified of its *completion*. The kernel does the buffer copying in the background. Linux's recent `io_uring` interface and Windows IOCP (I/O Completion Ports) implement this model.

Asynchronous I/O reduces context switches and avoids small, fragmented reads. It is increasingly the foundation for high-performance networking on Linux and Windows; macOS still relies primarily on `kqueue` readiness notification. The line between non-blocking I/O with event notification and true asynchronous I/O is blurring as `io_uring` adoption grows.

## 14.11 Client-Server and Peer-to-Peer Architectures

The dominant architectural pattern for networked applications is the **client-server model**: clients initiate requests; servers wait for them and respond. The pattern's strengths are operational (servers run on infrastructure that can be monitored, scaled, and secured) and architectural (any client can reach any server through standard naming and routing). HTTP, DNS, SMTP, and most Internet services are client-server.

The alternative is the **peer-to-peer (P2P) model**: every node is both a client and a server, exchanging data with other peers without a central authority. P2P shines when:

- The data being shared is too large for a single server to deliver economically (BitTorrent, video distribution).
- No central authority is desired (cryptocurrencies, decentralized chat).
- Network reach to peers is sometimes better than to a centralized server (peer-discovery in local mesh networks).

The technical challenge of P2P is that any two peers need to find each other and connect. On the public Internet, that means traversing NATs.

## 14.12 NAT Traversal: STUN and TURN

Recall from Chapter 9 that NAT translates private addresses to a single public address, and that incoming connections to private hosts are typically blocked. Two peers, each behind their own NAT, cannot simply `connect()` to each other — neither has a routable address the other can reach. **NAT traversal** is the family of techniques that let them establish a connection anyway.

**STUN (Session Traversal Utilities for NAT)**, RFC 8489, lets a peer discover its public-facing IP and port as seen by the outside world. The peer sends a STUN request to a public STUN server; the STUN server replies with the source address it observed. The peer now knows its own external address and can publish it to a coordination service for the other peer to find. Modern WebRTC, VoIP, and many P2P games use STUN.

Once both peers know each other's external addresses, they perform **hole punching**: each peer sends UDP packets toward the other's external address simultaneously. Each peer's NAT, seeing the outbound packet, opens a temporary mapping. Inbound packets from the other peer arrive on this mapping and are delivered. Hole punching works for most NAT types, but not all.

**TURN (Traversal Using Relays around NAT)**, RFC 8656, is the fallback when hole punching fails (e.g., behind symmetric NATs, which assign different external ports for each destination). TURN routes traffic through a public relay server, so each peer connects outbound to the relay and the relay forwards. TURN works in essentially every NAT scenario but doubles bandwidth costs (every byte traverses the relay twice) and adds latency.

Most production systems combine STUN and TURN: try STUN-mediated direct connection first; fall back to TURN if direct doesn't work. The combination is usually orchestrated by a signaling service (typically over WebSocket) that helps peers exchange their candidate addresses. WebRTC's ICE (Interactive Connectivity Establishment) framework wraps all of this into a single API.

#### Diagram: NAT Traversal with STUN and TURN

<details markdown="1">
<summary>Animated demonstration of two peers establishing a connection through NAT using STUN and TURN</summary>
Type: microsim
**sim-id:** nat-traversal-stun-turn<br/>
**Library:** p5.js<br/>
**Status:** Specified

Build an interactive MicroSim that shows two peers, each behind their own NAT, discovering each other's external addresses via STUN and falling back to TURN when hole punching fails.

Canvas: 960 px wide by 600 px tall, responsive down to 360 px. A 100 px control panel sits below.

Topology:

- Peer A (left): private IP `10.0.0.5:50001`, behind NAT-A with public IP `203.0.113.1`.
- Peer B (right): private IP `192.168.1.10:50002`, behind NAT-B with public IP `198.51.100.1`.
- STUN server in the middle-top with public address `stun.example.com:3478`.
- TURN relay in the middle-bottom with public address `turn.example.com:3478`.
- Signaling service (small box top-center) carries candidate addresses between peers.

Animation modes (selectable from a tab control):

- **STUN successful (cone NAT)**: Each peer sends a STUN binding request; the server replies with the observed external address. Peers exchange candidates via signaling. Each peer sends a probe to the other's external address; both NATs open mappings; direct UDP flow established.
- **STUN fails, TURN required (symmetric NAT)**: STUN returns an external address, but the symmetric NAT changes ports per destination, so the address is useless for B → A. TURN: peer A allocates a relay binding on the TURN server. Peer B connects to the relay address. Traffic flows through the relay.

Controls panel:

- Mode tabs: Cone NAT (STUN) / Symmetric NAT (TURN).
- Buttons: Step / Play / Reset.
- Toggle: "Show signaling messages" reveals the candidate-exchange flow.
- Toggle: "Visualize bandwidth path" shows how TURN doubles bytes-on-wire compared to direct STUN.

Visual style:

- Peers: rounded rectangles with laptop icons.
- NATs: hexagons with translation tables visible.
- STUN/TURN servers: rounded rectangles with cloud icons.
- Successful path: green; relay path: amber.

Learning objectives:

- (Bloom — Understanding) Students explain how STUN discovers external addresses.
- (Bloom — Analyzing) Students compare the bandwidth and latency cost of STUN-direct vs. TURN-relayed connections.
- (Bloom — Evaluating) Students judge when TURN is required given NAT type.

Implement in pure p5.js with the existing MicroSim CSS theme.
</details>

## 14.13 Putting It Together: A Multi-User Chat Server

A small chat server brings together every concept in this chapter:

```python
import asyncio

clients = set()

async def handle_client(reader, writer):
    addr = writer.get_extra_info('peername')
    clients.add(writer)
    try:
        while True:
            data = await reader.read(4096)
            if not data:
                break
            for w in clients:
                if w is not writer:
                    w.write(data)
                    await w.drain()
    finally:
        clients.discard(writer)
        writer.close()
        await writer.wait_closed()

async def main():
    server = await asyncio.start_server(handle_client, '0.0.0.0', 8080)
    print("Chat server on port 8080")
    async with server:
        await server.serve_forever()

asyncio.run(main())
```

The server uses Python's `asyncio` framework — which is built on top of `epoll` on Linux, `kqueue` on macOS — so a single thread efficiently handles thousands of concurrent connections. Each connection's `handle_client` coroutine is suspended at every `await` until the OS reports the relevant event (data ready, send buffer drained, connection closed). When the OS notifies, the runtime resumes the coroutine, processes the event, and yields again.

This 20-line server demonstrates the full pattern: accept connections, read messages, broadcast to all other connected clients, clean up on disconnect — all without any explicit threads or callbacks.

## 14.14 Practical Tips for Production Networking Code

A few hard-won pieces of advice that show up in every networking codebase:

- **Always handle short reads and short writes.** Wrap `recv()` and `send()` in framing logic that reads/writes the exact byte count you need.
- **Set TCP keepalive for long-lived connections.** Without it, a network outage may go undetected for hours; with it, idle connections are probed periodically and broken connections are detected.
- **Set timeouts on every blocking call.** A socket with no timeout can hang forever if the peer disappears silently.
- **Close sockets in `finally` blocks.** Leaked sockets exhaust file-descriptor limits and break servers in subtle ways.
- **Use `SO_REUSEADDR` (and on Linux, `SO_REUSEPORT`) carefully.** They simplify restarts and load balancing but have non-obvious semantics.
- **Always validate untrusted data.** Network input comes from untrusted sources; assume it is malicious until proven otherwise.
- **Profile under load.** Many networking bugs (lock contention, wakeup storms, allocator pressure) appear only at high load. Always test with realistic concurrency.

!!! mascot-thinking "TCP is harder than it looks"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Buzz thinking carefully">
    The first networked program a student writes "works" in the simple case but breaks under realistic conditions: long messages get split across `recv()` calls, slow senders cause `send()` to block, the kernel's send buffer fills under load. Production-quality network code is mostly about handling those *edge* cases gracefully. The 20-line chat server above is correct because it relies on `asyncio` to handle them; a from-scratch C version of the same server would be hundreds of lines.

## 14.15 Key Takeaways

Network programming is the bridge between protocol theory and working code. Before moving on, make sure you can answer the following without looking back:

- Walk through the system-call sequence for a TCP server.
- Walk through the system-call sequence for a TCP client.
- How does UDP socket programming differ from TCP?
- Why must application code handle short reads and short writes on TCP?
- Compare blocking, non-blocking, and asynchronous I/O.
- Compare `select`, `poll`, `epoll`, and `kqueue` on portability and scaling behavior.
- What is the client-server model? When does a peer-to-peer model fit better?
- What is NAT traversal, and why is it harder than ordinary connection establishment?
- Compare STUN and TURN. When is TURN required?
- Why does production networking code need timeouts on every blocking call?

If any of those answers feel shaky, re-read the corresponding section before continuing to Chapter 15, where we move to network operations — the day-to-day work of running networks at scale: monitoring, configuration management, change control, packet capture, and incident response.

!!! mascot-celebration "You can write the code now"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Buzz celebrating">
    The Berkeley sockets API has carried the Internet for forty years. You now know enough to build a server, debug it under load, and make it survive a hostile network. *Follow the packet.*
