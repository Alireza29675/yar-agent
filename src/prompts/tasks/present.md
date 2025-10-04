Create a reveal.js presentation that teaches the provided content effectively.

## Your Goal

**This is a teaching tool.** The presentation should onboard someone to the content in the best way possible. Think of it as a self-contained learning experience without a narrator - the slides must be clear enough to understand on their own, but not overwhelming with information.

## Technical Requirements

**HTML Structure:**
- Complete HTML5 document with modern, beautiful design
- Use reveal.js from CDN
- Custom CSS for beautiful, modern aesthetics
- Clean typography and generous whitespace
- Subtle animations and transitions

**CDN Links:**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.6.0/dist/reveal.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.6.0/dist/theme/white.css">
<script src="https://cdn.jsdelivr.net/npm/reveal.js@4.6.0/dist/reveal.js"></script>
```

**Design Guidelines:**
- Use a light, modern theme (white or light gray background)
- Add custom CSS for: beautiful typography, subtle shadows, modern color accents, code block styling
- Make it visually distinct and premium feeling
- Ensure excellent readability

**Slide Architecture - Use Vertical Slides Extensively:**
- Horizontal slides (`<section>`) = Major topics/chapters
- Vertical slides (nested `<section>`) = Sub-points, details, examples within that topic
- Structure: Topic Title (horizontal) → Details (vertical) → Examples (vertical) → Summary (vertical)
- This creates a natural hierarchy: left/right navigation = main concepts, up/down = diving deeper into current concept

Example structure:
```html
<section>
  <section>
    <h2>Main Topic</h2>
  </section>
  <section>
    <h3>Detail 1</h3>
  </section>
  <section>
    <h3>Detail 2</h3>
  </section>
</section>
```

## Content Guidelines

**1. Teaching-First Approach:**
- Start with overview/big picture before diving into details
- Build understanding progressively
- Use vertical slides to layer complexity
- Each slide should teach one clear concept

**2. Self-Explanatory Slides:**
- Since there's no narrator, slides must be clear on their own
- Use complete thoughts, not just bullet points
- Add context where needed
- Balance clarity with conciseness

**3. Structure:**
- **Title slide**: Clear, engaging title
- **Overview**: What will be covered and why it matters
- **Main sections** (horizontal): Major concepts, each with vertical slides for depth
- **Summary/Conclusion**: Key takeaways (NOT "Questions?" - this is AI-generated)

**4. Information Density:**
- Not too sparse (needs context to be self-explanatory)
- Not too dense (still needs to be digestible)
- Find the sweet spot: clear, contextual, focused

**5. No Generic Ending:**
- Don't end with "Questions?" or "Thank You"
- Instead: Key takeaways, summary, next steps, or resources

## Output Format

Return ONLY the complete HTML file - nothing else. No markdown code blocks, no explanations, just the raw HTML that can be written directly to a file and opened in a browser.

The HTML must be complete and ready to use immediately.
