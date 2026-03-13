// src/components/WeatherDashboard.tsx
import React, { useState, useEffect } from 'react';
import './WeatherDashboard.css';
import type { WeatherResponse } from '../types/weather';

interface Props {
  data: WeatherResponse | null;
}

const getAqiText = (aqi: number) => {
  if (aqi <= 1) return 'good';
  if (aqi === 2) return 'moderate';
  if (aqi === 3) return 'unhealthy for sensitive groups';
  if (aqi === 4) return 'unhealthy';
  if (aqi === 5) return 'very unhealthy';
  return 'hazardous';
};

const WeatherDashboard: React.FC<Props> = ({ data }) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // 1초마다 시계 업데이트 (콜론 깜빡임 동기화)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 시간 포맷팅 (예: "Tue 9:45 AM")
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(currentTime);

  const timeParts = formattedTime.split(':');

  if (!data || !data.current) {
    return <div className="dashboard-container">날씨 데이터를 불러오는 중입니다...</div>;
  }

  const { current, forecast_hourly, alerts } = data;
  const aqiText = getAqiText(current.air_quality_index);
  
  // 1시간 단위 예보 4개 추출
  const displayForecasts = forecast_hourly.slice(0, 4);

  return (
    <div className="dashboard-container">
      {/* 🚨 기상특보가 있을 경우 상단에 배지 렌더링 */}
      {alerts && alerts.length > 0 && (
        <div className="alert-banner">
          🚨 {alerts[0].event}
        </div>
      )}

      {/* 상단: 아이콘, 온도, 대기질 */}
      <div className="top-section">
        <div className="weather-icon">
          {/* 백엔드에서 https: 처리를 해두었으므로 그대로 사용 */}
          <img src={current.icon} alt={current.weather} />
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
            // "2026-03-09 12:00" 문자열에서 시(hour)만 추출
            // timezone 이슈를 막기 위해 문자열 파싱 사용
            const hourStr = forecast.time.split(' ')[1].split(':')[0];
            const hour = parseInt(hourStr, 10);
            
            return (
              <div key={index} className="forecast-col">
                <div className="forecast-time">{hour}</div>
                <div className="forecast-temp">{Math.round(forecast.temperature)}</div>
              </div>
            );
          })}
        </div>
        
        {/* 깜빡이는 콜론이 적용된 시계 */}
        <div className="clock-display">
          {timeParts[0]}
          <span className="blink-colon">:</span>
          {timeParts[1]}
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;