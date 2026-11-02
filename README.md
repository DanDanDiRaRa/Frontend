# 기억의 좌표 Frontend

대구·경북 지역 기억 아카이브 서비스의 프론트엔드 레포입니다. (모바일 웹)

## 실행 방법
1. 레포 받기: `git clone https://github.com/DanDanDiRaRa/Frontend.git`
2. 폴더 이동: `cd Frontend`
3. 라이브러리 설치: `npm install`
4. 개발 서버 실행: `npm run dev`
5. 브라우저에서 `http://localhost:5173/` 접속

## 폴더 구조
- `src/pages` : 화면 (S01~S20)
- `src/components` : 공통 컴포넌트 (Button, Input, Card, Layout, BottomTab)
- `src/styles` : 공통 스타일
- `src/api` : 백엔드 통신 코드 (예정)

## 협업 규칙
- 작업 전에 `git pull` 먼저
- 새 기능은 브랜치를 만들어서 작업 (예: `feature/map`)