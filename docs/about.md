---
title: "About This Book"
description: "About Networking and Communication — its purpose, audience, design, and the team behind it."
---

# About This Book

## Welcome from Buzz the Honey Bee

![](./img/mascot/welcome.png){ align="left" width="140px"}

Hi, I'm Buzz! I'm your guide through this intelligent textbook on networking and communication. Bees and packets have a lot in common — both travel from hop to hop, both follow protocols their colleagues understand, and both carry payloads that matter to whoever is waiting on the other end. I'll be with you through every chapter, from the first frame on the wire to the last byte of a TLS handshake. *Let's trace the route!*

<div style="clear: both;"></div>

## Why This Intelligent Textbook

Modern computing is networked computing. From the moment your students open a laptop or unlock a phone, dozens of protocols negotiate addresses, route packets, secure connections, and deliver data across continents in milliseconds. Yet most curricula still teach networking as a list of acronyms and header diagrams to memorize, rather than as a layered architecture students can reason about, debug, and extend. The result is graduates who can recite the seven layers of the OSI model but cannot read a packet capture, interpret a TLS handshake, or explain why their application is slow.

**In the United States (2024–2025):**

- The U.S. Bureau of Labor Statistics projects **33% growth** in information security analyst employment from 2023 to 2033 — among the fastest-growing occupations in the country[^1]
- BLS projects roughly **140,100 average annual openings** for software developers, QA analysts, and testers through 2033, every one of which assumes baseline networking literacy[^2]
- The **ABET Computing Accreditation Commission (CAC)** identifies "networking and communication" as a required topic area that every accredited Computer Science program must cover[^3]
- The **ACM/IEEE-CS/AAAI CS2023** curricular guidelines define a dedicated Networking and Communication (NC) knowledge area, signaling that this material is foundational to every computing degree[^4]

**Worldwide:**

- The **(ISC)² 2024 Cybersecurity Workforce Study** estimates a global cybersecurity workforce gap of **4.8 million professionals**, with network security skills consistently among the most-cited shortages[^5]
- The **International Telecommunication Union** reports that **5.5 billion people — 68% of the world's population — were using the Internet by the end of 2024**, every one of them dependent on the protocols this book teaches[^6]
- **IPv6 adoption** measured by Google now exceeds **45% of all client traffic**, marking a generational migration that today's students will own for the rest of their careers[^7]

These numbers represent millions of students who will spend their working lives debugging, securing, and extending networks. They deserve more than acronym lists — they deserve the analytical tools to reason about layered systems and the hands-on experience to back up what they read.

This book takes a fundamentally different approach. It is built on a **learning graph of 338 interconnected concepts** organized into **15 taxonomy categories** spanning architecture, physical and link layers, LANs, network and routing, transport, applications, security, wireless, programming, measurement, operations, and software-defined networking. Concepts are introduced in the order their prerequisites are established, so understanding builds naturally from chapter to chapter. Throughout the book you will find **interactive MicroSims** — browser-based simulations that let students manipulate models, watch packets traverse a topology, and discover principles through experimentation rather than memorization. The entire textbook is **open source and free** — no paywalls, no access codes, no expensive annual editions.

## How to Use This Book

This textbook is designed for self-paced study and for classroom adoption in ABET-aligned undergraduate programs. Each chapter builds on previous material, so reading in order is recommended. The book includes:

- **16 Chapters** covering layered architecture, physical and link layers, Ethernet and VLANs, wireless and mobility, IP and subnetting, routing protocols, reliable transport, network security, application protocols, socket programming, network operations, and software-defined networking
- **Interactive MicroSims** embedded in chapters — browser-based simulations you can manipulate to explore concepts
- **Glossary** with precise, non-circular definitions for every key concept
- **Learning Graph** visualizing how 338 concepts connect across the book
- **Buzz the Honey Bee**, a pedagogical mascot who appears at key moments to introduce, encourage, warn, and celebrate alongside the reader
- **Search** available from any page using the search bar

