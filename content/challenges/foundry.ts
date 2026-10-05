import foundryArena from "../games/foundry-arena.ts";

export const foundryChallenges = foundryArena.rounds.map((round) => {
  if (round.interaction.type !== "foundry") {
    throw new Error(`Foundry round ${round.id} is not a foundry interaction`);
  }
  return {
    id: round.id,
    title: round.title,
    pathId: round.interaction.pathId,
    scenario: round.scenario,
    constraints: round.interaction.constraints,
    rubric: round.interaction.rubric,
  };
});
