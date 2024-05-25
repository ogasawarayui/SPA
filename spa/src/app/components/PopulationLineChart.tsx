"use client";
import { Line } from "react-chartjs-2";
import {Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend,ChartOptions,} from "chart.js";
import { PrefPopulationData } from "../../types";

ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend);

type PopulationLineChartProps = {
  data: PrefPopulationData[];
};

export const PopulationLineChart = ({ data }: PopulationLineChartProps) => {
  console.log("data",data);
  const chartData = {
    labels: data[0]?.data.map((item) => item.year) || [],
    datasets: data.map((prefData) => ({
      label: prefData.prefName, // 凡例に表示するラベルとしてprefNameを設定
      data: prefData.data.map((item) => item.value),
      borderColor: getRandomColor(),
      fill: false,
    })),
  };

  return <Line data={chartData} />;
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};