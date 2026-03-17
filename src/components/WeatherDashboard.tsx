import React, { useState, useEffect } from 'react';
import type { WeatherResponse, WeatherAlert } from '../types/weather';
import { getAnimatedIcon } from '../utils/weatherMapper';

interface Props {
  data: WeatherResponse | null;
}

const getCleanAlertTitle = (alert: WeatherAlert): string => {
  let title = (alert.event && alert.event.toLowerCase() !== 'weather') 
    ? alert.event 
    : alert.headline;

  title = title.replace(/( in effect| issued by| until| for | - ).*$/i, '');
  return title.trim();
};

const getAqiText = (aqi: number) => {
  const texts = ['Good', 'Moderate', 'Unhealthy for Sensitive Groups', 'Unhealthy', 'Very Unhealthy', 'Hazardous'];
  return texts[aqi - 1] || 'Unknown';
};

const WeatherDashboard: React.FC<Props> = ({ data }) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!data || !data.current) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-[#5f9ea0] text-white text-2xl">
        날씨 데이터를 불러오는 중입니다...
      </div>
    );
  }

  const { current, forecast_hourly, alerts } = data;

  // 시계 포맷팅
  const dateStr = new Intl.DateTimeFormat('ko-KR', { 
    month: 'long', day: 'numeric', weekday: 'short' 
  }).format(currentTime);

  const timeStr = new Intl.DateTimeFormat('ko-KR', {
    hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(currentTime);
  
  const [ampmPart, timePart] = timeStr.split(' ');
  const [hourPart, minutePart] = timePart.split(':');

  return (
    <div className="flex flex-col justify-between w-full h-screen p-[30px] box-border bg-[#5f9ea0] text-white font-['Pretendard',-apple-system,BlinkMacSystemFont,system-ui,Roboto,sans-serif] overflow-hidden">
      
      {/* 🚨 알림 배지: 수정하신 스타일 그대로 반영 */}
      {alerts && alerts.length > 0 && (
        <div className="bg-[#ff3b30]/85 backdrop-blur-[10px] text-white py-[10px] px-[20px] rounded-[12px] text-[1.1rem] font-semibold text-center shadow-[0_4px_15px_rgba(0,0,0,0.3)] mb-[20px] animate-pulse">
          🚨 {getCleanAlertTitle(alerts[0])}
        </div>
      )}

      {/* 🌤 메인 정보 글래스 패널 */}
      <div className="bg-black/30 backdrop-blur-[15px] border border-white/10 rounded-[24px] p-[30px] flex items-center gap-[40px] w-fit shadow-xl">
        <div className="flex items-center">
          <img 
            className="w-[140px] h-[140px] drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
            src={getAnimatedIcon(current.code, current.is_day)} 
            alt={current.weather} 
          />
          <div className="text-[5rem] font-[800] tracking-[-2px] ml-4 leading-none">
            {Math.round(current.temperature)}°
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-[2rem] opacity-70 font-medium">
            체감 {Math.round(current.feels_like)}°
          </div>
          
          <div className="flex gap-2 mt-2">
            {/* 🌬️ 풍속 정보 추가 */}
            {current.wind_speed &&(
              <span className="bg-blue-500/30 px-[12px] py-[4px] rounded-[20px] text-[0.9rem] backdrop-blur-sm flex items-center gap-1">
                <span>🌬️</span> {Math.round(current.wind_speed)} km/h
              </span>
            )}
            
            {/* 기존 AQI 정보 */}
            <span className="bg-white/20 px-[12px] py-[4px] rounded-[20px] text-[0.9rem] backdrop-blur-sm">
              AQ: {getAqiText(current.air_quality_index)}
            </span>
          </div>
        </div>
      </div>

      {/* 📊 하단 영역 */}
      <div className="flex justify-between items-end mt-auto">
        {/* 시간별 예보 그리드 */}
        <div className="flex gap-[20px] bg-black/20 backdrop-blur-[10px] p-[20px] rounded-[20px] border border-white/5">
          {forecast_hourly.slice(1, 5).map((forecast, index) => {
            const fTime = new Date(forecast.time);
            const fHour = fTime.getHours();
            const fDisplayHour = fHour % 12 || 12;
            const fIsDay = fHour >= 6 && fHour < 18;

            return (
              <div key={index} className="flex flex-col items-center w-[70px]">
                <div className="text-[0.9rem] opacity-80 mb-[5px]">
                  {fHour < 12 ? '오전' : '오후'} {fDisplayHour}시
                </div>
                <div className="w-[45px] h-[45px]">
                  <img 
                    className="w-full h-full object-contain"
                    src={getAnimatedIcon(forecast.code, fIsDay)} 
                    alt="icon" 
                  />
                </div>
                <div className="text-[1.2rem] font-[600] mt-[5px]">
                  {Math.round(forecast.temperature)}°
                </div>
              </div>
            );
          })}
        </div>
        
        {/* ⏰ 우측 하단 시계 */}
        <div className="text-right drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
          <div className="text-[1.5rem] font-[400] opacity-90 mb-1">{dateStr}</div>
          <div className="text-[5.5rem] font-[700] leading-none flex items-baseline justify-end">
            <span className="text-[2.5rem] font-bold mr-3 opacity-80">{ampmPart}</span>
            <span>{hourPart}</span>
            <span className="animate-[blink_1s_step-end_infinite] mx-1">:</span>
            <span>{minutePart}</span>
          </div>
        </div>
      </div>

      {/* 커스텀 애니메이션 (Tailwind 스타일로 주입) */}
      <style>{`
        @keyframes blink { 
          0%, 100% { opacity: 1; } 
          50% { opacity: 0; } 
        }
      `}</style>
    </div>
  );
};

export default WeatherDashboard;