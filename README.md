# LANA Dance Formation

> V1 product specification — working source of truth

## 1. Product purpose

LANA Dance Formation is a web-based choreography formation visualisation tool designed primarily for Japanese idol groups and their choreographers.

The product modernises the traditional workflow of distributing static printed formation sheets. A choreographer creates formation snapshots across a song, and LANA connects those snapshots over time so dancers can see where they are, where they need to go, and how they move between positions.

**LANA is not intended to become a general-purpose animation editor.** Its purpose is to make dance formation creation, communication, rehearsal and review easier.

## 2. Core design principle

The choreographer should only need to specify exceptions.

- A new unsaved snapshot begins with the previous snapshot's dancer positions.
- Movement between snapshots is a straight line by default.
- The default snapshot spacing is 16 beats.
- Extra snapshots, custom paths and special formations are added only when required.

The same underlying choreography data powers both Edit Mode and View Mode.

---

## 3. Modes and target devices

### View Mode

View Mode is the dancer-facing, read-only experience.

Primary target: smartphone. The web interface should also respond appropriately to tablet and desktop screen sizes.

Dancers can:

- Open/load a choreography JSON file.
- View the stage and formation.
- Play and pause choreography playback.
- Jump backward 5 seconds.
- Jump forward 5 seconds.
- Change playback speed: 0.5x, 1.0x, 1.5x or 2.0x.
- Change the timeline between a focused 60-second view and FULL-song view.
- Select/highlight an individual dancer.
- View that dancer's movement path between snapshots.
- Use File functions made available to viewers, including opening another choreography and PDF export/download where applicable.

Dancers cannot:

- Change BPM.
- Change the number of dancers.
- Change stage dimensions.
- Edit dancer positions or choreography.
- Create, move or delete snapshots.
- Modify the YouTube source.
- Save changes to the choreography.

Normal View Mode does not expose Edit controls.

### Edit Mode

Edit Mode is the choreographer-facing creation workspace, designed primarily for a tablet in landscape orientation.

The main stage/timeline framework remains consistent with View Mode, but Edit Mode adds the controls required to create and modify choreography.

#### Unlock behaviour

Edit Mode is hidden during normal dancer use. Pressing and holding **VIEW for approximately 3 seconds** unlocks Edit Mode.

Once unlocked, **VIEW** and **EDIT** appear next to each other so the choreographer can switch safely between editing and dancer-preview views.

---

## 4. Stage and coordinate grid

The central stage should occupy substantially more screen space than in the current prototype.

The stage represents real-world dimensions in metres. The current reference example is **20 m wide × 15 m deep**, with each grid square representing **1 metre**.

The choreographer can change stage width and depth/length in Edit Mode.

Changing dimensions changes the **grid and coordinate system, not the physical size of the stage canvas on screen**. For example, a 10 m-wide stage has fewer metre divisions than a 20 m-wide stage while using the same available display area.

The stage includes a clear **FRONT** orientation.

### Off-stage area

Blank space around the numbered stage grid is functional off-stage space.

A dancer dragged outside the grid is off stage but remains part of the choreography. Moving a dancer off stage must **not** change the project's dancer count or delete the dancer.

This allows routines such as eight members beginning together, six leaving while two perform, and all eight returning later.

---

## 5. Dancers

Edit Mode allows the choreographer to add or remove dancers from the project using plus/minus controls.

Each dancer has persistent identity data including:

- Display name/label.
- Member colour.

Display names must support Unicode, including ASCII, numbers and Japanese text such as hiragana, katakana and kanji.

Member colours are particularly important for Japanese idol groups, where individual members commonly have assigned colours.

A dancer's snapshot state includes at minimum:

- Position.
- On-stage/off-stage position/state as represented on the canvas.
- Facing direction.

### Facing direction — required, visual treatment TBD

Facing direction must be visible to dancers, but the exact visual treatment remains open for mock-up testing.

Candidate treatments include:

