# Authentication Visual Design Guide

## 🎨 Design System Overview

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    PREMIUM ACCENT BAR (1px)                 │
├──────────────────────────┬──────────────────────────────────┤
│                          │                                  │
│    LEFT PANEL (55%)      │    RIGHT PANEL (45%)             │
│    ┌─────────────────┐   │    ┌──────────────────────┐     │
│    │ 🍳 Aura Logo    │   │    │  [Tab] [Tab] [Tab]   │     │
│    │ Restaurant OS   │   │    │                      │     │
│    └─────────────────┘   │    │  ┌────────────────┐  │     │
│                          │    │  │                │  │     │
│    The operating         │    │  │  Auth Form     │  │     │
│    system for            │    │  │                │  │     │
│    fine dining           │    │  │  - Email       │  │     │
│                          │    │  │  - Password    │  │     │
│    [Feature Cards]       │    │  │  - Actions     │  │     │
│    ├─ 🧑‍🍳 Kitchen      │    │  │                │  │     │
│    ├─ 🗂️  Tables       │    │  └────────────────┘  │     │
│    ├─ ⚡ Workflow       │    │                      │     │
│    └─ 📊 Analytics      │    │  Footer Links        │     │
│                          │    └──────────────────────┘     │
│    [Dashboard Preview]   │                                  │
│    ┌───┬───┬───┐         │                                  │
│    │Rev│Ord│Tbl│         │                                  │
│    └───┴───┴───┘         │                                  │
│                          │                                  │
│    [Testimonial]         │                                  │
│    "Quote..."            │                                  │
│    - Author              │                                  │
│                          │                                  │
└──────────────────────────┴──────────────────────────────────┘
```

---

## 🎨 Color Palette

### Primary Colors

```
Amber-400:  #fbbf24  (Primary actions, accents)
Amber-500:  #f59e0b  (Hover states, gradients)
Amber-600:  #d97706  (Active states, dark accents)
```

### Neutral Colors

```
White:      #ffffff  (Backgrounds, text on dark)
Slate-50:   #f8fafc  (Light backgrounds)
Slate-100:  #f1f5f9  (Borders, dividers)
Slate-200:  #e2e8f0  (Input borders)
Slate-400:  #94a3b8  (Placeholder text)
Slate-500:  #64748b  (Secondary text)
Slate-600:  #475569  (Body text)
Slate-900:  #0f172a  (Headings, dark backgrounds)
```

### Semantic Colors

```
Emerald-400: #34d399  (Success states)
Red-400:     #f87171  (Error states)
Blue-500:    #3b82f6  (Info states)
```

---

## 📐 Spacing System

### Grid System

```
4px   → 0.5 spacing unit
8px   → 1   spacing unit  (base)
12px  → 1.5 spacing units
16px  → 2   spacing units
20px  → 2.5 spacing units
24px  → 3   spacing units
32px  → 4   spacing units
48px  → 6   spacing units
64px  → 8   spacing units
```

### Component Spacing

```
Input padding:    12px 16px
Button padding:   14px 32px
Card padding:     16px 20px
Section margin:   24px 0
Form gap:         20px
```

---

## 🔤 Typography Scale

### Font Families

```
Headings:  font-display (Georgia, serif)
Body:      font-body (system-ui, sans-serif)
Code:      font-mono (monospace)
```

### Font Sizes

```
3xl:  text-3xl  30px   H1 (Main headings)
2xl:  text-2xl  24px   H2 (Section headings)
xl:   text-xl   20px   H3 (Card titles)
lg:   text-lg   18px   Large body text
base: text-base 16px   Body text
sm:   text-sm   14px   Secondary text
xs:   text-xs   12px   Captions, labels
```

### Font Weights

```
400 (normal):   Regular body text
500 (medium):   Emphasized text
600 (semibold): Subheadings
700 (bold):     Headings, buttons
800 (extrabold): Hero text
```

---

## 🎭 Component Styles

### Input Fields

**Default State:**

```css
border: 2px solid slate-200
background: white
padding: 14px 16px 14px 44px (icon space)
border-radius: 12px
shadow: sm
```

**Focus State:**

```css
border: 2px solid amber-400
ring: 4px ring-amber-50
shadow: lg + amber-100/50 glow
icon: text-amber-500
label: text-amber-600
```

**Error State:**

```css
border: 2px solid red-300
ring: 4px ring-red-50
background: white
icon: text-red-400
```

### Buttons

**Primary Button:**

```css
background: gradient(amber-500 → amber-600)
color: white
padding: 16px 32px
border-radius: 12px
border: 2px solid amber-400
font-weight: 700
transition: all 300ms

