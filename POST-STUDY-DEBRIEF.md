# Study Protocol

---

## Part 1: During Tasks — Think-Aloud + Observation

Ask participants to think aloud as they work. The researcher may interrupt at key moments (e.g., when they switch from docs to editor) to ask:

- *"What are you trying to do right now?"*
- *"Can you tell me when you're finished with this part?"*

Take notes on: construction order, self-correction patterns, verbalized confusion, doc reference patterns, per-section timing.

---

## Part 2: After Task 1 — Feature Usefulness (~2 min)

*"How useful was [feature] when you used the library to build this interactive formula?"*

Rate each on: **I did not use it** / **Not useful** / **Somewhat useful** / **Very useful**

| Feature | I did not use it | Not useful | Somewhat useful | Very useful |
|---------|:---:|:---:|:---:|:---:|
| Giving a formula an `id` (e.g., `id: "gravity"`) | | | | |
| Writing the formula in LaTeX (e.g., `latex: "\\vec{F} = G \\frac{m_1 m_2}{r^2}"`) | | | | |
| Using variable keys that match the LaTeX (e.g., `m_1`, `"\\vec{F}"`) | | | | |
| Setting `input: "drag"` to make a variable draggable | | | | |
| Controlling decimal places with `precision` (e.g., `precision: 2` shows `9.81`) | | | | |
| Controlling significant figures with `sigFigs` (e.g., `sigFigs: 3` shows `6.67 × 10⁻¹¹`) | | | | |
| Giving variables human-readable names with `name` (e.g., `name: "Mass of Earth"`) | | | | |
| Setting initial values with `default` (e.g., `default: 80`) | | | | |
| Reading variable values in semantics with `vars` (e.g., `var m1 = vars.m_1`) | | | | |
| Writing back computed results in semantics (e.g., `vars["\\vec{F}"] = force`) | | | | |
| The semantics function as a way to define computation (e.g., `semantics: function ({ vars }) { ... }`) | | | | |
| Configuring drag range and step size (e.g., `range: [0, 100]`, `step: 0.1`) | | | | |

---

## Part 3: After Task 2 — Feature Usefulness (~2 min)

*"How useful was [feature] when you used the library to build this interactive formula?"*

Rate each on: **I did not use it** / **Not useful** / **Somewhat useful** / **Very useful**

| Feature | I did not use it | Not useful | Somewhat useful | Very useful |
|---------|:---:|:---:|:---:|:---:|
| Enabling stepping with `stepping: true` | | | | |
| Calling `step()` inside the semantics function to create a snapshot | | | | |
| The `step({ ... })` call format with `description` and `labels` | | | | |
| Adding a text description to a step (e.g., `description: "Square the distance"`) | | | | |
| Using variable labels to show values (e.g., `labels: { m_1: m1 }`) | | | | |
| Using expression labels to highlight parts of the formula (e.g., `labels: { "m_1 m_2": "Product of masses" }`) | | | | |
| Formatting numbers with `latex()` (e.g., `latex(product).sigfigs(3)`) | | | | |
| Using inline LaTeX in descriptions (e.g., `description: "Multiply by $G$"`) | | | | |

---

## Part 4: After All Tasks — Closing Interview (~10 min)

A conversational debrief. Ask the open questions, follow up on specific moments you noticed during observation.

### Closeness of Mapping

*"Which parts of using the library felt most intuitive — where you just knew what to do?"*

*"Which parts felt unintuitive — where the library didn't work the way you expected?"*

### Viscosity

*"What kinds of changes were easy to make?"*

*"What kinds of changes were hard — where you wanted to adjust something but it felt like a lot of work?"*

### Open-Ended

*"If you could change one thing about how this library works, what would it be?"*
