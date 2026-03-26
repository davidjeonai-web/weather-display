// src/utils/weatherMapper.ts

export const weatherCodeMap: Record<number, { day: string; night: string }> = {
  // ☀️ 맑음
  1000: { day: 'clear-day', night: 'clear-night' },

  // ☁️ 구름
  1003: { day: 'partly-cloudy-day', night: 'partly-cloudy-night' }, // Partly cloudy
  1006: { day: 'cloudy', night: 'cloudy' },                         // Cloudy
  1009: { day: 'overcast', night: 'overcast' },                     // Overcast

  // 🌫️ 안개/미스트
  1030: { day: 'mist', night: 'mist' },       // Mist
  1135: { day: 'fog', night: 'fog' },         // Fog
  1147: { day: 'fog', night: 'fog' },         // Freezing fog

  // 🌧️ 비 (가벼운 비 ~ 보통)
  1063: { day: 'partly-cloudy-day-rain', night: 'partly-cloudy-night-rain' }, // Patchy rain possible
  1180: { day: 'partly-cloudy-day-rain', night: 'partly-cloudy-night-rain' }, // Patchy light rain
  1183: { day: 'rain', night: 'rain' },       // Light rain
  1186: { day: 'rain', night: 'rain' },       // Moderate rain at times
  1189: { day: 'rain', night: 'rain' },       // Moderate rain

  // ⛈️ 폭우/강한 비
  1192: { day: 'extreme-day-rain', night: 'extreme-night-rain' }, // Heavy rain at times
  1195: { day: 'extreme-rain', night: 'extreme-rain' },           // Heavy rain
  1240: { day: 'rain', night: 'rain' },                           // Light rain shower
  1243: { day: 'extreme-rain', night: 'extreme-rain' },           // Moderate or heavy rain shower
  1246: { day: 'extreme-rain', night: 'extreme-rain' },           // Torrential rain shower

  // ❄️ 눈
  1066: { day: 'partly-cloudy-day-snow', night: 'partly-cloudy-night-snow' }, // Patchy snow possible
  1210: { day: 'partly-cloudy-day-snow', night: 'partly-cloudy-night-snow' }, // Patchy light snow
  1213: { day: 'snow', night: 'snow' },       // Light snow
  1216: { day: 'snow', night: 'snow' },       // Patchy moderate snow
  1219: { day: 'snow', night: 'snow' },       // Moderate snow
  1222: { day: 'extreme-day-snow', night: 'extreme-night-snow' }, // Patchy heavy snow
  1225: { day: 'extreme-snow', night: 'extreme-snow' },           // Heavy snow
  1255: { day: 'snow', night: 'snow' },       // Light snow showers
  1258: { day: 'extreme-snow', night: 'extreme-snow' },           // Moderate or heavy snow showers

  // 🌨️ 진눈깨비/얼음비 (캐나다 겨울 단골)
  1069: { day: 'partly-cloudy-day-sleet', night: 'partly-cloudy-night-sleet' }, // Patchy sleet possible
  1072: { day: 'sleet', night: 'sleet' },     // Patchy freezing drizzle possible
  1114: { day: 'wind-snow', night: 'wind-snow' }, // Blowing snow (눈보라)
  1117: { day: 'extreme-snow', night: 'extreme-snow' }, // Blizzard
  1150: { day: 'drizzle', night: 'drizzle' }, // Patchy light drizzle
  1153: { day: 'drizzle', night: 'drizzle' }, // Light drizzle
  1168: { day: 'sleet', night: 'sleet' },     // Freezing drizzle
  1171: { day: 'sleet', night: 'sleet' },     // Heavy freezing drizzle
  1198: { day: 'sleet', night: 'sleet' },     // Light freezing rain
  1201: { day: 'sleet', night: 'sleet' },     // Moderate or heavy freezing rain
  1204: { day: 'sleet', night: 'sleet' },     // Light sleet
  1207: { day: 'sleet', night: 'sleet' },     // Moderate or heavy sleet
  1237: { day: 'hail', night: 'hail' },       // Ice pellets
  1249: { day: 'sleet', night: 'sleet' },     // Light sleet showers
  1252: { day: 'sleet', night: 'sleet' },     // Moderate or heavy sleet showers
  1261: { day: 'hail', night: 'hail' },       // Light showers of ice pellets
  1264: { day: 'hail', night: 'hail' },       // Moderate or heavy showers of ice pellets

  // ⚡ 천둥번개
  1087: { day: 'thunderstorms', night: 'thunderstorms' }, // Thundery outbreaks possible
  1273: { day: 'thunderstorms-day-rain', night: 'thunderstorms-night-rain' }, // Patchy light rain with thunder
  1276: { day: 'thunderstorms-rain', night: 'thunderstorms-rain' },           // Moderate or heavy rain with thunder
  1279: { day: 'thunderstorms-day-snow', night: 'thunderstorms-night-snow' }, // Patchy light snow with thunder
  1282: { day: 'thunderstorms-snow', night: 'thunderstorms-snow' },           // Moderate or heavy snow with thunder
};

const filled:Boolean = false

/**
 * 날씨 코드와 낮/밤 여부에 따라 적절한 SVG 경로를 반환하는 헬퍼 함수
 */
export const getAnimatedIcon = (code: number, isDay: boolean): string => {
  const iconSet = weatherCodeMap[code];

  const additionalPath = filled ? '' : '/line';
  
  // 만약 매핑된 코드가 없으면 기본값(맑음) 반환
  if (!iconSet) {
    return isDay ? '/icons/clear-day.svg' : '/icons/clear-night.svg';
  }

  const fileName = isDay ? iconSet.day : iconSet.night;
  return `/icons${additionalPath}/${fileName}.svg`;
};