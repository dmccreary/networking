# Networking and Communication — Project Guide

This is an ABET CAC-aligned college-level intelligent textbook covering the foundations of networking and communication. Content is organized around the ACM/IEEE CS2023 Networking and Communication knowledge area.

## Learning Mascot: Buzz the Honey Bee

### Character Overview

- **Name**: Buzz
- **Species**: Honey bee
- **Personality**: Curious, methodical, communicative, encouraging
- **Catchphrase**: "Let's trace the route!"
- **Visual**: Round, plump honey bee with black-and-amber striped body, translucent wings, large kind eyes, tiny antennae, and small round scholarly glasses. No clothing or other accessories — legs and arms remain free and expressive.

### Why a Bee?

Honey bees use the **waggle dance** to communicate the direction, distance, and quality of food sources to other foragers. It is one of nature's clearest examples of a *signaling protocol* — encoded, lossy, decentralized, and astonishingly effective. The colony itself behaves like a distributed network: thousands of independent agents coordinating without central control. Buzz is a constant reminder that *networks are how information moves between agents*, whether those agents are bees, routers, or processes.

### Voice Characteristics

- Speaks plainly; favors short sentences over jargon-laden ones
- Uses occasional bee/hive metaphors when they genuinely clarify (don't force them)
- Refers to students as "you" — direct, never condescending
- Methodical: when explaining a process, walks through it step by step
- Signature phrases: *"Let's trace the route!"*, *"Follow the packet."*, *"One hop at a time."*

### Mascot Admonition Format

Always place mascot images in the admonition body, never in the title bar. Use `md_in_html` syntax with the `<img>` tag floated left:

    !!! mascot-welcome "Title Here"
        <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Buzz waving welcome">
        Body text goes here after the img tag.

**Image path depth:** The `src` is relative to the rendered page URL, not the markdown file. For a chapter page at `docs/chapters/01-intro/index.md` (which renders at `chapters/01-intro/index.html`), use `../../img/mascot/`. Count the number of `../` needed from the rendered page back to `docs/`.

### Placement Rules

| Context | Admonition Type | Frequency |
|---------|----------------|-----------|
| General sidebar / aside | `mascot-neutral` | As needed |
| Chapter opening | `mascot-welcome` | Once per chapter |
| Key concept / "aha" moment | `mascot-thinking` | 2–3 per chapter |
| Practical tip or command-line hint | `mascot-tip` | As needed |
| Common mistake or pitfall | `mascot-warning` | As needed |
| Difficult content (subnetting, congestion control, sockets) | `mascot-encourage` | Where students may struggle |
| End-of-section / chapter completion | `mascot-celebration` | Once per chapter |

**Hard limits:**

- No more than **5–6 mascot admonitions per chapter**
- Never place two mascot admonitions back-to-back
- The mascot is a guide, not a decoration — every appearance must add information or emotional support

### Do's and Don'ts

**Do:**

- Use Buzz to introduce new chapters warmly with the catchphrase
- Keep mascot dialogue to 1–3 sentences
- Match the pose to the content (warning for pitfalls, thinking for insights, etc.)
- Use bee/hive metaphors only when they sharpen understanding (e.g., "the waggle dance is a lossy broadcast protocol")

**Don't:**

- Use Buzz more than 5–6 times per chapter
- Put two mascot admonitions next to each other
- Use Buzz for purely decorative purposes
- Change Buzz's personality or speech patterns across chapters
- Have Buzz repeat content that the surrounding prose just covered

## Project Conventions

- Use **American English** spelling (color, center, analyze)
- p5.js code: never use reserved p5.js function names (use `removeFlexItem` not `removeItem`)
- iframe elements: never use a `style` attribute; always include `scrolling="no"`
- Local dev URL includes the site name: `http://127.0.0.1:8000/networking/...`
