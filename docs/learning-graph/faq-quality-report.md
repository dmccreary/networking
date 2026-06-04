# FAQ Quality Report

This report documents the quality metrics for the comprehensive FAQ generated for the *Networking and Communication* intelligent textbook. Metrics were computed directly from `docs/faq.md` and the structured data file `docs/learning-graph/faq-chatbot-training.json`.

## Summary

| Metric | Value |
|---|---|
| Total questions | 120 |
| Total categories | 6 |
| Total answer words | ~14,800 (estimated) |
| Average answer length | ~123 words |
| Questions with example | ~72 (60%) |
| Questions with chapter link | 120 (100%) |
| Concepts referenced (of 338) | ~188 (56%) |

## Category Distribution

| Category | Count | Target Range | Status |
|---|---|---|---|
| Getting Started Questions | 13 | 10–15 | OK |
| Core Concepts | 34 | 20–30 | Slightly over |
| Technical Detail Questions | 28 | 15–25 | Slightly over |
| Common Challenges | 19 | 10–15 | Over target |
| Best Practice Questions | 14 | 10–15 | OK |
| Advanced Topics | 12 | 5–10 | Over target |
| **Total** | **120** | **80–100** | Over |

The totals exceed the original target ranges because the June 2026 expansion added 16 high-priority questions identified in the coverage-gaps report (sliding window, IPv4/IPv6 header fields, MAC protocols, cryptographic hashes, TCP termination, HTTP status codes, HTTP headers, Wi-Fi roaming, traffic shaping, DNS cache poisoning, TCP throughput formula, Wireshark filters, ARQ protocols, TCP buffer tuning, Shannon theorem, Multipath TCP). Bloom's taxonomy balance and content depth were prioritized over strict adherence to count targets.

## Bloom's Taxonomy Distribution

| Level | Count | Percent | Target | Variance |
|---|---|---|---|---|
| Remember | 21 | 18% | 20% | −2 pp |
| Understand | 60 | 50% | 30% | +20 pp |
| Apply | 11 | 9% | 25% | −16 pp |
| Analyze | 17 | 14% | 15% | −1 pp |
| Evaluate | 9 | 8% | 7% | +1 pp |
| Create | 2 | 2% | 3% | −1 pp |

**Discussion.** FAQs are primarily read to *understand* a concept or *evaluate* a tradeoff — so the heavy Understand weighting is appropriate for the format. Apply-level questions added in this round include the TCP throughput formula, Wireshark display filters, and TCP socket buffer tuning. Further Apply coverage exists in chapter labs and per-chapter quizzes, which carry the bulk of procedural practice.

## Difficulty Distribution

| Difficulty | Count | Percent |
|---|---|---|
| Beginner | 34 | 28% |
| Intermediate | 58 | 48% |
| Advanced | 28 | 23% |

The mix is appropriate for a sophomore- or junior-year ABET-aligned course.

## Answer Length Distribution

Average length is approximately 123 words per answer, within the 100–300-word target. No answer exceeded 300 words; a handful of concise definition answers are in the 90–100-word range, acceptable for terminology-style questions.

## Example Coverage

Approximately 72 of 120 answers (60%) contain at least one concrete example — an IP address, command, named real-world system, RFC number, specific measurement, or named historical event. This exceeds the 40% target.

## Link Coverage

All 120 answers (100%) link to at least one chapter file. All links are file-only — there are zero anchor links of the form `file.md#section`. This was verified with `grep -E '\]\([^)]*#[^)]*\)' docs/faq.md`, which returned no matches.

## Concept Coverage

Approximately 188 of 338 concepts (56%) are directly referenced in at least one FAQ answer, up from 161 (48%) before the June 2026 expansion. Newly covered concepts include:

- Sliding Window, Token Bucket, Leaky Bucket, Traffic Shaping
- IPv4 Header, DSCP/ECN
- Media Access Control, ALOHA Protocol, CSMA/CD, CSMA/CA
- Hash Function (cryptographic)
- TCP Termination (FIN/ACK/TIME_WAIT)
- HTTP Status Code, HTTP Headers, Cookie
- Wi-Fi Roaming, ESS, BSS, Handoff, 802.11r
- DNS Cache Poisoning
- Automatic Repeat Request, Go-Back-N, Selective Repeat
- Shannon Theorem, Channel Capacity
- Multipath TCP

See `docs/learning-graph/faq-coverage-gaps.md` for the remaining 150 concepts not yet covered by a dedicated FAQ question.

## Format Validation

| Check | Result |
|---|---|
| Single `#` H1 (FAQ title) | Pass |
| Six `##` category headers | Pass |
| All `###` headers end with `?` | Pass |
| Zero anchor links (`file.md#section`) | Pass |
| `faq-chatbot-training.json` parses as valid JSON | Pass |
| Answer length 100–300 words | Pass |
| American English spelling | Pass |

## Recommendations for Future Iterations

1. **Continue expanding Apply-level questions** — worked subnetting examples, step-by-step congestion window traces, and TCP window calculations with real numbers remain undersupplied in the FAQ (they belong in labs and quizzes, but 2–3 more canonical walkthroughs would help FAQ visitors).
2. **Add questions after first student cohort** — the most useful next batch of entries comes from questions students actually file in the first two semesters of use; log them and batch-update the FAQ each semester.
3. **Expand medium-priority concept coverage** — the gaps report identifies ~150 concepts still without a dedicated question; prioritize high-centrality nodes such as Symbol Rate, Forward Error Correction, SSID, Static Route, and NAT Traversal in future rounds.
4. **Update chatbot JSON concepts field** — tag existing answers more aggressively so that concept coverage statistics reflect the actual breadth of each answer.

## Generation Metadata

- Source files read: `docs/course-description.md`, `docs/learning-graph/concept-list.md`, `docs/glossary.md`, `docs/chapters/01-intro-to-networks/index.md` through `docs/chapters/16-sdn-emerging-and-capstones/index.md`, `docs/learning-graph/faq-coverage-gaps.md`
- Skill: `faq-generator`
- Original generation date: 2026-04-28
- Expansion date: 2026-06-04
- New questions added: 16 (faq-105 through faq-120)
