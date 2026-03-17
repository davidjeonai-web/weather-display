// types/weather.ts

export type ErrorType = "ACCOUNT_ISSUE" | "API_PROVIDER_ERROR" | "API_REQUEST_ERROR" | "UNKNOWN_ERROR" | "SYSTEM_STARTING";

export interface WeatherError {
  type: ErrorType;
  message: string;
}

export type PrecipitationType = "rain" | "snow" | "mixed" | "none"; // 👈 이 타입이 없다면 추가해 주세요.

// 🚨 새롭게 추가된 기상특보 타입
export interface WeatherAlert {
  event: string;      // 특보 이름 (예: Snow Squall Warning)
  headline: string;   // 요약
  severity: string;   // 심각도
  instruction: string;// 행동 요령 (있을 경우)
}

export interface CurrentWeather {
  temperature: number;
  feels_like: number;
  weather: string;
  wind_speed: number;    // 👈 추가 (km/h)
  icon: string;       // url 형식으로 제공됨
  air_quality_index: number; // 1(Good) ~ 6(Hazardous) (US-EPA 기준)
  precipitation_amount: number; // 현재 강수량 (mm)
  is_day: boolean;    // 낮(1)/밤(0) 여부 (UI 테마 변경에 유용)
  precipitation_type: PrecipitationType; // 👈 새로 추가된 부분!
  code: number; // 아이콘 코드
}

// 1시간 단위 예보로 변경!
export interface HourlyForecast {
  time: string;       // "2026-03-09 12:00"
  temperature: number;
  weather: string;
  icon: string;
  pop: number;        // 강수 확률 (chance_of_rain or chance_of_snow)
  precipitation_amount: number;
  precipitation_type: PrecipitationType; // 👈 새로 추가된 부분!
  code: number; // 아이콘 코드
}

export interface WeatherResponse {
  status: "success" | "error";
  updated_at: string;
  last_attempt: string;
  error: WeatherError | null;
  location: string;
  current: CurrentWeather | null;
  forecast_hourly: HourlyForecast[]; // 1시간 단위 배열 
  alerts: WeatherAlert[];            // 🚨 기상특보 배열
}