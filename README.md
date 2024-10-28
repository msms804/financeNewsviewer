# MINVEST

## 1. 프로젝트 소개
뉴욕타임즈API를 활용하여 주식관련 뉴스를 한국어로 번역해서 보여주고, 나의 관심종목 맞춤뉴스들도 제공하는 서비스

## 2. 기능 영상

## 3. 기술 스택
<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
<img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
<img src="https://img.shields.io/badge/redux-764ABC?style=for-the-badge&logo=redux&logoColor=white"/>
<img src="https://img.shields.io/badge/reactquery-FF4154?style=for-the-badge&logo=reactquery&logoColor=white"/>
<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/firebase-DD2C00?style=for-the-badge&logo=firebase&logoColor=white"/>  

## 4. 주요 기능
* 뉴스기사 무한스크롤
* gpt api 이용하여 뉴스 한국어로 번역
* gpt api 이용하여 뉴스의 호재 / 악재 분석
* 관심 주식 저장
* 관심종목 관련 뉴스 제공
* 다크모드 (로컬스토리지 저장)  
## 5. 아키텍처

## 6. 최적화
* react-window를 이용하여 렌더링시 보이는 주식만 DOM에 표시
* React.memo로 불필요한 리렌더링 개선
* useCallback, 으로 메모이제이션
* API 캐싱 이용하여 API 호출수 감소(staleTime , gcTime)
* 스크롤시 redux에  전역상태로 번역된 기사 저장하여 openai api 호출 줄임
* 무한스크롤시 throttle, backoff 적용하여 사용자 경험 개선(rate limit이 있어서)
