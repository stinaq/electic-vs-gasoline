# Design

How the app looks and feels. For code structure, see [ARCHITECTURE.md](ARCHITECTURE.md).
For behavior, see [FEATURES.md](FEATURES.md).

## Feeling

**A page in a sketchbook.** Someone worked out the trip cost with a black marker on slightly
yellowed paper.

Three words to settle every design question: **hand-made, bold, clear.**

- Hand-made: lines wobble a little, nothing is perfectly straight or perfectly aligned.
- Bold: thick black ink, big numbers, high contrast.
- Clear: the sketch style never gets in the way of reading the answer. Readability wins every
  conflict with charm.

## Design tokens

All tokens are CSS custom properties in `src/styles/global.scss`. Components use the variables
and never hardcode colors, fonts or line widths.

### Colors

| Token | Value | Use |
|---|---|---|
| `--color-paper` | `#f5ecd2` | Page background (warm, yellowish paper) |
| `--color-paper-shade` | `#ebdfbd` | Cards, slider tracks, subtle fills |
| `--color-ink` | `#1c1a17` | Text, lines, borders (soft black, like marker ink) |
| `--color-pencil` | `#6e675a` | Secondary text, hints, units |
| `--color-highlighter` | `#ffe14d` | Winner highlight (marker stroke behind text) |
| `--color-red-pen` | `#c8372d` | Validation errors only |

There are no separate colors per car. The winner is shown with ink and highlighter, not a brand color.

### Typography

| Token | Font | Use |
|---|---|---|
| `--font-heading` | **Caveat** (700) | Title, card headings, the summary line |
| `--font-body` | **Patrick Hand** | Labels, values, body text, numbers |

- Both are free Google Fonts, loaded externally with a Google Fonts `<link>` in `index.html`
  (with `preconnect` and `display=swap`). Fallback: `cursive` for headings and `sans-serif` for body.
- Numbers change while sliding. Give value labels a fixed `min-width` (in `ch`) so the layout
  doesn't jump.
- Base size 18px or larger. Handwritten fonts read smaller than they are.

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
2. **Slight rotation:** cards and labels get `transform: rotate(-0.6deg)` to `rotate(0.8deg)`.
   Never rotate inputs, sliders or numbers you need to read precisely.
3. **Solid offset shadow:** `box-shadow: var(--shadow-offset)` makes things look drawn rather than elevated.
4. **Paper texture:** a subtle noise on `body` via an inline SVG `feTurbulence` data URI in
   `global.scss`. Keep it barely visible.
5. **Rough ink edges (try, keep only if crisp):** one shared, static SVG filter (`feTurbulence`
   with a fixed `seed` + a low-scale `feDisplacementMap`) defined once in `index.html`, applied with
   `filter: url(#ink)` to borders and decorative lines only. It gives slightly uneven marker edges.
   Never animate it, and **never apply it to text** or to the slider thumb.

No drawing libraries (e.g. Rough.js) without asking.

## Key elements

### Sliders

The main interaction, so they must feel good.

- Styled native `<input type="range">` (keeps it accessible and keyboard-friendly).
- Track: a thick ink line with slightly uneven, static edges.
- Thumb: a hand-drawn ink circle (wobbly border-radius), filled with paper, about 28px for touch.
- The current value is shown next to the label in `--font-body`, e.g. `17,50 kr/l`.
- Focus state: a highlighter-colored scribble ring, clearly visible.

### Result cards

- One card per car: paper-shade fill, bold ink border, wobbly radius, offset shadow and a slight rotation.
- **Winner:** the cost gets a highlighter stroke behind it, plus a hand-drawn ink circle or
  "✓" mark around or next to the card. The loser stays plain, not greyed out.
- **Tie:** both cards are plain, and the summary says they cost the same.

### Summary and break-even

- Summary line ("Nissan Leaf is cheaper by 147,20 kr") in `--font-heading`, large, centered.
  It reads like a note scribbled at the bottom of the page.
- Break-even text in `--font-body`, `--color-pencil`, like a margin note.

### Errors

- Red-pen color, handwritten font, directly under the field. Optionally a red underline on the
  field. No icons and no boxes.

### Read-only values (Volvo consumption)

- Plain text in pencil color, with no input styling, so it is clearly not editable.

## Motion

- Minimal. When the winner changes, the highlighter stroke may "draw in" (a short width transition
  of about 200ms).
- Respect `prefers-reduced-motion`: no transitions when it is set.

## Accessibility

- Ink on paper is well above WCAG AA contrast. Pencil on paper must stay at 4.5:1 or above
  for text. Check this when adjusting colors.
- The winner must not rely on the highlighter color alone. The text summary and the mark carry it too.
- All inputs have real `<label>`s. Sliders are native range inputs.
