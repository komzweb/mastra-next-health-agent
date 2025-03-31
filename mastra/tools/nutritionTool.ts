import { getMockNutritionInfo } from "@/lib/nutrition/edamam";

/**
 * 栄養成分検索ツール
 * 食品名を入力すると、その栄養成分情報を返します
 */
export const nutritionTool = {
	name: "nutrition_lookup",
	description:
		"食品の栄養成分情報を検索します。ユーザーが特定の食品について質問した場合に使用します。",
	parameters: {
		type: "object",
		properties: {
			foodItem: {
				type: "string",
				description:
					"栄養成分を検索したい食品名（例：りんご、バナナ、鶏胸肉など）",
			},
		},
		required: ["foodItem"],
	},
	execute: async ({ foodItem }: { foodItem: string }) => {
		try {
			// 本番環境では getNutritionInfo(foodItem) を使用
			// デモ用にモックデータを返す
			return getMockNutritionInfo(foodItem);
		} catch (error) {
			console.error("栄養成分検索中にエラーが発生しました:", error);
			return `「${foodItem}」の栄養成分情報の取得に失敗しました。別の食品名で試してみてください。`;
		}
	},
};
