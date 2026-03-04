# 🔍 디시인사이드 식별코드 & IP 검색기 (Deep Scan)

디시인사이드 갤러리 이용 시 고정닉/반고닉의 **식별코드(UID)**나 유동 유저의 **IP**를 기반으로 작성글을 빠르게 추적할 수 있도록 도와주는 유저스크립트입니다.

---

## ✨ 주요 기능

### 1. 닉네임 클릭 메뉴 통합
게시판 목록이나 본문에서 유저의 닉네임을 클릭하면 나타나는 메뉴에 검색 버튼이 자동 주입됩니다. 유저의 상태에 따라 버튼 이름이 유동적으로 변합니다.

| 고정닉/반고닉 검색 | 유동 IP 검색 |
| :---: | :---: |
| ![식별코드 검색](https://raw.githubusercontent.com/mabinewb/dc-id-search-script/main/images/code_search.png) | ![IP 검색](https://raw.githubusercontent.com/mabinewb/dc-id-search-script/main/images/ip_search.png) |

### 2. 검색창 옵션 추가
하단 검색창 드롭다운 메뉴에 **'식별코드/IP'** 항목이 추가되어 직접 입력 검색이 가능해집니다.

![검색창 옵션](https://raw.githubusercontent.com/mabinewb/dc-id-search-script/main/images/searchbox.png)

### 3. 강력한 연속 스캔
* **30페이지 딥 스캔**: 한 번의 클릭으로 과거 30페이지 분량의 게시글을 백그라운드에서 스캔합니다.
* **본문-목록 연동**: 게시글 본문(`view`)에서 검색을 실행해도 자동으로 목록(`lists`) 페이지로 이동하여 결과를 보여줍니다.
* **무한 탐색**: 스캔 완료 후 하단 버튼을 클릭하여 계속해서 다음 30페이지를 검색할 수 있습니다.

---

## 🚀 설치 방법

1. **사전 준비**: 브라우저에 **Tampermonkey** 확장 프로그램이 설치되어 있어야 합니다.
   - [Chrome용 설치](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) / [Edge용 설치](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpcndfhdbmhlgdicjfibjmocne)
2. **스크립트 설치**: 아래 링크를 클릭하여 설치 화면으로 이동한 뒤 **'설치(Install)'** 버튼을 누르세요.
   - [👉 스크립트 설치하기 (GitHub Direct)](https://raw.githubusercontent.com/mabinewb/dc-id-search-script/main/dc_search.user.js)

---

## 🛠 업데이트 및 지원

이 스크립트는 GitHub를 통해 **자동 업데이트**를 지원합니다. 별도의 사이트 방문 없이도 새로운 기능이 추가되거나 오류가 수정되면 브라우저에서 자동으로 업데이트 알림이 갑니다.

* **제작자**: [uid1000](https://github.com/mabinewb)
* **저장소**: [GitHub Repository](https://github.com/mabinewb/dc-id-search-script)
* **버그 제보**: [GitHub Issues](https://github.com/mabinewb/dc-id-search-script/issues)

---
© 2026 uid1000. MIT License.
