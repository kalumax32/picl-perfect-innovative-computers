# PICL - Perfect Innovative Computers

## Current State

A full-stack Caffeine app (Motoko backend + React frontend) rebuilt from https://arsolutionsindia.com/pcil/. It features:

- Fixed glass navbar with smooth-scroll active-section tracking
- Hero section with animated gradient orbs, grid background, shimmer headline, partner marquee, stats ticker, CTAs
- About section with feature badges and floating image cards
- Stats section with animated counters (useCountUp) and intersection observer trigger
- Services section with 6 glassmorphism cards
- Products section with 6 product category cards
- Clients section with 9 client cards (Defence, Govt., PSU, Education, Corporate)
- Brand Ecosystem section with dual-direction infinite marquees
- Contact section with float-label form, contact info cards, submission via backend
- Footer with company links, certifications, address
- Back-to-top button
- OKLCH dark theme, Mona Sans + General Sans fonts, comprehensive CSS animations

The existing version works but needs a quality UI lift: more premium visual polish, a proper moving hero banner/showcase area, and stronger premium feel across the page.

## Requested Changes (Diff)

### Add
- Full-width cinematic hero "video reel" banner: horizontally scrolling image showcase cards that auto-advance with parallax depth — showcasing Data Centre, Networking, Cyber Security, Armed Forces, India Map themes
- Floating WhatsApp CTA button (bottom-right, sticky)
- "Why Choose PICL" differentiator section between About and Stats: 4-column icon grid with animated border accent
- Subtle particle/dot field animation layer in the hero background (CSS-only, performant)
- ISO badge and "Armed Forces Trusted" trust seal row above footer
- Enhanced hero: large subtle "30+" and "1995" typographic background elements behind headline
- Micro-interaction: service cards reveal a glowing border sweep on hover (CSS keyframe)

### Modify
- Hero stats row: replace plain text counters with pill-shaped animated stat badges with individual colored glows
- Stats section: upgrade grid to full-bleed dark section with a large radial gradient spotlight per stat card
- Service cards: improve icon container with a subtle inner glow ring; add an arrow chevron link at bottom
- Client section: add a Defence / Government / PSU / Education filter tab row (frontend-only, no backend needed)
- Brand Ecosystem: make partner logo cards slightly larger with a soft hover scale effect and glow
- Contact section: add a subtle pulsing dot on the phone icon to indicate "available now"
- Navbar: add a thin colored top border line (electric blue to gold gradient) on scroll

### Remove
- Nothing to remove — all existing sections remain

## Implementation Plan

1. Generate backend Motoko code (contact form submission, read submissions — same as existing)
2. Generate hero showcase images via generate_image (data centre, networking, cyber security, armed forces, India map)
3. Frontend: implement all Add and Modify changes above in App.tsx and index.css
4. Add WhatsApp floating button with pulse animation
5. Add client filter tabs (Defence / Govt. / PSU / Education / Corporate / All)
6. Add "Why Choose PICL" section
7. Add trust seal row
8. Add particle dot field to hero (CSS radial-gradient pattern, animated)
9. Run UI Craft pass for final polish
10. Deploy
