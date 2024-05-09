"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState, useCallback } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type YearlyPopulationData = {
  year: number;
  value: number;
};

const PopulationLineChart = ({
  data = [],
}: {
  data: YearlyPopulationData[];
}) => {
  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "総人口の推移",
      },
    },
  };

  const chartData = {
    labels: data.map((item) => item.year),
    datasets: [
      {
        label: "総人口",
        data: data.map((item) => item.value),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  return <Line options={options} data={chartData} />;
};

const DataFetcher = () => {
  const [data, setData] = useState<YearlyPopulationData[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(
        "https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=11362&prefCode=11",
        {
          headers: {
            "X-API-KEY": "DgHX6Bc4TbS3wEEhfg6MIYZKXlgR5woG568BSG31",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const newData = await response.json();
      setData((prevData) => [...prevData, ...newData.result.data[0].data]); // 既存のデータに追加
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData(); // 初回フェッチ
  }, [fetchData]);

  return (
    <div>
      <h2>データ一覧</h2>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li>
        ))}
      </ul>
      <PopulationLineChart data={data} /> {/* 折れ線グラフを表示 */}
    </div>
  );
};

export default DataFetcher;