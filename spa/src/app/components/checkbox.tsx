"use client";

import { useCallback, useEffect, useState } from "react";
import { YearlyPopulationData } from "./PopulationLineChart";

type DataFetcherProps = {
  handleCheckboxChange: (prefCode: string) => void;
};

export const DataFetcher = ({ handleCheckboxChange }: DataFetcherProps) => {
  const [data, setData] = useState<{ prefCode: string; prefName: string }[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(
        "https://opendata.resas-portal.go.jp/api/v1/prefectures",
        {
          headers: {
            "X-API-KEY": "DgHX6Bc4TbS3wEEhfg6MIYZKXlgR5woG568BSG31",
          },
        }
      );
      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const newData = await response.json();
      console.log(newData);
      setData(newData.result);// 既存のデータに追加
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData(); // 初回フェッチ
  }, [fetchData]);

  return (
    <div className="w-[600px]">
      <h2>都道府県</h2>
      <ul className="flex flex-wrap justify-center">
        {data.map((item, index) => (
          <li className="flex" key={item.prefCode}>
            <input type="checkbox"
              name={item.prefCode}
              id={`populationCheckbox${index}`}
              onChange={() => handleCheckboxChange(item.prefCode ?? "")} />
            <label className="w-28" htmlFor={`populationCheckbox${index}`}>{item.prefName}</label>
          </li>))}
      </ul>
    </div>
  );
};