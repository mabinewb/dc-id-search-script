// ==UserScript==
// @name         디시인사이드 식별코드 & IP 검색기 (Deep Scan)
// @namespace    https://github.com/mabinewb/dc-id-search-script
// @version      2.8
// @description  닉네임 클릭 메뉴와 검색창에 식별코드(UID) 및 IP 검색 옵션을 추가하고, 30페이지씩 연속 스캔합니다. (결과 메시지 버그 수정)
// @author       uid1000
// @homepage     https://github.com/mabinewb/dc-id-search-script
// @supportURL   https://github.com/mabinewb/dc-id-search-script/issues
// @downloadURL  https://raw.githubusercontent.com/mabinewb/dc-id-search-script/main/dc_search.user.js
// @updateURL    https://raw.githubusercontent.com/mabinewb/dc-id-search-script/main/dc_search.user.js
// @match        https://gall.dcinside.com/board/lists/*
// @match        https://gall.dcinside.com/mgallery/board/lists/*
// @match        https://gall.dcinside.com/mini/board/lists/*
// @match        https://gall.dcinside.com/board/view/*
// @match        https://gall.dcinside.com/mgallery/board/view/*
// @match        https://gall.dcinside.com/mini/board/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dcinside.com
// @license      MIT
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let currentScanPage = 1;
    let isScanning = false;
    const SCAN_STEP = 30;

    function init() {
        if (isScanning) return;
        const urlParams = new URLSearchParams(window.location.search);
        const queryFromUrl = urlParams.get('uid_search');
        if (queryFromUrl && window.location.pathname.includes('/lists')) {
            executeInstantSearch(queryFromUrl);
        }
        injectSearchType();
        injectUserMenu();
    }

    function injectSearchType() {
        const typeLayer = document.querySelector('#searchTypeLayer');
        const typeTxt = document.querySelector('#search_type_txt');
        if (!typeLayer || !typeTxt || typeLayer.querySelector('.id-filter-item')) return;
        const idLi = document.createElement('li');
        idLi.className = 'id-filter-item';
        idLi.innerText = '식별코드/IP';
        idLi.style.cursor = 'pointer';
        idLi.onclick = () => {
            typeTxt.innerText = '식별코드/IP';
            typeTxt.setAttribute('data-opt', 'user_id_filter');
            typeLayer.style.display = 'none';
        };
        typeLayer.appendChild(idLi);
    }

    function injectUserMenu() {
        const userLayers = document.querySelectorAll('#user_data_lyr');
        userLayers.forEach(layer => {
            if (layer.style.display !== 'none' && !layer.querySelector('.custom-id-search')) {
                const parentTd = layer.closest('.ub-writer') || layer.closest('.writer_mainbox');
                const uid = parentTd ? parentTd.getAttribute('data-uid') : '';
                const ip = parentTd ? parentTd.getAttribute('data-ip') : '';
                const targetValue = uid || ip;
                const menuList = layer.querySelector('.user_data_list');
                if (targetValue && menuList) {
                    const searchLi = document.createElement('li');
                    searchLi.className = 'bg_grey custom-id-search';
                    searchLi.innerHTML = `<a href="javascript:;" style="color:#292e59; font-weight:bold;">${uid ? '식별코드' : 'IP'} 검색<em class="sp_img icon_go"></em></a>`;
                    searchLi.onclick = (e) => { e.preventDefault(); handleSearchRedirection(targetValue); };
                    menuList.appendChild(searchLi);
                }
            }
        });
    }

    function handleSearchRedirection(val) {
        if (window.location.pathname.includes('/lists')) {
            executeInstantSearch(val);
        } else {
            const gallId = new URLSearchParams(window.location.search).get('id');
            const listUrl = window.location.origin + window.location.pathname.replace('/view/', '/lists/');
            window.location.href = `${listUrl}?id=${gallId}&uid_search=${encodeURIComponent(val)}`;
        }
    }

    function executeInstantSearch(val) {
        if (isScanning) return;
        const searchInput = document.querySelector('input[name="search_keyword"]');
        const typeTxt = document.querySelector('#search_type_txt');
        if (searchInput && typeTxt) {
            searchInput.value = val;
            typeTxt.innerText = '식별코드/IP';
            typeTxt.setAttribute('data-opt', 'user_id_filter');
            const newUrl = window.location.pathname + window.location.search.replace(/&uid_search=[^&]*/, '');
            window.history.replaceState({}, '', newUrl);
            currentScanPage = 1;
            startDeepSearch(val, true);
        }
    }

    async function startDeepSearch(query, isNewSearch) {
        const listTable = document.querySelector('.gall_list tbody');
        if (!listTable || (isScanning && isNewSearch)) return;

        isScanning = true;
        if (isNewSearch) {
            listTable.innerHTML = `<tr class="scan-msg"><td colspan="5" style="padding:50px; text-align:center;">[${query}] 스캔 중... (1~${SCAN_STEP}페이지)</td></tr>`;
            removeNextButton();
        }

        const gallId = new URLSearchParams(window.location.search).get('id');
        const baseUrl = window.location.origin + window.location.pathname.replace('/view/', '/lists/');
        let foundRows = [];
        const endPage = currentScanPage + SCAN_STEP;

        try {
            while (currentScanPage < endPage) {
                const response = await fetch(`${baseUrl}?id=${gallId}&page=${currentScanPage}`);
                if (!response.ok) break;
                const text = await response.text();
                const doc = new DOMParser().parseFromString(text, 'text/html');
                doc.querySelectorAll('tr.ub-content').forEach(row => {
                    const writer = row.querySelector('.gall_writer.ub-writer');
                    const rowUid = writer?.getAttribute('data-uid') || '';
                    const rowIp = writer?.getAttribute('data-ip') || '';
                    if (rowUid.toLowerCase() === query.toLowerCase() || rowIp === query) {
                        row.style.backgroundColor = 'rgba(255, 235, 59, 0.1)';
                        foundRows.push(row.cloneNode(true));
                    }
                });
                currentScanPage++;
            }

            // 기존 안내 메시지(스캔 중, 결과 없음 등)를 삭제
            const oldMsgs = listTable.querySelectorAll('.scan-msg');
            oldMsgs.forEach(m => m.remove());

            if (isNewSearch) listTable.innerHTML = '';
            removeNextButton();

            foundRows.forEach(row => listTable.appendChild(row));

            if (foundRows.length === 0 && listTable.querySelectorAll('tr.ub-content').length === 0) {
                const noResultRow = document.createElement('tr');
                noResultRow.className = 'scan-msg';
                noResultRow.innerHTML = `<td colspan="5" style="padding:50px; text-align:center;">해당 범위 내에 검색 결과가 없습니다.</td>`;
                listTable.appendChild(noResultRow);
            }
            renderNextButton(query);
        } catch (e) { 
            console.error(e); 
        } finally {
            isScanning = false;
        }
    }

    function renderNextButton(query) {
        const listTable = document.querySelector('.gall_list tbody');
        if (!listTable || document.querySelector('#scan_status_row')) return;
        const nextRow = document.createElement('tr');
        nextRow.id = "scan_status_row";
        nextRow.innerHTML = `<td colspan="5" style="padding:20px; text-align:center; background:#f9f9f9; border-top:1px solid #ddd;">
            <button id="btn_scan_more" style="padding:10px 25px; cursor:pointer; background:#292e59; color:white; border:none; border-radius:4px; font-weight:bold;">
                다음 ${SCAN_STEP}페이지 더 검색하기 (현재 ${currentScanPage-1}p 완료)
            </button></td>`;
        listTable.appendChild(nextRow);
        document.querySelector('#btn_scan_more').onclick = () => startDeepSearch(query, false);
    }

    function removeNextButton() { const old = document.querySelector('#scan_status_row'); if (old) old.remove(); }

    window.originalSearch = window.search;
    window.search = function(p) {
        const typeTxt = document.querySelector('#search_type_txt');
        if (typeTxt?.getAttribute('data-opt') === 'user_id_filter') {
            const input = document.querySelector('input[name="search_keyword"]');
            if (input?.value.trim()) { handleSearchRedirection(input.value.trim()); return false; }
        }
        return window.originalSearch ? window.originalSearch(p) : null;
    };

    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.addedNodes.length) {
                injectSearchType();
                injectUserMenu();
                break;
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    init();
})();
