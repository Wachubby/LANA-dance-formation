# LANA Dance Formation

> V1 product specification — implementation baseline

## 1. Product purpose

LANA Dance Formation is a lightweight web-based dance formation visualisation and editing tool designed primarily for Japanese idol groups and their choreographers.

It modernises static formation sheets by connecting formation snapshots over musical beats so dancers can see where they are, where they need to go, which way they face, and the route between positions.

**V1 is a formation tool, not a body-animation tool.** It does not attempt to model arm, hand, leg or full-body dance choreography.

## 2. V1 principles

- Keep V1 simple, controllable, inexpensive and easy to use.
- Choreography data is portable JSON; a LANA cloud account/database is not required.
- Media is referenced externally and is not stored by LANA.
- BPM/beats are the choreography clock; seconds are derived only where needed for media synchronisation.
- Straight movement is the default; the choreographer specifies exceptions.
- View and Edit use the same underlying choreography data and stage framework.
- Future sophistication must not make V1 harder to use.
- Build/test/refine touch interactions rather than over-designing them before real tablet testing.

## 3. Language

**V1 user-facing UI is Japanese only.**

English may be used internally for development, code and JSON field names, but an English-language UI/switch is not required in V1.

Japanese names must support full Unicode including kanji, hiragana, katakana and Latin characters.

## 4. Modes and devices

### View Mode — smartphone landscape

View Mode is read-only. A dancer cannot edit choreography.

The screen prioritises:

1. Large stage.
2. Dancer markers and facing direction.
3. Snapshot filmstrip/timeline.
4. Previous Snapshot, Play/Pause and Next Snapshot.
5. FILE/open control.

The Edit toolbox is removed so the stage can use more width.

Initially nobody is selected. All dancers use the normal white selection ring. Tapping a dancer enters a personal/highlight view:

- selected dancer ring becomes green;
- other dancers become visually dimmed/greyed;
- selected dancer's stored movement route is shown as a dotted path;
- a semi-transparent destination/ghost marker shows the selected dancer's next snapshot position and final facing direction;
- during Play the solid marker travels along the stored path toward the destination, including stored facing changes/spins;
- the selected dancer identity should be remembered on that device where practical so it need not be selected every practice session.

There should remain an easy way to select another dancer or return to the all-dancers view.

### Edit Mode — tablet landscape

Edit Mode is intended for landscape tablets. Smartphone editing is not supported in V1.

It uses the same stage/timeline framework plus choreographer tools for formations, movement/facing, snapshots, group settings and project controls.

Normal dancer use should expose View only. Edit may be protected/hidden (for example a press-and-hold VIEW unlock); exact protection interaction can be refined during implementation.

## 5. Stage and dancers

### Stage

- Default real stage dimensions: **10 m × 8 m**.
- Width/depth are editable for the actual venue.
- Changing dimensions changes coordinate/grid scale, not the basic physical size of the UI canvas.
- **Audience is always at the top of the screen.** The stage itself does not rotate.
- A narrow visible off-stage margin (approximately one dancer-marker width) is available around the stage.
- Off-stage dancers may overlap; LANA does not model backstage geography.
- Moving a dancer off stage does not delete them or change dancer count.
- Dancer marker size remains visually consistent when stage dimensions change.

### Dancer marker

Each dancer has:

- stable ID;
- full/member name;
- optional short stage label;
- member colour;
- position per snapshot;
- facing direction per snapshot.

The stage marker is a coloured circle with a compact **pointy nose/bump** indicating the dancer's front. The marker/label may rotate with the dancer's facing in V1 so the body direction is visually explicit.

### Selection / lock visual language

Concept is locked; exact gestures are intentionally testable:

- **White outer ring:** normal/not selected.
- **Green outer ring:** selected/included in current action.
- **Red outer ring:** position locked/excluded from the current movement operation.

Green means selected, not specifically moving. Red is an operational position lock, not permanent uneditability.

## 6. Groups and members

A new group starts with:

- group name: `Group A` (Japanese UI equivalent can be used);
- default member count: **5**;
- temporary/default member labels: `1, 2, 3, 4, 5`;
- initial colours: **Red, Yellow, Pink, Green, Purple**;
- free multiline Notes field.

V1 should provide approximately **20 curated member colours** covering common Japanese-idol colour families, plus a Custom colour option using a colour picker/HEX value.

In the Members area, tapping a member's colour circle should open the lightweight member editor rather than requiring a separate permanent section. It should allow editing at least:

- full/member name;
- short stage label;
- member colour.

