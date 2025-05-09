export interface WeatherData {
    temperature: number;
    windSpeed: number;
    uvIndex: number;
    visibility: number;
    precipitationProbability: number;
    time: string;
  }
  
  export interface HistoricalData {
    date: string;
    tempMax: number;
    tempMin: number;
  }