# LANA Dance Formation

> V1 product specification — implementation baseline

## 1. Product purpose

LANA Dance Formation is a lightweight web-based dance formation visualisation and editing tool designed primarily for Japanese idol groups and their choreographers.

It modernises static formation sheets by connecting formation snapshots over musical beats so dancers can see where they are, where they need to go, which way they face, and the route between positions.

**V1 is a formation tool, not a body-animation tool.** It does not attempt to model arm, hand, leg or full-body dance choreography.

## 2. V1 principles

- Keep the product simple enough to remain controllable and inexpensive.
- Choreography data is portable JSON; a cloud account/database is not required for basic use.
- Media is not stored by LANA. A project may reference external media such as YouTube.
- The choreography clock is fundamentally beat/BPM based.
- Straight movement is the default; the choreographer specifies exceptions.
- View and Edit use the same underlying choreography data and stage framework.
- Future sophistication must not make the basic V1 workflow harder.

## 3. Modes and devices

### View Mode — smartphone first

View Mode is read-only and intended primarily for landscape smartphones.

The screen prioritises:

1. A large rectangular stage.
2. Coloured dancer markers and facing direction.
3. A visual snapshot filmstrip.
4. Playback/rehearsal controls.

The Edit toolbox is removed in View Mode so the stage and snapshot thumbnails can use the available width.

Dancers can load a choreography JSON, play/pause, navigate snapshots, use FULL/ZOOM views, select a dancer and inspect that dancer's movement path. They cannot modify choreography.

### Edit Mode — tablet first

Edit Mode is intended primarily for landscape tablets. Smartphone editing is not supported in V1.

It uses the same stage/timeline framework as View Mode and adds the choreographer's creation toolbox, including formation presets, movement/path presets and snapshot editing.

Edit Mode remains hidden during normal dancer use. Press-and-hold VIEW for approximately three seconds unlocks editing; once unlocked VIEW and EDIT can appear together for safe preview switching.

## 4. Stage and dancers

The stage is the dominant part of the interface. Reference dimensions are 20 m × 15 m with a 1 m grid, but width/depth are editable. Changing real dimensions changes the coordinate/grid scale rather than shrinking the physical UI canvas.

Blank canvas space around the stage grid can represent off-stage positions. Moving a dancer off stage does not delete the dancer or change project dancer count.

Each dancer has:

- stable ID;
- display name/label;
- member colour;
- position per snapshot;
- facing direction per snapshot.

Names support full Unicode including Japanese hiragana, katakana and kanji.

### Facing direction — V1 preferred treatment

Use a compact **pointy nose/bump on the dancer circle** to indicate the dancer's front. The marker/nose rotates with facing direction while the displayed letter/name remains upright and readable.

## 5. Beat-based snapshot model

Snapshots are choreography keyframes attached to musical beats.

Snapshot 00 is the starting formation. New work inherits the previous choreography state so formations do not need to be rebuilt from scratch.

The earlier rule that `+` must always split the interval exactly in half is no longer required. The timeline should allow the choreographer to work at a chosen beat and add a snapshot at the intended beat position.

Deleting a snapshot must be recoverable through Undo/Redo. Protection of Snapshot 00 can be finalised during implementation.

### Visual snapshot filmstrip

Snapshots are displayed as miniature formation previews rather than plain numbered buttons. This filmstrip is a primary navigation element in both View and Edit modes.

If a project contains 52 snapshots, the interface can show `52 Snapshots` and allow horizontal browsing rather than squeezing every thumbnail onto one screen.

### FULL and ZOOM 32

The old `60s / FULL` timeline concept is replaced.

- **FULL** is the comfortable snapshot-browser/overview scale. It shows many readable snapshot thumbnails and can scroll horizontally; it does not have to compress every snapshot onto one screen.
- **ZOOM 32** is the precision view focused on a 32-beat region (four 8-counts). It makes beat placement and nearby snapshot selection/editing safer and clearer.

The same FULL/ZOOM concept is used in View Mode and Edit Mode. In View Mode it is read-only navigation; in Edit Mode ZOOM 32 supports precise snapshot work.

A traditional seconds-based progress bar or remaining-time display is not required for V1 UI. Internal media synchronisation may still use elapsed time as needed.

## 6. Movement paths

Between snapshots, straight-line movement is the default.

A choreographer can override the default with a custom route, for example a curve or route around/behind another dancer.

V1 supports:

- straight default paths;
- a small starter set of useful path presets;
- touch/hand-drawn custom paths where practical;
- saving custom movement/path presets for reuse.

Terminology should avoid implying that V1 stores full-body "dance moves". V1 stores **movement paths/routes**: how a dancer travels between formation positions.

In View Mode, selecting a dancer can highlight that dancer, dim others and display the actual stored movement path.

## 7. Formation library

Edit Mode includes a small starter set of formation presets.

