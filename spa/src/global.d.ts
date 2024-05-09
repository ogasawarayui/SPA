interface PopulationData {
  message: null | string;
  result: {
    boundaryYear: number;
    data: PopulationCategory[];
  };
}

interface PopulationCategory {
  label: string;
  data: YearlyPopulationData[];
}

interface YearlyPopulationData {
  year: number;
  value: number;
  rate?: number;
}