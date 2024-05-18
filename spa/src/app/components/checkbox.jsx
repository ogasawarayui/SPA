checkbox


import { useCallback, useEffect, useState } from "react";
import PopulationLineChart from "./components/PopulationLineChart";
import PrefectureCheckbox from "./components/PrefectureCheckbox";

const PrefectureCheckbox = ({ prefectures, onCheckboxChange }) => {
  return (
    <div>
      {prefectures.map((prefecture) => (
        <label key={prefecture.prefCode}>
          <input
            type="checkbox"
            value={prefecture.prefCode}
            onChange={onCheckboxChange}
          />
          {prefecture.prefName}
        </label>
      ))}
    </div>
  );
};

export default function BOX() {
  const [populationData, setPopulationData] = useState([]);
  const [checkedPrefectures, setCheckedPrefectures] = useState([]);
  const [prefectures, setPrefectures] = useState([]);
  const [loading, setLoading] = useState(true);

  // 都道府県リストを取得する関数
  const fetchPrefectures = useCallback(async () => {
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
      setPrefectures(data.result || []);
    } catch (error) {
      console.error("Error fetching prefectures:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 都道府県の人口データを取得する関数
  const fetchPopulationData = useCallback(async (prefCode) => {
    try {
      const response = await fetch(
        `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${prefCode}`,
        {
          headers: {
            "X-API-KEY": "DgHX6Bc4TbS3wEEhfg6MIYZKXlgR5woG568BSG31",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch population data");
      }
      const data = await response.json();
      return data.result.data[0]?.data || [];
    } catch (error) {
      console.error("Error fetching population data:", error);
      return [];
    }
  }, []);

  const handleCheckboxChange = (e) => {
    const selectedPrefectureCode = e.target.value;
    if (e.target.checked) {
      setCheckedPrefectures((prevCheckedPrefectures) => [
        ...prevCheckedPrefectures,
        selectedPrefectureCode,
      ]);
    } else {
      setCheckedPrefectures((prevCheckedPrefectures) =>
        prevCheckedPrefectures.filter(
          (code) => code !== selectedPrefectureCode
        )
      );
    }
  };

  useEffect(() => {
    fetchPrefectures();
  }, [fetchPrefectures]);

  useEffect(() => {
    const fetchDataForSelectedPrefectures = async () => {
      const populationDataPromises = checkedPrefectures.map((prefCode) =>
        fetchPopulationData(prefCode)
      );
      const populationDataArrays = await Promise.all(populationDataPromises);
      const mergedPopulationData = populationDataArrays.flat();
      setPopulationData(mergedPopulationData);
    };

    fetchDataForSelectedPrefectures();
  }, [checkedPrefectures, fetchPopulationData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex flex-col items-center justify-center">
      <h1>RESAS</h1>
      <div>
        <PrefectureCheckbox
          prefectures={prefectures}
          onCheckboxChange={handleCheckboxChange}
        />
        {populationData.length > 0 && (
          <PopulationLineChart data={populationData} />
        )}
      </div>
    </main>
  );
}
