# DevHub Design System — shared with Orbit family

DevHub and Orbit share one visual language so your portfolio feels like one product studio, not random apps.

**Reference products:** Linear, Vercel, Raycast, Height.  
**Sibling app:** Orbit (`moadh704/orbit`) — same tokens, type, and component rules.

## Identity

DevHub is a Product Hunt–style launchpad for side projects. Premium dark UI, dense, restrained — not a student template, not “AI purple gradient” slop.

## Anti-patterns (never)

- Generic purple→blue gradients on white  
- Oversized empty heroes with fluff taglines  
- Inter / Roboto / Poppins / Space Grotesk as primary fonts  
- Drop shadows on every dark surface  
- Pill buttons everywhere  
- Borders on everything with no elevation system  
- Rainbow accents with no hierarchy  

## Typography

| Role | Font |
|------|------|
| Headings | **Bricolage Grotesque** — bold, tight tracking (-0.02em) |
| Body | **DM Sans** — 13–14px base |
| Mono | **JetBrains Mono** — times, IDs, labels |

Hierarchy via **weight + size**, not color.

## Color — elevation through brightness

```
--bg-app:        #0A0B0D
--bg-sidebar:    #0E0F11
--bg-card:       #111214
--bg-card-hover: #16181C
--bg-elevated:   #1C1E22
--bg-input:      #111214

--border:        rgba(255,255,255,0.06)
--border-hover:  rgba(255,255,255,0.12)

--text-primary:  #E6E7EA
--text-secondary:#9CA0A8
--text-muted:    #5A5E66

--accent:        #7C5CFF
--accent-hover:  #6B4FE0
--accent-dim:    rgba(124,92,255,0.12)
--accent-border: rgba(124,92,255,0.25)
```

## Components

### Cards
- `bg-card`, `1px` border, **12px** radius  
- Hover: brighter surface + border — **no heavy shadows**  
- Padding 16–20px  

### Buttons
- Height ~32–36px, **8px** radius (not full pills)  
- Primary = solid accent; ghost = transparent + hover surface  

### Inputs
- Height 36px, 13px type, focus = accent border + soft ring  

### Chips / tags
- Muted fill, thin border, small type — not solid rainbow pills  

## Density

- Base 13px, tight spacing, intentional animation only  
- Prefer brightness elevation over blur/glow decoration  

When building new DevHub screens: **open this file + Orbit `DESIGN.md` and match.**
