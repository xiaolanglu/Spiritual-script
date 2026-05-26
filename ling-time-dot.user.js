// ==UserScript==
// @name         灵界时辰天道罗盘
// @namespace    http://tampermonkey.net/
// @version      20.7.7
// @description  拟物交互视觉正统大成版。全面对齐游戏原生灵兽轩架构：实装 data-state 状态机枢纽，重构三层命名空间与全套 ARIA 无障碍矩阵，法宝自此大隐隐于市。
// @author       修仙道友
// @match        https://ling.muge.info/game.html
// @match        http://ling.muge.info/game.html
// @updateURL    https://raw.githubusercontent.com/xiaolanglu/Spiritual-script/main/ling-pet-compass.user.js
// @downloadURL  https://raw.githubusercontent.com/xiaolanglu/Spiritual-script/main/ling-pet-compass.user.js
// @icon         https://ling.muge.info/favicon.svg
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

    // ================= 1. 正统规范 CSS 大阵 (全面基于 data-state 与命名空间) =================
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
            
            /* 折叠偏移量与绝对触控带尺寸 */
            --ling-fold-transform: translateX(0);
            --ling-shield-width: 0px;
            --ling-shield-left: auto;
            --ling-shield-right: auto;
        }

        /* 1. 法宝大圆主体 —— 对齐原生命名规范，接入无障碍响应 */
        .ling-pet-compass {
            position: fixed;
            top: 85px; right: 20px; z-index: 10000;
            width: 44px; height: 44px; border-radius: 50%;
            cursor: move; user-select: none; box-sizing: border-box;
            backdrop-filter: blur(8px) saturate(160%);
            -webkit-backdrop-filter: blur(8px) saturate(160%);
            
            /* 承载状态机统领的连绵渐变流转底层 */
            background: var(--ling-stream-bg);
            background-size: 300% 100%;
            
            /* 拟物级联阴影 */
            box-shadow: 
                var(--ling-shadow-x) var(--ling-shadow-y) var(--ling-shadow-blur) rgba(0, 0, 0, var(--ling-shadow-opacity)),
                inset -2px -2px 6px rgba(0, 0, 0, 0.4),
                inset 0px 0px 0px 1px rgba(255, 255, 255, 0.2),
                inset 0px 0px 4px 3px rgba(0, 0, 0, 0.35),               
                inset 0px 0px 2px 3px var(--ling-inset-border-color);   

            border: 1px dashed rgba(255, 255, 255, 0.08); 
            transform: var(--ling-fold-transform) scale(1);
            
            /* 运行凡间杀招：主体流光平滑连绵流转 */
            animation: lingStreamMove 16s linear infinite;
            
            transition: box-shadow 0.35s cubic-bezier(0.25, 1, 0.5, 1),
                        opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1),
                        transform 0.5s cubic-bezier(0.25, 1, 0.36, 1);
        }

        /* 【对齐原生：__aura 护体灵气环层（高斯模糊霓虹）】 */
        .ling-pet-compass__aura {
            position: absolute; 
            top: -5px; left: -5px; right: -5px; bottom: -5px; 
            border-radius: 50%;
            background: var(--ling-stream-bg);
            background-size: 300% 100%;
            opacity: 0;
            filter: blur(12px); 
            z-index: -2;
            pointer-events: none;
            
            /* 与主体严格共振流转 */
            animation: lingStreamMove 16s linear infinite;
            transition: opacity 0.45s cubic-bezier(0.25, 1, 0.5, 1);
        }

        /* 虚体扩容法——隐形神识感应盾牌 */
        .ling-pet-compass::after {
            content: ''; position: absolute; top: -5px; bottom: -5px;
            width: var(--ling-shield-width);
            left: var(--ling-shield-left); right: var(--ling-shield-right);
            background: transparent; z-index: -1; pointer-events: auto; cursor: pointer;
        }

        /* 2. 【对齐原生：__core 灵玉核心层】 */
        .ling-pet-compass__core {
            position: absolute;
            top: 6px; left: 6px; right: 6px; bottom: 6px;
            border-radius: 50%; z-index: 5; box-sizing: border-box; overflow: hidden;
            background-color: var(--ling-jade-bg-color);
            background-image: 
                linear-gradient(45deg, rgba(255,255,255,0.06) 25%, transparent 25%), 
                linear-gradient(-45deg, rgba(255,255,255,0.06) 25%, transparent 25%),
                linear-gradient(135deg, rgba(0,0,0,0.02) 25%, transparent 25%);
            background-size: 6px 6px; 
            box-shadow: 
                inset 1.5px 1.5px 3px var(--ling-jade-glint), 
                inset -1.5px -1.5px 3px rgba(0, 0, 0, 0.3),   
                inset 0 0 0 1px var(--ling-inset-border-color); 
            transition: background-color 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* 核心内部的45°真玉掠影高光 */
        .ling-pet-compass__core::after {
            content: ''; position: absolute; top: 0; left: 0; width: 200%; height: 100%;
            z-index: 6; pointer-events: none;
            background: linear-gradient(
                90deg, 
                transparent 0%, 
                rgba(255, 255, 255, 0) 35%, 
                rgba(255, 255, 255, 0.25) 45%, 
                rgba(255, 255, 255, 0.5) 50%, 
                rgba(255, 255, 255, 0.25) 55%, 
                transparent 65%
            );
            transform: skewX(-45deg);
            animation: lingJadeGlint 7s cubic-bezier(0.25, 1, 0.5, 1) infinite;
        }

        /* 小圆内部·四象神识动态玉莹图层 */
        .ling-pet-compass__aura-layer {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 50%; opacity: 0; z-index: 1;
            background-image: radial-gradient(circle at var(--ling-light-x) var(--ling-light-y), var(--aura-color) 0%, transparent 75%);
            mix-blend-mode: screen; transition: opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1); 
        }
        .layer-day    { --aura-color: rgba(147, 197, 253, 0.6); }
        .layer-night  { --aura-color: rgb(5, 1, 15); }
        .layer-sunset { --aura-color: rgba(249, 115, 22, 0.65); }
        .layer-sky    { --aura-color: rgba(34, 211, 238, 0.65); }
        .ling-pet-compass__aura-layer.active { opacity: 1; }

        /* 3. 【对齐原生：__text 真言铭牌信息层】 */
        .ling-pet-compass__text {
            position: relative; z-index: 10; font-family: "ShuowenZuan", "LiSu", "KaiTi", serif; 
            font-size: 13px; font-weight: 700; text-align: center; line-height: 32px; width: 100%; height: 100%; 
            display: flex; align-items: center; justify-content: center; padding-top: 1px; box-sizing: border-box;
            transition: color 0.2s ease-in-out, text-shadow 0.2s ease-in-out;
        }

        /* ================= 🎛️ 终极法典：DATA-STATE 状态机视觉规则映射 ================= */
        
        /* [data-state="day"] 白昼·羊脂白玉大阵 */
        .ling-pet-compass[data-state="day"] { 
            --ling-inset-border-color: rgba(44, 53, 62, 0.2); --ling-jade-bg-color: #f5f4f0; --ling-jade-glint: rgba(255, 255, 255, 0.8); 
            --ling-stream-bg: linear-gradient(90deg, #eae8e3, #fcfbf9, #cbd5e1, #eae8e3);
        }
        .ling-pet-compass[data-state="day"] .ling-pet-compass__text { color: #232a30; text-shadow: -0.5px -0.5px 0.5px rgba(0,0,0,0.4), 0.5px 0.5px 0.5px rgba(255,255,255,0.9); }

        /* [data-state="night"] 黑夜·深邃墨翠星河大阵 */
        .ling-pet-compass[data-state="night"] { 
            --ling-inset-border-color: rgba(197, 160, 89, 0.25); --ling-jade-bg-color: #14161a; --ling-jade-glint: rgba(255, 255, 255, 0.15); 
            --ling-stream-bg: linear-gradient(90deg, #14161a, #231b3c, #524227, #14161a);
        }
        .ling-pet-compass[data-state="night"] .ling-pet-compass__text { color: #cbd5e1; text-shadow: -0.5px -0.5px 1px rgba(0,0,0,0.8), 0.5px 0.5px 0.5px rgba(255,255,255,0.2); }

        /* [data-state="sunset"] 夕照·血珀晚霞流光大阵 */
        .ling-pet-compass[data-state="sunset"] { 
            --ling-inset-border-color: rgba(255, 78, 80, 0.35);  --ling-jade-bg-color: #2b1212; --ling-jade-glint: rgba(255, 120, 120, 0.3); 
            --ling-stream-bg: linear-gradient(90deg, #2b1212, #ff4e50, #f97316, #2b1212);
        }
        .ling-pet-compass[data-state="sunset"] .ling-pet-compass__text { color: #ffe4e6; text-shadow: -0.5px -0.5px 1px rgba(0,0,0,0.9), 0.5px 0.5px 0.5px rgba(255,78,80,0.4); }

        /* [data-state="sky"] 破晓·清冷碧翠寒天大阵 */
        .ling-pet-compass[data-state="sky"] { 
            --ling-inset-border-color: rgba(6, 182, 212, 0.35);  --ling-jade-bg-color: #0f1826; --ling-jade-glint: rgba(100, 220, 255, 0.4); 
            --ling-stream-bg: linear-gradient(90deg, #0f1826, #06b6d4, #1d4ed8, #0f1826);
        }
        .ling-pet-compass[data-state="sky"] .ling-pet-compass__text { color: #ecfeff; text-shadow: -0.5px -0.5px 1px rgba(0,0,0,0.9), 0.5px 0.5px 0.5px rgba(6,182,212,0.4); }

        /* ================= ⚡ 交互状态响应控制 ================= */
        
        /* 悬浮激活态（高斯模糊霓虹显现，外部阴影大幅拉长腾空） */
        .ling-pet-compass:hover { 
            transform: translateX(0) scale(1.12) !important; 
            opacity: 1 !important;
            --ling-shadow-y: 15px !important;
            --ling-shadow-blur: 32px !important;
            --ling-shadow-opacity: 0.55 !important;
        }
        .ling-pet-compass:hover .ling-pet-compass__aura { opacity: 0.85; }
        
        /* 悬浮时各状态机的深度内嵌边框增强 */
        .ling-pet-compass[data-state="day"]:hover    { --ling-inset-border-color: rgba(0, 0, 0, 0.65); }
        .ling-pet-compass[data-state="night"]:hover  { --ling-inset-border-color: rgba(197, 160, 89, 0.7); }
        .ling-pet-compass[data-state="sunset"]:hover { --ling-inset-border-color: rgba(255, 78, 80, 0.8); }
        .ling-pet-compass[data-state="sky"]:hover    { --ling-inset-border-color: rgba(6, 182, 212, 0.8); }

        /* 悬浮时真言文字爆出强力起刚效果 */
        .ling-pet-compass[data-state="day"]:hover .ling-pet-compass__text { color: #000000 !important; font-weight: 900 !important; text-shadow: 0px 1px 2px rgba(255, 255, 255, 0.9), 0px 0px 4px rgba(147, 197, 253, 0.6); }
        .ling-pet-compass[data-state="night"]:hover .ling-pet-compass__text { color: #111317 !important; font-weight: 900 !important; -webkit-text-stroke: 0.5px #c5a059; text-shadow: 0 0 6px rgba(167, 139, 250, 0.85); }
        .ling-pet-compass[data-state="sunset"]:hover .ling-pet-compass__text { color: #2b0000 !important; font-weight: 900 !important; -webkit-text-stroke: 0.5px #ff4e50; text-shadow: 0 0 6px rgba(249, 115, 22, 0.9); }
        .ling-pet-compass[data-state="sky"]:hover .ling-pet-compass__text { color: #000c1f !important; font-weight: 900 !important; -webkit-text-stroke: 0.5px #06b6d4; text-shadow: 0 0 6px rgba(34, 211, 238, 0.9); }

        /* 点击内缩 3D 压感 */
        .ling-pet-compass:active { 
            transform: translateX(0) scale(0.95) !important; 
            --ling-shadow-y: 2px !important;
            --ling-shadow-blur: 5px !important;
        }
        .ling-pet-compass:active .ling-pet-compass__aura { opacity: 0.2; }

        /* 时辰突变震荡 */
        .ling-pulse-trigger { animation: lingShock 0.45s cubic-bezier(0.25, 1, 0.5, 1) !important; }
        @keyframes lingShock {
            0% { transform: translateX(0) scale(1); }
            30% { transform: translateX(0) scale(1.15); box-shadow: 0 0 35px rgba(255,255,255,0.5); }
            100% { transform: translateX(0) scale(1); }
        }

        /* 300%大背景平滑连绵流转动画 */
        @keyframes lingStreamMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        /* 玉面高光掠影 */
        @keyframes lingJadeGlint {
            0% { left: -150%; }
            25% { left: 150%; }
            100% { left: 150%; } 
        }

        @media screen and (max-width: 768px) {
            .ling-pet-compass { width: 40px; height: 40px; }
            .ling-pet-compass__text { font-size: 12px; line-height: 28px; }
            .ling-pet-compass__core { top: 5.5px; left: 5.5px; right: 5.5px; bottom: 5.5px; }
        }
    `;

    const styleNode = document.createElement('style');
    styleNode.textContent = STYLES;
    document.head.appendChild(styleNode);

    // ================= 2. 铸造正统无障碍复合 DOM 架构 =================
    const dot = document.createElement('div');
    dot.className = 'ling-pet-compass';
    // 完美的正统无障碍天道真言注入
    dot.setAttribute('role', 'button');
    dot.setAttribute('aria-live', 'polite');
    dot.setAttribute('title', '天道罗盘：感知当前游戏时辰变化');
    dot.setAttribute('data-state', 'day'); // 初始设为白昼状态
    dot.setAttribute('data-system-drag', '1'); // 独立于原生的拖拽识别标印

    // 护体灵气环层 (__aura)
    const auraRing = document.createElement('div');
    auraRing.className = 'ling-pet-compass__aura';
    dot.appendChild(auraRing);

    // 真玉核心层 (__core)
    const jadeCore = document.createElement('div');
    jadeCore.className = 'ling-pet-compass__core';
    jadeCore.setAttribute('aria-hidden', 'true'); // 让辅助工具直接跃过纯视觉层，提升性能

    const auraLayers = {
        'day': createAuraLayer('layer-day'),
        'night': createAuraLayer('layer-night'),
        'sunset': createAuraLayer('layer-sunset'),
        'sky': createAuraLayer('layer-sky')
    };
    Object.values(auraLayers).forEach(layer => jadeCore.appendChild(layer));

    // 真言层 (__text)
    const textLayer = document.createElement('div');
    textLayer.className = 'ling-pet-compass__text';
    textLayer.textContent = '---';
    jadeCore.appendChild(textLayer);

    dot.appendChild(jadeCore);
    document.body.appendChild(dot);

    function createAuraLayer(className) {
        const layer = document.createElement('div');
        layer.className = `ling-pet-compass__aura-layer ${className}`;
        return layer;
    }

    // ================= 3. 神识随行：三维物理光影联动 =================
    document.addEventListener('mousemove', (e) => {
        if (isDragging || isFolded) return; 
        
        const rect = dot.getBoundingClientRect();
        const dotCenterX = rect.left + rect.width / 2;
        const dotCenterY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - dotCenterX;
        const deltaY = e.clientY - dotCenterY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance < 250) {
            const influence = (250 - distance) / 250; 
            const lightX = 45 - (deltaX / distance) * 16 * influence;
            const lightY = 45 - (deltaY / distance) * 16 * influence;
            
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

    // ================= 4. 纳芥半隐与智能双向折叠算法 =================
    let fadeTimer = null;
    let isFolded = false; 

    function executeFold() {
        if (isDragging || isFolded) return;
        
        const rect = dot.getBoundingClientRect();
        const winWidth = window.innerWidth;
        
        const isExactlyOnLeft = rect.left <= 0;
        const isExactlyOnRight = rect.right >= winWidth;
        
        if (isExactlyOnLeft || isExactlyOnRight || rect.left < 40 || (winWidth - rect.right) < 40) {
            isFolded = true;
            dot.style.opacity = '0.35'; 
            
            dot.style.setProperty('--ling-shadow-y', '1px');
            dot.style.setProperty('--ling-shadow-blur', '3px');
            dot.style.setProperty('--ling-shadow-opacity', '0.15');

            if (isExactlyOnLeft || rect.left < winWidth / 2) {
                dot.style.setProperty('--ling-fold-transform', 'translateX(-68%)');
                dot.style.setProperty('--ling-shield-width', '24px');
                dot.style.setProperty('--ling-shield-left', '100%');
                dot.style.setProperty('--ling-shield-right', 'auto');
            } else {
                dot.style.setProperty('--ling-fold-transform', 'translateX(68%)');
                dot.style.setProperty('--ling-shield-width', '24px');
                dot.style.setProperty('--ling-shield-left', 'auto');
                dot.style.setProperty('--ling-shield-right', '100%');
            }
        } else {
            dot.style.opacity = '0.35';
        }
    }

    function executeWakeUp() {
        if (!isFolded && dot.style.opacity === '1') return;
        isFolded = false;
        dot.style.opacity = '1';
        dot.style.setProperty('--ling-fold-transform', 'translateX(0)');
        dot.style.setProperty('--ling-shield-width', '0px');
        resetLightVariables();
        resetFadeTimer();
    }

    function resetFadeTimer() {
        clearTimeout(fadeTimer);
        if (isFolded) {
            executeWakeUp();
            return;
        }
        dot.style.opacity = '1'; 
        fadeTimer = setTimeout(executeFold, 3000); 
    }
    
    dot.addEventListener('mouseenter', resetFadeTimer);
    dot.addEventListener('mousemove', resetFadeTimer);
    dot.addEventListener('touchstart', (e) => { executeWakeUp(); }, { passive: true });

    // ================= 5. 核心状态机时辰监听与切换枢纽 =================
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

        // 状态机核心断言：只有状态发生真正异动时，才重铸属性大印
        if (lastState !== currentState) {
            Object.keys(auraLayers).forEach(key => {
                if (key === currentState) auraLayers[key].classList.add('active');
                else auraLayers[key].classList.remove('active');
            });
            
            // 一印定乾坤：直接改写 data-state
            dot.setAttribute('data-state', currentState);
            dot.setAttribute('title', `天道罗盘：当前游戏时辰【${hour}时】· 界域【${currentState}】`);
            
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

    // ================= 6. 严密物理拖拽与双向磁力吸附 =================
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

        dot.style.transition = 'box-shadow 0.25s cubic-bezier(0.25, 1, 0.5, 1), left 0.4s cubic-bezier(0.25, 1, 0.5, 1), top 0.4s cubic-bezier(0.25, 1, 0.5, 1), transform 0.3s ease, opacity 0.6s';
        dot.style.left = finalLeft + 'px';
        dot.style.top = finalTop + 'px';

        localStorage.setItem('ling_time_dot_position', JSON.stringify({ left: finalLeft, top: finalTop }));
        
        isFolded = false; 
        resetFadeTimer(); 
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
        resetFadeTimer();
    }

    const startDrag = (clientX, clientY) => {
        isDragging = true;
        clearTimeout(fadeTimer);
        if (isFolded) { executeWakeUp(); return; }
        dot.style.opacity = '1';
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
        if (isFolded) { executeWakeUp(); e.preventDefault(); return; }
        startDrag(e.clientX, e.clientY);
    });
    document.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
    document.addEventListener('mouseup', endDrag);

    dot.addEventListener('touchstart', (e) => {
        if (isFolded) { executeWakeUp(); return; }
        if (e.touches.length > 0) startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    dot.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) moveDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    dot.addEventListener('touchend', endDrag);

    window.addEventListener('resize', () => {
        if (!dot.style.left) return;
        snapToEdges(parseFloat(dot.style.left), parseFloat(dot.style.top));
    });

    loadSavedPosition();
    setTimeout(updateDotStyle, 500);

})();
