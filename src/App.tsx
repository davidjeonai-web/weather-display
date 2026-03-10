// src/App.tsx
import { useEffect, useState } from 'react';
import WeatherDashboard from './components/WeatherDashboard';
import { WeatherResponse } from './types/weather';

function App() {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);

  useEffect(() => {
    // 백엔드에서 날씨 데이터를 가져오는 함수
    const fetchWeather = async () => {
      try {
        // 백엔드 주소 (라즈베리 파이 로컬에서 같이 돌린다면 localhost, 
        // 다른 PC에서 돌린다면 해당 PC의 IP 주소를 입력하세요. 예: http://192.168.1.15:3000/api/weather)
        const res = await fetch('http://localhost:3000/api/weather');
        
        if (!res.ok) throw new Error('네트워크 응답이 정상이 아닙니다.');
        
        const data: WeatherResponse = await res.json();
        setWeatherData(data);
      } catch (error) {
        console.error('날씨 데이터를 가져오는데 실패했습니다:', error);
      }
    };

    // 컴포넌트가 마운트될 때 즉시 1회 호출
    fetchWeather();

    // 2분(120,000 밀리초)마다 백엔드에 최신 데이터 갱신 요청
    const interval = setInterval(fetchWeather, 120000);
    
    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <WeatherDashboard data={weatherData} />
    </div>
  );
}

export default App;
