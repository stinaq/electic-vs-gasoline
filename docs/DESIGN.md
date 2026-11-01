# Design

How the app looks and feels. For code structure, see [ARCHITECTURE.md](ARCHITECTURE.md).
For behavior, see [FEATURES.md](FEATURES.md).

## Feeling

**Pop art color blocks.** Flat tiles of mustard yellow, salmon pink and periwinkle blue with
thick navy outlines, hard offset shadows and comic-book halftone dots. The reference is the
Duroc color-block grid in [image copy 2.png](image%20copy%202.png).

Three words to settle every design question: **fun, bold, clear.**

- Fun: stickers, starbursts, speech bubbles, dots. It should make you smile.
- Bold: thick outlines, chunky type, big numbers, saturated flat color.
- Clear: the fun never gets in the way of reading the answer. Readability wins every
  conflict with charm.

## Design tokens

All tokens are CSS custom properties in `src/styles/global.scss`. Components use the variables
and never hardcode colors, fonts or line widths (plain `#fff` for text on red/blue stickers is
the one exception).

### Colors

| Token | Value | Use |
|---|---|---|
| `--color-blue` | `#4f63b0` | Page background, sticker fill |
| `--color-blue-light` | `#8fa1e0` | Halftone dots on the page |
| `--color-yellow` | `#f2d65c` | Section fill, winner marker behind the cost |
| `--color-pink` | `#f19a96` | Section fill, halftone dots on the winner card |
| `--color-red` | `#c8352c` | Accent: sticker headings, slider thumb, checkbox, starburst, errors |
| `--color-cream` | `#fff6e6` | Section fill, cards, inputs, title text |
| `--color-ink` | `#1c1f3f` | Text, outlines, shadows (navy) |
| `--color-ink-soft` | `#3d3f63` | Secondary text: hints, units, read-only values |

Contrast (WCAG AA, 4.5:1 for text):

| Pair | Ratio |
|---|---|
| ink on yellow / pink / cream | 11.0 / 7.4 / 14.9 |
| ink-soft on yellow / pink / cream | 7.0 / 4.7 / 9.4 |
| white on red / blue | 5.2 / 5.6 |
| yellow on ink | 11.0 |

Secondary text (`--color-ink-soft`) is never placed on blue.

### Typography

| Token | Font | Use |
|---|---|---|
| `--font-heading` | **Rubik** (700, 900) | Title, section stickers, card headings, the summary |
| `--font-body` | **Inter** (400, 500, 700) | Labels, values, body text, numbers |

- Both are free Google Fonts, loaded with a `<link>` in `index.html` (with `preconnect` and
  `display=swap`). Fallback: `system-ui, sans-serif`.
- Title and section stickers are uppercase Rubik Black. Long text (summary, notes) is never uppercase.
- Numbers change while sliding. Give value labels a fixed `min-width` (in `ch`) and
  `tabular-nums` so the layout doesn't jump.
- Base size 17px.

### Lines and shapes

| Token | Value | Use |
|---|---|---|
| `--line-bold` | `4px` | Section, card, input and sticker outlines |
| `--line-thin` | `2px` | Slider track |
| `--shadow-pop` | `6px 6px 0 ink` | Sections, the winner card |
| `--shadow-pop-small` | `3px 3px 0 ink` | Cards, inputs, stickers, thumb |
| `--radius` | `18px` | Sections and cards. Pills and stickers use `999px` |
| `--dots-size` | `14px 14px` | Halftone dot grid (a `radial-gradient` background layer) |
| `--mark-check`, `--mark-check-cream` | SVG | Check mark as mask / as cream image |
| `--shape-burst` | `polygon(...)` | Starburst `clip-path` for the winner badge |

### Spacing

`--space-1` to `--space-6` (4, 8, 12, 16, 24, 40 px). One centered column, max about 640px
wide, mobile first.

## Key elements

### Page

- Blue background with light-blue halftone dots.
- Title: huge uppercase Rubik Black in cream with stacked navy, red, navy offset text shadows.

### Sections

- Flat color block with a bold ink outline, `--radius` corners and `--shadow-pop`.
- Fills cycle yellow, pink, cream (`nth-of-type(3n + …)`).
- The heading is a pill-shaped sticker on the top edge, tilted `-2deg`, with its own small
  shadow. Sticker colors cycle with the section: red/white, ink/yellow, blue/white.

### Sliders

- Styled native `<input type="range">` (accessible, keyboard-friendly).
- Track: cream pill with an ink outline. Thumb: red circle, bold ink outline, small hard shadow, about 30px.
- The current value sits in an ink pill tag next to the label, in cream text.
- Focus: cream + ink double ring around the thumb, visible on every section color.

### Inputs and checkboxes

- Cream fill, bold ink outline, rounded, small hard shadow. Focus adds a colored ring.
- Checked checkbox: red fill with a cream check mark.

### Result cards

- Cream card with a bold outline and small shadow.
- **Winner:** lifts a few pixels with the bigger shadow, gets pink halftone dots, a yellow marker
  block behind the cost, and a red starburst with a cream check on the top-right corner.
  The loser stays plain, not greyed out.
- **Tie:** both cards are plain, and the summary says they cost the same.

### Summary and break-even

- Summary: Rubik Black in a cream comic speech bubble whose tail points up at the cards.
  It is the answer, so it is the most prominent text after the costs.
- Break-even notes: body font, `--color-ink-soft`, with a red bar on the left, in their own section.

### Errors

- A red pill sticker with white bold text directly under the field, plus a red outline on the field.

### Read-only values (Volvo consumption)

- Plain text in `--color-ink-soft`, no input styling, so it is clearly not editable.
- Car details such as the engine designation go on a smaller line under the name.

## Favicon

`public/favicon.svg`: a tile split diagonally yellow/pink, navy outline and offset shadow, with a
red lightning bolt. Uses the same hex values as the tokens.

## Motion

- Minimal. When the winner changes, the yellow marker grows in and the card lifts (about 200ms,
  `--duration-pop`).
- Respect `prefers-reduced-motion`: no transitions when it is set.

## Accessibility

- Every text/background pair used is at least 4.5:1 (see the contrast table). Check it when
  adjusting colors.
- The winner must not rely on color alone. The text summary and the starburst check carry it too.
- All inputs have real `<label>`s. Sliders are native range inputs.
