---
title: "SDN Architecture: Control vs. Data Plane"
description: "Interactive p5.js MicroSim: sdn architecture: control vs. data plane."
image: /sims/sdn-architecture-overview/sdn-architecture-overview.png
og:image: /sims/sdn-architecture-overview/sdn-architecture-overview.png
twitter:image: /sims/sdn-architecture-overview/sdn-architecture-overview.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
quality_score: 0
---

# SDN Architecture: Control vs. Data Plane

<iframe src="main.html" height="602" width="100%" scrolling="no"></iframe>

[Run the SDN Architecture: Control vs. Data Plane MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Students explain the three-layer SDN architecture and the role of northbound and southbound APIs.

This MicroSim is built with p5.js and is width-responsive, so it adapts to
the width of the page or container it is embedded in.

## How to Use

Use the controls in the panel below the drawing area to explore the concept.
Adjust the sliders, toggle the options, and step through the stages to see how
each change affects what is shown.

## Specification

The full specification below is extracted from
[Chapter 16: SDN, NFV, Emerging Topics, and Capstone Projects](../../chapters/16-sdn-emerging-and-capstones/index.md).

```
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

## Iframe Embed Code

You can add this MicroSim to any web page by adding this HTML:

```html
<iframe src="https://dmccreary.github.io/networking/sims/sdn-architecture-overview/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students explain the three-layer SDN architecture and the role of northbound and southbound APIs.

### Bloom Taxonomy Level

**Understand**

### Suggested Classroom Use

1. **Predict** — Ask students to predict the behavior before they interact.
2. **Explore** — Have students manipulate the controls and observe the results.
3. **Explain** — Ask students to explain, in their own words, what they observed
   and how it connects to sdn, nfv, emerging topics, and capstone projects.

## References

- [Chapter 16: SDN, NFV, Emerging Topics, and Capstone Projects](../../chapters/16-sdn-emerging-and-capstones/index.md)
- [ACM/IEEE CS2023 Networking and Communication Knowledge Area](https://csed.acm.org/)