Hover:
  background: gradient(amber-600 → amber-700)
  shadow: 2xl + amber-300/50 glow
  transform: translateY(-4px)
```

**Disabled State:**

```css
background: slate-100
color: slate-400
border: 2px solid slate-200
cursor: not-allowed
```

### Cards

**Feature Cards:**

```css
background: white/[0.03]
border: 1px solid white/[0.06]
padding: 16px
border-radius: 16px
backdrop-filter: blur(sm)

Hover:
  background: white/[0.06]
  border: white/[0.10]
  transform: translateX(4px)
```

**Preview Cards:**

```css
background: white/[0.04]
border: 1px solid white/[0.08]
padding: 16px
border-radius: 16px

Hover:
  background: white/[0.06]
  border: white/[0.10]
```

---

## ✨ Animation Specifications

### Timing Functions

```
ease-out:     Default for most animations
ease-in-out:  For smooth back-and-forth
ease:         For simple transitions
```

### Durations

```
200ms:  Quick feedback (hover, focus)
300ms:  Standard transitions (buttons, tabs)
500ms:  Form animations (slide, fade)
600ms:  Page transitions
1000ms: Shimmer effects
3000ms: Testimonial rotation
8000ms: Background pulse
```

### Keyframe Animations

**fade-in:**

```css
from: opacity 0
to: opacity 1
duration: 600ms
```

**slide-up:**

```css
from: opacity 0, translateY(20px)
to: opacity 1, translateY(0)
duration: 500ms
```

**scale-in:**

```css
from: opacity 0, scale(0.95)
to: opacity 1, scale(1)
duration: 400ms
```

**shimmer:**

```css
from: backgroundPosition(-200% center)
to: backgroundPosition(200% center)
duration: 3000ms infinite
```

---

## 📱 Responsive Breakpoints

### Desktop First Approach

```
xl:   1280px+   Extra large screens
lg:   1024px+   Desktop screens
md:   768px+    Tablet screens
sm:   640px+    Large mobile
      < 640px   Small mobile (default)
```

### Layout Changes

**1024px+ (Desktop):**

- Split-screen layout visible
- Left panel: 55-58% width
- Right panel: 42-45% width
- Full feature showcase
- 3-column preview cards

**768px - 1023px (Tablet):**

- Left panel reduced
- Mobile logo shown
- Single column forms
- 2-column preview cards

**< 768px (Mobile):**

- Left panel hidden
- Stacked layout
- Full-width forms
- Mobile-optimized spacing
- Touch-friendly buttons (48px+ height)

---

## 🎯 Interactive States

### Input Focus Sequence

```
1. User clicks input
2. Border changes to amber-400 (instant)
3. Ring appears (4px amber-50) with fade-in
4. Icon color transitions to amber-500
5. Label color transitions to amber-600
6. Subtle glow appears behind input
7. All transitions: 200ms ease-out
```

### Button Hover Sequence

```
1. User hovers button
2. Background gradient shifts (300ms)
3. Shadow grows and glows (300ms)
4. Button lifts up 4px (300ms)
5. Shimmer effect animates across (1000ms)
6. Icon slides right 4px (300ms)
```

### Form Submission Flow

```
1. User clicks submit
2. Button enters loading state
3. Spinner appears with fade-in
4. Form inputs disabled
5. Request processes
6. On success:
   - Success animation plays
   - Redirect after 800ms
7. On error:
   - Error message slides up
   - Button returns to normal
   - Form re-enabled
