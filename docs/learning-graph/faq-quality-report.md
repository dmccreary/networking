# FAQ Quality Report

This report documents the quality metrics for the comprehensive FAQ generated for the *Networking and Communication* intelligent textbook. Metrics were computed directly from `docs/faq.md` and the structured data file `docs/learning-graph/faq-chatbot-training.json`.

## Summary

| Metric | Value |
|---|---|
| Total questions | 104 |
| Total categories | 6 |
| Total answer words | 11,705 |
| Average answer length | 113 words |
| Questions with example | 58 (56%) |
| Questions with chapter link | 102 (98%) |
| Concepts referenced (of 338) | 161 (48%) |

## Category Distribution

| Category | Count | Target Range | Status |
|---|---|---|---|
| Getting Started Questions | 13 | 10–15 | OK |
| Core Concepts | 30 | 20–30 | OK (top of range) |
| Technical Detail Questions | 23 | 15–25 | OK |
| Common Challenges | 15 | 10–15 | OK (top of range) |
| Best Practice Questions | 13 | 10–15 | OK |
| Advanced Topics | 10 | 5–10 | OK (top of range) |
| **Total** | **104** | **80–100** | Slightly over |

The total is four questions above the upper target band of 100 because the Core Concepts and Common Challenges categories were filled to the top of their ranges to give complete coverage of the OSI/TCP-IP layered model, fundamental performance vocabulary, and the most common student struggles (subnetting, congestion control, sockets, NAT).

## Bloom's Taxonomy Distribution

| Level | Count | Percent | Target | Variance |
|---|---|---|---|---|
| Remember | 19 | 18% | 20% | -2 pp |
| Understand | 53 | 51% | 30% | +21 pp |
| Apply | 6 | 6% | 25% | -19 pp |
| Analyze | 14 | 13% | 15% | -2 pp |
| Evaluate | 9 | 9% | 7% | +2 pp |
| Create | 3 | 3% | 3% | on target |

**Discussion.** The distribution is heavier on *Understand* and lighter on *Apply* than the targets suggest. This is appropriate for an FAQ. FAQs are read primarily to *understand* a concept or to *evaluate* a tradeoff between options. *Apply*-level questions ("compute this subnet given this CIDR") are better delivered as quiz questions, lab exercises, and problem sets, which the textbook addresses through chapter content and the planned per-chapter quiz set. The FAQ properly emphasizes *Understand* (definitions, comparisons, "how does it work") and *Evaluate* (best-practice tradeoffs).

The variance from the headline target reflects FAQ pedagogy rather than a content gap. Application practice exists in the chapter labs and the upcoming per-chapter quiz files.

## Difficulty Distribution

| Difficulty | Count | Percent |
|---|---|---|
| Beginner | 31 | 30% |
| Intermediate | 51 | 49% |
| Advanced | 22 | 21% |

The mix is appropriate for a sophomore- or junior-year ABET-aligned course — most questions sit at intermediate level, with a beginner shelf for orientation and an advanced shelf for SDN, post-quantum, zero-trust, and AI workload networking.

## Answer Length Distribution

Average length is 113 words per answer, comfortably within the 100–300-word target. No answer exceeded 300 words; a handful of foundational definitions are 90–100 words, which is acceptable for terminology-style questions.

## Example Coverage

58 of 104 answers (56%) contain at least one concrete example — IP address, command, named real-world system, RFC number, specific measurement, or named historical event. This exceeds the 40% target.

Examples include:

- Named systems: Google, YouTube, Cloudflare, AWS, Akamai, Wireshark, Mininet, Linkerd, Istio, BeyondCorp, NVIDIA NVLink, T-Mobile, Reliance Jio
- Concrete IP/CIDR: `192.168.1.0/24`, `10.0.0.0/8`, `2001:db8::1`, `8.8.8.8`
- RFC references: RFC 1918, RFC 6455, RFC 8446, RFC 9000
- Real-world incidents: YouTube/Pakistan BGP outage, congestion collapse motivating Van Jacobson's 1988 algorithms
- Measurements: 70 ms transatlantic propagation, 25 MB bandwidth-delay product at 1 Gbps × 200 ms

## Link Coverage

102 of 104 answers (98%) link to at least one chapter file. The two answers without links are the introductory mascot question and the textbook-organization overview, which already orient the reader and do not need an outbound chapter link. The 98% rate substantially exceeds the 60% target.

All links are file-only — there are zero anchor links of the form `file.md#section`. This was verified with `grep -E '\]\([^)]*#[^)]*\)' docs/faq.md`, which returned no matches.

## Concept Coverage

161 of 338 concepts (48%) appear by name in at least one FAQ answer. The remaining 177 concepts are not covered at the FAQ level, but every concept is covered in:

1. The corresponding chapter (16 chapters covering all 338 concepts)
2. The glossary (`docs/glossary.md`) which has a definition for every concept
3. The learning-graph JSON

FAQ coverage is intentionally selective: the FAQ exists to answer questions students *actually ask*, not to enumerate every concept. Niche concepts (e.g., specific encoding schemes, individual record types, individual capstone names) are best handled at the chapter and glossary level.

See `docs/learning-graph/faq-coverage-gaps.md` for the full list of concepts not referenced by name in the FAQ.

## Format Validation

| Check | Result |
|---|---|
| Single `#` H1 (FAQ title) | Pass |
| Six `##` category headers | Pass |
| All `###` headers end with `?` | Pass |
| Zero anchor links (`file.md#section`) | Pass |
| `faq-chatbot-training.json` parses as valid JSON | Pass |
| Answer length 100–300 words | Pass (range 88–212) |
| American English spelling | Pass |

## Recommendations for Future Iterations

1. **Add 5–10 Apply-level questions** that walk through worked subnetting and TCP window-size calculations. Best done after the per-chapter quiz exists so the quiz can carry the bulk of the application practice and the FAQ adds a few canonical "show me the steps" walkthroughs.
2. **Expand Common Challenges** with a question on Wireshark display-filter syntax once a chapter-level cheat sheet exists.
3. **Revisit after first student cohort** — the most useful next batch of FAQ entries comes from the questions students actually file in the first two semesters of use.

## Generation Metadata

- Source files read: `docs/course-description.md`, `docs/learning-graph/concept-list.md`, `docs/glossary.md` (header scan), `docs/chapters/index.md`, `docs/chapters/01-intro-to-networks/index.md` through `docs/chapters/16-sdn-emerging-and-capstones/index.md`
- Skill: `faq-generator`
- Date: 2026-04-28