The [Learning Graph](learning-graph/index.md) visualizes how concepts connect across chapters. If you want to explore non-linearly or check prerequisites for a specific topic, start there.

## About the Author

Dan McCreary is a semi-retired AI researcher, solution architect, and educator who has spent more than three decades helping Fortune 100 organizations reason over massive datasets. At Optum he founded the Generative AI Center of Excellence and led the team that built one of the world's largest healthcare knowledge graphs — spanning over 25 billion vertices — to unify member, provider, and patient insights. Dan's deep background in knowledge representation and systems thinking underpins the precise learning graphs and intelligent textbook workflows used throughout this course.

He is the co-author of *Making Sense of NoSQL* (Manning Publications), the founding chair of the NoSQL Now! conference, and a frequent keynote speaker on semantic search, ontology strategy, and AI hardware. Beyond industry, Dan has mentored students as a STEM volunteer since 2014 and now applies the same rigor to building open educational resources. You can visit the [Intelligent Textbooks Case Studies](https://dmccreary.github.io/intelligent-textbooks/case-studies/) to see over 70 textbooks that Dan has created or co-created with other authors.

**Selected Credentials**

- B.A. in Physics and Computer Science from Carleton College
- M.S.E.E. from the University of Minnesota
- MBA coursework at the University of St. Thomas
- Patent holder in semantic search and ontology management techniques
- Advocate for large-scale Enterprise Knowledge Graph adoption across healthcare and education
- Long-time promoter of accessible, low-cost AI-powered learning experiences

## How to Cite This Book

If you reference this textbook in academic work, curriculum proposals, lesson plans, or other publications, please use one of the following citation formats.

**APA (7th edition)**

McCreary, D. (2026). *Networking and Communication*. https://dmccreary.github.io/networking/

**Chicago (17th edition)**

McCreary, Dan. 2026. *Networking and Communication*. https://dmccreary.github.io/networking/.

**MLA (9th edition)**

McCreary, Dan. *Networking and Communication*. 2026, dmccreary.github.io/networking/.

**BibTeX**

```bibtex
@book{mccreary2026networking,
  title     = {Networking and Communication},
  author    = {McCreary, Dan},
  year      = {2026},
  url       = {https://dmccreary.github.io/networking/},
  note      = {Interactive intelligent textbook aligned to ACM/IEEE CS2023 NC and ABET CAC}
}
```

To cite a specific chapter, append the chapter number and title — for example:

McCreary, D. (2026). Chapter 1: Introduction to Networks. In *Networking and Communication*. https://dmccreary.github.io/networking/chapters/01-intro-to-networks/

## License

This work is released under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0)](license.md). You are free to share and adapt the material for non-commercial purposes as long as you give appropriate credit and share your adaptations under the same license.

## References

[^1]: U.S. Bureau of Labor Statistics. (2024). *Information Security Analysts: Occupational Outlook Handbook*. <https://www.bls.gov/ooh/computer-and-information-technology/information-security-analysts.htm>
[^2]: U.S. Bureau of Labor Statistics. (2024). *Software Developers, Quality Assurance Analysts, and Testers: Occupational Outlook Handbook*. <https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm>
[^3]: ABET Computing Accreditation Commission. (2025). *Criteria for Accrediting Computing Programs, 2025–2026*. <https://www.abet.org/accreditation/accreditation-criteria/criteria-for-accrediting-computing-programs-2025-2026/>
[^4]: ACM/IEEE-CS/AAAI Joint Task Force. (2023). *Computer Science Curricula 2023 (CS2023)*. <https://csed.acm.org/>
[^5]: ISC2. (2024). *2024 ISC2 Cybersecurity Workforce Study*. <https://www.isc2.org/Insights/2024/10/Cybersecurity-Workforce-Study-2024>
[^6]: International Telecommunication Union. (2024). *Facts and Figures 2024: Internet Use*. <https://www.itu.int/itu-d/reports/statistics/facts-figures-2024/>
[^7]: Google. (Ongoing). *IPv6 Adoption Statistics*. <https://www.google.com/intl/en/ipv6/statistics.html>
