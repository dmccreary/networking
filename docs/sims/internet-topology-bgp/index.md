---
title: Internet Topology and BGP Relationships
description: Internet Topology and BGP Relationships
status: scaffold
library: vis-network
bloom_level: TBD
---

# Internet Topology and BGP Relationships



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 10: Routing and Forwarding](../../chapters/10-routing-and-forwarding/index.md).

```text
Type: microsim
**sim-id:** internet-topology-bgp<br/>
**Library:** vis-network<br/>
**Status:** Specified

Render an interactive node-link diagram of a small Internet showing autonomous systems and the BGP relationships between them.

Canvas: 960 px wide by 620 px tall, responsive down to 360 px.

Topology:

- 4 tier-1 ISPs at the top, fully meshed with peering links.
- 6 tier-2 ISPs in the middle, each connected to one or two tier-1s via transit, and to several other tier-2s via peering.
- 8 tier-3 ISPs and content providers at the bottom, each with one or two transit providers.
- Special nodes: a tier-1 anchored CDN (e.g., Cloudflare, AS 13335) directly peering with most others; a major content network (e.g., Google, AS 15169) with many peering links.

Edge styles:

- Transit links: thick honey-amber arrows pointing from customer to provider; transit traffic flows in both directions.
- Peering links: dashed slate edges, no arrow direction.
- Each link has a hover tooltip showing the relationship type and the typical traffic volume.

Interactivity:

- Click any AS to see its full set of relationships and the AS path it would use to reach any other AS in the diagram.
- Click any pair of ASes (source and destination) to highlight the BGP-preferred path in green and other available paths in dim gray.
- Toggle "Hide transit relationships" to show only peering links — useful for understanding the dense peering mesh among large networks.
- "Add IXP" toggle introduces a virtual IXP node to which many ASes connect; demonstrate that one IXP can replace dozens of pairwise peering links.

Visual style:

- Tier-1 ASes: rounded rectangles in deep slate.
- Tier-2 ASes: rounded rectangles in mid-slate.
- Tier-3 ASes / content: rounded rectangles in honey amber.
- Currently-selected path: green highlight.

Learning objectives:

- (Bloom — Understanding) Students explain the difference between peering and transit relationships.
- (Bloom — Analyzing) Students decompose a BGP-preferred AS path into its commercial relationships.
- (Bloom — Evaluating) Students judge how IXPs and direct peering with content providers reduce transit costs and improve performance.

Implement in vis-network with the existing learning-graph viewer styling.
```

## Related Resources

- [Chapter 10: Routing and Forwarding](../../chapters/10-routing-and-forwarding/index.md)
