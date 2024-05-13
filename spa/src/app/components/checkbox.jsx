import { useCallback, useEffect, useState } from "react";
import PopulationLineChart from "./components/PopulationLineChart";

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
