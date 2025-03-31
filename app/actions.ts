"use server";

import { getMockNutritionInfo } from "@/lib/nutrition/edamam";
import { mastra } from "@/mastra";

// 健康アドバイスを取得するサーバーアクション（クイック質問用）
export async function getQuickHealthTip(healthQuery: string) {
	try {
		const agent = mastra.getAgent("healthAgent");
		const prompt = `以下の質問に対して、簡潔で実用的な健康アドバイスを提供してください：\n${healthQuery}`;
		const result = await agent.generate(prompt);

		// Mastraエージェントの結果からテキストを抽出
		// GenerateTextResultオブジェクトの構造に基づいて適切にアクセス
		if (result && typeof result === "object") {
			// resultの中身を確認してログ出力
			console.log("健康アドバイス生成結果:", JSON.stringify(result, null, 2));

			// 様々なプロパティを試す
			if ("text" in result && typeof result.text === "string") {
				return result.text;
			}

			if ("value" in result && typeof result.value === "string") {
				return result.value;
			}

			if ("message" in result && typeof result.message === "string") {
				return result.message;
			}

			if ("output" in result && typeof result.output === "string") {
				return result.output;
			}

			// 最終手段としてJSONに変換
			const jsonString = JSON.stringify(result);
			if (jsonString !== "{}" && jsonString !== "[object Object]") {
				return jsonString;
			}
		}

		return "回答を生成できませんでした。";
	} catch (error) {
		console.error("健康アドバイス生成中にエラーが発生しました:", error);
		return "申し訳ありません、エラーが発生しました。もう一度お試しください。";
	}
}

// 健康プランを取得するサーバーアクション（詳細プラン用）
export async function getHealthPlan(input: {
	diet?: string;
	exercise?: string;
	goal?: string;
	generalInfo?: string;
}) {
	const { diet, exercise, goal, generalInfo } = input;

	let prompt = "健康状態の分析と改善プランを作成してください。\n";

	if (diet) {
		prompt += `【食事内容】: ${diet}\n`;
	}

	if (exercise) {
		prompt += `【運動習慣】: ${exercise}\n`;
	}

	if (goal) {
		prompt += `【目標】: ${goal}\n`;
	}

	if (generalInfo) {
		prompt += `【その他情報】: ${generalInfo}\n`;
	}

	prompt += "\n具体的なアドバイスと、実行可能な改善プランを提案してください。";

	try {
		const agent = mastra.getAgent("healthAgent");
		const result = await agent.generate(prompt);

		// Mastraエージェントの結果からテキストを抽出
		// GenerateTextResultオブジェクトの構造に基づいて適切にアクセス
		if (result && typeof result === "object") {
			// resultの中身を確認してログ出力
			console.log("健康プラン生成結果:", JSON.stringify(result, null, 2));

			// 様々なプロパティを試す
			if ("text" in result && typeof result.text === "string") {
				return result.text;
			}

			if ("value" in result && typeof result.value === "string") {
				return result.value;
			}

			if ("message" in result && typeof result.message === "string") {
				return result.message;
			}

			if ("output" in result && typeof result.output === "string") {
				return result.output;
			}

			// 最終手段としてJSONに変換
			const jsonString = JSON.stringify(result);
			if (jsonString !== "{}" && jsonString !== "[object Object]") {
				return jsonString;
			}
		}

		return "回答を生成できませんでした。";
	} catch (error) {
		console.error("健康プラン生成中にエラーが発生しました:", error);
		return "申し訳ありません、エラーが発生しました。もう一度お試しください。";
	}
}

// 栄養成分情報を取得するサーバーアクション
export async function getNutritionInfo(foodItem: string) {
	if (!foodItem) {
		throw new Error("食品名が指定されていません");
	}

	try {
		const agent = mastra.getAgent("healthAgent");
		const prompt = `「${foodItem}」の栄養成分情報を教えてください。nutrition_lookupツールを使用してください。`;

		const result = await agent.generate(prompt);

		// エージェントからの応答を処理
		if (result && typeof result === "object") {
			// コンソールにログ出力（デバッグ用）
			console.log("栄養成分検索結果:", JSON.stringify(result, null, 2));

			if ("text" in result && typeof result.text === "string") {
				return result.text;
			}

			// 他のプロパティを試す
			if ("value" in result && typeof result.value === "string") {
				return result.value;
			}

			if ("message" in result && typeof result.message === "string") {
				return result.message;
			}

			if ("output" in result && typeof result.output === "string") {
				return result.output;
			}

			// 最終手段としてJSONに変換
			const jsonString = JSON.stringify(result);
			if (jsonString !== "{}" && jsonString !== "[object Object]") {
				return jsonString;
			}
		}

		// APIキーがない場合やエージェントが正しく動作しない場合はモックデータを使用
		return getMockNutritionInfo(foodItem);
	} catch (error) {
		console.error("栄養成分情報の取得中にエラーが発生しました:", error);
		// エラーが発生した場合はモックデータを使用
		return getMockNutritionInfo(foodItem);
	}
}
