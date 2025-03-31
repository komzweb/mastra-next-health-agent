"use client";

import {
	getHealthPlan,
	getNutritionInfo,
	getQuickHealthTip,
} from "@/app/actions";
import { useState } from "react";
import { useFormStatus } from "react-dom";

// フォーム送信ボタンコンポーネント
function SubmitButton({
	label,
	loadingLabel,
	isLoading,
}: { label: string; loadingLabel: string; isLoading: boolean }) {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			disabled={pending || isLoading}
			className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 cursor-pointer"
		>
			{isLoading ? loadingLabel : label}
		</button>
	);
}

// 余計な文字を削除する関数
function cleanStreamText(text: string): string {
	// "0:"などの数字+コロンのパターンを削除
	let cleaned = text.replace(/\d+:/g, "");

	// 引用符の処理
	cleaned = cleaned.replace(/"{2,}/g, '"').replace(/^"|"$/g, "");

	// メッセージIDを含む部分を削除
	cleaned = cleaned.replace(/f:\{"messageId":"[^"]*"\}/g, "");

	// エスケープされた改行文字を実際の改行に変換
	cleaned = cleaned.replace(/\\n\\n/g, "\n\n").replace(/\\n/g, "\n");

	// 数字付きのリスト（例：1.**水分摂取**）を保持
	cleaned = cleaned.replace(/(\d+)\.\s*\*\*([^*]+)\*\*/g, "\n$1. **$2**");

	// JSONメタデータを削除
	cleaned = cleaned.replace(/! e:(.|\n)*$/, "");
	cleaned = cleaned.replace(/\{"finishReason":[^}]*\}/g, "");
	cleaned = cleaned.replace(/\{"usage":[^}]*\}/g, "");
	cleaned = cleaned.replace(/\{"promptTokens":[^}]*\}/g, "");
	cleaned = cleaned.replace(/e:,"isContinued":false\}d:\}/g, "");
	cleaned = cleaned.replace(/e:(.|\n)*isContinued(.|\n)*\}/g, "");
	cleaned = cleaned.replace(/d:\}/g, "");

	// 最後に残った余計なJSONを削除
	cleaned = cleaned.replace(/ ! e:.*$/, "");

	// 連続する空白を1つに（ただし改行は保持）
	const lines = cleaned.split("\n");
	cleaned = lines.map((line) => line.trim()).join("\n");

	return cleaned;
}

// クイック質問フォーム
function QuickForm({
	onResult,
}: { onResult: (result: string | ((prev: string) => string)) => void }) {
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);
		const formData = new FormData(event.currentTarget);
		const healthQuery = formData.get("healthQuery") as string;

		try {
			// 結果をクリア
			onResult("");

			// サーバーアクションを使用
			const result = await getQuickHealthTip(healthQuery);
			onResult(result);
		} catch (error) {
			console.error("エラーが発生しました:", error);
			onResult(
				"申し訳ありません、エラーが発生しました。もう一度お試しください。",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="mb-4">
				<label htmlFor="healthQuery" className="block mb-2 font-medium">
					健康に関する質問
				</label>
				<textarea
					id="healthQuery"
					name="healthQuery"
					rows={3}
					className="w-full p-2 border rounded"
					placeholder="例: 最近運動不足で、野菜をあまり食べていません。どうすればいいですか？"
					required
				/>
			</div>
			<SubmitButton
				label="アドバイスを取得"
				loadingLabel="処理中..."
				isLoading={isLoading}
			/>
		</form>
	);
}

// 詳細プラン作成フォーム
function DetailedForm({
	onResult,
}: { onResult: (result: string | ((prev: string) => string)) => void }) {
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);
		const formData = new FormData(event.currentTarget);
		const diet = formData.get("diet") as string;
		const exercise = formData.get("exercise") as string;
		const goal = formData.get("goal") as string;
		const generalInfo = formData.get("generalInfo") as string;

		try {
			// 結果をクリア
			onResult("");

			// サーバーアクションを使用
			const result = await getHealthPlan({
				diet,
				exercise,
				goal,
				generalInfo,
			});
			onResult(result);
		} catch (error) {
			console.error("エラーが発生しました:", error);
			onResult(
				"申し訳ありません、エラーが発生しました。もう一度お試しください。",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="space-y-4 mb-4">
				<div>
					<label htmlFor="diet" className="block mb-2 font-medium">
						現在の食事内容
					</label>
					<textarea
						id="diet"
						name="diet"
						rows={2}
						className="w-full p-2 border rounded"
						placeholder="例: 朝はパン、昼は弁当、夜は外食が多いです。野菜は1日1食程度しか摂れていません。"
					/>
				</div>
				<div>
					<label htmlFor="exercise" className="block mb-2 font-medium">
						運動習慣
					</label>
					<textarea
						id="exercise"
						name="exercise"
						rows={2}
						className="w-full p-2 border rounded"
						placeholder="例: 週に1回30分程度のウォーキングをしています。デスクワークが多く、運動不足です。"
					/>
				</div>
				<div>
					<label htmlFor="goal" className="block mb-2 font-medium">
						健康目標
					</label>
					<textarea
						id="goal"
						name="goal"
						rows={2}
						className="w-full p-2 border rounded"
						placeholder="例: 3ヶ月で3kg減量したいです。また、体力をつけて疲れにくい体になりたいです。"
					/>
				</div>
				<div>
					<label htmlFor="generalInfo" className="block mb-2 font-medium">
						その他の情報
					</label>
					<textarea
						id="generalInfo"
						name="generalInfo"
						rows={2}
						className="w-full p-2 border rounded"
						placeholder="例: 30代男性、身長175cm、体重80kg、高血圧気味です。忙しくて時間があまりとれません。"
					/>
				</div>
			</div>
			<SubmitButton
				label="健康プランを作成"
				loadingLabel="プラン作成中..."
				isLoading={isLoading}
			/>
		</form>
	);
}

