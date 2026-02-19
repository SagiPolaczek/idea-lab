# Idea Lab

Interactive force-directed graph for exploring, rating, and connecting ideas. Zero-dependency single-page app — just HTML + JS, no build step.

## Architecture

```
idea-lab/
  index.html    # Visualization: canvas rendering, physics engine, UI (all-in-one)
  data.js       # All user data: categories, ideas, problems, references, edge labels
  README.md     # User-facing documentation
  CLAUDE.md     # Agent instructions (this file)
  AGENTS.md     # Points to this file
```

**Separation of concerns**: `data.js` holds ALL content data. `index.html` holds ALL code (CSS + JS). Users only edit `data.js` to customize — the visualization code should never contain hardcoded idea content.

## Data Schema (`data.js`)

The file exports 5 global constants via `<script src="data.js">`:

### `CATEGORIES` — Object
```js
{ key: { name: 'Display Name', color: '#hex' } }
```
- The `reference` category is special — renders as diamond shapes, bypasses score filters
- The `problem` category is special — renders as red gem shapes, bypasses score filters, participates in rating filters
- Colors should be high-contrast against dark background (`--bg: #0a0a0f`)

### `IDEAS` — Array of objects
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | number | yes | **Must be unique across IDEAS + PROBLEMS + REFERENCES**. Convention: 1-99 for ideas |
| `cat` | string | yes | Must match a key in `CATEGORIES` |
| `name` | string | yes | Short title, displayed on graph labels (truncated at 28 chars) |
| `short` | string | yes | Full description, shown in detail panel and tooltips |
| `difficulty` | number (1-5) | yes | Used in score filter sliders and detail panel |
| `novelty` | number (1-5) | yes | **Affects node size** (radius = 5 + novelty*1.2 + impact*0.5) |
| `feasibility` | number (1-5) | yes | Used in score filter sliders |
| `impact` | number (1-5) | yes | **Affects node size** and high-impact ring (>=4 gets ring) |
| `type` | string | yes | Free-text tag displayed in detail panel (e.g. "Feature", "Architecture") |
| `connects` | number[] | yes | Array of IDs this idea connects to. **Edges are undirected** — only need one side |

### `REFERENCES` — Array of objects
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | number | yes | Convention: 201+ to separate from ideas |
| `cat` | string | yes | Must be `'reference'` |
| `name` | string | yes | Title of the source |
| `short` | string | yes | Description |
| `connects` | number[] | yes | Direct connections |
| `descendants` | number[] | no | Ideas that descend from this reference (shown in detail panel) |
| `url` | string | no | External link shown as button in detail panel |

### `PROBLEMS` — Array of objects
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | number | yes | **Must be unique across IDEAS + PROBLEMS + REFERENCES**. Convention: 101-199 for problems |
| `cat` | string | yes | Must be `'problem'` |
| `name` | string | yes | Short title, displayed on graph labels (truncated at 28 chars) |
| `short` | string | yes | Full description, shown in detail panel and tooltips |
| `severity` | number (1-5) | yes | **Affects node size** (radius = 12 + severity*0.8). Shown as severity meter in detail panel |
| `connects` | number[] | yes | Array of IDs this problem connects to (ideas it blocks/affects, related problems) |

### `EDGE_LABELS` — Object
```js
{ "loId-hiId": "relationship label" }
```
- **Key format**: lower ID first, dash, higher ID. E.g., `"1-201"` not `"201-1"`
- Labels appear as pills on edges when a connected node is hovered/selected
- Optional — edges without labels still render, just without text

## Critical Rules for Agents

### Adding Ideas
1. Pick a unique `id` not used by any existing idea or reference
2. Set `connects` to at least 1-2 existing IDs to integrate into the graph
3. Add corresponding `EDGE_LABELS` entries for meaningful connections
4. If the idea descends from a reference, add the idea ID to that reference's `descendants` array

