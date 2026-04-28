# FAQ Generation Log

Generated: 2026-04-28

## Inputs read
- docs/course-description.md
- docs/learning-graph/concept-list.md (338 concepts)
- docs/glossary.md (338 terms)
- All 16 chapter index.md files (~5,800 lines total)

## Outputs written
- docs/faq.md — 104 questions across 6 categories
- docs/learning-graph/faq-chatbot-training.json — 104 entries with bloom_level, difficulty, concepts, keywords, source_links
- docs/learning-graph/faq-quality-report.md — quality metrics
- docs/learning-graph/faq-coverage-gaps.md — 38 high-priority, 129 medium, 10 low-priority uncovered concepts

## Stats
- Total questions: 104
- Categories: Getting Started, Core Concepts, Technical Detail, Common Challenges, Best Practice, Advanced Topics
- Anchor links: 0 (verified via grep)
- JSON validates: yes
- Concept coverage (tagged): 161/338 = 48% (many other concepts are discussed inside answers but not explicitly tagged)

## Notes
- The agent timed out before writing the coverage gaps and log files; these were written in a follow-up step.
- The chatbot JSON uses `entries` as the question array key (functionally equivalent to `questions`).
