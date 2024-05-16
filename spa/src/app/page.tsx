"use client";

import PopulationLineChart from "./components/PopulationLineChart";
import { useCallback, useEffect, useState } from "react";

type YearlyPopulationData = {
  year: number;
  value: number;
};


export default function Home() {
  const [populationData, setPopulationData] = useState<YearlyPopulationData[]>([]);
  const [prefCode, setPrefCode] = useState("20")

  const fetchPopulationData = useCallback(async () => {
    const response = await fetch(
      // クエリパラメーターで東京のデータを取得しているので、ここを変更すればその都度データを取得できます(クエリパラメーターっていうのは、URLの末尾についている?からのパラメーター。?の後に〇〇=〇〇という感じで書くとURL経由でデータを渡せる)
      // ここではcityCode=11362&prefCode=11というのがクエリパラメーターで、11362は東京の市区町村コード、11は東京の都道府県コードです。
      // 今回の課題では、都道府県をクリックするとその県に合わせてデータを取得したいので、cityCodeとprefCodeを変更してデータを取得します。useStateを使用してクリックされたものの情報をstateにセットすると、取得するデータも変えることができます。
      `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${prefCode}`,
      {
        headers: {
          "X-API-KEY": "DgHX6Bc4TbS3wEEhfg6MIYZKXlgR5woG568BSG31",// ご自身のAPIキーを入力しよう（ここでは.envファイル（環境変数を定義するもの）からAPIキーを取得しています）
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json(); // 取得したデータをJSON形式に変換
    setPopulationData(data.result.data[0].data); // 取得したデータをstateにセットしています(data.result.data[0].dataには年ごとのデータが入っています)
  }, [prefCode]);

  // useEffectはページがロードされた時に一度だけ実行されます
  useEffect(() => {
    fetchPopulationData(); // 関数の実行
  }, [fetchPopulationData]);
}
return (
  <main className="flex flex-col items-center justify-center">
    <h1>RESAS</h1>
    <div>
      {/* コンポーネントにデータ(取得したグラフのデータ)を渡す */}
      <PopulationLineChart
        data={populationData}
        prefCode={prefCode}
        setPrefCode={setPrefCode} />
    </div>
  </main>
);
}


/*
この内容では、グラフのデータを取得してPopulationLineChartコンポーネントで描画しているだけですが、
都道府県のチェックボックスを表示する＋チェックされた都道府県の総人口のデートをグラフに表示する動作が必要なので
難しいところも多いかもしれませんが、頑張って下さいね！
 */