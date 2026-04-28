# Learning Graph Generator Session Log

- **Skill:** learning-graph-generator
- **Skill version:** 0.04
- **Run date:** 2026-04-27
- **Project:** Networking and Communication intelligent textbook
- **Working directory:** `/Users/danmccreary/Documents/ws/networking`

## Helper script versions

| Script | Version |
|--------|---------|
| csv-to-json.py | 0.03 |
| analyze-graph.py | unversioned (latest from skill package) |
| taxonomy-distribution.py | unversioned (latest from skill package) |
| add-taxonomy.py | unused this run (replaced by inline range mapping) |
| validate-learning-graph.sh / .py | latest from skill package |

## Steps executed

### Step 0 — Setup
Confirmed `docs/`, `mkdocs.yml`, and `docs/course-description.md` present. `docs/learning-graph/` already existed (from a prior partial run with `course-description-assessment.md`).

### Step 1 — Course description quality assessment
**Skipped.** YAML frontmatter of `docs/course-description.md` declared `quality_score: 96`, which is above the 85 threshold. Existing `course-description-assessment.md` left in place.

### Step 2 — Concept enumeration
Generated **338 concepts** in `docs/learning-graph/concept-list.md` covering the full ABET CAC / CS2023 NC scope: foundations, data units, layered architecture, performance, physical layer, link layer, LAN switching, wireless and mobility, IPv4/IPv6 and addressing, routing, transport, application protocols, security, sockets/programming, operations and measurement, SDN/NFV/emerging, and 5 capstones plus incident postmortem and benchmarking.

All labels Title Case and ≤32 characters.

### Step 3 — Dependency CSV
Wrote `docs/learning-graph/learning-graph.csv` with 338 rows, columns `ConceptID,ConceptLabel,Dependencies`. Pipe-delimited dependencies. Four foundational concepts: Computer Network (1), Standard (15), Bit (21), Signal (71).

### Step 4 — Quality validation
Ran `python analyze-graph.py learning-graph.csv quality-metrics.md`.

Key results:

- Valid DAG, 0 cycles, 0 self-dependencies.
- 0 orphaned nodes; 1 connected component (100% connectivity).
- Average dependencies per concept: 1.57.
- Maximum chain length: 16 (Bit → Byte → Header → Encapsulation → Layered Architecture → OSI Reference Model → Network Layer → Routing → Routing Algorithm → Path Vector Routing → BGP Protocol → Autonomous System → Internet Topology → Content Delivery Network → Edge Computing → Fog Computing).
- Top indegree: RFC Document (18), TCP (17), Application Layer (16), Network Layer (14).
- Terminal nodes: 155 (45.9%) — slightly above the 5–40% healthy band; expected for a course with capstones plus many specialty leaf protocols.

Estimated overall quality score: **~85/100**.

### Step 5 — Concept taxonomy
Wrote `concept-taxonomy.md` with 15 categories: FOUND, ARCH, PERF, PHYS, LINK, WIRE, NET, ROUT, TRANS, APP, SEC, PROG, OPS, SDN, CAP. (15 is at the upper edge of the skill's "~12 ±2-3" guideline; the natural groupings of the OSI/TCP-IP stack plus distinct operations and capstone buckets justify it.)

### Step 5b — Taxonomy names JSON
Wrote `taxonomy-names.json` with descriptive Title Case names for all 15 IDs plus MISC. Required by `csv-to-json.py` for `classifierName`.

### Step 6 — Add taxonomy to CSV
Bypassed `add-taxonomy.py` (its config supports only one ID range per category; PERF spans two ranges 58–70 and 221–230). Used an inline Python range-to-ID mapping. Largest category 9.5% (FOUND, LINK), smallest 2.1% (CAP). All under the 30% threshold.

### Step 7 — metadata.json
Wrote Dublin-Core-style metadata: title, description, creator (Dan McCreary), date 2026-04-27, version 1.0, format, schema URL, license CC BY-NC-SA 4.0 DEED.

### Steps 8–9 — Generate learning-graph.json
Ran `python csv-to-json.py learning-graph.csv learning-graph.json color-config.json metadata.json taxonomy-names.json`.

- Color config file not provided; defaults used. Color assignments shown in script output.
- Output: 15 groups, 338 nodes, 523 edges, 4 foundational concepts.
- Strict schema validation via `validate-learning-graph.sh` failed because the schema expects `color` as a nested object while `csv-to-json.py` (per the skill's Step 8 documentation) emits a flat string. The graph viewer expects the flat format the script produces; validation is marked optional in the skill instructions.

### Step 10 — Taxonomy distribution
Ran `python taxonomy-distribution.py learning-graph.csv taxonomy-distribution.md`. Confirmed balanced distribution. Note: the script uses raw TaxonomyIDs as labels for most categories (only "FOUND" got a friendly name); cosmetic — counts and percentages are correct.

### Step 11 — Learning graph index.md
Created `docs/learning-graph/index.md` from `index-template.md`, substituting "TEXTBOOK_NAME" → "Networking and Communication" and tuning the foundational-concept count (10 → 4) and category count (12 → 15) to match this run.

### Step 12 — Session log
This file.

## Files created or updated

- `docs/learning-graph/concept-list.md`
- `docs/learning-graph/learning-graph.csv`
- `docs/learning-graph/quality-metrics.md`
- `docs/learning-graph/concept-taxonomy.md`
- `docs/learning-graph/taxonomy-names.json`
- `docs/learning-graph/metadata.json`
- `docs/learning-graph/learning-graph.json`
- `docs/learning-graph/learning-graph-schema.json` (copied from skill)
- `docs/learning-graph/taxonomy-distribution.md`
- `docs/learning-graph/index.md`
- `docs/learning-graph/analyze-graph.py` (copied from skill)
- `docs/learning-graph/csv-to-json.py` (copied from skill)
- `docs/learning-graph/taxonomy-distribution.py` (copied from skill)
- `docs/learning-graph/validate-learning-graph.py` (copied from skill)
- `docs/learning-graph/validate-learning-graph.sh` (copied from skill)
- `logs/learning-graph-generator-0.04-2026-04-27.md` (this file)

## Open issues / follow-ups for the user

1. **Review concept list** — `concept-list.md` should be reviewed before chapter generation. Adding/removing concepts later costs many tokens.
2. **Strict schema validation mismatch** — schema and `csv-to-json.py` disagree on the shape of `groups[*].color`. Either the schema or the script should be updated to match. Output is functional in the graph viewer.
3. **Terminal node ratio (45.9%)** — slightly above the suggested healthy band. Could be reduced by adding more advanced/capstone concepts that depend on currently terminal protocol details (SMTP-on-cloud, BGP-at-scale, etc.) — only worth doing if the capstones don't already cover them.
4. **mkdocs.yml nav** — the existing nav has the original 5 learning-graph entries. The Introduction page (`index.md`) is referenced; no new files were added that need additional nav lines beyond what was already configured.
