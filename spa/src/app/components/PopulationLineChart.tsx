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
import { ReactNode } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export type YearlyPopulationData = {
  prefName: ReactNode;
  prefCode: string | undefined;
  year: number;
  value: number;
};

type PrefPopulationData = {
  prefCode: string;
  prefName: string;
  data: YearlyPopulationData[];
};

export const PopulationLineChart = ({
  data = [],
}: {
  data: PrefPopulationData[];
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
    labels: data.length > 0 ? data[0].data.map((item) => item.year) : [],
    datasets: data.map((prefData) => ({
      label: prefData.prefName,
      data: prefData.data.map((item) => item.value),
      borderColor: "rgb(75, 192, 192)",
      backgroundColor: "rgba(75, 192, 192, 0.5)",
    })),
  };

  return <Line options={options} data={chartData} />;
};