```

---

## 🎨 Visual Hierarchy

### Emphasis Levels

**Level 1 - Primary Focus:**

- Main headings (text-3xl, font-bold)
- Primary buttons (gradient, shadows)
- Active tab indicator
- Key metrics (preview cards)

**Level 2 - Secondary Focus:**

- Section headings (text-2xl, font-bold)
- Input labels (text-xs, font-semibold)
- Feature titles (text-sm, font-semibold)
- Secondary buttons

**Level 3 - Supporting:**

- Body text (text-sm)
- Descriptions (text-xs, text-slate-400)
- Placeholders
- Helper text

**Level 4 - Minimal:**

- Footer text (text-[11px])
- Copyright notices
- Divider lines
- Background patterns

---

## 🌈 Gradient Recipes

### Background Gradients

```css
Left Panel:
  from-slate-950 via-slate-900 to-slate-950

Button:
  from-amber-500 via-amber-600 to-amber-500

Glow Effects:
  from-amber-500/5 via-transparent to-amber-500/5
```

### Accent Gradients

```css
Top Bar:
  from-transparent via-amber-400 to-transparent

Logo Background:
  from-amber-400 via-amber-500 to-amber-600

Text Gradient:
  from-amber-400 via-amber-300 to-amber-500
```

---

## 🔒 Accessibility Features

### Focus Indicators

- Visible focus rings (4px)
- High contrast borders
- Color + non-color indicators
- Skip to content options

### Color Contrast

- Text: 4.5:1 minimum ratio
- Large text: 3:1 minimum ratio
- Interactive elements: clearly distinguishable
- Error states: red + icon + text

### Keyboard Navigation

- Tab order follows visual flow
- Enter submits forms
- Escape closes modals
- Arrow keys navigate options

### Screen Reader Support

- Semantic HTML elements
- ARIA labels where needed
- Error announcements
- Loading state announcements

---

## 📊 Performance Targets

### Load Times

- First Paint: < 1s
- First Contentful Paint: < 1.5s
- Time to Interactive: < 2s

### Animation Performance

- 60fps for all animations
- GPU-accelerated transforms
- Reduced motion respect
- Lazy load off-screen content

### Asset Optimization

- Compressed images (WebP)
- Minified CSS/JS
- Tree-shaken dependencies
- Critical CSS inline

---

## 🎯 Design Principles

### 1. Clarity Over Cleverness

- Clear labels and instructions
- Obvious interactive elements
- Predictable behaviors
- No hidden functionality

### 2. Progressive Disclosure

- Show what's needed when needed
- Don't overwhelm with options
- Guide users through steps
- Reveal complexity gradually

### 3. Consistent Patterns

- Reuse components
- Maintain spacing rhythm
- Follow established conventions
- Create muscle memory

### 4. Premium Feel

- Attention to detail
- Smooth animations
- Quality visual feedback
- Professional polish

### 5. Performance First

- Fast page loads
- Instant feedback
- Optimistic UI updates
- Graceful degradation

---

## 🎨 Component Showcase

### Tab Switcher

```
┌────────────────────────────────────────┐
│ ┌──────────┬──────────┬──────────┐    │
│ │ Sign In  │  Register │  Reset   │    │
│ │  ● ●     │           │          │    │
│ └──────────┴──────────┴──────────┘    │
└────────────────────────────────────────┘
Active: White bg, shadow, amber accent
Inactive: Transparent, slate-500 text
```

### Input Field

```
┌────────────────────────────────────────┐
│ Email Address               ┌────────┐ │
│ ┌──────────────────────────┐│        │ │
│ │ 📧  you@restaurant.com   ││  👁️   │ │
│ └──────────────────────────┘│        │ │
│                             └────────┘ │
└────────────────────────────────────────┘
Icon: Left aligned, color transitions
Toggle: Right aligned (passwords only)
Ring: Appears on focus with glow
```

### Primary Button

```
┌────────────────────────────────────────┐
│  ┌──────────────────────────────────┐  │
│  │  Sign In to Dashboard      →     │  │
│  └──────────────────────────────────┘  │
│            [shimmer effect]            │
└────────────────────────────────────────┘
Gradient: Amber 500-600
Shadow: Grows on hover with glow
Arrow: Slides right on hover
```

---

This visual guide serves as a reference for maintaining design consistency across the authentication system and can be extended to other parts of the application.
