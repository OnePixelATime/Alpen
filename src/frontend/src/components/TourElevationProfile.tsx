import { useRouter } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfilePoint {
  d: number;
  e: number;
}

interface TourStageData {
  stageNumber: number;
  stageId: string;
  distanceKm: number;
  ascentM: number;
  descentM: number;
  profile: readonly ProfilePoint[];
}

interface MergedPoint extends ProfilePoint {
  stageNumber: number;
}

// ─── Stage data (stages with real GPX data) ────────────────────────────────

export const TOUR_STAGES_DATA: TourStageData[] = [
  {
    stageNumber: 1,
    stageId: "e1",
    distanceKm: 6.5,
    ascentM: 789,
    descentM: 2,
    profile: [
      { d: 0.0, e: 993 },
      { d: 0.08, e: 993 },
      { d: 0.13, e: 992 },
      { d: 0.2, e: 991 },
      { d: 0.26, e: 991 },
      { d: 0.33, e: 991 },
      { d: 0.39, e: 993 },
      { d: 0.46, e: 995 },
      { d: 0.52, e: 997 },
      { d: 0.59, e: 1000 },
      { d: 0.65, e: 1004 },
      { d: 0.72, e: 1007 },
      { d: 0.78, e: 1011 },
      { d: 0.85, e: 1015 },
      { d: 0.91, e: 1019 },
      { d: 0.98, e: 1023 },
      { d: 1.04, e: 1026 },
      { d: 1.11, e: 1031 },
      { d: 1.18, e: 1037 },
      { d: 1.24, e: 1043 },
      { d: 1.31, e: 1049 },
      { d: 1.37, e: 1057 },
      { d: 1.43, e: 1065 },
      { d: 1.5, e: 1073 },
      { d: 1.56, e: 1079 },
      { d: 1.62, e: 1086 },
      { d: 1.69, e: 1092 },
      { d: 1.75, e: 1098 },
      { d: 1.82, e: 1103 },
      { d: 1.88, e: 1108 },
      { d: 1.94, e: 1114 },
      { d: 2.01, e: 1120 },
      { d: 2.07, e: 1126 },
      { d: 2.14, e: 1132 },
      { d: 2.2, e: 1138 },
      { d: 2.26, e: 1143 },
      { d: 2.33, e: 1151 },
      { d: 2.39, e: 1159 },
      { d: 2.46, e: 1168 },
      { d: 2.52, e: 1175 },
      { d: 2.59, e: 1180 },
      { d: 2.65, e: 1184 },
      { d: 2.71, e: 1189 },
      { d: 2.78, e: 1194 },
      { d: 2.84, e: 1198 },
      { d: 2.9, e: 1203 },
      { d: 2.97, e: 1213 },
      { d: 3.03, e: 1224 },
      { d: 3.09, e: 1233 },
      { d: 3.15, e: 1248 },
      { d: 3.22, e: 1262 },
      { d: 3.28, e: 1276 },
      { d: 3.34, e: 1292 },
      { d: 3.4, e: 1309 },
      { d: 3.46, e: 1324 },
      { d: 3.52, e: 1338 },
      { d: 3.58, e: 1349 },
      { d: 3.65, e: 1360 },
      { d: 3.71, e: 1370 },
      { d: 3.77, e: 1374 },
      { d: 3.84, e: 1378 },
      { d: 3.9, e: 1381 },
      { d: 3.96, e: 1394 },
      { d: 4.02, e: 1407 },
      { d: 4.08, e: 1420 },
      { d: 4.15, e: 1433 },
      { d: 4.21, e: 1446 },
      { d: 4.27, e: 1459 },
      { d: 4.33, e: 1469 },
      { d: 4.4, e: 1477 },
      { d: 4.46, e: 1485 },
      { d: 4.53, e: 1492 },
      { d: 4.59, e: 1498 },
      { d: 4.66, e: 1505 },
      { d: 4.72, e: 1510 },
      { d: 4.79, e: 1514 },
      { d: 4.85, e: 1517 },
      { d: 4.92, e: 1522 },
      { d: 4.98, e: 1530 },
      { d: 5.04, e: 1537 },
      { d: 5.11, e: 1546 },
      { d: 5.17, e: 1558 },
      { d: 5.24, e: 1570 },
      { d: 5.3, e: 1582 },
      { d: 5.36, e: 1598 },
      { d: 5.42, e: 1613 },
      { d: 5.48, e: 1629 },
      { d: 5.54, e: 1644 },
      { d: 5.6, e: 1659 },
      { d: 5.67, e: 1676 },
      { d: 5.73, e: 1690 },
      { d: 5.79, e: 1703 },
      { d: 5.86, e: 1716 },
      { d: 5.92, e: 1729 },
      { d: 5.99, e: 1739 },
      { d: 6.05, e: 1749 },
      { d: 6.11, e: 1758 },
      { d: 6.18, e: 1766 },
      { d: 6.24, e: 1773 },
      { d: 6.31, e: 1780 },
      { d: 6.5, e: 1780 },
    ],
  },
  {
    stageNumber: 2,
    stageId: "e2",
    distanceKm: 7.7,
    ascentM: 165,
    descentM: 908,
    profile: [
      { d: 0.0, e: 1847 },
      { d: 0.03, e: 1847 },
      { d: 0.11, e: 1848 },
      { d: 0.19, e: 1854 },
      { d: 0.25, e: 1859 },
      { d: 0.31, e: 1864 },
      { d: 0.38, e: 1877 },
      { d: 0.48, e: 1894 },
      { d: 0.67, e: 1940 },
      { d: 0.73, e: 1950 },
      { d: 0.76, e: 1953 },
      { d: 0.84, e: 1959 },
      { d: 0.9, e: 1964 },
      { d: 0.93, e: 1961 },
      { d: 1.06, e: 1944 },
      { d: 1.1, e: 1938 },
      { d: 1.12, e: 1932 },
      { d: 1.21, e: 1907 },
      { d: 1.25, e: 1898 },
      { d: 1.34, e: 1871 },
      { d: 1.39, e: 1856 },
      { d: 1.46, e: 1832 },
      { d: 1.51, e: 1818 },
      { d: 1.56, e: 1803 },
      { d: 1.58, e: 1798 },
      { d: 1.61, e: 1788 },
      { d: 1.68, e: 1767 },
      { d: 1.72, e: 1754 },
      { d: 1.84, e: 1723 },
      { d: 1.91, e: 1706 },
      { d: 2.03, e: 1684 },
      { d: 2.11, e: 1667 },
      { d: 2.15, e: 1658 },
      { d: 2.2, e: 1649 },
      { d: 2.24, e: 1640 },
      { d: 2.33, e: 1623 },
      { d: 2.5, e: 1583 },
      { d: 2.63, e: 1556 },
      { d: 2.75, e: 1530 },
      { d: 2.87, e: 1500 },
      { d: 2.93, e: 1482 },
      { d: 3.01, e: 1459 },
      { d: 3.06, e: 1443 },
      { d: 3.19, e: 1406 },
      { d: 3.28, e: 1378 },
      { d: 3.32, e: 1368 },
      { d: 3.42, e: 1352 },
      { d: 3.47, e: 1342 },
      { d: 3.5, e: 1336 },
      { d: 3.57, e: 1334 },
      { d: 3.64, e: 1331 },
      { d: 3.7, e: 1329 },
      { d: 3.76, e: 1325 },
      { d: 3.82, e: 1322 },
      { d: 3.87, e: 1319 },
      { d: 3.96, e: 1313 },
      { d: 4.03, e: 1308 },
      { d: 4.09, e: 1304 },
      { d: 4.19, e: 1295 },
      { d: 4.29, e: 1287 },
      { d: 4.35, e: 1282 },
      { d: 4.42, e: 1278 },
      { d: 4.53, e: 1272 },
      { d: 4.59, e: 1270 },
      { d: 4.67, e: 1269 },
      { d: 4.72, e: 1267 },
      { d: 4.8, e: 1265 },
      { d: 4.88, e: 1262 },
      { d: 4.93, e: 1260 },
      { d: 5.05, e: 1255 },
      { d: 5.1, e: 1252 },
      { d: 5.22, e: 1247 },
      { d: 5.28, e: 1244 },
      { d: 5.4, e: 1244 },
      { d: 5.48, e: 1245 },
      { d: 5.59, e: 1254 },
      { d: 5.66, e: 1260 },
      { d: 5.84, e: 1284 },
      { d: 5.88, e: 1289 },
      { d: 6.03, e: 1285 },
      { d: 6.09, e: 1282 },
      { d: 6.16, e: 1270 },
      { d: 6.21, e: 1260 },
      { d: 6.28, e: 1248 },
      { d: 6.4, e: 1224 },
      { d: 6.44, e: 1215 },
      { d: 6.55, e: 1193 },
      { d: 6.58, e: 1186 },
      { d: 6.67, e: 1169 },
      { d: 6.71, e: 1161 },
      { d: 6.76, e: 1154 },
      { d: 6.83, e: 1144 },
      { d: 6.87, e: 1137 },
      { d: 6.91, e: 1132 },
      { d: 6.97, e: 1127 },
      { d: 7.03, e: 1123 },
      { d: 7.15, e: 1115 },
      { d: 7.3, e: 1108 },
      { d: 7.37, e: 1106 },
      { d: 7.42, e: 1105 },
      { d: 7.49, e: 1104 },
      { d: 7.54, e: 1103 },
      { d: 7.71, e: 1103 },
    ],
  },
  {
    stageNumber: 3,
    stageId: "e3",
    distanceKm: 11.7,
    ascentM: 1165,
    descentM: 72,
    profile: [
      { d: 0.0, e: 1266 },
      { d: 0.08, e: 1266 },
      { d: 0.14, e: 1266 },
      { d: 0.21, e: 1267 },
      { d: 0.29, e: 1267 },
      { d: 0.41, e: 1277 },
      { d: 0.49, e: 1283 },
      { d: 0.54, e: 1288 },
      { d: 0.67, e: 1299 },
      { d: 0.76, e: 1310 },
      { d: 0.83, e: 1318 },
      { d: 1.0, e: 1333 },
      { d: 1.09, e: 1339 },
      { d: 1.15, e: 1340 },
      { d: 1.26, e: 1342 },
      { d: 1.39, e: 1349 },
      { d: 1.55, e: 1361 },
      { d: 1.71, e: 1372 },
      { d: 1.92, e: 1389 },
      { d: 2.0, e: 1398 },
      { d: 2.18, e: 1416 },
      { d: 2.41, e: 1435 },
      { d: 2.62, e: 1441 },
      { d: 2.85, e: 1446 },
      { d: 3.22, e: 1461 },
      { d: 3.46, e: 1477 },
      { d: 3.56, e: 1485 },
      { d: 3.71, e: 1496 },
      { d: 3.77, e: 1501 },
      { d: 4.04, e: 1527 },
      { d: 4.23, e: 1547 },
      { d: 4.38, e: 1565 },
      { d: 4.45, e: 1574 },
      { d: 4.58, e: 1595 },
      { d: 4.97, e: 1640 },
      { d: 5.13, e: 1648 },
      { d: 5.39, e: 1660 },
      { d: 5.52, e: 1663 },
      { d: 5.61, e: 1665 },
      { d: 5.67, e: 1666 },
      { d: 5.77, e: 1672 },
      { d: 5.89, e: 1681 },
      { d: 6.03, e: 1700 },
      { d: 6.21, e: 1727 },
      { d: 6.36, e: 1747 },
      { d: 6.49, e: 1763 },
      { d: 6.61, e: 1777 },
      { d: 6.72, e: 1789 },
      { d: 6.83, e: 1803 },
      { d: 7.0, e: 1823 },
      { d: 7.1, e: 1837 },
      { d: 7.18, e: 1843 },
      { d: 7.23, e: 1848 },
      { d: 7.38, e: 1859 },
      { d: 7.57, e: 1871 },
      { d: 7.68, e: 1878 },
      { d: 7.82, e: 1897 },
      { d: 7.93, e: 1914 },
      { d: 8.01, e: 1932 },
      { d: 8.05, e: 1940 },
      { d: 8.11, e: 1951 },
      { d: 8.17, e: 1966 },
      { d: 8.24, e: 1980 },
      { d: 8.27, e: 1988 },
      { d: 8.38, e: 2014 },
      { d: 8.52, e: 2050 },
      { d: 8.65, e: 2086 },
      { d: 8.78, e: 2119 },
      { d: 8.9, e: 2147 },
      { d: 9.01, e: 2169 },
      { d: 9.09, e: 2184 },
      { d: 9.19, e: 2200 },
      { d: 9.33, e: 2221 },
      { d: 9.42, e: 2232 },
      { d: 9.5, e: 2242 },
      { d: 9.56, e: 2252 },
      { d: 9.62, e: 2261 },
      { d: 9.67, e: 2269 },
      { d: 9.72, e: 2277 },
      { d: 9.77, e: 2287 },
      { d: 9.81, e: 2295 },
      { d: 9.84, e: 2301 },
      { d: 9.92, e: 2315 },
      { d: 10.01, e: 2333 },
      { d: 10.08, e: 2344 },
      { d: 10.14, e: 2357 },
      { d: 10.18, e: 2364 },
      { d: 10.23, e: 2375 },
      { d: 10.37, e: 2401 },
      { d: 10.48, e: 2421 },
      { d: 10.51, e: 2424 },
      { d: 10.55, e: 2426 },
      { d: 10.62, e: 2428 },
      { d: 10.65, e: 2429 },
      { d: 10.67, e: 2430 },
      { d: 10.71, e: 2430 },
      { d: 10.86, e: 2409 },
      { d: 10.93, e: 2400 },
      { d: 11.03, e: 2385 },
      { d: 11.14, e: 2374 },
      { d: 11.19, e: 2373 },
      { d: 11.34, e: 2368 },
      { d: 11.45, e: 2362 },
      { d: 11.54, e: 2359 },
      { d: 11.66, e: 2359 },
    ],
  },
  {
    stageNumber: 4,
    stageId: "e4",
    distanceKm: 6.0,
    ascentM: 0,
    descentM: 1173,
    profile: [
      { d: 0.0, e: 2326 },
      { d: 0.09, e: 2326 },
      { d: 0.19, e: 2306 },
      { d: 0.29, e: 2285 },
      { d: 0.36, e: 2266 },
      { d: 0.44, e: 2248 },
      { d: 0.5, e: 2231 },
      { d: 0.58, e: 2211 },
      { d: 0.66, e: 2191 },
      { d: 0.72, e: 2175 },
      { d: 0.79, e: 2154 },
      { d: 0.85, e: 2134 },
      { d: 0.93, e: 2111 },
      { d: 1.01, e: 2089 },
      { d: 1.06, e: 2074 },
      { d: 1.14, e: 2049 },
      { d: 1.2, e: 2033 },
      { d: 1.27, e: 2013 },
      { d: 1.34, e: 1993 },
      { d: 1.39, e: 1973 },
      { d: 1.46, e: 1952 },
      { d: 1.5, e: 1935 },
      { d: 1.58, e: 1907 },
      { d: 1.66, e: 1879 },
      { d: 1.72, e: 1856 },
      { d: 1.79, e: 1836 },
      { d: 1.85, e: 1818 },
      { d: 1.92, e: 1799 },
      { d: 2.01, e: 1784 },
      { d: 2.15, e: 1762 },
      { d: 2.25, e: 1748 },
      { d: 2.33, e: 1737 },
      { d: 2.4, e: 1728 },
      { d: 2.47, e: 1719 },
      { d: 2.55, e: 1709 },
      { d: 2.67, e: 1693 },
      { d: 2.73, e: 1684 },
      { d: 2.79, e: 1674 },
      { d: 2.86, e: 1663 },
      { d: 2.94, e: 1645 },
      { d: 2.99, e: 1629 },
      { d: 3.04, e: 1614 },
      { d: 3.11, e: 1593 },
      { d: 3.17, e: 1572 },
      { d: 3.23, e: 1551 },
      { d: 3.31, e: 1528 },
      { d: 3.36, e: 1514 },
      { d: 3.44, e: 1491 },
      { d: 3.54, e: 1466 },
      { d: 3.61, e: 1450 },
      { d: 3.66, e: 1439 },
      { d: 3.77, e: 1411 },
      { d: 3.86, e: 1385 },
      { d: 3.91, e: 1371 },
      { d: 3.96, e: 1359 },
      { d: 4.06, e: 1338 },
      { d: 4.14, e: 1319 },
      { d: 4.23, e: 1298 },
      { d: 4.33, e: 1277 },
      { d: 4.49, e: 1248 },
      { d: 4.6, e: 1235 },
      { d: 4.71, e: 1223 },
      { d: 4.82, e: 1215 },
      { d: 4.95, e: 1203 },
      { d: 5.05, e: 1193 },
      { d: 5.12, e: 1186 },
      { d: 5.3, e: 1171 },
      { d: 5.42, e: 1164 },
      { d: 5.64, e: 1155 },
      { d: 5.97, e: 1153 },
    ],
  },
  {
    stageNumber: 5,
    stageId: "e5",
    distanceKm: 11.9,
    ascentM: 395,
    descentM: 1565,
    profile: [
      { d: 0.0, e: 2199 },
      { d: 0.12, e: 2198 },
      { d: 0.22, e: 2192 },
      { d: 0.34, e: 2183 },
      { d: 0.44, e: 2168 },
      { d: 0.55, e: 2162 },
      { d: 0.66, e: 2167 },
      { d: 0.76, e: 2171 },
      { d: 0.87, e: 2175 },
      { d: 0.98, e: 2178 },
      { d: 1.08, e: 2179 },
      { d: 1.19, e: 2192 },
      { d: 1.29, e: 2208 },
      { d: 1.4, e: 2218 },
      { d: 1.5, e: 2228 },
      { d: 1.61, e: 2251 },
      { d: 1.71, e: 2273 },
      { d: 1.82, e: 2289 },
      { d: 1.93, e: 2307 },
      { d: 2.04, e: 2328 },
      { d: 2.14, e: 2353 },
      { d: 2.25, e: 2386 },
      { d: 2.35, e: 2415 },
      { d: 2.46, e: 2442 },
      { d: 2.56, e: 2466 },
      { d: 2.67, e: 2487 },
      { d: 2.78, e: 2499 },
      { d: 2.89, e: 2505 },
      { d: 3.0, e: 2493 },
      { d: 3.1, e: 2480 },
      { d: 3.21, e: 2469 },
      { d: 3.31, e: 2459 },
      { d: 3.42, e: 2461 },
      { d: 3.53, e: 2459 },
      { d: 3.64, e: 2447 },
      { d: 3.75, e: 2447 },
      { d: 3.86, e: 2459 },
      { d: 3.96, e: 2471 },
      { d: 4.07, e: 2483 },
      { d: 4.18, e: 2479 },
      { d: 4.29, e: 2470 },
      { d: 4.4, e: 2459 },
      { d: 4.5, e: 2448 },
      { d: 4.61, e: 2439 },
      { d: 4.71, e: 2429 },
      { d: 4.86, e: 2402 },
      { d: 4.96, e: 2375 },
      { d: 5.07, e: 2342 },
      { d: 5.17, e: 2312 },
      { d: 5.28, e: 2284 },
      { d: 5.38, e: 2249 },
      { d: 5.48, e: 2212 },
      { d: 5.6, e: 2170 },
      { d: 5.7, e: 2130 },
      { d: 5.81, e: 2098 },
      { d: 5.91, e: 2067 },
      { d: 6.02, e: 2033 },
      { d: 6.12, e: 2001 },
      { d: 6.23, e: 1974 },
      { d: 6.33, e: 1955 },
      { d: 6.44, e: 1957 },
      { d: 6.55, e: 1955 },
      { d: 6.66, e: 1950 },
      { d: 6.76, e: 1939 },
      { d: 6.87, e: 1925 },
      { d: 6.98, e: 1911 },
      { d: 7.08, e: 1898 },
      { d: 7.19, e: 1886 },
      { d: 7.3, e: 1874 },
      { d: 7.4, e: 1857 },
      { d: 7.51, e: 1841 },
      { d: 7.62, e: 1829 },
      { d: 7.73, e: 1820 },
      { d: 7.83, e: 1813 },
      { d: 8.1, e: 1764 },
      { d: 8.2, e: 1744 },
      { d: 8.31, e: 1723 },
      { d: 8.41, e: 1702 },
      { d: 8.52, e: 1680 },
      { d: 8.62, e: 1658 },
      { d: 8.73, e: 1636 },
      { d: 8.83, e: 1616 },
      { d: 8.94, e: 1594 },
      { d: 9.04, e: 1571 },
      { d: 9.14, e: 1548 },
      { d: 9.25, e: 1527 },
      { d: 9.36, e: 1505 },
      { d: 9.46, e: 1482 },
      { d: 9.57, e: 1458 },
      { d: 9.67, e: 1436 },
      { d: 9.78, e: 1418 },
      { d: 9.89, e: 1400 },
      { d: 9.99, e: 1386 },
      { d: 10.1, e: 1371 },
      { d: 10.21, e: 1348 },
      { d: 10.32, e: 1326 },
      { d: 10.42, e: 1303 },
      { d: 11.25, e: 1110 },
      { d: 11.36, e: 1092 },
      { d: 11.47, e: 1075 },
      { d: 11.58, e: 1054 },
      { d: 11.68, e: 1032 },
      { d: 11.79, e: 1029 },
    ],
  },
  {
    stageNumber: 6,
    stageId: "etappe-6",
    distanceKm: 5.5,
    ascentM: 978,
    descentM: 0,
    profile: [
      { d: 0.0, e: 1738 },
      { d: 0.08, e: 1738 },
      { d: 0.14, e: 1742 },
      { d: 0.22, e: 1747 },
      { d: 0.29, e: 1752 },
      { d: 0.34, e: 1756 },
      { d: 0.41, e: 1761 },
      { d: 0.5, e: 1768 },
      { d: 0.55, e: 1772 },
      { d: 0.6, e: 1777 },
      { d: 0.66, e: 1782 },
      { d: 0.71, e: 1787 },
      { d: 0.76, e: 1792 },
      { d: 0.83, e: 1800 },
      { d: 0.9, e: 1806 },
      { d: 0.97, e: 1813 },
      { d: 1.0, e: 1816 },
      { d: 1.05, e: 1820 },
      { d: 1.12, e: 1827 },
      { d: 1.17, e: 1831 },
      { d: 1.25, e: 1838 },
      { d: 1.31, e: 1843 },
      { d: 1.37, e: 1850 },
      { d: 1.48, e: 1862 },
      { d: 1.54, e: 1867 },
      { d: 1.63, e: 1879 },
      { d: 1.7, e: 1886 },
      { d: 1.87, e: 1905 },
      { d: 1.93, e: 1911 },
      { d: 2.0, e: 1919 },
      { d: 2.15, e: 1935 },
      { d: 2.24, e: 1945 },
      { d: 2.29, e: 1951 },
      { d: 2.42, e: 1968 },
      { d: 2.48, e: 1976 },
      { d: 2.56, e: 1992 },
      { d: 2.62, e: 2003 },
      { d: 2.69, e: 2017 },
      { d: 2.75, e: 2033 },
      { d: 2.8, e: 2048 },
      { d: 2.86, e: 2066 },
      { d: 2.93, e: 2087 },
      { d: 3.05, e: 2122 },
      { d: 3.15, e: 2149 },
      { d: 3.26, e: 2175 },
      { d: 3.37, e: 2197 },
      { d: 3.52, e: 2225 },
      { d: 3.64, e: 2251 },
      { d: 3.75, e: 2273 },
      { d: 3.87, e: 2299 },
      { d: 3.98, e: 2322 },
      { d: 4.12, e: 2353 },
      { d: 4.22, e: 2384 },
      { d: 4.3, e: 2405 },
      { d: 4.39, e: 2438 },
      { d: 4.49, e: 2473 },
      { d: 4.59, e: 2501 },
      { d: 4.71, e: 2537 },
      { d: 4.85, e: 2592 },
      { d: 4.99, e: 2645 },
      { d: 5.1, e: 2686 },
      { d: 5.3, e: 2717 },
      { d: 5.5, e: 2717 },
    ],
  },
  {
    stageNumber: 7,
    stageId: "e7",
    distanceKm: 16.6,
    ascentM: 388,
    descentM: 1230,
    profile: [
      { d: 0.0, e: 2737 },
      { d: 0.07, e: 2737 },
      { d: 0.15, e: 2742 },
      { d: 0.23, e: 2752 },
      { d: 0.33, e: 2765 },
      { d: 0.52, e: 2800 },
      { d: 0.7, e: 2820 },
      { d: 0.83, e: 2820 },
      { d: 0.97, e: 2825 },
      { d: 1.09, e: 2834 },
      { d: 1.16, e: 2847 },
      { d: 1.31, e: 2882 },
      { d: 1.47, e: 2908 },
      { d: 1.61, e: 2927 },
      { d: 1.71, e: 2938 },
      { d: 1.77, e: 2939 },
      { d: 1.85, e: 2941 },
      { d: 1.94, e: 2930 },
      { d: 2.14, e: 2877 },
      { d: 2.35, e: 2820 },
      { d: 2.63, e: 2764 },
      { d: 2.8, e: 2732 },
      { d: 2.92, e: 2711 },
      { d: 3.23, e: 2674 },
      { d: 3.38, e: 2662 },
      { d: 3.57, e: 2653 },
      { d: 3.85, e: 2648 },
      { d: 4.14, e: 2658 },
      { d: 6.02, e: 2799 },
      { d: 6.18, e: 2792 },
      { d: 6.34, e: 2782 },
      { d: 6.55, e: 2780 },
      { d: 6.7, e: 2787 },
      { d: 6.85, e: 2783 },
      { d: 7.09, e: 2776 },
      { d: 7.22, e: 2766 },
      { d: 7.37, e: 2749 },
      { d: 7.55, e: 2724 },
      { d: 7.74, e: 2712 },
      { d: 7.93, e: 2710 },
      { d: 8.18, e: 2700 },
      { d: 8.35, e: 2689 },
      { d: 8.65, e: 2671 },
      { d: 8.94, e: 2655 },
      { d: 9.39, e: 2669 },
      { d: 9.68, e: 2663 },
      { d: 10.04, e: 2646 },
      { d: 10.23, e: 2636 },
      { d: 10.41, e: 2627 },
      { d: 10.53, e: 2619 },
      { d: 10.8, e: 2571 },
      { d: 10.99, e: 2541 },
      { d: 11.17, e: 2523 },
      { d: 11.53, e: 2521 },
      { d: 11.9, e: 2516 },
      { d: 12.0, e: 2510 },
      { d: 12.28, e: 2494 },
      { d: 12.59, e: 2455 },
      { d: 12.79, e: 2425 },
      { d: 12.95, e: 2397 },
      { d: 13.1, e: 2364 },
      { d: 13.27, e: 2343 },
      { d: 13.5, e: 2319 },
      { d: 13.76, e: 2282 },
      { d: 13.89, e: 2266 },
      { d: 14.05, e: 2248 },
      { d: 14.24, e: 2221 },
      { d: 14.39, e: 2194 },
      { d: 14.57, e: 2158 },
      { d: 14.71, e: 2133 },
      { d: 14.8, e: 2114 },
      { d: 14.91, e: 2095 },
      { d: 15.06, e: 2061 },
      { d: 15.18, e: 2040 },
      { d: 15.41, e: 2011 },
      { d: 15.59, e: 1995 },
      { d: 15.82, e: 1967 },
      { d: 16.09, e: 1929 },
      { d: 16.42, e: 1898 },
      { d: 16.52, e: 1894 },
    ],
  },
  {
    stageNumber: 8,
    stageId: "e8",
    distanceKm: 8.4,
    ascentM: 457,
    descentM: 12,
    profile: [
      { d: 0.0, e: 1896 },
      { d: 0.08, e: 1896 },
      { d: 0.21, e: 1899 },
      { d: 0.35, e: 1905 },
      { d: 0.45, e: 1915 },
      { d: 0.55, e: 1925 },
      { d: 0.62, e: 1932 },
      { d: 0.76, e: 1946 },
      { d: 0.93, e: 1960 },
      { d: 1.04, e: 1964 },
      { d: 1.12, e: 1968 },
      { d: 1.27, e: 1976 },
      { d: 1.38, e: 1982 },
      { d: 1.52, e: 1990 },
      { d: 1.66, e: 1994 },
      { d: 1.76, e: 1997 },
      { d: 1.86, e: 1998 },
      { d: 1.97, e: 1999 },
      { d: 2.04, e: 2000 },
      { d: 2.11, e: 2002 },
      { d: 2.19, e: 2004 },
      { d: 2.4, e: 2009 },
      { d: 2.6, e: 2010 },
      { d: 2.71, e: 2011 },
      { d: 2.87, e: 2017 },
      { d: 2.97, e: 2022 },
      { d: 3.01, e: 2024 },
      { d: 3.27, e: 2041 },
      { d: 3.5, e: 2059 },
      { d: 3.6, e: 2066 },
      { d: 3.7, e: 2073 },
      { d: 3.85, e: 2075 },
      { d: 3.96, e: 2079 },
      { d: 4.03, e: 2085 },
      { d: 4.1, e: 2089 },
      { d: 4.16, e: 2095 },
      { d: 4.21, e: 2100 },
      { d: 4.28, e: 2107 },
      { d: 4.4, e: 2111 },
      { d: 4.53, e: 2113 },
      { d: 4.67, e: 2108 },
      { d: 4.77, e: 2107 },
      { d: 4.94, e: 2108 },
      { d: 5.03, e: 2113 },
      { d: 5.12, e: 2117 },
      { d: 5.23, e: 2119 },
      { d: 5.35, e: 2122 },
      { d: 5.51, e: 2126 },
      { d: 5.61, e: 2133 },
      { d: 5.67, e: 2136 },
      { d: 5.76, e: 2138 },
      { d: 5.91, e: 2139 },
      { d: 6.06, e: 2135 },
      { d: 6.17, e: 2140 },
      { d: 6.21, e: 2143 },
      { d: 6.29, e: 2150 },
      { d: 6.37, e: 2158 },
      { d: 6.46, e: 2169 },
      { d: 6.51, e: 2174 },
      { d: 6.62, e: 2185 },
      { d: 6.71, e: 2195 },
      { d: 6.75, e: 2197 },
      { d: 6.82, e: 2202 },
      { d: 6.86, e: 2205 },
      { d: 6.92, e: 2208 },
      { d: 6.98, e: 2212 },
      { d: 7.07, e: 2217 },
      { d: 7.19, e: 2225 },
      { d: 7.23, e: 2228 },
      { d: 7.29, e: 2232 },
      { d: 7.35, e: 2238 },
      { d: 7.43, e: 2246 },
      { d: 7.47, e: 2250 },
      { d: 7.52, e: 2255 },
      { d: 7.55, e: 2260 },
      { d: 7.58, e: 2265 },
      { d: 7.62, e: 2271 },
      { d: 7.73, e: 2286 },
      { d: 7.77, e: 2294 },
      { d: 7.83, e: 2303 },
      { d: 7.9, e: 2314 },
      { d: 8.05, e: 2334 },
      { d: 8.12, e: 2341 },
      { d: 8.35, e: 2341 },
    ],
  },
  {
    stageNumber: 9,
    stageId: "e9",
    distanceKm: 5.7,
    ascentM: 662,
    descentM: 621,
    profile: [
      { d: 0.0, e: 2402 },
      { d: 0.09, e: 2402 },
      { d: 0.13, e: 2411 },
      { d: 0.23, e: 2440 },
      { d: 0.33, e: 2468 },
      { d: 0.42, e: 2490 },
      { d: 0.51, e: 2512 },
      { d: 0.62, e: 2531 },
      { d: 0.71, e: 2549 },
      { d: 0.81, e: 2572 },
      { d: 0.89, e: 2590 },
      { d: 0.96, e: 2606 },
      { d: 1.06, e: 2630 },
      { d: 1.18, e: 2654 },
      { d: 1.28, e: 2672 },
      { d: 1.42, e: 2692 },
      { d: 1.53, e: 2706 },
      { d: 1.61, e: 2717 },
      { d: 1.71, e: 2729 },
      { d: 1.81, e: 2757 },
      { d: 1.87, e: 2771 },
      { d: 1.97, e: 2806 },
      { d: 2.02, e: 2824 },
      { d: 2.12, e: 2857 },
      { d: 2.22, e: 2891 },
      { d: 2.27, e: 2909 },
      { d: 2.34, e: 2930 },
      { d: 2.42, e: 2952 },
      { d: 2.5, e: 2976 },
      { d: 2.57, e: 2997 },
      { d: 2.64, e: 3020 },
      { d: 2.71, e: 3042 },
      { d: 2.78, e: 3051 },
      { d: 2.82, e: 3055 },
      { d: 2.87, e: 3062 },
      { d: 2.89, e: 3064 },
      { d: 2.94, e: 3057 },
      { d: 2.99, e: 3047 },
      { d: 3.06, e: 3030 },
      { d: 3.15, e: 3005 },
      { d: 3.24, e: 2977 },
      { d: 3.33, e: 2951 },
      { d: 3.4, e: 2930 },
      { d: 3.49, e: 2902 },
      { d: 3.62, e: 2857 },
      { d: 3.72, e: 2823 },
      { d: 3.82, e: 2789 },
      { d: 3.9, e: 2762 },
      { d: 3.96, e: 2750 },
      { d: 4.03, e: 2732 },
      { d: 4.11, e: 2717 },
      { d: 4.21, e: 2706 },
      { d: 4.26, e: 2700 },
      { d: 4.32, e: 2693 },
      { d: 4.42, e: 2678 },
      { d: 4.5, e: 2665 },
      { d: 4.56, e: 2654 },
      { d: 4.68, e: 2631 },
      { d: 4.78, e: 2607 },
      { d: 4.85, e: 2589 },
      { d: 4.93, e: 2570 },
      { d: 4.99, e: 2558 },
      { d: 5.03, e: 2550 },
      { d: 5.12, e: 2531 },
      { d: 5.18, e: 2519 },
      { d: 5.23, e: 2510 },
      { d: 5.31, e: 2495 },
      { d: 5.41, e: 2467 },
      { d: 5.51, e: 2443 },
      { d: 5.74, e: 2443 },
    ],
  },
  {
    stageNumber: 10,
    stageId: "e10",
    distanceKm: 5.6,
    ascentM: 698,
    descentM: 385,
    profile: [
      { d: 0.0, e: 2402 },
      { d: 0.09, e: 2402 },
      { d: 0.13, e: 2411 },
      { d: 0.23, e: 2440 },
      { d: 0.33, e: 2468 },
      { d: 0.42, e: 2490 },
      { d: 0.51, e: 2512 },
      { d: 0.62, e: 2531 },
      { d: 0.71, e: 2549 },
      { d: 0.81, e: 2572 },
      { d: 0.89, e: 2590 },
      { d: 0.96, e: 2606 },
      { d: 1.06, e: 2630 },
      { d: 1.18, e: 2654 },
      { d: 1.28, e: 2672 },
      { d: 1.42, e: 2692 },
      { d: 1.53, e: 2706 },
      { d: 1.61, e: 2717 },
      { d: 1.71, e: 2729 },
      { d: 1.81, e: 2757 },
      { d: 1.87, e: 2771 },
      { d: 1.97, e: 2806 },
      { d: 2.02, e: 2824 },
      { d: 2.12, e: 2857 },
      { d: 2.22, e: 2891 },
      { d: 2.27, e: 2909 },
      { d: 2.34, e: 2930 },
      { d: 2.42, e: 2952 },
      { d: 2.5, e: 2976 },
      { d: 2.57, e: 2997 },
      { d: 2.64, e: 3020 },
      { d: 2.71, e: 3042 },
      { d: 2.78, e: 3053 },
      { d: 2.84, e: 3062 },
      { d: 2.94, e: 3071 },
      { d: 3.08, e: 3071 },
      { d: 3.16, e: 3065 },
      { d: 3.27, e: 3053 },
      { d: 3.34, e: 3041 },
      { d: 3.41, e: 3022 },
      { d: 3.48, e: 3005 },
      { d: 3.54, e: 2992 },
      { d: 3.61, e: 2977 },
      { d: 3.69, e: 2958 },
      { d: 3.76, e: 2943 },
      { d: 3.82, e: 2927 },
      { d: 3.9, e: 2908 },
      { d: 3.98, e: 2894 },
      { d: 4.07, e: 2877 },
      { d: 4.21, e: 2855 },
      { d: 4.33, e: 2835 },
      { d: 4.44, e: 2817 },
      { d: 4.52, e: 2800 },
      { d: 4.55, e: 2794 },
      { d: 4.61, e: 2781 },
      { d: 4.69, e: 2763 },
      { d: 4.76, e: 2751 },
      { d: 4.82, e: 2740 },
      { d: 4.9, e: 2726 },
      { d: 4.97, e: 2716 },
      { d: 5.04, e: 2706 },
      { d: 5.08, e: 2700 },
      { d: 5.13, e: 2695 },
      { d: 5.23, e: 2689 },
      { d: 5.29, e: 2686 },
      { d: 5.37, e: 2697 },
      { d: 5.45, e: 2709 },
      { d: 5.5, e: 2715 },
      { d: 5.64, e: 2716 },
    ],
  },
  {
    stageNumber: 11,
    stageId: "e11",
    distanceKm: 13.9,
    ascentM: 916,
    descentM: 517,
    profile: [
      { d: 0.0, e: 2725 },
      { d: 0.1, e: 2724 },
      { d: 0.19, e: 2706 },
      { d: 0.28, e: 2688 },
      { d: 0.39, e: 2664 },
      { d: 0.5, e: 2644 },
      { d: 0.79, e: 2627 },
      { d: 1.07, e: 2628 },
      { d: 1.45, e: 2632 },
      { d: 1.77, e: 2630 },
      { d: 2.02, e: 2631 },
      { d: 2.22, e: 2635 },
      { d: 2.44, e: 2628 },
      { d: 2.91, e: 2604 },
      { d: 3.67, e: 2616 },
      { d: 4.04, e: 2610 },
      { d: 4.25, e: 2569 },
      { d: 4.51, e: 2521 },
      { d: 4.64, e: 2490 },
      { d: 4.91, e: 2415 },
      { d: 5.06, e: 2379 },
      { d: 5.17, e: 2357 },
      { d: 5.33, e: 2326 },
      { d: 5.51, e: 2298 },
      { d: 5.68, e: 2299 },
      { d: 5.83, e: 2320 },
      { d: 5.96, e: 2345 },
      { d: 6.1, e: 2378 },
      { d: 6.25, e: 2404 },
      { d: 6.4, e: 2421 },
      { d: 6.53, e: 2434 },
      { d: 6.69, e: 2453 },
      { d: 6.85, e: 2468 },
      { d: 7.12, e: 2488 },
      { d: 7.29, e: 2501 },
      { d: 7.5, e: 2524 },
      { d: 7.67, e: 2546 },
      { d: 7.86, e: 2571 },
      { d: 8.09, e: 2595 },
      { d: 8.51, e: 2635 },
      { d: 8.79, e: 2668 },
      { d: 9.42, e: 2739 },
      { d: 9.68, e: 2764 },
      { d: 9.86, e: 2782 },
      { d: 10.01, e: 2796 },
      { d: 10.09, e: 2803 },
      { d: 10.32, e: 2824 },
      { d: 10.57, e: 2834 },
      { d: 10.7, e: 2835 },
      { d: 10.95, e: 2834 },
      { d: 11.09, e: 2831 },
      { d: 11.28, e: 2821 },
      { d: 11.4, e: 2811 },
      { d: 11.6, e: 2791 },
      { d: 11.74, e: 2779 },
      { d: 11.95, e: 2778 },
      { d: 12.07, e: 2788 },
      { d: 12.17, e: 2806 },
      { d: 12.28, e: 2831 },
      { d: 12.34, e: 2845 },
      { d: 12.45, e: 2871 },
      { d: 12.57, e: 2902 },
      { d: 12.63, e: 2920 },
      { d: 12.72, e: 2944 },
      { d: 12.83, e: 2969 },
      { d: 13.06, e: 3008 },
      { d: 13.29, e: 3049 },
      { d: 13.42, e: 3072 },
      { d: 13.53, e: 3092 },
      { d: 13.69, e: 3122 },
      { d: 13.78, e: 3124 },
      { d: 13.91, e: 3124 },
    ],
  },
  {
    stageNumber: 12,
    stageId: "e12",
    distanceKm: 12.6,
    ascentM: 368,
    descentM: 1045,
    profile: [
      { d: 0.0, e: 1206 },
      { d: 0.17, e: 1211 },
      { d: 0.31, e: 1221 },
      { d: 0.62, e: 1265 },
      { d: 0.9, e: 1294 },
      { d: 1.24, e: 1335 },
      { d: 1.67, e: 1366 },
      { d: 1.86, e: 1377 },
      { d: 2.12, e: 1370 },
      { d: 2.5, e: 1374 },
      { d: 2.64, e: 1396 },
      { d: 2.82, e: 1418 },
      { d: 3.15, e: 1433 },
      { d: 3.36, e: 1443 },
      { d: 3.58, e: 1443 },
      { d: 3.72, e: 1452 },
      { d: 3.88, e: 1469 },
      { d: 4.07, e: 1487 },
      { d: 4.24, e: 1478 },
      { d: 4.62, e: 1447 },
      { d: 4.9, e: 1417 },
      { d: 5.16, e: 1399 },
      { d: 5.33, e: 1400 },
      { d: 5.56, e: 1417 },
      { d: 5.74, e: 1435 },
      { d: 5.93, e: 1446 },
      { d: 6.11, e: 1449 },
      { d: 6.36, e: 1434 },
      { d: 6.53, e: 1399 },
      { d: 6.74, e: 1348 },
      { d: 7.08, e: 1303 },
      { d: 7.25, e: 1270 },
      { d: 7.56, e: 1220 },
      { d: 7.78, e: 1169 },
      { d: 7.92, e: 1134 },
      { d: 8.1, e: 1091 },
      { d: 8.2, e: 1064 },
      { d: 8.41, e: 1018 },
      { d: 8.71, e: 964 },
      { d: 8.91, e: 934 },
      { d: 9.1, e: 909 },
      { d: 9.31, e: 863 },
      { d: 9.45, e: 832 },
      { d: 9.63, e: 792 },
      { d: 9.85, e: 744 },
      { d: 10.0, e: 723 },
      { d: 10.28, e: 714 },
      { d: 10.51, e: 720 },
      { d: 10.71, e: 709 },
      { d: 11.04, e: 662 },
      { d: 11.22, e: 622 },
      { d: 11.38, e: 591 },
      { d: 11.62, e: 559 },
      { d: 11.91, e: 534 },
      { d: 12.06, e: 530 },
      { d: 12.39, e: 528 },
      { d: 12.62, e: 529 },
    ],
  },
];

