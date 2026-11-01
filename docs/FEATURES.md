# Features

What the app does. For how it is built, see [ARCHITECTURE.md](ARCHITECTURE.md).
Each feature has an ID. Reference it in commits and PRs (e.g. `F3: add break-even text`).

## Overview

A single page. You enter a trip and adjust prices and the Leaf's consumption with sliders,
and the app shows live which car is cheaper for the trip and at which price the other car
would take over.

All logic lives in `core/trip-cost/`, with shared formatting in `core/format/`.

## Conventions (v1)

- Units: km, l/100 km, kWh/100 km, kr/l, kr/kWh, kr.
- Locale `sv-SE`: decimal comma, space as thousands separator (e.g. `1 234,50 kr`).
- Money is shown with 2 decimals. Unit values are shown with the precision of their step.
- All values below come from `core/constants.ts` or `core/vehicles.ts`, never hardcoded elsewhere.

## Cars (v1)

| Car | Type | Consumption | Editable |
|---|---|---|---|
| Volvo V70 (2009) | gasoline | 8,0 l/100 km | No. Shown as read-only text |
| Nissan Leaf (2022, 40 kWh) | electric | 13,0 kWh/100 km (default) | Yes. Slider 12–30 kWh/100 km, step 0,1 |

Values are owner estimates and can be refined later in `core/vehicles.ts`.

---

## F1 — Trip distance

- A number field for one-way distance in km.
- A "Round trip" checkbox that doubles the distance used in calculations.
- Accepts decimal comma or dot. Trims whitespace.
- Validation: required, numeric, > 0. Invalid input shows an error under the field, and the
  results are hidden (not shown as 0).
- An error is shown only once the field has been touched (no errors on first load).
- Starts empty.

**Done when:** `"12,5"` with round trip gives 25 km in the calculation. `""`, `"abc"`, `"0"`
and `"-3"` give an error and no result.

## F2 — Price sliders

| Slider | Min | Max | Step | Default |
|---|---|---|---|---|
| Gasoline price (kr/l) | 12,00 | 30,00 | 0,10 | 17,50 |
| Electricity price (kr/kWh) | 0,00 | 15,00 | 0,05 | 2,00 |

- Each slider shows its current value formatted next to it (e.g. `17,50 kr/l`).
- Values are clamped to the range.
- Defaults, ranges and steps live in `constants.ts`.

**Done when:** sliding either price updates the results immediately.

## F3 — Car consumption

- Gasoline car: name and consumption shown as read-only text (e.g. `Volvo V70 (2009) · 8,0 l/100 km`).
- Electric car: name, plus a consumption slider prefilled with the config default.
  Range and step come from the car's config entry.

**Done when:** moving the Leaf slider changes the electric cost live, and the Volvo value
cannot be changed in the UI.

## F4 — Cost comparison (live)

Shown only when the inputs are valid. Updates on every change, with no submit button.

Formulas (pure, tested):

- `tripDistance = distance × (roundTrip ? 2 : 1)`
- `gasolineCost = tripDistance / 100 × litersPer100Km × gasolinePrice`
- `electricCost = tripDistance / 100 × kWhPer100Km × electricityPrice`
- `cheaper = 'gasoline' | 'electric' | 'equal'`. It is `'equal'` when `|difference|` is below the
  tie threshold in `constants.ts` (default 0,01 kr).
- `saving = |gasolineCost − electricCost|`

Display:

- One result card per car with its trip cost. The cheaper car's card is highlighted.
- A summary line: "Nissan Leaf is cheaper by 147,20 kr", or "Both cost the same" for a tie.

**Done when:** tests cover both winners, a tie, round trip, and the slider extremes (e.g. electricity 0 kr).

## F5 — Break-even prices

Helps you see where one car overtakes the other while sliding.

- Electricity break-even at the current gasoline price:
  `gasolinePrice × litersPer100Km / kWhPer100Km` (kr/kWh)
- Gasoline break-even at the current electricity price:
  `electricityPrice × kWhPer100Km / litersPer100Km` (kr/l)
- Shown as text, e.g. "Electric is cheaper while electricity is below 4,12 kr/kWh" and
  "Gasoline is cheaper while gasoline is below 8,40 kr/l".
- Independent of distance, so it is shown even when the distance is empty or invalid.
- Shown even if the value is outside the slider range.
- Guard: if a consumption value is 0 (not possible via the current sliders), the function returns
  `null` and nothing is shown.

**Done when:** tests verify that at the break-even price both costs are equal (`toBeCloseTo`).

---

## Not in v1

Keep the design open to these, but don't build them:

- Choosing among multiple cars (config is already a list)
- User-configurable units, currency or locale
- CO2, range or charging-stop calculations
- Home/public charging split, charging losses
- A visual break-even marker on the slider
- Persistence (localStorage) or a backend