Changes should immediately update that member's stage marker.

Member count can be changed, with Add/Remove Member controls as appropriate.

### Duplicate Group / configuration

**Duplicate Group is V1.** It is useful not only for a different group but for alternate configurations of the same group, for example a temporary four-member version while one member is unavailable.

The original configuration remains untouched.

## 7. Beat-based snapshots and timeline

Snapshots are choreography keyframes attached to beats.

A newly created next snapshot initially inherits the previous saved state. The choreographer changes positions/facing/etc. and explicitly saves the snapshot.

### Provisional default interval

The current working default is **one snapshot every 16 beats**, but this must be confirmed with Lana. Additional snapshots can be inserted at intermediate beat positions such as 8 or 4 beats where required.

The intended insertion behaviour supports midpoint subdivision of the current interval (for example 16 → 8 → 4) while keeping underlying beat positions accurate and displayed snapshot numbering clean.

Deleting the selected snapshot does not shift surrounding beat positions. Add/delete operations must be undoable before Save.

### SAVE / Undo / Redo

Permanent Edit control group:

**Undo | SAVE | Redo**

- Undo/Redo covers multiple edits since the last SAVE.
- SAVE creates the current snapshot checkpoint/boundary.
- V1 Undo does not need to cross the last SAVE.
- Navigating away with unsaved changes should warn the user rather than silently discard work.

### Snapshot filmstrip

Snapshots appear as miniature top-down formation previews with snapshot numbers. Large projects scroll horizontally rather than squeezing every thumbnail onto one screen.

### FULL and precision ZOOM

FULL and ZOOM are two scales of the same beat-based timeline.

- **FULL:** navigation/overview scale showing as many readable snapshots as practical, with horizontal scrolling.
- **Precision ZOOM:** current provisional design is **32 beats** with reference markers `0 — 8 — 16 — 24 — 32`.

Whether precision ZOOM should show **32 or 64 beats** is intentionally left for Lana to test/answer. The underlying architecture must not depend on one choice.

## 8. Navigation and playback

The old +/-5-second navigation is removed.

Use:

**Previous Snapshot | Play/Pause | Next Snapshot**

Previous/Next jumps exactly to the adjacent snapshot regardless of whether the gap is 4, 8, 16 or another supported number of beats.

During Play, dancers move continuously between snapshot states according to BPM and stored paths rather than jumping between positions.

Default movement begins at the first snapshot and reaches the next snapshot at the next snapshot's beat using constant travel timing. If a dancer must wait before moving, the choreographer can insert an intermediate snapshot where the dancer remains in place.

## 9. Formation system

### Built-in V1 defaults

Only three built-in formations are required:

1. **Line**
2. **V**
3. **Circle**

Line can support useful horizontal/vertical orientations; V can rotate/flip through useful orientations. Circle remains circular.

Applying a formation selects the formation/group (green rings), after which it can be positioned on the stage and individual dancers adjusted before saving the snapshot. No separate formation Confirm/Save step is required; **SAVE always means save the snapshot**.

### Geometry, not member identity

A saved formation stores reusable relative geometry/shape rather than specific member names. Member assignment is separate.

A formation should be reusable across different member counts. V1 may use a simple best-effort adaptation algorithm to preserve the shape/symmetry when the current group has fewer or more dancers than the formation's original creation count. Manual adjustment remains available.

### Replace Member / Swap

LANA must distinguish:

- **Drag dancer:** physical movement, therefore potentially creates/changes a movement path.
- **Replace Member:** identity assignment only; position remains unchanged and no travel path is created.

If the replacement member already occupies another formation position, default behaviour should be a swap rather than duplication/disappearance.

Exact interaction is to be tested with Lana.

## 10. Movement and facing system

Formation and Movement/Facing are sibling reusable-tool systems.

### Built-in V1 defaults

- **Straight** — automatic/default route and reset-to-straight option.
- **Curve** — simple reusable curved route.
- **Spin** — facing rotation through 360 degrees over a specified beat interval/event while position may also be changing.
- **Face Audience** — set selected dancer(s) to face the audience/top of screen without changing position.

The built-in defaults start available/enabled but may be disabled for a particular group if the choreographer does not need them.

### Paths

Dragging a dancer from Position A to Position B in the next snapshot automatically creates/assumes a straight route.

If the actual route differs, the choreographer can draw a custom route from A to B. LANA applies light smoothing to accidental finger shake while preserving the intended curve. **Reset to Straight** restores the automatic route.

