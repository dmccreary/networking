---
title: SDN Architecture: Control vs. Data Plane
description: SDN Architecture: Control vs. Data Plane
status: scaffold
library: p5.js
bloom_level: TBD
---

# SDN Architecture: Control vs. Data Plane



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 16: SDN, NFV, Emerging Topics, and Capstone Projects](../../chapters/16-sdn-emerging-and-capstones/index.md).

```text
Type: infographic
**sim-id:** sdn-architecture-overview<br/>
**Library:** p5.js<br/>
**Status:** Specified

Render an interactive infographic of an SDN architecture with three vertically-stacked planes and the boundary protocols between them.

Canvas: 940 px wide by 600 px tall, responsive down to 360 px.

Layout:

- Top: "Application plane" — three rounded rectangles labeled "Traffic engineering", "Security policy", "Network monitoring".
- Middle: "Control plane" — a single rounded rectangle labeled "SDN Controller" (e.g., ONOS or OpenDaylight) with smaller boxes inside for "Topology", "Routing", "Policy".
- Bottom: "Data plane" — five forwarding devices (switches) connected in a partial mesh.
- Northbound API: arrows from applications down to the controller, labeled "REST / gRPC".
- Southbound API: arrows from controller to switches, labeled "OpenFlow / P4 / gNMI".

Interactivity:

- Click any plane to see a side-panel description and example components.
- Click any switch to see its installed flow table (a simplified list of match-action rules).
- Toggle "Failure mode: controller unreachable" — switches fall back to local default behavior; some functions degrade.
- Toggle "Inject application: load balance" — installs flow rules that hash specific fields and forward to the chosen back-end.

Visual style:

- Application plane: light yellow.
- Control plane: honey amber.
- Data plane: slate.
- Northbound and southbound APIs: dashed arrows in distinct colors.

Learning objective (Bloom — Understanding): Students explain the three-layer SDN architecture and the role of northbound and southbound APIs.
```

## Related Resources

- [Chapter 16: SDN, NFV, Emerging Topics, and Capstone Projects](../../chapters/16-sdn-emerging-and-capstones/index.md)