// ─── Tour summary (auto-computed from stage data) ──────────────────────────

export const TOUR_SUMMARY = TOUR_STAGES_DATA.reduce(
  (acc, stage) => ({
    totalDistanceKm: acc.totalDistanceKm + stage.distanceKm,
    totalAscentM: acc.totalAscentM + stage.ascentM,
    totalDescentM: acc.totalDescentM + stage.descentM,
  }),
  { totalDistanceKm: 0, totalAscentM: 0, totalDescentM: 0 },
);

// ─── Tooltip ──────────────────────────────────────────────────────────────────

interface TooltipPayloadItem {
  value: number;
  payload: MergedPoint;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

function TourTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const { d, e, stageNumber } = payload[0].payload;
  return (
    <div
      className="rounded-lg border border-border bg-card px-3 py-2 shadow-md"
      style={{ boxShadow: "0 2px 12px oklch(var(--foreground) / 0.08)" }}
    >
      <p className="text-xs font-semibold tracking-wide text-primary uppercase mb-1">
        Etappe {stageNumber}
      </p>
      <p className="text-sm font-bold font-display text-foreground leading-snug">
        {e.toLocaleString("de-DE")} m ü.d.M.
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">
        {d.toLocaleString("de-DE", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 2,
        })}{" "}
        km (gesamt)
      </p>
    </div>
  );
}

