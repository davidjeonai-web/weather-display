// types/weather.ts

export type ErrorType = 
  | "ACCOUNT_ISSUE"       // API 키 문제 또는 호출 한도 초과
  | "API_PROVIDER_ERROR"  // OpenWeather 서버 장애 또는 네트워크 문제
  | "API_REQUEST_ERROR"   // 잘못된 파라미터 등 요청 오류
  | "UNKNOWN_ERROR"       // 알 수 없는 오류
  | "SYSTEM_STARTING";    // 서버가 켜진 직후 아직 데이터를 수집하지 못한 상태

export interface WeatherError {
  type: ErrorType;
  message: string;
}

// 비와 눈을 통합한 강수 형태
export type PrecipitationType = "rain" | "snow" | "mixed" | "none";

// 현재 날씨 데이터 인터페이스
export interface CurrentWeather {
  temperature: number;          // 현재 온도 (섭씨 ℃)
  feels_like: number;           // 체감 온도 (섭씨 ℃)
  temp_max: number;             // 현재 시점의 관측소 기준 최고 온도 (섭씨 ℃)
  temp_min: number;             // 현재 시점의 관측소 기준 최저 온도 (섭씨 ℃)
  weather: string;              // 날씨 상태 텍스트 (예: Clear, Clouds, Rain)
  icon: string;                 // 날씨 아이콘 코드 (예: "10d", "01n" - 프론트엔드 이미지 렌더링용)
  clouds_percent: number;       // 구름 덮임 정도 (0 ~ 100%)
  air_quality_index: number;    // 대기질 지수 (1: 최고 ~ 5: 최악)
  pop_current: number;          // 현재 시점의 강수 확률 (0 ~ 100%)
  precipitation_amount: number; // 최근 1시간 강수/강설량 (mm)
  precipitation_type: PrecipitationType; // 강수 형태 (비, 눈, 진눈깨비, 없음)
}

// 3시간 단위 예보 데이터 인터페이스
export interface ForecastWeather {
  time: string;                 // 예보 기준 시간 (UTC 기준 문자열, 예: "2026-03-09 12:00:00")
  temperature: number;          // 예상 온도 (섭씨 ℃)
  weather: string;              // 예상 날씨 상태 텍스트
  icon: string;                 // 예상 날씨 아이콘 코드
  clouds_percent: number;       // 예상 구름 덮임 정도 (0 ~ 100%)
  pop: number;                  // 예상 강수 확률 (0 ~ 100%)
  precipitation_amount: number; // 3시간 동안의 예상 강수/강설량 (mm)
  precipitation_type: PrecipitationType; // 예상 강수 형태
}

// 최종적으로 클라이언트에 반환될 전체 JSON 응답 구조
export interface WeatherResponse {
  status: "success" | "error";  // 현재 데이터의 유효성 상태
  updated_at: string;           // 가장 마지막으로 통신에 성공하여 데이터를 갱신한 시간 (ISO 문자열)
  last_attempt: string;         // 성공/실패 여부와 무관하게 가장 마지막으로 API 호출을 시도한 시간
  error: WeatherError | null;   // 에러 발생 시 에러 상세 정보 (정상일 땐 null)
  location: string;             // 데이터 기준 지역 이름
  current: CurrentWeather | null; // 현재 날씨 객체
  forecast_3hourly: ForecastWeather[]; // 향후 24시간(3시간 간격 8개) 예보 배열
}