export function Plan() {
	const [result, setResult] = useState<string>("");
	const [mode, setMode] = useState<"quick" | "detailed" | "nutrition">("quick");
	const [foodItem, setFoodItem] = useState<string>("");
	const [isSearching, setIsSearching] = useState<boolean>(false);

	// 栄養成分検索の処理
	const handleNutritionSearch = async (
		event: React.FormEvent<HTMLFormElement>,
	) => {
		event.preventDefault();
		setIsSearching(true);

		try {
			const formData = new FormData(event.currentTarget);
			const foodItemValue = formData.get("foodItem") as string;

			// サーバーアクションを使用して栄養成分情報を取得
			const result = await getNutritionInfo(foodItemValue);
			setResult(result);
		} catch (error) {
			console.error("エラーが発生しました:", error);
			setResult(
				"申し訳ありません、エラーが発生しました。もう一度お試しください。",
			);
		} finally {
			setIsSearching(false);
		}
	};

	// 結果表示エリアに適用するスタイル
	const resultStyle = {
		whiteSpace: "pre-wrap" as const,
		wordBreak: "break-word" as const,
	};

	return (
		<div className="max-w-2xl mx-auto p-4">
			<h1 className="text-2xl font-bold mb-6 text-center">
				健康管理アシスタント
			</h1>

			<div className="mb-6">
				<div className="flex justify-center space-x-4 mb-4">
					<button
						type="button"
						onClick={() => setMode("quick")}
						className={`px-4 py-2 rounded cursor-pointer transition-colors ${
							mode === "quick"
								? "bg-blue-500 text-white hover:bg-blue-600"
								: "bg-gray-200 text-gray-700 hover:bg-gray-300"
						}`}
					>
						クイック質問
					</button>
					<button
						type="button"
						onClick={() => setMode("detailed")}
						className={`px-4 py-2 rounded cursor-pointer transition-colors ${
							mode === "detailed"
								? "bg-purple-500 text-white hover:bg-purple-600"
								: "bg-gray-200 text-gray-700 hover:bg-gray-300"
						}`}
					>
						詳細プラン作成
					</button>
					<button
						type="button"
						onClick={() => setMode("nutrition")}
						className={`px-4 py-2 rounded cursor-pointer transition-colors ${
							mode === "nutrition"
								? "bg-green-500 text-white hover:bg-green-600"
								: "bg-gray-200 text-gray-700 hover:bg-gray-300"
						}`}
					>
						栄養成分検索
					</button>
				</div>

				{mode === "quick" ? (
					<QuickForm onResult={setResult} />
				) : mode === "detailed" ? (
					<DetailedForm onResult={setResult} />
				) : (
					<form onSubmit={handleNutritionSearch}>
						<div className="mb-4">
							<label htmlFor="foodItem" className="block mb-2 font-medium">
								食品名
							</label>
							<input
								id="foodItem"
								name="foodItem"
								type="text"
								className="w-full p-2 border rounded"
								placeholder="例: りんご、バナナ、鶏胸肉など"
								required
								value={foodItem}
								onChange={(e) => setFoodItem(e.target.value)}
							/>
						</div>
						<button
							type="submit"
							disabled={isSearching}
							className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 cursor-pointer"
						>
							{isSearching ? "検索中..." : "栄養成分を検索"}
						</button>
					</form>
				)}
			</div>

			{result && (
				<div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
					<h2 className="text-xl font-semibold mb-3 text-blue-800">
						{mode === "nutrition" ? "栄養成分情報" : "健康アドバイス"}
					</h2>
					<div className="whitespace-pre-wrap text-gray-800">{result}</div>
				</div>
			)}
		</div>
	);
}
