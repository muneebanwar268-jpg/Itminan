# =====================================================================================
# MASTER_PROMPT.md
# PART 3
# TECHNICAL ARCHITECTURE
# PERFORMANCE BIBLE
# DEVELOPMENT WORKFLOW
# IMPLEMENTATION RULES
# =====================================================================================

# TECHNICAL PHILOSOPHY

We are NOT building a demo.

We are building a production-ready premium product website.

Every decision should optimize:

• Maintainability
• Scalability
• Performance
• Reusability
• Accessibility
• SEO
• Developer Experience

The final codebase should feel like it was built by a senior engineering team.

================================================================================

# TECHNOLOGY STACK

Framework:
Next.js (App Router)

Language:
TypeScript

Styling:
Tailwind CSS

UI Components:
shadcn/ui

Icons:
Lucide React

Animation:
GSAP
GSAP ScrollTrigger
GSAP Flip
SplitType (only where appropriate)

Micro Interactions:
Framer Motion

Smooth Scrolling:
Lenis

Images:
Next/Image

Package Manager:
pnpm (preferred)

================================================================================

# PROJECT ARCHITECTURE

The project should follow a clean and scalable structure.

Example:

src/

app/

components/

ui/

layout/

navigation/

hero/

features/

gallery/

lifestyle/

cta/

footer/

animations/

hooks/

lib/

constants/

types/

styles/

public/

images/

videos/

icons/

fonts/

Every section should be isolated.

Every section should be reusable.

Avoid giant files.

================================================================================

# COMPONENT PHILOSOPHY

One component.

One responsibility.

Avoid components larger than necessary.

Split complex sections into:

Container

↓

Layout

↓

Content

↓

Animation

↓

Utilities

Never place business logic inside presentation components.

================================================================================

# GSAP ARCHITECTURE

Never scatter GSAP code throughout the project.

Each animated section should own its own animation logic.

Preferred pattern:

Hero.tsx

HeroAnimations.ts

FeatureShowcase.tsx

FeatureAnimations.ts

Gallery.tsx

GalleryAnimations.ts

Keep animation timelines modular.

Destroy animations on unmount.

Avoid memory leaks.

================================================================================

# SCROLLTRIGGER RULES

Always register plugins once.

Use proper cleanup.

Avoid unnecessary ScrollTriggers.

Batch animations where possible.

Prefer timelines over dozens of independent triggers.

Test refresh behavior after layout changes.

================================================================================

# PERFORMANCE BIBLE

Target:

60 FPS

Desktop

Tablet

Mobile

No compromises.

================================================================================

# PERFORMANCE RULES

Always:

Use transform instead of top/left

Animate opacity and transform only

Optimize images

Use lazy loading

Use dynamic imports where beneficial

Avoid expensive filters

Avoid unnecessary blur layers

Limit box shadows

Avoid unnecessary re-renders

Memoize expensive components

Never animate layout properties unnecessarily

================================================================================

# IMAGE OPTIMIZATION

Always use Next/Image.

Provide proper sizes.

Compress assets.

Lazy load below-the-fold images.

Preload Hero assets.

Serve modern formats where possible.

Avoid oversized images.

================================================================================

# RESPONSIVE STRATEGY

Desktop First

Then optimize individually for:

Laptop

Tablet Landscape

Tablet Portrait

Large Mobile

Mobile

Small Mobile

Never simply shrink the desktop.

Each breakpoint should feel intentionally designed.

================================================================================

# MOBILE UX

Touch-friendly interactions.

Comfortable spacing.

Large tap targets.

Readable typography.

Optimized animation timing.

No hover-dependent functionality.

Sticky elements only when beneficial.

================================================================================

# TYPOGRAPHY SYSTEM

Use a consistent scale.

Large Hero heading.

Clear section headings.

Comfortable paragraph width.

Generous line-height.

Never reduce readability for style.

================================================================================

# SPACING SYSTEM

Whitespace creates luxury.

Use a spacing rhythm.

Avoid random margins.

Every section should breathe.

Maintain vertical consistency.

