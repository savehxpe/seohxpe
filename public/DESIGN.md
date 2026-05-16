---
name: Outworld Design System
colors:
  surface: '#0d1321'
  surface-dim: '#0d1321'
  surface-bright: '#333948'
  surface-container-lowest: '#070e1b'
  surface-container-low: '#151c29'
  surface-container: '#19202d'
  surface-container-high: '#232a38'
  surface-container-highest: '#2e3543'
  on-surface: '#dce2f5'
  on-surface-variant: '#c4c5d9'
  inverse-surface: '#dce2f5'
  inverse-on-surface: '#2a303f'
  outline: '#8e90a2'
  outline-variant: '#434656'
  surface-tint: '#b8c3ff'
  primary: '#b8c3ff'
  on-primary: '#002388'
  primary-container: '#2e5bff'
  on-primary-container: '#efefff'
  inverse-primary: '#124af0'
  secondary: '#bac9d3'
  on-secondary: '#24323a'
  secondary-container: '#3d4b54'
  on-secondary-container: '#acbac5'
  tertiary: '#b8c7e6'
  on-tertiary: '#22314a'
  tertiary-container: '#5f6d89'
  on-tertiary-container: '#ebf0ff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c3ff'
  on-primary-fixed: '#001356'
  on-primary-fixed-variant: '#0035be'
  secondary-fixed: '#d6e5ef'
  secondary-fixed-dim: '#bac9d3'
  on-secondary-fixed: '#0f1d25'
  on-secondary-fixed-variant: '#3b4951'
  tertiary-fixed: '#d6e3ff'
  tertiary-fixed-dim: '#b8c7e6'
  on-tertiary-fixed: '#0c1c34'
  on-tertiary-fixed-variant: '#394761'
  background: '#0d1321'
  on-background: '#dce2f5'
  surface-variant: '#2e3543'
typography:
  display-lg:
    fontFamily: Syne
    fontSize: 72px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Syne
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Syne
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  title-md:
    fontFamily: Syne
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Syne
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Syne
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 80px
  margin-tablet: 40px
  margin-mobile: 20px
---

## Brand & Style

This design system embodies the "Outworld" narrative—a cinematic, futuristic journey into an artist's digital universe. The brand personality is enigmatic yet premium, balancing the cold vastness of deep space with the warmth of high-fidelity creative expression. 

The aesthetic leverages **Glassmorphism** as its primary visual driver. Elements appear as suspended shards of high-tech instrumentation, utilizing deep blue tints and significant backdrop blurs to create a sense of three-dimensional depth. The interface should feel like a premium heads-up display (HUD) found in a high-end cinematic spacecraft—functional, ethereal, and immersive.

## Colors

The palette is rooted in the "Deep Midnight" spectrum, moving from the near-black `#050B18` for base canvases to the structural `#0B1B33` for elevated surfaces. 

The **HANDOUT blue** (`#2E5BFF`) serves as the primary action color, used sparingly for critical interactive elements and focal points to maintain its high-impact, saturated energy. Text is rendered in **Ice White** (`#E3F2FD`) to ensure maximum legibility against dark voids while maintaining a soft, atmospheric glow. Use varying opacities of Ice White (80%, 60%) to establish secondary and tertiary content hierarchies without introducing muddy greys.

## Typography

**Syne** is the cornerstone of this design system, chosen for its avant-garde and distinctive character. Large display styles should utilize the "Extra Bold" or "Bold" weights with tight letter spacing to create a cinematic, impactful presence. 

For technical metadata and small labels, **Space Mono** is introduced as a supporting font to reinforce the futuristic, "Outworld" HUD aesthetic. Body text should remain airy with a generous line height to ensure readability against dark, textured backgrounds.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop to maintain a curated, editorial feel, while transitioning to a fluid model for mobile devices. A 12-column grid is standard, but content should frequently "break" the grid or span across 8 centered columns to create a sense of vast, open space.

Spacing is generous. Large vertical gaps (120px - 160px) between sections are encouraged to allow the background gradients and glass elements to "breathe," simulating the emptiness of space.

## Elevation & Depth

Hierarchy is achieved through **Backdrop Blurs** and **Tonal Layering** rather than traditional drop shadows. 

1.  **Level 0 (Void):** The base background (#050B18).
2.  **Level 1 (Surface):** Semi-transparent layers of #0B1B33 with a 20px - 40px blur. 
3.  **Level 2 (Active):** HANDOUT blue highlights or higher opacity glass.

Use a 1px inner border (stroke) on all glass cards with a top-down linear gradient (Ice White at 20% to 0%) to simulate a "light catch" on the edge of the glass. Avoid black shadows; instead, use a deep blue glow (#050B18 at 40% opacity) if depth is absolutely required.

## Shapes

The design system uses **Rounded** geometry (0.5rem base) to soften the "tech" aesthetic and make the interface feel more organic and "warm." 

While the primary containers use standard rounding, decorative elements or "Buy Now" CTAs may utilize pill-shaped (Level 3) rounding to differentiate them as high-priority interactive nodes. Interactive states should gently expand the border-radius or increase the blur intensity to provide tactile feedback.

## Components

**Buttons:** Primary buttons use a solid HANDOUT blue fill with white text. Secondary buttons are "Ghost" style: a glass background with a 1px Ice White border at 30% opacity.

**Glass Cards:** The signature component. Background: #0B1B33 at 40-60% opacity; Backdrop-filter: blur(24px). Must include the 1px "light-catch" border.

**Input Fields:** Minimalist under-lines or fully enclosed glass containers. Focus state triggers a 1px HANDOUT blue glow.

**Chips/Tags:** Small, pill-shaped Space Mono labels with a 10% HANDOUT blue tint background to signify categories or metadata.

**Audio Player/Visualizer:** A custom component featuring a blurred glass waveform container. The progress bar should be a vibrant HANDOUT blue gradient.

**Scroll Progress:** A thin, vertical HANDOUT blue line on the far right of the screen to maintain the cinematic HUD feeling.