### Adding Problems
1. Use IDs in the 101-199 range
2. Always set `cat: 'problem'`
3. Set `severity` from 1 (minor) to 5 (critical)
4. Add `connects` entries linking to ideas that address the problem and related problems
5. Add corresponding `EDGE_LABELS` entries for meaningful connections

### Adding References
1. Use IDs in the 201+ range
2. Always set `cat: 'reference'`
3. Populate `descendants` with IDs of ideas inspired by this reference
4. Add `connects` entries linking to descendants and related references

### Adding Categories
1. Add to `CATEGORIES` object in `data.js` — that's all that's needed
2. The visualization auto-generates filter buttons, legend items, and colors from `CATEGORIES`
3. No CSS changes required — colors come from data

### Data Integrity
- **No duplicate IDs** across IDEAS + PROBLEMS + REFERENCES
- **No broken connects** — every ID in a `connects` array must exist
- **No broken descendants** — every ID in `descendants` must exist
- **Edge labels use lo-hi format** — lower ID first in the key string
- **No self-loops** — an idea's `connects` should not include its own ID

### Verification
After modifying `data.js`, run this integrity check:
```bash
node -e "
const fs = require('fs');
eval(fs.readFileSync('data.js', 'utf8'));
const probs = typeof PROBLEMS !== 'undefined' ? PROBLEMS : [];
const allIds = [...IDEAS.map(i=>i.id), ...probs.map(p=>p.id), ...REFERENCES.map(r=>r.id)];
const idSet = new Set(allIds);
let ok = true;
// Check duplicates
const dupes = allIds.filter((id, i) => allIds.indexOf(id) !== i);
if (dupes.length) { console.log('DUPLICATE IDs:', dupes); ok = false; }
// Check connects
[...IDEAS, ...probs, ...REFERENCES].forEach(item => {
  (item.connects || []).forEach(cid => {
    if (!idSet.has(cid)) { console.log('BROKEN: id=' + item.id + ' -> missing ' + cid); ok = false; }
  });
});
// Check descendants
REFERENCES.forEach(ref => {
  (ref.descendants || []).forEach(did => {
    if (!idSet.has(did)) { console.log('BROKEN DESC: ref=' + ref.id + ' -> missing ' + did); ok = false; }
  });
});
console.log(ok ? 'ALL OK (' + IDEAS.length + ' ideas, ' + probs.length + ' problems, ' + REFERENCES.length + ' refs)' : 'ERRORS FOUND');
"
```

## Browser State

Ratings and notes are stored in `localStorage`:
- `idea-lab-ratings` — `{ ideaId: 'up' | 'down' }` (absent = neutral)
- `idea-lab-notes` — `{ ideaId: 'note text' }`

These are per-device and not in the repo. The `?clear=id1,id2` URL param pattern from the original was removed in the template.

## Physics Engine

The graph uses simulated annealing with these tunable constants in `index.html`:
- `REPULSION: 2000` — Coulomb-like repulsion between all visible node pairs
- `SPRING_K: 0.005` — Hooke's law spring constant for edges
- `SPRING_LEN: 100` — Rest length of edge springs (pixels)
- `DAMPING: 0.82` — Velocity decay per frame
- `CENTER_PULL: 0.0005` — Gravity toward canvas center
- `MAX_VELOCITY: 8` / `MAX_FORCE: 10` — Caps prevent explosive forces
- `TEMP_DECAY: 0.997` — Annealing temperature decay per frame

The engine pre-settles 800 iterations before first render, then runs at low temperature for gentle final settling. Toggling physics (pause/play button) resets temperature to 1.0.

## Origin

Cleaned from a research-specific visualization (`inbox/idea-lab.html` in the `research` repo) that had 193 PE ideas for video diffusion. Stripped: KaTeX math rendering, showcase mode (content blurring), AV/Math/SPF domain-specific filters, lineage panel, export-to-agent workflow, pre-seeded ratings. This template keeps the universally useful features.
