# Customization

Educational text lives in `content/`. Course switches live in `config/odyssey.config.ts`. Both are TypeScript so a typo fails `npm run typecheck` or, for game shape, the Zod parse at startup.

## Change a challenge

Edit the round in `content/games/<id>.ts`. Fields you can change without touching React: `scenario`, `learnerTask`, `hints`, `scoringRule`, `explanation`, `feedbackCorrect`, `feedbackIncorrect`, option labels, and which option has `quality: "best"`.

## Add a round

Append an object to the `rounds` array. Give it a new `id`. Three hint strings are required.

## Mastery threshold

`masteryThreshold` in `config/odyssey.config.ts` is used for every game while `overrideGameThresholds` is true. Set that flag to false to honor each game's own number.

## Disable or reorder

Remove an id from `enabledGames` to hide a game. Reorder `gameOrder` to change the course sequence and the recommendation order. Set `showFoundry` to false to hide Foundry Arena. Set `tier2UnlockMastered` or `tier3UnlockMastered` to 0 to open later tiers immediately.

## Branding

Set `title`, `institution`, and `logoSrc`. `logoSrc` is a public path such as `/institution.svg`. Put the file in `public/`.

## References

Add an entry to `content/references.ts` and put its `id` in the game's `furtherReadingIds`.

## Research mode

Prefer the environment variable `VITE_RESEARCH_MODE`. The config flag is used only when that variable is unset. See `docs/research-mode.md`.

Rebuild after any of these edits. The running dev server picks up file saves; a static host needs a new `npm run build`.
