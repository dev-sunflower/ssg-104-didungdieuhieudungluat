# Traffic Light Animation Game — Design Spec

**Date:** 2026-04-20  
**Route:** `/road-signs` (replaces current placeholder)  
**Status:** Approved

---

## Overview

A mini-game where a car animation plays through traffic light phases. The animation pauses at a red light to ask the player a driving knowledge question. Correct answers advance the animation; wrong answers cost hearts. Scores and names are saved to a leaderboard (no auth required).

---

## Game Flow

```
[enter-name] → [playing] → [game-over | game-complete]
```

### Screens

1. **NameEntryScreen** — Text input for player display name + Start button.
2. **GameScreen** — Full animation + HUD (hearts, score) + QuestionModal overlay.
3. **ResultScreen** — Final score, outcome, leaderboard.

---

## Animation State Machine

Animation sets (all PNG frames in `/public/3dassets/animations/`):
- `red_light/drive_red0001–0008`
- `green_light/drive_green0001–0008`
- `normally_drive/normally_drive0001–0008`

### States

| State | Description |
|---|---|
| `animating-red` | Plays drive_red0001→0008 at ~12fps |
| `question-open` | Frozen on drive_red0008, QuestionModal visible |
| `animating-green` | Plays drive_green0001→0008 |
| `animating-drive` | Plays normally_drive0001→0008 |

### Transitions

```
animating-red → (frame 8 reached) → question-open
question-open → (correct answer)  → animating-green
question-open → (wrong answer)    → check hearts → game-over OR animating-red (new question)
animating-green → (complete)      → animating-drive
animating-drive → (complete)      → animating-red (new question)
```

---

## Scoring Rules

| Event | Points |
|---|---|
| Correct normal question | +5 |
| Correct `is_critical` question | +20 |
| Wrong answer | +0 |

---

## Heart / Life System

- Player starts with **5 hearts**.
- **Wrong normal question:** increment `wrongNormalCount`. Every 5th wrong answer (`wrongNormalCount % 5 === 0`) deducts 1 heart.
- **Wrong `is_critical` question:** deducts 1 heart immediately.
- `hearts === 0` → game over.

---

## Questions

- Fetched from existing `public.questions` Supabase table.
- No license type filter — all questions pooled.
- Shuffled randomly at game start, cycle through until hearts run out.
- Each question has: `content`, `options` (JSONB A/B/C/D), `correct_answer`, `is_critical`, `explanation`.

---

## Database

### New table: `game_sessions`

```sql
CREATE TABLE public.game_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  questions_answered integer NOT NULL DEFAULT 0,
  hearts_remaining integer NOT NULL DEFAULT 5,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT game_sessions_pkey PRIMARY KEY (id)
);
```

- No foreign key to `auth.users` — guest play.
- Saved on game-over or game-complete.
- Feeds the leaderboard (sorted by `score DESC`, top 10).

---

## Components

```
src/app/(mini-games)/road-signs/
  page.tsx                     # Orchestrator: game state, Supabase calls
  _components/
    NameEntryScreen.tsx        # Name input + start
    GameScreen.tsx             # Animation display + HUD
    QuestionModal.tsx          # Question popup + answer options
    ResultScreen.tsx           # Score summary + leaderboard
    Leaderboard.tsx            # Top-10 ranked table (reusable)
  _hooks/
    useFrameAnimation.ts       # Interval frame player
  _lib/
    gameTypes.ts               # TypeScript types for game state
```

### `useFrameAnimation` hook

```ts
function useFrameAnimation(
  frameCount: number,
  fps: number,
  onComplete: () => void
): { frame: number; play: () => void; pause: () => void; reset: () => void }
```

- Uses `setInterval` internally.
- `onComplete` fires after the last frame.
- Caller controls play/pause/reset based on game state.

---

## UI / UX Notes

- Animation displayed as a centered `<img>` (~360px tall, full-width container).
- HUD fixed at top: `♥♥♥♥♥` hearts (filled = active, empty = lost) + score counter.
- QuestionModal is a centered overlay card (same style as existing exam UI — white card, `#F4A616` accents).
- After answering, show brief feedback (green = correct, red = wrong) with explanation before advancing.
- Leaderboard shown on ResultScreen, top 10 by score.
- Design language matches existing site: `#FFF4D6` backgrounds, `#F4A616` accents, rounded-3xl cards.