Saved movement patterns should be reusable rather than tied to one dancer or one exact distance; where practical the path can scale/stretch between the current and destination positions.

### Facing

Facing is stored separately from position. A dancer can remain in the same position while changing facing.

Multi-selection allows facing changes to several dancers at once. Face Audience is permanently available as a useful default. More complex reusable facing arrangements can be stored in the choreographer's library.

Exact arbitrary-facing/rotation gesture is to be tested with Lana.

## 11. Choreographer library and per-group tool selection

Lana has a **global reusable library** of custom formations and movement/facing patterns she has saved, regardless of which group they originated from.

Each group chooses which library items appear in its normal Edit toolbox:

- **Green:** enabled/selected for current group.
- **White:** available in the global library but not enabled for current group.

There is no artificial small limit such as 40 formations. If the library contains 40, Settings may show all 40. The normal Edit panel shows only the items enabled for the current group and becomes scrollable if necessary.

When a new custom formation/movement is created, it is added to the global Lana library and enabled for the current group by default.

Group Settings should cover:

- group name;
- member count;
- member names/short labels/colours;
- Notes;
- Formation library selection;
- Movement/Facing library selection.

## 12. BPM, beat clock and rehearsal sound

BPM is core choreography timing data.

- V1 supported range: **40–300 BPM**.
- Direct numeric entry.
- +/- adjusts by 1.
- **Tap BPM** estimates BPM from repeated taps and asks for confirmation before replacing the current value.
- One project uses one BPM in V1.

The beat engine is continuous and separate from the audible sound layer.

Song and Count can be independently ON/OFF, allowing:

- song only;
- count only;
- both;
- silent visual playback.

Current provisional rehearsal-count concept is a **32-beat/four-8-count cycle** such as spoken ONE + seven ticks, TWO + seven, THREE + seven, FOUR + seven, then repeat. Exact count/click/voice treatment is intentionally left for Lana to confirm.

## 13. External media

LANA does not store WAV, MP3, MP4 or other song/video media.

A project may store a generic external media reference, for example:

```json
"media": {
  "provider": "youtube",
  "videoId": "..."
}
```

LANA's BPM/beat engine remains the choreography clock; external media is synchronised to it rather than becoming the authoritative clock.

Media should not occupy large permanent screen space. Main Edit can use compact Song/Count controls, with media configuration elsewhere.

Private/unreleased-song workflow and authenticated provider behaviour require technical testing and input from Lana about how she actually receives/plays unreleased music.

## 14. Library data vs choreography projects

Two concepts are deliberately separated.

### Lana Library

Reusable working setup containing:

- groups/configurations;
- members and colours;
- global formation library;
- global movement/facing library;
- per-group enabled tools;
- song/project catalogue/index where practical.

The preferred day-to-day storage location (own cloud, local tablet, or both) is intentionally left for Lana to confirm. LANA does not need its own cloud account/server for V1.

### Choreography Project JSON

Each individual song/routine is a **self-contained portable JSON file**. When a project is created from a group/configuration, the relevant group data is copied into the project so the project can still open even if the original Library is unavailable.

At minimum a project contains:

- group name;
- song/project name;
- version/identity metadata;
- copied member IDs/names/labels/colours and member count;
- stage dimensions;
- BPM/timing;
- snapshots and beat positions;
- coordinates and facing;
- required movement paths/events/spins;
- formations/data actually required to reconstruct the choreography;
- Notes as applicable;
- optional external-media reference.

Later changes to the Group Library must **not silently rewrite an existing choreography project**.

## 15. Song names, filenames and versions

Both **Group Name and Song Name** must be visible project identity because different groups may have songs with the same title.

Exported filenames should automatically include both, for example:

`GroupA_Sakura_v1.json`

The project header should also clearly display both group and song name.

### Version workflow

For an established choreography, the recommended workflow is **Duplicate rather than overwrite**.

Example:

- Sakura — v1
- Sakura — v2
- Sakura — v3

The choreographer can Open, Duplicate, Rename, Delete and Export versions. Delete requires confirmation.

If v2 is deleted, v3 does not need to be renumbered. Stable filenames/identities are preferable to automatic renaming.

The Library/project browser may organise projects conceptually as:

**Group → Songs → Versions**

These remain separate self-contained project files rather than one giant group file.

## 16. File transfer and dancer opening workflow

LANA remains server-light. A choreography JSON can be transferred by the user's preferred method, for example LINE, email, AirDrop, cloud drive or a file-transfer service such as GigaFile便.

