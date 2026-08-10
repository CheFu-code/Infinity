import { Achievement } from "./types";

export function getAchievements(
    gameScore: number,
    won: boolean,
    over: boolean,
): Achievement[] {
    const achievements: Achievement[] = [
        {
            id: "first-merge",
            title: "First Merge",
            description: "Merge two tiles for the first time.",
            unlocked: gameScore >= 4,
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
            id: "score-2048",
            title: "2048 Master",
            description: "Reach the 2048 tile.",
            unlocked: won,
        },
        {
            id: "survivor",
            title: "Survivor",
            description: "End a game without losing.",
            unlocked: won,
        },
    ];

    return achievements;
}
