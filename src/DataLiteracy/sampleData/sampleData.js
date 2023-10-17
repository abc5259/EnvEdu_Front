export const data = JSON.parse(localStorage.getItem("data")) || [
  ["농업지대", "평균기온", "강수량", "일조시간"],
  ["태백고냉", 21.9, 181.9, 149.7],
  ["소백간산", 25.3, 675.6, 140],
  ["영남내륙산간", 24.6, 578.3, 137.8],
  ["중부내륙", 25.9, 505.3, 144.5],
  ["소백서부내륙", 26, 699.7, 138.6],
  ["노령동서내륙", 25.6, 570.2, 136.2],
  ["호남내륙", 25.6, 570.2, 136.2],
  ["영남내륙", 26, 477.5, 123.8],
  ["중서부평야", 25.7, 508.1, 157],
  ["남서해안", 25.6, 500.8, 104.9],
  ["남부해안", 25.2, 623.4, 113.6],
  ["동해안남부", 26.2, 235.6, 167.3],
];

export const data1 = [
  ["농업지대", "평균기온", "강수량", "일조시간"],
  ["태백고냉", 21.9, 181.9, 149.7],
  ["소백간산", 25.3, null, 140],
  ["영남내륙산간", 24.6, 578.3, 137.8],
  ["중부내륙", 125.9, 505.3, 144.5], // 평균기온에 이상치 추가 (125.9)
  ["소백서부내륙", 26, 2699.7, 138.6], // 강수량에 이상치 추가 (2699.7)
  ["노령동서내륙", 25.6, 570.2, null],
  ["호남내륙", -15.6, 570.2, 136.2], // 평균기온에 이상치 추가 (-15.6)
  ["영남내륙", 26, null, 1123.8], // 일조시간에 이상치 추가 (1123.8)
  ["중서부평야", 25.7, 508.1, 157],
  ["남서해안", 25.6, 500.8, 104.9],
  ["남부해안", 25.2, 623.4, 113.6],
  ["동해안남부", 26.2, 235.6, 167.3],
];