Guaranteed V1 web workflow:

1. Receive choreography JSON.
2. Save/open the file on the phone as required by the OS/browser.
3. Open LANA.
4. FILE → select/open choreography JSON.
5. LANA reconstructs the choreography in View Mode.
6. Where practical, remember the recently opened choreography locally so the dancer does not need to reselect the JSON every practice session.

When Lana exports/shares a project, it is desirable to provide both the JSON and a simple **Open LANA** web link/instruction.

One-tap opening of a JSON attachment directly into a web/PWA LANA experience is a **technical feasibility/test item** for iOS, Android and messaging apps such as LINE; do not make V1 depend on it.

## 17. Edit Mode layout

The first approved simple Edit Mode mockup remains the visual baseline, subject to the newer product decisions in this specification.

- Stage is the dominant area.
- Members remain on the left.
- Right-side authoring area contains enabled Formation and Movement/Facing tools.
- Settings can replace/open the right-side area for group/member/library configuration rather than permanently consuming stage space.
- Snapshot filmstrip/timeline runs along the bottom.
- Media controls remain compact.
- No English-language switch in V1.
- A Layers feature is not a V1 requirement.

## 18. Intentionally unresolved: Ask/Test with Lana

These are **not specification gaps to guess at**. The underlying architecture should remain flexible while they are confirmed with the working choreographer.

1. **Precision ZOOM range:** 32 beats vs 64 beats.
2. **Default snapshot interval:** whether 16 beats is a useful real-world default.
3. **Rehearsal count/metronome:** voice/click pattern and whether spoken counts are useful.
4. **Multi-dancer selection gesture:** exact touch interaction.
5. **Manual facing/rotation gesture:** exact touch interaction.
6. **Replace Member / Swap gesture:** exact touch interaction.
7. **Whole-formation manipulation:** exact drag/rotate/flip interaction.
8. **Custom-path smoothing:** how much smoothing feels natural.
9. **Library/master storage:** own cloud vs local tablet vs both.
10. **Private/unreleased music workflow:** how Lana receives and plays working audio in practice.
11. **Stage visual treatment:** functional geometry is locked; final visual styling can be judged in the real build.
12. **Tutorial/help:** View Mode should be self-explanatory; if help is needed, favour short Japanese visual guidance/screen recording without requiring narration.

## 19. Explicit V1 boundary

V1 includes:

- Japanese-only production UI;
- tablet Edit Mode and smartphone-landscape View Mode;
- 10 m × 8 m editable stage with audience fixed at top;
- coloured dancer markers, Japanese names/labels and facing noses;
- selection/lock states;
- groups/configurations and Duplicate Group;
- Line/V/Circle formations;
- Straight/Curve/Spin/Face Audience movement/facing defaults;
- reusable global Formation and Movement/Facing libraries with per-group selection;
- beat/BPM snapshots and visual filmstrip;
- FULL + precision ZOOM timeline (32/64 final choice pending Lana);
- explicit SAVE with Undo/Redo since last save;
- continuous movement playback;
- personal View highlighting, dotted route and destination ghost;
- BPM 40–300, Tap BPM and independent rehearsal count;
- self-contained portable choreography JSON;
- separate reusable Lana Library data;
- Group → Songs → Versions organisation;
- duplicate-before-edit version workflow;
- optional external-media reference/playback.

V1 explicitly does **not** model detailed arm, hand, leg or full-body dance animation.

More sophisticated dancer/avatar/body-movement visualisation is a possible future V2/V3 concept and must not expand V1 scope.

## 20. Implementation sequence

1. Keep this README as the V1 product source of truth.
2. Build/refine shared responsive stage and dancer-marker system.
3. Implement group/member configuration and selection visual states.
4. Implement snapshots, SAVE/Undo/Redo and beat timeline.
5. Implement Line/V/Circle group formation behaviour.
6. Implement Straight/Curve/custom paths plus facing, Spin and Face Audience.
7. Implement View Mode personal highlight, dimming, dotted route and destination ghost.
8. Implement reusable global libraries and per-group enabled tools.
9. Define/finalise Library and choreography JSON schemas alongside implementation.
10. Implement Group → Songs → Versions file/project workflow and JSON import/export.
11. Implement BPM/Tap BPM and rehearsal sound architecture.
12. Add optional external-media integration without making it a dependency.
13. Test on real tablet/phone hardware with Lana/dancers and resolve the items in Section 18.

The README remains the V1 source of truth and should be updated whenever a product decision is intentionally changed.