import { Achievement } from "./types";

export function getAchievements(
    gameScore: number,
    won: boolean,
    over: boolean,
    moveCount: number,
    maxTile: number,
    keepPlaying: boolean,
): Achievement[] {
    const achievements: Achievement[] = [
        {
            id: "first-merge",
            title: "First Merge",
            description: "Merge two tiles for the first time.",
            unlocked: maxTile >= 4,
        },
        {
            id: "score-100",
            title: "Century",
            description: "Reach 100 points.",
            unlocked: gameScore >= 100,
        },
        {
            id: "score-500",
            title: "Momentum",
            description: "Reach 500 points.",
            unlocked: gameScore >= 500,
        },
        {
            id: "score-1000",
            title: "Thousand Club",
            description: "Reach 1,000 points.",
            unlocked: gameScore >= 1000,
        },
        {
            id: "tile-2048",
            title: "2048 Master",
            description: "Create the 2048 tile.",
            unlocked: maxTile >= 2048,
        },
        {
            id: "tile-4096",
            title: "Beyond 2048",
            description: "Create the 4096 tile.",
            unlocked: maxTile >= 4096,
        },
        {
            id: "tile-8192",
            title: "Infinity Seeker",
            description: "Create the 8192 tile.",
            unlocked: maxTile >= 8192,
        },
        {
            id: "quick-2048",
            title: "Quick Thinker",
            description: "Reach 2048 in 100 moves or fewer.",
            unlocked: maxTile >= 2048 && moveCount > 0 && moveCount <= 100,
        },
        {
            id: "survivor",
            title: "Survivor",
            description: "Win the game and keep going.",
            unlocked: won && keepPlaying,
        },
    ];

    return achievements;
}
