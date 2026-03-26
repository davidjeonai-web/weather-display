import React, { useState, useEffect } from 'react';
import type { WeatherResponse, WeatherAlert } from '../types/weather';
import { getAnimatedIcon } from '../utils/weatherMapper';

interface Props {
  data: WeatherResponse | null;
}

// David님의 기상 특보 정제 로직
const sanitizeAlertText = (text: string): string => {
  return text
    .replace(/\\n/g, ' ')
    .replace(/[\r\t]/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const getCleanAlertTitle = (alert: WeatherAlert): string => {
  let title = (alert.event && alert.event.toLowerCase() !== 'weather') 
    ? alert.event 
    : alert.headline;

  title = title.replace(/( in effect| issued by| until| for | - ).*$/i, '');

  if (alert.instruction) {
    const instructionPart = sanitizeAlertText(alert.instruction);
    if (instructionPart) {
      title += `: ${instructionPart}`;
    }
  }
  return sanitizeAlertText(title).toUpperCase();
};

const WeatherDashboard: React.FC<Props> = ({ data }) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!data || !data.current) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-[#f6fafb] text-[#004d60] text-2xl font-bold">
        ATMOSPHERIC HUB LOADING...
      </div>
    );
  }

  const { current, forecast_hourly, alerts } = data;

  // 시계 및 날짜 포맷팅 (목업 디자인 준수)
  const dateStr = new Intl.DateTimeFormat('en-US', { 
    weekday: 'long', day: 'numeric', month: 'short' 
  }).format(currentTime).toUpperCase();

  const timeStr = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: false 
  }).format(currentTime);

  return (
    <div className="w-[800px] h-[480px] bg-[#f6fafb] text-[#181c1d] flex flex-col p-4 gap-4 relative overflow-hidden font-['Inter']">
      
      {/* 🚨 상단 특보 배지 (David님의 텍스트 정제 로직 적용) */}
      {alerts && alerts.length > 0 && (
        <div className="w-full bg-[#ffdad6] text-[#93000a] px-4 py-2 rounded-xl flex items-center justify-between shadow-sm flex-shrink-0 animate-pulse">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#ba1a1a]" style={{fontVariationSettings: "'FILL' 1"}}>warning</span>
            <span className="font-['Space_Grotesk'] font-bold text-sm tracking-tight truncate max-w-[650px]">
              {getCleanAlertTitle(alerts[0])}
            </span>
          </div>
          <span className="material-symbols-outlined text-xs">close</span>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        
        {/* 왼쪽 (7/12): 현재 날씨 & 8시간 예보 */}
        <div className="col-span-7 flex flex-col gap-4">
          
          {/* Hero Temperature Card */}
          <div className="bg-white rounded-xl p-6 flex flex-col justify-between relative overflow-hidden h-[240px] flex-shrink-0 shadow-sm border border-[#dfe3e4]">
            <div className="flex justify-between items-start z-10">
              <div>
                <h1 className="font-['Space_Grotesk'] font-bold text-7xl text-[#004d60] tracking-tighter leading-none">
                  {Math.round(current.temperature)}°C
                </h1>
                <p className="font-['Space_Grotesk'] font-medium text-[#3f484c] opacity-70 tracking-widest text-xs uppercase mt-3">
                  FEELS LIKE {Math.round(current.feels_like)}°C • NORTH YORK, ON
                </p>
              </div>
              <div className="text-right">
                <img 
                  src={getAnimatedIcon(current.code, current.is_day)} 
                  className="w-28 h-28 drop-shadow-md" 
                  alt="weather" 
                />
              </div>
            </div>

            {/* 하단 상세 정보 (Wind, Min/Max, AQI) */}
            <div className="grid grid-cols-3 gap-2 z-10 pt-4 border-t border-[#bfc8cd]/30">
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-[8px] text-[#3f484c] font-bold tracking-widest uppercase">WIND</span>
                <span className="font-['Space_Grotesk'] font-semibold text-sm text-[#004d60]">{Math.round(current.wind_speed)} km/h</span>
              </div>
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-[8px] text-[#3f484c] font-bold tracking-widest uppercase">MIN/MAX</span>
                <span className="font-['Space_Grotesk'] font-semibold text-sm text-[#004d60]">19°/28°</span> {/* API에서 받아온 값으로 연동 가능 */}
              </div>
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-[8px] text-[#3f484c] font-bold tracking-widest uppercase">AQI</span>
                <span className="font-['Space_Grotesk'] font-semibold text-sm text-[#004d60]">{current.air_quality_index}</span>
              </div>
            </div>
            
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#004d60]/5 rounded-full blur-3xl"></div>
          </div>

          {/* 8시간 시간별 예보 그리드 */}
          <div className="bg-[#f0f4f5] rounded-xl p-4 flex flex-col flex-1 min-h-0">
            <span className="font-['Space_Grotesk'] text-[10px] text-[#3f484c] font-bold tracking-widest uppercase mb-3">8-HOUR FORECAST</span>
            <div className="flex justify-between items-center h-full gap-2 overflow-hidden">
              {forecast_hourly.slice(1, 9).map((f, i) => {
                const fTime = new Date(f.time);
                const isDay = fTime.getHours() >= 6 && fTime.getHours() < 18;
                return (
                  <div key={i} className={`flex-1 flex flex-col items-center py-2 rounded-lg transition-colors ${i === 1 ? 'bg-[#00677f] text-white shadow-md' : 'bg-white shadow-sm'}`}>
                    <span className="text-[10px] font-medium opacity-80">{fTime.getHours()}:00</span>
                    <img src={getAnimatedIcon(f.code, isDay)} className="w-8 h-8 my-1" alt="icon" />
                    <span className="font-['Space_Grotesk'] font-bold text-sm">{Math.round(f.temperature)}°</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 오른쪽 (5/12): 거대 디지털 시계 카드 */}
        <div className="col-span-5 bg-[#004d60] rounded-xl flex flex-col items-center justify-center p-8 text-white relative">
          <div className="flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[#86d1ec] text-5xl mb-4">schedule</span>
            <h2 className="font-['Space_Grotesk'] font-bold text-[84px] leading-none tracking-tighter" id="digital-clock">
              {timeStr}
            </h2>
            <p className="font-['Space_Grotesk'] font-medium text-lg tracking-[0.2em] uppercase opacity-80 mt-2">
              {dateStr}
            </p>
          </div>
          {/* 하단에 살짝 비치는 "Jeon's Home" 같은 개인화 문구 추천 */}
          <p className="absolute bottom-4 text-[8px] tracking-[0.4em] opacity-20 uppercase">Atmospheric Hub v3.0</p>
        </div>
      </div>

      <style>{`
        .material-symbols-outlined { font-size: 24px; vertical-align: middle; }
        body { cursor: none; } /* 키오스크용 마우스 커서 숨김 */
      `}</style>
    </div>
  );
};

export default WeatherDashboard;