// Edamam API クライアント
// 実際の使用時には、環境変数からAPIキーを取得するように設定してください
// 例: const APP_ID = process.env.EDAMAM_APP_ID;
// 例: const APP_KEY = process.env.EDAMAM_APP_KEY;

// 注意: 以下はデモ用のダミーキーです。実際の使用時には有効なAPIキーに置き換えてください。
const APP_ID = "YOUR_EDAMAM_APP_ID";
const APP_KEY = "YOUR_EDAMAM_APP_KEY";

export interface NutritionInfo {
	foodId: string;
	label: string;
	nutrients: {
		ENERC_KCAL: number; // カロリー (kcal)
		PROCNT: number; // タンパク質 (g)
		FAT: number; // 脂質 (g)
		CHOCDF: number; // 炭水化物 (g)
		FIBTG?: number; // 食物繊維 (g)
	};
	category: string;
	categoryLabel: string;
	image?: string;
}

export interface NutritionResponse {
	text: string;
	parsed: Array<{
		food: NutritionInfo;
	}>;
	hints: Array<{
		food: NutritionInfo;
	}>;
}

/**
 * 食品名から栄養成分情報を取得する
 * @param foodItem 食品名（日本語または英語）
 * @returns 栄養成分情報
 */
export async function getNutritionInfo(
	foodItem: string,
): Promise<NutritionResponse> {
	try {
		// 日本語の場合は英語に翻訳するロジックを追加することも検討
		const response = await fetch(
			`https://api.edamam.com/api/food-database/v2/parser?app_id=${APP_ID}&app_key=${APP_KEY}&ingr=${encodeURIComponent(foodItem)}`,
		);

		if (!response.ok) {
			throw new Error(`API request failed with status ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error("栄養成分情報の取得に失敗しました:", error);
		throw error;
	}
}

/**
 * 栄養成分情報を日本語で整形して返す
 * @param nutritionData 栄養成分データ
 * @returns 整形された栄養成分情報（日本語）
 */
export function formatNutritionInfo(nutritionData: NutritionResponse): string {
	if (!nutritionData.parsed.length && !nutritionData.hints.length) {
		return `「${nutritionData.text}」の栄養成分情報は見つかりませんでした。`;
	}

	// 最も関連性の高い食品情報を取得
	const foodInfo =
		nutritionData.parsed.length > 0
			? nutritionData.parsed[0].food
			: nutritionData.hints[0].food;

	return `
【${foodInfo.label}】の栄養成分情報:
・カロリー: ${foodInfo.nutrients.ENERC_KCAL.toFixed(1)} kcal
・タンパク質: ${foodInfo.nutrients.PROCNT.toFixed(1)} g
・脂質: ${foodInfo.nutrients.FAT.toFixed(1)} g
・炭水化物: ${foodInfo.nutrients.CHOCDF.toFixed(1)} g
${foodInfo.nutrients.FIBTG ? `・食物繊維: ${foodInfo.nutrients.FIBTG.toFixed(1)} g` : ""}
・カテゴリ: ${foodInfo.categoryLabel || foodInfo.category}
`;
}

/**
 * モックデータを返す関数（APIキーがない場合のデモ用）
 * @param foodItem 食品名
 * @returns モックの栄養成分情報
 */
export function getMockNutritionInfo(foodItem: string): string {
	const mockData: Record<
		string,
		{
			label: string;
			nutrients: {
				ENERC_KCAL: number;
				PROCNT: number;
				FAT: number;
				CHOCDF: number;
				FIBTG?: number;
			};
			categoryLabel: string;
		}
	> = {
		りんご: {
			label: "りんご",
			nutrients: {
				ENERC_KCAL: 52.0,
				PROCNT: 0.3,
				FAT: 0.2,
				CHOCDF: 14.0,
				FIBTG: 2.4,
			},
			categoryLabel: "果物",
		},
		バナナ: {
			label: "バナナ",
			nutrients: {
				ENERC_KCAL: 89.0,
				PROCNT: 1.1,
				FAT: 0.3,
				CHOCDF: 22.8,
				FIBTG: 2.6,
			},
			categoryLabel: "果物",
		},
		鶏胸肉: {
			label: "鶏胸肉",
			nutrients: {
				ENERC_KCAL: 165.0,
				PROCNT: 31.0,
				FAT: 3.6,
				CHOCDF: 0.0,
			},
			categoryLabel: "肉類",
		},
		玄米: {
			label: "玄米",
			nutrients: {
				ENERC_KCAL: 362.0,
				PROCNT: 7.5,
				FAT: 2.7,
				CHOCDF: 76.2,
				FIBTG: 3.5,
			},
			categoryLabel: "穀物",
		},
		ブロッコリー: {
			label: "ブロッコリー",
			nutrients: {
				ENERC_KCAL: 34.0,
				PROCNT: 2.8,
				FAT: 0.4,
				CHOCDF: 6.6,
				FIBTG: 2.6,
			},
			categoryLabel: "野菜",
		},
	};

	// 入力された食品名に最も近いものを探す
	const foodNames = Object.keys(mockData);
	const matchedFood =
		foodNames.find(
			(name) => foodItem.includes(name) || name.includes(foodItem),
		) || foodNames[0]; // デフォルトはりんご

	const foodInfo = mockData[matchedFood];

	return `
【${foodInfo.label}】の栄養成分情報:
・カロリー: ${foodInfo.nutrients.ENERC_KCAL.toFixed(1)} kcal
・タンパク質: ${foodInfo.nutrients.PROCNT.toFixed(1)} g
・脂質: ${foodInfo.nutrients.FAT.toFixed(1)} g
・炭水化物: ${foodInfo.nutrients.CHOCDF.toFixed(1)} g
${foodInfo.nutrients.FIBTG ? `・食物繊維: ${foodInfo.nutrients.FIBTG.toFixed(1)} g` : ""}
・カテゴリ: ${foodInfo.categoryLabel}

※注意: これはデモ用のモックデータです。実際の値とは異なる場合があります。
`;
}
