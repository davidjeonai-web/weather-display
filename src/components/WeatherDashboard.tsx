import React, { useState, useEffect } from 'react';
import './WeatherDashboard.css';
import { WeatherResponse } from './types/weather'; // 백엔드에서 만든 타입 import

interface Props {
  data: WeatherResponse | null;
}

// 대기질 지수(AQI)를 텍스트로 변환하는 유틸 함수
const getAqiText = (aqi: number) => {
  switch (aqi) {
    case 1: return 'good';
    case 2: return 'fair';
    case 3: return 'moderate';
    case 4: return 'poor';
    case 5: return 'very poor';
    default: return 'unknown';
  }
};

const WeatherDashboard: React.FC<Props> = ({ data }) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // 1분마다 시계 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // 시간 포맷팅 (예: "Tue 9:45 am")
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(currentTime);

  if (!data || !data.current) {
    return <div className="dashboard-container">날씨 데이터를 불러오는 중입니다...</div>;
  }

  const { current, forecast_3hourly } = data;
  const aqiText = getAqiText(current.air_quality_index);
  
  // 예보 데이터 중 앞의 4개만 사용 (화면 스케치 기준)
  const displayForecasts = forecast_3hourly.slice(0, 4);

  return (
    <div className="dashboard-container">
      {/* 상단: 아이콘, 온도, 대기질 */}
      <div className="top-section">
        <div className="weather-icon">
          {/* 공식 OWM CDN 이미지를 사용하거나 로컬 커스텀 이미지를 연결하세요 */}
          <img 
            src={`https://openweathermap.org/img/wn/${current.icon}@4x.png`} 
            alt={current.weather} 
          />
        </div>
        <div className="current-temp-info">
          <div className="temp-main">{Math.round(current.temperature)}c</div>
          <div className="temp-feels">({Math.round(current.feels_like)})</div>
        </div>
        <div className="aqi-info">
          AQ: {aqiText}
        </div>
      </div>

      {/* 하단: 시간별 예보, 현재 시간 */}
      <div className="bottom-section">
        <div className="forecast-grid">
          {displayForecasts.map((forecast, index) => {
            // "2026-03-09 12:00:00" 형태의 문자열에서 시간("12")만 추출
            const hour = new Date(forecast.time.replace(' ', 'T')).getHours();
            
            return (
              <div key={index} className="forecast-col">
                <div className="forecast-time">{hour}</div>
                <div className="forecast-temp">{Math.round(forecast.temperature)}</div>
              </div>
            );
          })}
        </div>
        
        <div className="clock-display">
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