================================================================================

# ACCESSIBILITY

Meet WCAG best practices where practical.

Semantic HTML.

Keyboard navigation.

Visible focus states.

Proper aria labels.

Sufficient contrast.

Respect reduced-motion preferences.

Never sacrifice usability for animation.

================================================================================

# SEO

Use semantic structure.

Single H1.

Logical heading hierarchy.

Descriptive metadata.

Open Graph.

Twitter cards.

Structured data where relevant.

Optimized image alt text.

Clean URLs.

Fast loading.

================================================================================

# CODE QUALITY

Readable code.

Meaningful naming.

Consistent formatting.

No dead code.

No duplicated logic.

Reusable utilities.

Type-safe components.

Avoid "magic numbers."

Document complex animation timelines.

================================================================================

# ERROR HANDLING

Gracefully handle:

Missing images

Animation failures

Slow connections

JavaScript disabled (where possible)

Viewport resizing

Orientation changes

================================================================================

# TESTING CHECKLIST

Before considering any feature complete:

Desktop verified

Tablet verified

Mobile verified

No overflow

No CLS

Animations smooth

Images optimized

Typography consistent

Accessibility checked

SEO reviewed

Performance acceptable

================================================================================

# IMPLEMENTATION WORKFLOW

For every task:

1. Analyze the existing implementation.

2. Explain what you understood.

3. Identify strengths.

4. Identify weaknesses.

5. Propose multiple solutions.

6. Recommend the best approach.

7. Explain animations.

8. Explain responsive behavior.

9. Explain performance impact.

10. Wait for approval.

Only after approval:

Implement.

After implementation:

Summarize changes.

Wait for the next instruction.

Never continue automatically.

================================================================================

# AI COLLABORATION RULES

If requirements are unclear:

Ask questions.

Never guess.

If there are multiple valid solutions:

Present options.

Recommend one.

Explain why.

If an idea conflicts with performance:

Prioritize performance.

If an animation reduces usability:

Simplify it.

Quality over quantity.

================================================================================

# DO NOT

❌ Copy templates blindly

❌ Add animations without purpose

❌ Break desktop while fixing mobile

❌ Sacrifice performance for effects

❌ Overuse GSAP

❌ Create inconsistent spacing

❌ Use random colors

❌ Ignore accessibility

❌ Ignore SEO

❌ Continue implementing without approval

================================================================================

# ALWAYS

✅ Think before coding

✅ Analyze before implementing

✅ Explain before changing

✅ Recommend improvements

✅ Build reusable components

✅ Optimize continuously

✅ Keep animations purposeful

✅ Keep UI minimal

✅ Keep the product as the hero

================================================================================

# FINAL QUALITY STANDARD

Before any page is considered complete, ask:

• Does it feel premium?

• Does it feel handcrafted?

• Is the code maintainable?

• Is it fast?

• Is it accessible?

• Is it responsive?

• Is the animation meaningful?

• Is the storytelling clear?

• Would this impress an experienced product designer?

• Could this realistically appear on Awwwards or CSS Design Awards?

If the answer is "no" to any question, improve it before presenting.

================================================================================

# GOLDEN PRINCIPLE

We are not shipping features.

We are crafting experiences.

Every interaction should increase trust.

Every transition should feel intentional.

Every animation should support the narrative.

Every pixel should reinforce quality.

The product is always the hero.

The experience is what users remember.

Never settle for "good enough."

Aim for timeless, premium, production-quality work.


/ai-context
│
├── 00_MASTER_SYSTEM.md
├── 01_PROJECT_CONTEXT.md
├── 02_BRAND_GUIDE.md
├── 03_DESIGN_SYSTEM.md
├── 04_MOTION_BIBLE.md
├── 05_STORYTELLING.md
├── 06_TECH_ARCHITECTURE.md
├── 07_DEVELOPMENT_WORKFLOW.md
├── 08_RULES_AND_CONSTRAINTS.md
├── 09_IMPLEMENTATION_CHECKLIST.md
└── 10_PROJECT_PROGRESS.md