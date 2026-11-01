# Design

How the app looks and feels. For code structure, see [ARCHITECTURE.md](ARCHITECTURE.md).
For behavior, see [FEATURES.md](FEATURES.md).

## Feeling

**Modern type on a sketched page.** The text is clean and contemporary. The lines around it
(borders, underlines, sliders, marks) look drawn with a dark brown marker on blush-white paper.

Three words to settle every design question: **hand-made, bold, clear.**

- Hand-made: lines wobble a little and are never perfectly straight. Text is never hand-made:
  it is set in a modern sans-serif and stays straight.
- Bold: thick dark ink, big numbers, high contrast.
- Clear: the sketch style never gets in the way of reading the answer. Readability wins every
  conflict with charm.

## Design tokens

All tokens are CSS custom properties in `src/styles/global.scss`. Components use the variables
and never hardcode colors, fonts or line widths.

### Colors

The palette combines two Figma palettes, "Graphite" and "Driftwood pearl morning".

| Token | Value | Use | Contrast on paper |
|---|---|---|---|
| `--color-paper` | `#f5e9e7` | Page background (blush-white paper) | – |
| `--color-paper-shade` | `#cccdc7` | Cards, subtle fills | – |
| `--color-ink` | `#5a322a` | Text, lines, borders (dark brown marker ink) | 9.2:1 |
| `--color-pencil` | `#6e6957` | Secondary text, hints, units. The palette's `#837d68`, darkened to pass 4.5:1 | 4.6:1 |
| `--color-highlighter` | `#e4a499` | Winner highlight (salmon marker stroke behind text) | ink on it 5.2:1 |
| `--color-red-pen` | `#a93a2e` | Validation errors only. Darkened terracotta red | 5.3:1 |

There are no separate colors per car. The winner is shown with ink and highlighter, not a brand color.

### Typography

| Token | Font | Use |
|---|---|---|
| `--font-heading` | **Space Grotesk** (700) | Title, section and card headings, the summary line |
| `--font-body` | **Inter** (400, 500, 700) | Labels, values, body text, numbers |

- Both are free Google Fonts, loaded externally with a Google Fonts `<link>` in `index.html`
  (with `preconnect` and `display=swap`). Fallback: `system-ui, sans-serif`.
- No handwritten fonts. The hand-made feeling comes from the lines only.
- Numbers change while sliding. Give value labels a fixed `min-width` (in `ch`) so the layout
  doesn't jump.
- Base size 17px. Headings use a slightly negative `letter-spacing` (about `-0.01em` to `-0.02em`).

### Lines

| Token | Value | Use |
|---|---|---|
| `--line-bold` | `3px` | Card borders, slider track |
| `--line-thin` | `1.5px` | Inputs, dividers |
| `--shadow-offset` | `3px 4px 0 var(--color-ink)` | Solid "drawn" offset shadow on cards |

### Spacing

Use a simple scale: `--space-1` to `--space-6` (4, 8, 12, 16, 24, 40 px). The layout is one
centered column, max about 640px wide, and it works on mobile first.

## Hand-drawn techniques (CSS only)

**Lines look hand-drawn but never shake.** All irregularity is static: nothing jitters, wiggles
or re-randomizes on render, hover or while sliding. Use these in order of preference, and stick
to cheap tricks before heavy ones.

1. **Uneven borders:** an irregular `border-radius`, e.g.
   `border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;`. Vary the values per component.
2. **Slight rotation:** cards get `transform: rotate(-0.6deg)` to `rotate(0.8deg)`.
   Never rotate text on its own (headings, labels, summary), inputs or sliders.
3. **Solid offset shadow:** `box-shadow: var(--shadow-offset)` makes things look drawn rather than elevated.
4. **Paper texture:** a subtle noise on `body` via an inline SVG `feTurbulence` data URI in
   `global.scss`. Keep it barely visible.
5. **Rough ink edges (try, keep only if crisp):** one shared, static SVG filter (`feTurbulence`
   with a fixed `seed` + a low-scale `feDisplacementMap`) defined once in `index.html`, applied with
   `filter: url(#ink)` to borders and decorative lines only. It gives slightly uneven marker edges.
   Never animate it, and **never apply it to text** or to the slider thumb.

6. **Hand-drawn marks:** shapes like the check mark are inline SVG paths stored as CSS custom
   properties in `global.scss` (e.g. `--mark-check`) and applied with `mask` plus
   `background-color: var(--color-ink)`. Never use a font glyph for a mark.

No drawing libraries (e.g. Rough.js) without asking.

## Key elements

### Sections

- Each section is a hand-drawn ink frame (bold line, wobbly radius, rough-ink edges). Frames do not
  rotate.
- The section heading sits on the frame's top-left line and breaks it, like a label on a form:
  `--font-heading`, bold, on a `--color-paper` background. Headings have no underline.
- Generous space between sections, so each reads as its own unit.

### Sliders

The main interaction, so they must feel good.

- Styled native `<input type="range">` (keeps it accessible and keyboard-friendly).
- Track: a thick ink line with slightly uneven, static edges.
- Thumb: a hand-drawn ink circle (wobbly border-radius), filled with paper, about 28px for touch.
- The current value is shown next to the label in `--font-body`, e.g. `17,50 kr/l`.
- Focus state: a highlighter-colored scribble ring, clearly visible.

### Result cards

- One card per car: paper-shade fill, bold ink border, wobbly radius, offset shadow and a slight rotation.
- **Winner:** the cost gets a highlighter stroke behind it, plus a hand-drawn check mark
  (`--mark-check`) overlapping the card's top-right corner. The loser stays plain, not greyed out.
- **Tie:** both cards are plain, and the summary says they cost the same.

### Summary and break-even

- Summary line ("Nissan Leaf is cheaper by 147,20 kr") in `--font-heading`, bold, large, centered.
  It is the answer, so it is the most prominent text after the costs.
- Break-even text in `--font-body`, `--color-pencil`, in its own section ("Break-even prices")
  framed like the others.

### Errors

- Red-pen color, `--font-body`, directly under the field. Optionally a red underline on the
  field. No icons and no boxes.

### Read-only values (Volvo consumption)

- Plain text in pencil color, with no input styling, so it is clearly not editable.
- Car details such as the engine designation go on a smaller pencil-colored line under the name.

## Motion

- Minimal. When the winner changes, the highlighter stroke may "draw in" (a short width transition
  of about 200ms).
- Respect `prefers-reduced-motion`: no transitions when it is set.

## Accessibility

- Ink on paper (9.2:1) and on cards (6.8:1) is well above WCAG AA contrast. Pencil on paper must stay at 4.5:1 or above
  for text. Check this when adjusting colors.
- The winner must not rely on the highlighter color alone. The text summary and the mark carry it too.
- All inputs have real `<label>`s. Sliders are native range inputs.
