// ==UserScript==
// @name         灵界时辰天道罗盘
// @namespace    http://tampermonkey.net/
// @version      20.8.7
// @description  拟物交互视觉流体玉莹无界版。彻底去除灵珠内部生硬的次级小圈边界与暗纹，使四象流体彻底融汇，真言透视更显空灵。
// @author       修仙道友
// @match        https://ling.muge.info/game.html
// @match        http://ling.muge.info/game.html
// @icon         https://ling.muge.info/favicon.svg
// @updateURL    https://raw.githubusercontent.com/xiaolanglu/Spiritual-script/main/ling-pet-compass.user.js
// @downloadURL  https://raw.githubusercontent.com/xiaolanglu/Spiritual-script/main/ling-pet-compass.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 引入云端古法篆书字体
    const FONT_LINK = document.createElement('link');
    FONT_LINK.href = 'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght=700;900&display=swap'; 
    document.head.appendChild(FONT_LINK);

    const AMBIENT_FONT = `
        @font-face {
            font-family: 'ShuowenZuan';
            src: url('https://cdn.jsdelivr.net/gh/scandrial/scandrial.github.io/fonts/Shuowen.ttf') format('truetype'),
                 local('FZShuTi'), local('LiSu'), local('KaiTi');
            font-display: swap;
        }
    `;
    const fontStyleNode = document.createElement('style');
    fontStyleNode.textContent = AMBIENT_FONT;
    document.head.appendChild(fontStyleNode);

    // ================= 1. 流体玉莹 CSS 大阵 =================
    const STYLES = `
        :root {
            /* 交互联动变量群 */
            --ling-light-x: 45%;
            --ling-light-y: 45%;
            --ling-shadow-x: 0px;
            --ling-shadow-y: 6px;
            --ling-shadow-blur: 20px;
            --ling-shadow-opacity: 0.35;
            
            /* 动态界域变量底层 */
            --ling-inset-border-color: rgba(44, 53, 62, 0.2);
            --ling-jade-bg-color: #f4f3f0;
            --ling-jade-glint: rgba(255, 255, 255, 0.7);
            --ling-stream-bg: linear-gradient(90deg, #eae8e3, #fcfbf9, #cbd5e1, #eae8e3);
            --ling-blend-mode: screen; 
            
            /* 四象流体灵液核心色轨配置 */
            --fluid-prime-color: radial-gradient(circle at 30% 30%, rgba(147,197,253,0.8) 0%, transparent 65%);
            --fluid-sub-color: radial-gradient(circle at 70% 70%, rgba(191,219,254,0.6) 0%, transparent 60%);
        }

        /* 1. 法宝大圆主体 */
        .ling-pet-compass {
            position: fixed;
            top: 85px; right: 20px; z-index: 10000;
            width: 44px; height: 44px; border-radius: 50%;
            cursor: move; user-select: none; box-sizing: border-box;
            backdrop-filter: blur(8px) saturate(160%);
            -webkit-backdrop-filter: blur(8px) saturate(160%);
            
            background: var(--ling-stream-bg);
            background-size: 300% 100%;
            
            box-shadow: 
                var(--ling-shadow-x) var(--ling-shadow-y) var(--ling-shadow-blur) rgba(0, 0, 0, var(--ling-shadow-opacity)),
                inset -2px -2px 6px rgba(0, 0, 0, 0.4),
                inset 0px 0px 0px 1px rgba(255, 255, 255, 0.2),
                inset 0px 0px 4px 3px rgba(0, 0, 0, 0.35),               
                inset 0px 0px 2px 3px var(--ling-inset-border-color);   

            border: 1px dashed rgba(255, 255, 255, 0.08); 
            opacity: 1 !important; 
            transform: scale(1);
            animation: lingStreamMove 16s linear infinite;
            
            transition: box-shadow 0.35s cubic-bezier(0.25, 1, 0.5, 1),
                        transform 0.4s cubic-bezier(0.25, 1, 0.36, 1);
        }

        /* __aura 护体灵气环层 */
        .ling-pet-compass__aura {
            position: absolute; top: -5px; left: -5px; right: -5px; bottom: -5px; border-radius: 50%;
            background: var(--ling-stream-bg); background-size: 300% 100%;
            opacity: 0.15; filter: blur(12px); z-index: -2; pointer-events: none;
            animation: lingStreamMove 16s linear infinite;
            transition: opacity 0.45s cubic-bezier(0.25, 1, 0.5, 1);
        }

        /* 2. __core 灵玉核心层（重铸：去除次级小圈阴影与网格暗纹，全面莹澈化） */
        .ling-pet-compass__core {
            position: absolute; top: 6px; left: 6px; right: 6px; bottom: 6px;
            border-radius: 50%; z-index: 5; box-sizing: border-box; overflow: hidden;
            background-color: var(--ling-jade-bg-color);
            /* 抹除原有小圈边界线与背景粒子，使流体无界融合 */
            box-shadow: 
                inset 1.5px 1.5px 3px var(--ling-jade-glint), 
                inset -1.5px -1.5px 3px rgba(0, 0, 0, 0.3); 
            transition: background-color 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* 核心上空真玉镜面轻微掠影 */
        .ling-pet-compass__core::after {
            content: ''; position: absolute; top: 0; left: 0; width: 200%; height: 100%;
            z-index: 8; pointer-events: none;
            background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 60%, transparent 100%);
            transform: skewX(-45deg); animation: lingJadeGlint 8s cubic-bezier(0.25, 1, 0.5, 1) infinite;
        }

        /* 双层流体玉莹大阵 */
        .ling-pet-compass__fluid-container {
            position: absolute; top: -10%; left: -10%; right: -10%; bottom: -10%;
            border-radius: 50%; opacity: 0; z-index: 2; pointer-events: none;
            mix-blend-mode: var(--ling-blend-mode); filter: blur(1px); 
            transition: opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ling-pet-compass__fluid-container.active { opacity: 1; }

        /* 主流体层 */
        .ling-pet-compass__fluid-prime {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 50%;
            background-image: var(--fluid-prime-color);
            background-size: 140% 140%;
            transform-origin: center center;
            --mask-x: var(--ling-light-x); --mask-y: var(--ling-light-y);
            animation: lingVortexPrime 11s cubic-bezier(0.37, 0, 0.63, 1) infinite;
        }

        /* 次流体层 */
        .ling-pet-compass__fluid-sub {
            position: absolute; top: 5%; left: 5%; right: 5%; bottom: 5%; border-radius: 50%;
            background-image: var(--fluid-sub-color);
            background-size: 150% 150%;
            transform-origin: 45% 55%;
            animation: lingVortexSub 7s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }

        /* 3. __text 真言信息层 */
        .ling-pet-compass__text {
            position: relative; z-index: 10; font-family: "ShuowenZuan", "LiSu", "KaiTi", serif; 
            font-size: 13px; font-weight: 700; text-align: center; line-height: 32px; width: 100%; height: 100%; 
            display: flex; align-items: center; justify-content: center; padding-top: 1px; box-sizing: border-box;
            transform: translateY(-0.5px);
            transition: color 0.3s cubic-bezier(0.25, 1, 0.5, 1), 
                        text-shadow 0.3s cubic-bezier(0.25, 1, 0.5, 1),
                        transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }

        /* ==================== DATA-STATE 状态机 · 时辰四象 ==================== */
        
        /* [白昼：日耀玉白] */
        .ling-pet-compass[data-state="day"] { 
            --ling-inset-border-color: rgba(44, 53, 62, 0.2); --ling-jade-bg-color: #f5f4f0; --ling-jade-glint: rgba(255, 255, 255, 0.8); 
            --ling-stream-bg: linear-gradient(90deg, #eae8e3, #fcfbf9, #cbd5e1, #eae8e3);
            --ling-blend-mode: screen;
            --fluid-prime-color: radial-gradient(circle at var(--ling-light-x) var(--ling-light-y), rgba(147, 197, 253, 0.75) 0%, rgba(239, 206, 144, 0.2) 50%, transparent 70%);
            --fluid-sub-color: radial-gradient(circle at 60% 40%, rgba(219, 234, 254, 0.6) 0%, transparent 60%);
        }
        .ling-pet-compass[data-state="day"] .ling-pet-compass__text { color: #232a30; text-shadow: 0px 1px 2px rgba(0,0,0,0.18), 0.5px 0.5px 0.5px rgba(255,255,255,0.9); }

        /* [夜间：寒潭玄青与幽冥墨蓝] */
        .ling-pet-compass[data-state="night"] { 
            --ling-inset-border-color: rgba(56, 189, 248, 0.22); 
            --ling-jade-bg-color: #0b0f17;                       
            --ling-jade-glint: rgba(255, 255, 255, 0.08); 
            --ling-stream-bg: linear-gradient(90deg, #090d14, #0f172a, #1e293b, #090d14); 
            --ling-blend-mode: overlay; 
            --fluid-prime-color: radial-gradient(circle at var(--ling-light-x) var(--ling-light-y), rgba(56, 189, 248, 0.85) 0%, rgba(30, 41, 59, 0.6) 35%, transparent 60%);
            --fluid-sub-color: radial-gradient(circle at 40% 70%, rgba(15, 23, 42, 0.95) 0%, transparent 55%);
        }
        .ling-pet-compass[data-state="night"] .ling-pet-compass__text { color: #f1f5f9; text-shadow: 0px 1px 3px rgba(0,0,0,0.95), 0px 0px 3px rgba(56,189,248,0.25); }

        /* [黄昏：夕照熔金] */
        .ling-pet-compass[data-state="sunset"] { 
            --ling-inset-border-color: rgba(255, 78, 80, 0.35);  --ling-jade-bg-color: #2b1212; --ling-jade-glint: rgba(255, 120, 120, 0.3); 
            --ling-stream-bg: linear-gradient(90deg, #2b1212, #ff4e50, #f97316, #2b1212);
            --ling-blend-mode: screen;
            --fluid-prime-color: radial-gradient(circle at var(--ling-light-x) var(--ling-light-y), rgba(249, 115, 22, 0.85) 0%, rgba(220, 38, 38, 0.3) 50%, transparent 70%);
            --fluid-sub-color: radial-gradient(circle at 30% 60%, rgba(254, 215, 170, 0.5) 0%, transparent 60%);
        }
        .ling-pet-compass[data-state="sunset"] .ling-pet-compass__text { color: #ffe4e6; text-shadow: 0px 1px 3px rgba(0,0,0,0.65), 0.5px 0.5px 0.5px rgba(255,78,80,0.3); }

        /* [破晓：天青苍穹] */
        .ling-pet-compass[data-state="sky"] { 
            --ling-inset-border-color: rgba(6, 182, 212, 0.35);  --ling-jade-bg-color: #0f1826; --ling-jade-glint: rgba(100, 220, 255, 0.4); 
            --ling-stream-bg: linear-gradient(90deg, #0f1826, #06b6d4, #1d4ed8, #0f1826);
            --ling-blend-mode: screen;
            --fluid-prime-color: radial-gradient(circle at var(--ling-light-x) var(--ling-light-y), rgba(34, 211, 238, 0.85) 0%, rgba(29, 78, 216, 0.3) 55%, transparent 75%);
            --fluid-sub-color: radial-gradient(circle at 65% 65%, rgba(165, 243, 252, 0.55) 0%, transparent 60%);
        }
        .ling-pet-compass[data-state="sky"] .ling-pet-compass__text { color: #ecfeff; text-shadow: 0px 1px 3px rgba(0,0,0,0.6), 0.5px 0.5px 0.5px rgba(6,182,212,0.3); }

        /* ==================== ⚡ 交互状态响应 ==================== */
        .ling-pet-compass:hover { transform: scale(1.12) !important; --ling-shadow-y: 15px !important; --ling-shadow-blur: 32px !important; --ling-shadow-opacity: 0.55 !important; }
        .ling-pet-compass:hover .ling-pet-compass__aura { opacity: 0.85; }
        .ling-pet-compass:hover .ling-pet-compass__text { transform: translateY(0.5px) scale(0.98); }

        .ling-pet-compass[data-state="day"]:hover    { --ling-inset-border-color: rgba(0, 0, 0, 0.65); }
        .ling-pet-compass[data-state="night"]:hover  { --ling-inset-border-color: rgba(56, 189, 248, 0.7); } 
        .ling-pet-compass[data-state="sunset"]:hover { --ling-inset-border-color: rgba(255, 78, 80, 0.8); }
        .ling-pet-compass[data-state="sky"]:hover    { --ling-inset-border-color: rgba(6, 182, 212, 0.8); }

        /* 悬停四象深度沉降投影 */
        .ling-pet-compass[data-state="day"]:hover .ling-pet-compass__text { color: #000000 !important; font-weight: 900 !important; text-shadow: 0px 0.5px 1px rgba(0, 0, 0, 0.65), 0px 0px 4px rgba(147, 197, 253, 0.8); }
        .ling-pet-compass[data-state="night"]:hover .ling-pet-compass__text { color: #090d16 !important; font-weight: 900 !important; -webkit-text-stroke: 0.5px #e2e8f0; text-shadow: 0px 0.5px 1.5px rgba(0, 0, 0, 0.98), 0px 0px 6px rgba(56, 189, 248, 0.95); }
        .ling-pet-compass[data-state="sunset"]:hover .ling-pet-compass__text { color: #2b0000 !important; font-weight: 900 !important; -webkit-text-stroke: 0.5px #ff4e50; text-shadow: 0px 0.5px 1.5px rgba(0, 0, 0, 0.95), 0px 0px 6px rgba(249, 115, 22, 0.95); }
        .ling-pet-compass[data-state="sky"]:hover .ling-pet-compass__text { color: #000c1f !important; font-weight: 900 !important; -webkit-text-stroke: 0.5px #06b6d4; text-shadow: 0px 0.5px 1.5px rgba(0, 0, 0, 0.95), 0px 0px 6px rgba(34, 211, 238, 0.95); }

        /* 点击/拖拽（Active） */
        .ling-pet-compass:active { transform: scale(0.95) !important; --ling-shadow-y: 2px !important; --ling-shadow-blur: 5px !important; }
        .ling-pet-compass:active .ling-pet-compass__aura { opacity: 0.2; }
        .ling-pet-compass:active .ling-pet-compass__text { transform: translateY(1px) scale(0.93) !important; text-shadow: 0px 0px 1px rgba(0,0,0,0.8) !important; }

        .ling-pulse-trigger { animation: lingShock 0.45s cubic-bezier(0.25, 1, 0.5, 1) !important; }
        @keyframes lingShock {
            0% { transform: scale(1); }
            30% { transform: scale(1.15); box-shadow: 0 0 35px rgba(255,255,255,0.5); }
            100% { transform: scale(1); }
        }

        @keyframes lingStreamMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        @keyframes lingJadeGlint {
            0% { left: -150%; }
            22% { left: 150%; }
            100% { left: 150%; } 
        }

        @keyframes lingVortexPrime {
            0% { transform: rotate(0deg) scale(1) translate(0px, 0px); background-position: 0% 0%; }
            33% { transform: rotate(120deg) scale(1.08) translate(1px, -0.5px); background-position: 30% 20%; }
            66% { transform: rotate(240deg) scale(0.95) translate(-0.5px, 1.5px); background-position: 10% 40%; }
            100% { transform: rotate(360deg) scale(1) translate(0px, 0px); background-position: 0% 0%; }
        }

        @keyframes lingVortexSub {
            0% { transform: rotate(360deg) scale(1.05) skew(0deg); }
            50% { transform: rotate(180deg) scale(0.92) skew(3deg); }
            100% { transform: rotate(0deg) scale(1.05) skew(0deg); }
        }

        @media screen and (max-width: 768px) {
            .ling-pet-compass { width: 40px; height: 40px; }
            .ling-pet-compass__text { font-size: 12px; line-height: 28px; }
            .ling-pet-compass { top: 85px; right: 20px; }
        }
    `;

    const styleNode = document.createElement('style');
    styleNode.textContent = STYLES;
    document.head.appendChild(styleNode);

    // ================= 2. 铸造 DOM 架构 =================
    const dot = document.createElement('div');
    dot.className = 'ling-pet-compass';
    dot.setAttribute('role', 'button');
    dot.setAttribute('aria-live', 'polite');
    dot.setAttribute('data-state', 'day'); 
    dot.setAttribute('data-system-drag', '1'); 

    const auraRing = document.createElement('div');
    auraRing.className = 'ling-pet-compass__aura';
    dot.appendChild(auraRing);

    const jadeCore = document.createElement('div');
    jadeCore.className = 'ling-pet-compass__core';
    jadeCore.setAttribute('aria-hidden', 'true'); 

    const fluidContainers = {
        'day': createFluidNest('layer-day'),
        'night': createFluidNest('layer-night'),
        'sunset': createFluidNest('layer-sunset'),
        'sky': createFluidNest('layer-sky')
    };
    Object.values(fluidContainers).forEach(nest => jadeCore.appendChild(nest));

    const textLayer = document.createElement('div');
    textLayer.className = 'ling-pet-compass__text';
    textLayer.textContent = '---';
    jadeCore.appendChild(textLayer);

    dot.appendChild(jadeCore);
    document.body.appendChild(dot);

    function createFluidNest(stateClassName) {
        const nest = document.createElement('div');
        nest.className = `ling-pet-compass__fluid-container ${stateClassName}`;
        const primeFluid = document.createElement('div');
        primeFluid.className = 'ling-pet-compass__fluid-prime';
        const subFluid = document.createElement('div');
        subFluid.className = 'ling-pet-compass__fluid-sub';
        nest.appendChild(primeFluid);
        nest.appendChild(subFluid);
        return nest;
    }

    // ================= 3. 三维物理光影联动 =================
    document.addEventListener('mousemove', (e) => {
        if (isDragging) return; 
        const rect = dot.getBoundingClientRect();
        const dotCenterX = rect.left + rect.width / 2;
        const dotCenterY = rect.top + rect.height / 2;
        const deltaX = e.clientX - dotCenterX;
        const deltaY = e.clientY - dotCenterY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance < 250) {
            const influence = (250 - distance) / 250; 
            const lightX = 45 - (deltaX / distance) * 18 * influence;
            const lightY = 45 - (deltaY / distance) * 18 * influence;
            const shadowX = (deltaX / distance) * 10 * influence;
            const shadowY = 6 + (deltaY / distance) * 10 * influence;
            const shadowBlur = 20 + influence * 10;

            dot.style.setProperty('--ling-light-x', `${lightX}%`);
            dot.style.setProperty('--ling-light-y', `${lightY}%`);
            dot.style.setProperty('--ling-shadow-x', `${shadowX}px`);
            dot.style.setProperty('--ling-shadow-y', `${shadowY}px`);
            dot.style.setProperty('--ling-shadow-blur', `${shadowBlur}px`);
        } else {
            resetLightVariables();
        }
    });

    function resetLightVariables() {
        dot.style.setProperty('--ling-light-x', '45%');
        dot.style.setProperty('--ling-light-y', '45%');
        dot.style.setProperty('--ling-shadow-x', '0px');
        dot.style.setProperty('--ling-shadow-y', '6px');
        dot.style.setProperty('--ling-shadow-blur', '20px');
        dot.style.setProperty('--ling-shadow-opacity', '0.35');
    }

    // ================= 4. 时辰监听与流体切换枢纽 =================
    let lastState = ""; 

    function triggerShockwave() {
        dot.classList.add('ling-pulse-trigger');
        setTimeout(() => { dot.classList.remove('ling-pulse-trigger'); }, 450); 
    }

    function updateDotStyle() {
        const headerNode = document.getElementById('headerGameTime');
        if (!headerNode || !headerNode.textContent) return;

        const rawText = headerNode.textContent.trim();
        const hourMatch = rawText.match(/([子丑寅卯辰巳午未申酉戌亥])时/);
        if (!hourMatch) return;
        
        const hour = hourMatch[1];
        if (textLayer.textContent !== hour) textLayer.textContent = hour; 

        let currentState = "";

        switch (hour) {
            case '寅': currentState = "sky"; break;
            case '酉': currentState = "sunset"; break;
            case '卯': case '辰': case '巳': case '午': case '未': case '申':
                currentState = "day"; break;
            case '戌': case '亥': case '子': case '丑':
                currentState = "night"; break;
        }

        if (lastState !== currentState) {
            Object.keys(fluidContainers).forEach(key => {
                if (key === currentState) fluidContainers[key].classList.add('active');
                else fluidContainers[key].classList.remove('active');
            });
            
            dot.setAttribute('data-state', currentState);
            
            if (lastState !== "") triggerShockwave();
            lastState = currentState;
        }
    }

    const observer = new MutationObserver(() => {
        if (window.dotTimer) clearTimeout(window.dotTimer);
        window.dotTimer = setTimeout(updateDotStyle, 100);
    });
    const targetNode = document.getElementById('headerGameTime');
    if (targetNode) observer.observe(targetNode, { childList: true, characterData: true, subtree: true, attributes: true });

    // ================= 5. 严密物理拖拽与精细重绘吸附 =================
    let isDragging = false;
    let offsetX, offsetY;

    function snapToEdges(currentLeft, currentTop) {
        const dotWidth = dot.offsetWidth;
        const dotHeight = dot.offsetHeight;
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;

        const distLeft = currentLeft;
        const distRight = winWidth - (currentLeft + dotWidth);
        const distTop = currentTop;
        const distBottom = winHeight - (currentTop + dotHeight);

        let finalLeft = currentLeft;
        let finalTop = currentTop;
        const snapThreshold = 120; 

        const minDist = Math.min(distLeft, distRight, distTop, distBottom);

        if (minDist < snapThreshold) {
            if (minDist === distLeft) finalLeft = 0;
            else if (minDist === distRight) finalLeft = winWidth - dotWidth;
            else if (minDist === distTop) finalTop = 0;
            else if (minDist === distBottom) finalTop = winHeight - dotHeight;
        }

        finalLeft = Math.max(0, Math.min(winWidth - dotWidth, finalLeft));
        finalTop = Math.max(0, Math.min(winHeight - dotHeight, finalTop));

        dot.style.transition = 'box-shadow 0.25s cubic-bezier(0.25, 1, 0.5, 1), transform 0.3s ease, left 0.4s cubic-bezier(0.25, 1, 0.5, 1), top 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        dot.offsetHeight; 

        dot.style.left = finalLeft + 'px';
        dot.style.top = finalTop + 'px';

        localStorage.setItem('ling_time_dot_position', JSON.stringify({ left: finalLeft, top: finalTop }));
    }

    function loadSavedPosition() {
        const savedPos = localStorage.getItem('ling_time_dot_position');
        if (savedPos) {
            try {
                const pos = JSON.parse(savedPos);
                dot.style.left = pos.left + 'px';
                dot.style.top = pos.top + 'px';
                dot.style.right = 'auto'; 
            } catch (e) {}
        }
    }

    const startDrag = (clientX, clientY) => {
        isDragging = true;
        offsetX = clientX - dot.getBoundingClientRect().left;
        offsetY = clientY - dot.getBoundingClientRect().top;
        dot.style.transition = 'none'; 
    };

    const moveDrag = (clientX, clientY) => {
        if (!isDragging) return;
        let targetLeft = clientX - offsetX;
        let targetTop = clientY - offsetY;
        dot.style.left = targetLeft + 'px';
        dot.style.top = targetTop + 'px';
    };

    const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        snapToEdges(parseFloat(dot.style.left), parseFloat(dot.style.top));
    };

    dot.addEventListener('mousedown', (e) => {
        startDrag(e.clientX, e.clientY);
    });
    document.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
    document.addEventListener('mouseup', endDrag);

    dot.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    dot.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) moveDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    dot.addEventListener('touchend', endDrag);

    window.addEventListener('resize', () => {
        if (!dot.style.left) return;
        dot.style.transition = 'none';
        snapToEdges(parseFloat(dot.style.left), parseFloat(dot.style.top));
    });

    loadSavedPosition();
    setTimeout(updateDotStyle, 500);

})();