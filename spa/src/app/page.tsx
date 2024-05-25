"use client";

import { useCallback, useEffect, useState } from "react";
import { PopulationLineChart } from "./components/PopulationLineChart";
import { DataFetcher } from "./components/checkbox";
import { PrefPopulationData } from "../types";

type SelectedPref = {
  prefCode: string;
  prefName: string;
};

export default function Home() {
  const [populationData, setPopulationData] = useState<PrefPopulationData[]>([]);
  const [selectedPrefCodes, setSelectedPrefCodes] = useState<SelectedPref[]>([]);

  const fetchPopulationData = useCallback(async ({ prefCode, prefName }: SelectedPref) => {
    const response = await fetch(
      `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${prefCode}`,
      {
        headers: {
          "X-API-KEY": "DgHX6Bc4TbS3wEEhfg6MIYZKXlgR5woG568BSG31", // ご自身のAPIキーを入力しよう
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json(); // 取得したデータをJSON形式に変換

    const newPrefData = {
      prefCode,
      prefName,
      data: data.result.data[0].data,
    };

    setPopulationData((prevData) => [...prevData, newPrefData]);
  }, []);

  useEffect(() => {
    selectedPrefCodes.forEach(({ prefCode, prefName }) => {
      if (!populationData.some((data) => data.prefCode === prefCode)) {
        console.log("fetchPopulationData", prefCode);
        fetchPopulationData({ prefCode, prefName });
      }
    });
  }, [selectedPrefCodes, fetchPopulationData, populationData]);

  const handleCheckboxChange = (prefCode: string, prefName: string) => {
    setSelectedPrefCodes((prevCodes) => {
      if (prevCodes.some((code) => code.prefCode === prefCode)) {
        setPopulationData((prevData) =>
          prevData.filter((data) => data.prefCode !== prefCode)
        );
        return prevCodes.filter((code) => code.prefCode !== prefCode);
      } else {
        return [...prevCodes, { prefCode, prefName }];
      }
    });
  };

  return (
    <main className="flex flex-col items-center justify-center">
      <h1>RESAS</h1>
      <div>
        {/* コンポーネントにデータ(取得したグラフのデータ)を渡す */}
        <DataFetcher handleCheckboxChange={handleCheckboxChange} />
        <PopulationLineChart data={populationData} />
      </div>
    </main>
  );
}
