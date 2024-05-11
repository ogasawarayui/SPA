"use client";

import { useCallback, useEffect, useState } from "react";
import PopulationLineChart from "./components/PopulationLineChart";

// PrefectureCheckbox コンポーネントは、チェックボックスを生成し、選択時にコールバックを呼び出します
const PrefectureCheckbox = ({ onPrefectureChange }) => {
  const [prefectures, setPrefectures] = useState([]);
  const [loading, setLoading] = useState(true);

  // 都道府県一覧を取得して、チェックボックスとして生成
  const fetchPrefectures = async () => {
    try {
      const response = await fetch(
        "https://opendata.resas-portal.go.jp/api/v1/prefectures",
        {
          headers: {
            "X-API-KEY": "DgHX6Bc4TbS3wEEhfg6MIYZKXlgR5woG568BSG31",
          },
        }
      );
      const data = await response.json();
      setPrefectures(data.result || []); // データがなければ空のリスト
    } catch (error) {
      console.error("Error fetching prefectures:", error);
      setPrefectures([]); // エラー時に空のリスト
    } finally {
      setLoading(false); // ロード完了
    }
  };

  useEffect(() => {
    fetchPrefectures(); // 初回ロード時に都道府県一覧を取得
  }, []);

  if (loading) {
    return <div>Loading...</div>; // ローディング中のメッセージ
  }

  return (
    <div>
      {prefectures.map((prefecture) => (
        <label key={prefecture.prefCode}>
          <input
            type="checkbox"
            value={prefecture.prefCode}
            onChange={onPrefectureChange} // 選択時のハンドラ
          />
          {prefecture.prefName}
        </label>
      ))}
    </div>
  );
};

export default function BOX() {
  const [populationData, setPopulationData] = useState([]);
  const [prefCode, setPrefCode] = useState(""); // 初期状態で `prefCode` は空の文字列

  const fetchPopulationData = useCallback(
    async (prefCode) => {
      if (!prefCode) return; // `prefCode` が空の文字列の場合は実行しない
      try {
        const response = await fetch(
          `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${prefCode}`,
          {
            headers: {
              "X-API-KEY": "DgHX6Bc4TbS3wEEhfg6MIYZKXlgR5woG568BSG31", // API キーを追加
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const populationComposition = data.result.data[0]?.data || []; // データがあるか確認してから配列を取得
          setPopulationData(populationComposition); // データをセット
        } else {
          console.error("Failed to fetch population data");
        }
      } catch (error) {
        console.error("Error fetching population data:", error);
      }
    },
    []
  );

  useEffect(() => {
    fetchPopulationData(prefCode); // `prefCode` が変更されるたびにデータを取得
  }, [prefCode, fetchPopulationData]);

  const handlePrefectureChange = (e) => {
    const newPrefCode = parseInt(e.target.value); // チェックボックスから `prefCode` を取得
    setPrefCode(newPrefCode.toString()); // `prefCode` を更新
  };

  return (
    <main className="flex flex-col items-center justify-center">
      <h1>RESAS</h1>
      <div>
        <PrefectureCheckbox onPrefectureChange={handlePrefectureChange} />
        {populationData.length > 0 && (
          <PopulationLineChart data={populationData} />
        )}
      </div>
    </main>
  );
}