1. Rotating the dancer's name/label to match facing direction.
2. Keeping the label readable while using an internal direction marker.
3. Giving the dancer circle a small "nose"/bump indicating its front.

Dense formations must remain readable; an indicator that consumes substantial space outside the dancer circle should be avoided if it interferes with nearby dancers.

---

## 6. Snapshot model

Snapshots are choreography keyframes.

### Snapshot 00

**Snapshot 00** is the song's starting formation.

### Default spacing

Subsequent snapshots are spaced **16 beats apart by default**. Actual elapsed time therefore depends on BPM.

### Position inheritance

When the choreographer opens a snapshot with no saved position data yet, it initially displays the immediately preceding snapshot's positions.

Example:

1. Snapshot 00 contains the starting positions.
2. Snapshot 01 initially shows Snapshot 00's positions.
3. The choreographer moves dancers and presses SAVE.
4. Snapshot 02 then begins from Snapshot 01's saved positions.

This avoids rebuilding every formation from scratch.

### SAVE

The Edit Mode **SAVE** control commits the currently selected snapshot's choreography changes to the working project. It is distinct from downloading/exporting the complete project file.

### Adding snapshots: midpoint rule

The snapshot `+` control inserts a new snapshot **halfway between the currently selected snapshot and the next snapshot**.

For example, if Snapshot 01 and Snapshot 02 are 16 beats apart, adding a snapshot while on Snapshot 01 divides that interval into two 8-beat sections.

If a further snapshot is inserted into an 8-beat section, that section is divided again into 4-beat sections.

This allows additional timing precision only where the choreography requires it.

### Removing snapshots

The snapshot `−` control removes the currently selected snapshot.

Undo/Redo is therefore an important Edit Mode requirement so accidental snapshot changes or deletion can be recovered.

**Open question:** whether Snapshot 00 should be protected from deletion will be confirmed later.

---

## 7. Movement between snapshots

By default, a dancer travels in a **straight line** from the previous snapshot position to the next snapshot position.

The choreographer can override this with a custom movement path when a dancer needs to curve, travel around/behind other dancers, or follow another route.

Edit Mode should support:

- A small built-in library of common movement paths.
- Touch/hand-drawn custom paths where required.
- Saving a newly created movement as a reusable named preset.

The movement library should be horizontally scrollable and provide an Edit/Pencil mechanism for saving/managing custom moves.

---

## 8. Formation presets

Edit Mode includes a small starter library of reusable formations.

The choreographer can also arrange dancers manually and save the resulting arrangement as a **named custom formation** for later reuse.

The formation library should be horizontally scrollable and provide an Edit/Pencil mechanism for saving/managing custom formations.

Conceptually:

- **Formation = where the dancers are.**
- **Move = how the dancers get there.**

---

## 9. Individual dancer focus in View Mode

A dancer can tap a dancer marker on the stage to focus on that member.

When focused:

- The selected dancer remains visually prominent.
- Other dancers are dimmed.
- The selected dancer's movement between snapshots becomes visible.
- The displayed movement must use the actual stored path, including custom/curved paths, rather than always showing a straight line.

This is intended to make it easier for an individual performer to learn and remember their own movement through the choreography.

### Movement-path visual — required, treatment TBD

Candidate treatments for mock-up testing include:

- A ghost of the previous/from position plus a dotted movement path.
- A dotted path ending in a directional arrow.
- A combination if testing shows that it is clearer without adding excessive visual clutter.

---

## 10. Edit Mode toolbox

The right-side editing area contains the main creation controls:

1. YouTube
2. BPM
3. Snapshot
4. Dancers
5. Formation
6. Moves

Tablet space is limited, so approximately two rows may be visible at once, with horizontal and/or vertical scrolling within the toolbox as appropriate.

### YouTube

The choreographer supplies the YouTube URL/reference used for the routine. The reference becomes part of the choreography project data so View Mode can reconstruct the routine.

### BPM

Default BPM: **120**.

The current 80/100/120/140 preset buttons are not required.