The choreographer can manually create a formation, name it and save it for later reuse. Applying a preset creates a starting arrangement that can then be adjusted for the current routine without requiring the original preset to change.

Conceptually:

- **Formation = where dancers are.**
- **Movement path = how they get there.**

## 8. Reusable choreographer library

V1 should support a lightweight reusable preset library separate from an individual song/routine.

A choreographer can maintain/import a small library JSON containing reusable:

- formation presets;
- movement/path presets.

This allows Lana, for example, to load her personal library on a device and use familiar patterns while creating a new choreography without requiring a LANA cloud account.

Exact library JSON schema will be defined during implementation.

## 9. BPM and rehearsal audio

BPM is core choreography timing data. Default may begin at 120 BPM and can be adjusted in Edit Mode with +/- and direct numeric entry.

LANA must provide **BPM-based rehearsal audio that works without YouTube/media playback**.

The exact rehearsal sound is deliberately not locked yet. Possible future/implementation choices include:

- accented first beat plus ordinary clicks;
- bell/accent on beat 1 with clicks on remaining beats;
- spoken 1–8 counts.

The beat clock must be separated from the sound treatment so the sound can change without changing choreography data.

Playback speed and choreography BPM are separate concepts.

## 10. External media / YouTube

LANA does not store WAV, MP3, MP4 or other song/video media in the choreography JSON or on a LANA media server.

A choreography JSON may store an external media reference, initially expected to support YouTube/video ID or URL. The external provider streams the media.

Media should be represented generically in the data model where practical (for example provider + media reference) so the choreography format is not unnecessarily locked to one provider.

Private/unreleased-song access and authenticated YouTube behaviour require implementation testing against current platform rules.

**YouTube/media functionality remains in V1 architecture, but it does not need permanent screen real estate.** The final media control may be a compact button/panel/popover. If media cannot be played, BPM/click rehearsal remains available.

## 11. Edit Mode toolbox

The first approved Edit Mode visual direction remains the V1 baseline, but controls should earn permanent screen space.

The right-side creation area is for editing functions such as:

- formations;
- movement/path presets;
- snapshot creation/editing;
- relevant project controls.

Dancer identity information may remain on the left. Media does not require a large permanent panel.

Exact toolbox layout can be refined during the real implementation without changing the V1 product model.

## 12. File workflow and JSON

The basic workflow is deliberately server-light:

1. Choreographer creates/edits a routine.
2. LANA exports a small choreography JSON file.
3. The file is distributed using the user's preferred method (for example messaging, email, AirDrop or drive storage).
4. A dancer opens the JSON in LANA View Mode.
5. LANA reconstructs the stage, dancers, snapshots, paths, timing and external-media reference.

The choreography JSON should contain enough information to reconstruct at minimum:

- project/song metadata;
- BPM and beat/timing data;
- optional external-media provider/reference;
- stage dimensions;
- dancer IDs, names and colours;
- snapshots and their beat positions;
- dancer coordinates and facing direction per snapshot;
- custom movement paths required for playback.

Reusable choreographer presets may live in a separate library JSON rather than being duplicated into every project except where the project needs embedded data for portable playback.

FILE operations should include opening/loading choreography JSON and saving/downloading choreography JSON in Edit Mode. PDF formation-sheet export remains desirable; exact PDF layout can be resolved later.

## 13. Language and localisation

Japanese is the primary production language. English is used for development/testing and is also a supported UI language.

The architecture must support Japanese from the beginning. Japanese labels should use terminology natural to choreographers rather than blind literal translation.

## 14. Explicit V1 boundary

V1 includes:

- formation editing;
- coloured dancer markers;
- facing direction;
- beat/BPM timing;
- visual snapshot filmstrip;
- FULL and ZOOM 32 views;
- straight and custom movement paths;
- reusable formation/path presets;
- portable choreography JSON;
- reusable library JSON;
- BPM/click rehearsal;
- optional external-media reference/playback;
- smartphone View Mode;
- tablet Edit Mode.

V1 explicitly does **not** model detailed arm, hand, leg or full-body dance animation.

More sophisticated dancer/avatar/body-movement visualisation is a possible future V2/V3 concept and must not expand V1 scope.

## 15. Implementation sequence

1. Freeze this V1 scope as the implementation baseline.
2. Build the shared responsive stage and dancer-marker system.
3. Build View Mode for landscape smartphone.
4. Build the visual snapshot filmstrip with FULL and ZOOM 32 behaviour.
5. Build beat/BPM timing and local click playback.
6. Build tablet Edit Mode and snapshot editing.
7. Add formation and movement/path preset libraries.
8. Define/finalise choreography JSON and reusable library JSON schemas alongside implementation.
9. Add JSON import/export.
10. Add optional external-media integration without making it a dependency for choreography playback.
11. Test on real phone/tablet sizes and refine UI.

The README remains the V1 source of truth and should be updated whenever a product decision is intentionally changed.