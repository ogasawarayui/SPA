export type YearlyPopulationData = {
  prefName: string;
  prefCode: string;
  year: number;
  value: number;
};

export type PrefPopulationData = {
  prefCode: string;
  prefName: string;
  data: YearlyPopulationData[];
};