// ─── Stage divider label ──────────────────────────────────────────────────────

interface DividerLabelProps {
  viewBox?: { x?: number; y?: number; width?: number; height?: number };
  label: string;
  onClick: () => void;
}

function StageDividerLabel({ viewBox, label, onClick }: DividerLabelProps) {
  const x = viewBox?.x ?? 0;
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <g
      style={{ cursor: "pointer" }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      <rect
        x={x - 14}
        y={4}
        width={28}
        height={18}
        rx={4}
        fill="oklch(var(--card))"
        stroke="oklch(var(--border))"
        strokeWidth={1}
      />
      <text
        x={x}
        y={16}
        textAnchor="middle"
        fontSize={9}
        fontWeight={700}
        fontFamily="var(--font-display)"
        fill="oklch(var(--primary))"
        letterSpacing="0.05em"
      >
        {label}
      </text>
    </g>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

const CHART_MARGIN = { top: 28, right: 8, left: 0, bottom: 4 };
const YAXIS_WIDTH = 52;

export function TourElevationProfile() {
  const router = useRouter();

  // Build cumulative stage boundaries for navigation
  const stageBoundaries = useMemo(() => {
    const boundaries: { stageNumber: number; start: number; end: number }[] =
      [];
    let cumulative = 0;
    for (const stage of TOUR_STAGES_DATA) {
      boundaries.push({
        stageNumber: stage.stageNumber,
        start: cumulative,
        end: cumulative + stage.distanceKm,
      });
      cumulative += stage.distanceKm;
    }
    return boundaries;
  }, []);

  // Build merged profile: offset each stage's points by cumulative distance
  const mergedProfile = useMemo<MergedPoint[]>(() => {
    const points: MergedPoint[] = [];
    let cumulative = 0;
    for (const stage of TOUR_STAGES_DATA) {
      for (const pt of stage.profile) {
        points.push({
          d: Math.round((pt.d + cumulative) * 100) / 100,
          e: pt.e,
          stageNumber: stage.stageNumber,
        });
      }
      cumulative += stage.distanceKm;
    }
    return points;
  }, []);

  const totalDistance = stageBoundaries[stageBoundaries.length - 1]?.end ?? 0;

  const elevationDomain = useMemo<[number, number]>(() => {
    const elevations = mergedProfile.map((p) => p.e);
    const minE = Math.min(...elevations);
    const maxE = Math.max(...elevations);
    const pad = (maxE - minE) * 0.08;
    return [
      Math.floor((minE - pad) / 100) * 100,
      Math.ceil((maxE + pad) / 100) * 100,
    ];
  }, [mergedProfile]);

  // Divider lines at stage boundaries (between stages — not after the last one)
  const dividerPositions = useMemo(
    () => stageBoundaries.slice(0, -1).map((b) => b.end),
    [stageBoundaries],
  );

  // Determine which stage a click belongs to
  const handleChartClick = (chartData: {
    activePayload?: TooltipPayloadItem[];
  }) => {
    if (!chartData?.activePayload?.length) return;
    const { stageNumber } = chartData.activePayload[0].payload;
    router.navigate({ to: `/etappe/${stageNumber}` });
  };

  return (
    <div data-ocid="tour-elevation-profile">
      <ResponsiveContainer width="100%" height={280} className="sm:!h-[350px]">
        <AreaChart
          data={mergedProfile}
          margin={CHART_MARGIN}
          onClick={handleChartClick}
          style={{ cursor: "pointer" }}
        >
          <defs>
            <linearGradient
              id="tourProfileGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="oklch(var(--primary))"
                stopOpacity={0.35}
              />
              <stop
                offset="95%"
                stopColor="oklch(var(--primary))"
                stopOpacity={0.04}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="oklch(var(--border))"
            vertical={false}
          />

          <XAxis
            dataKey="d"
            type="number"
            domain={[0, totalDistance]}
            tickCount={10}
            tickFormatter={(v: number) => `${v}`}
            label={{
              value: "Distanz (km)",
              position: "insideBottom",
              offset: -2,
              fontSize: 11,
              fill: "oklch(var(--muted-foreground))",
              fontFamily: "var(--font-body)",
            }}
            tick={{
              fontSize: 11,
              fill: "oklch(var(--muted-foreground))",
              fontFamily: "var(--font-body)",
            }}
            tickLine={false}
            axisLine={{ stroke: "oklch(var(--border))" }}
            height={44}
          />

          <YAxis
            domain={elevationDomain}
            tickFormatter={(v: number) => `${v}`}
            label={{
              value: "Höhe (m)",
              angle: -90,
              position: "insideLeft",
              offset: 14,
              fontSize: 11,
              fill: "oklch(var(--muted-foreground))",
              fontFamily: "var(--font-body)",
            }}
            tick={{
              fontSize: 11,
              fill: "oklch(var(--muted-foreground))",
              fontFamily: "var(--font-body)",
            }}
            tickLine={false}
            axisLine={false}
            width={YAXIS_WIDTH}
          />

          <Tooltip
            content={<TourTooltip />}
            cursor={{
              stroke: "oklch(var(--primary))",
              strokeWidth: 1,
              strokeDasharray: "4 2",
            }}
          />

          <Area
            type="monotone"
            dataKey="e"
            stroke="oklch(var(--primary))"
            strokeWidth={2.5}
            fill="url(#tourProfileGradient)"
            dot={false}
            activeDot={{
              r: 5,
              fill: "oklch(var(--primary))",
              stroke: "oklch(var(--card))",
              strokeWidth: 2,
            }}
          />

          {/* Stage divider lines */}
          {dividerPositions.map((xPos, idx) => (
            <ReferenceLine
              key={xPos}
              x={xPos}
              stroke="oklch(var(--primary) / 0.35)"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              label={
                <StageDividerLabel
                  label={`E${TOUR_STAGES_DATA[idx].stageNumber}`}
                  onClick={() =>
                    router.navigate({
                      to: `/etappe/${TOUR_STAGES_DATA[idx].stageNumber}`,
                    })
                  }
                />
              }
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>

      {/* Stage legend below chart */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 px-2 justify-center">
        {TOUR_STAGES_DATA.map((stage) => (
          <button
            key={stage.stageId}
            type="button"
            onClick={() =>
              router.navigate({ to: `/etappe/${stage.stageNumber}` })
            }
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors duration-150"
            data-ocid={`tour-legend-${stage.stageId}`}
          >
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm opacity-70"
              style={{ background: "oklch(var(--primary))" }}
            />
            <span className="font-semibold text-primary">
              E{stage.stageNumber}
            </span>
            <span>{stage.distanceKm} km</span>
          </button>
        ))}
      </div>
    </div>
  );
}
