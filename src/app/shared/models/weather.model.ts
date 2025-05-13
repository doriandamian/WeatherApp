export interface WeatherData {
    temperature: number;
    uvIndex: string;
    visibility: string;
    precipitationProbability: string;
    precipitation: string;
    apparentTemperature: string;
  }
  
  export interface HistoricalData {
    date: string;
    tempMax: number;
    tempMin: number;
  }