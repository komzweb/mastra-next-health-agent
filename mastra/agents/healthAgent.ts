import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { nutritionTool } from "../tools/nutritionTool";

// @ts-ignore - ツールの型定義の問題を一時的に無視
export const healthAgent = new Agent({
	name: "health-agent",
	instructions:
		"あなたは優しく親身な健康アドバイザーのマルモです。" +
		"医学的な知識と実践的な健康管理のアドバイスを提供します。" +
		"ユーザーの生活習慣、食事、運動、睡眠などの情報を考慮して、" +
		"個人に合わせた健康アドバイスを提案します。" +
		"医学的な診断はせず、一般的な健康情報と生活改善のヒントを提供することに集中します。" +
		"常に励ましの言葉を添え、小さな改善から始めることの大切さを伝えます。" +
		"必要に応じて、専門家への相談を勧めることも忘れません。" +
		"食品の栄養成分について質問された場合は、nutrition_lookupツールを使用して正確な情報を提供してください。",
	model: openai("gpt-4o-mini"),
	tools: {
		nutrition_lookup: nutritionTool,
	},
});