Use plus/minus controls to adjust BPM. Tapping the BPM number should allow direct numeric entry.

BPM is choreography timing data and is separate from View Mode playback speed.

### Snapshot

Provides snapshot selection plus the midpoint insertion (`+`) and current-snapshot removal (`−`) behaviour described above.

### Dancers

Provides project-level dancer count controls and access to dancer configuration.

### Formation

Provides built-in and user-saved formation presets.

### Moves

Provides built-in and user-saved movement-path presets.

---

## 11. Timeline and playback

The bottom of both View and Edit modes contains the song progress/timeline system.

Required controls include:

- Play/Pause.
- Back 5 seconds.
- Forward 5 seconds.
- Timeline/playhead.
- Snapshot/keyframe indicators.
- 60s/FULL timeline zoom.
- Playback speed.

### 60s / FULL

This is a **timeline zoom/view-range control**, not a snapshot-spacing control.

- **FULL** displays the complete song timeline, including songs around four minutes or longer.
- **60s** displays a more focused approximately one-minute window around the relevant/current section.

### Playback speed

Supported speeds:

- 0.5x
- 1.0x
- 1.5x
- 2.0x

Changing playback speed changes rehearsal playback only. It does **not** change the choreography BPM.

---

## 12. File workflow

The choreography should be portable rather than requiring a dancer account/server workflow for basic viewing.

The choreographer completes a routine and exports/downloads a JSON choreography file. That file can be sent to dancers, who open it in View Mode.

The JSON should contain enough project information to reconstruct the choreography, including at minimum:

- Project/song metadata.
- YouTube reference.
- BPM/timing information.
- Stage dimensions.
- Dancer identities and colours.
- Snapshots/keyframes.
- Dancer positions and facing directions.
- Movement paths.
- Formation/movement information required for playback.

Exact JSON schema remains an implementation decision to be defined before coding.

### FILE menu

The FILE area should support the appropriate project operations, including:

- Open/load choreography JSON.
- Save/download choreography JSON in Edit Mode.
- Export/download formation snapshots as PDF.
- Open another routine/song as appropriate.

The exact File menu layout will be resolved during UI design.

---

## 13. Settings

Settings includes dancer identity configuration.

For each dancer, the choreographer can change:

- Display name/label.
- Member colour.

The interface and stored data must fully support Japanese Unicode text.

Additional Settings items may be defined later.

---

## 14. Language and localisation

The production product is intended primarily for Japanese choreographers and Japanese idol/dance groups.

Required product languages:

- **Japanese — primary production language.**
- **English — development, testing and QA language, and supported UI language.**

Development may begin with English UI for easier testing, but the architecture and layouts must support Japanese from the beginning.

Japanese labels should use terminology natural to Japanese choreographers rather than blindly translating English interface terms word-for-word.

---

## 15. Current open design decisions

These are deliberately **not blockers for V1 specification or engineering preparation**:

- Exact facing-direction visual: rotating label vs internal marker vs "nose" circle.
- Focused-dancer movement visual: ghost vs dotted directional arrow vs combination.
- Exact toolbox layout, scrolling behaviour and component dimensions.
- Exact File menu presentation.
- Exact Settings screen presentation.
- Final treatment of Snapshot 00 deletion/protection.
- Exact PDF snapshot layout.
- Exact JSON schema.

These should be tested/resolved through mock-ups and implementation planning rather than guessed prematurely.

---

## 16. V1 product boundary

V1 should remain focused on:

**Create choreography → save portable choreography → distribute it → let dancers clearly visualise and rehearse formations and movement.**

Features that do not materially support that workflow should not expand V1 unnecessarily.

---

## 17. Next steps

1. Create View Mode and Edit Mode UI mock-ups based on this specification and the existing prototype reference.
2. Compare the open facing-direction treatments visually.
3. Compare focused-dancer movement-path treatments visually.
4. Confirm the UI with the product owner.
5. Define the V1 JSON schema and application architecture.
6. Implement against this specification while keeping the README updated as decisions are locked.
