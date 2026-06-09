// ==UserScript==
// @name         灵界时辰天道罗盘
// @namespace    http://tampermonkey.net/
// @version      21.0.0
// @description  从头重做，进化为晶莹透亮的磨砂玻璃质感椭圆按钮。动态四象极光内敛，真言悬停破水感，极致高级。
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

    // ================= 1. 磨砂玻璃大阵 CSS =================
    const STYLES = `
        :root {
            /* 物理投影变量 */
            --glass-shadow-y: 4px;
            --glass-shadow-blur: 16px;
            --glass-shadow-opacity: 0.15;
            
            /* 四象核心内衬玻璃极光色（柔和不刺眼，蕴藏于玻璃之内） */
            --glass-aurora-bg: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0%, transparent 60%);
            --glass-border-color: rgba(255, 255, 255, 0.35);
            --glass-text-color: #2c353e;
            --glass-text-shadow: 0 1px 1px rgba(255,255,255,0.8);
        }

        /* 1. 椭圆磨砂玻璃按钮主体 */
        .ling-pet-compass {
            position: fixed;
            top: 85px; right: 20px; z-index: 10000;
            
            /* 核心重构：变成小椭圆 */
            width: 62px; height: 34px; 
            border-radius: 17px; 
            
            cursor: move; user-select: none; box-sizing: border-box;
            
            /* 核心毛玻璃特效：12px 物理高斯模糊 */
            backdrop-filter: blur(12px) saturate(140%);
            -webkit-backdrop-filter: blur(12px) saturate(140%);
            
            /* 基础微光底色 */
            background: var(--glass-aurora-bg);
            
            /* 极其纤细精致的磨砂多重阴影，带有一层极淡的物理反光边框 */
            box-shadow: 
                0px var(--glass-shadow-y) var(--glass-shadow-blur) rgba(0, 0, 0, var(--glass-shadow-opacity)),
                inset 0px 1px 2px rgba(255, 255, 255, 0.5),   
                inset 0px -1px 2px rgba(0, 0, 0, 0.1);         

            /* 纤细的白玉反光边缘线 */
            border: 1px solid var(--glass-border-color); 
            
            opacity: 1 !important; 
            transform: scale(1);
            
            /* 丝滑过渡逻辑 */
            transition: border-color 0.4s ease,
                        box-shadow 0.35s cubic-bezier(0.25, 1, 0.5, 1),
                        transform 0.4s cubic-bezier(0.25, 1, 0.36, 1);
        }

        /* 2. 内部隐现的极光层（营造磨砂内部有微光流转的感觉） */
        .ling-pet-compass__aurora-core {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            border-radius: 16px; z-index: 2; pointer-events: none;
            background: var(--glass-aurora-bg);
            mix-blend-mode: normal;
            opacity: 0.85;
            animation: glassBreathe 8s ease-in-out infinite alternate;
            transition: background 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* 3. __text 真言信息层（居中、精致） */
        .ling-pet-compass__text {
            position: relative; z-index: 10; 
            font-family: "ShuowenZuan", "LiSu", "KaiTi", serif; 
            font-size: 15px; font-weight: 700; 
            letter-spacing: 1px;
            text-align: center; 
            width: 100%; height: 100%; 
            display: flex; align-items: center; justify-content: center; 
            box-sizing: border-box;
            color: var(--glass-text-color);
            text-shadow: var(--glass-text-shadow);
            
            transition: color 0.3s ease, text-shadow 0.3s ease, transform 0.3s ease;
        }

        /* ==================== DATA-STATE 状态机 · 四象磨砂极光 ==================== */
        
        /* [白昼：耀白玉莹玻璃] */
        .ling-pet-compass[data-state="day"] { 
            --glass-border-color: rgba(255, 255, 255, 0.5);
            --glass-text-color: #232a30;
            --glass-text-shadow: 0px 1px 1px rgba(255,255,255,0.9);
            --glass-aurora-bg: radial-gradient(circle at 15% 15%, rgba(219, 234, 254, 0.6) 0%, rgba(255, 255, 255, 0.25) 60%, rgba(244, 243, 240, 0.1) 100%);
        }

        /* [夜间：幽玄青玉玻璃（暗调高级黑）] */
        .ling-pet-compass[data-state="night"] { 
            --glass-border-color: rgba(56, 189, 248, 0.25);
            --glass-text-color: #f1f5f9;
            --glass-text-shadow: 0px 1px 3px rgba(0,0,0,0.8), 0px 0px 4px rgba(56,189,248,0.3);
            /* 淡淡的深海玄青极光裹在黑玻璃内部 */
            --glass-aurora-bg: radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.35) 0%, rgba(15, 23, 42, 0.65) 50%, rgba(11, 15, 23, 0.5) 100%);
        }

        /* [黄昏：落日熔金玻璃] */
        .ling-pet-compass[data-state="sunset"] { 
            --glass-border-color: rgba(255, 120, 120, 0.4);
            --glass-text-color: #fff1f2;
            --glass-text-shadow: 0px 1px 2px rgba(43, 18, 18, 0.7), 0px 0px 2px rgba(249, 115, 22, 0.3);
            --glass-aurora-bg: radial-gradient(circle at 25% 20%, rgba(249, 115, 22, 0.45) 0%, rgba(220, 38, 38, 0.2) 60%, rgba(43, 18, 18, 0.3) 100%);
        }

        /* [破晓：天青微茫玻璃] */
        .ling-pet-compass[data-state="sky"] { 
            --glass-border-color: rgba(6, 182, 212, 0.4);
            --glass-text-color: #ecfeff;
            --glass-text-shadow: 0px 1px 2px rgba(15, 24, 38, 0.7), 0px 0px 3px rgba(34, 211, 238, 0.3);
            --glass-aurora-bg: radial-gradient(circle at 15% 25%, rgba(34, 211, 238, 0.45) 0%, rgba(29, 78, 216, 0.2) 60%, rgba(15, 24, 38, 0.3) 100%);
        }

        /* ==================== ⚡ 交互状态响应 ==================== */
        .ling-pet-compass:hover { 
            transform: scale(1.08) !important; 
            --glass-shadow-y: 10px !important; 
            --glass-shadow-blur: 24px !important; 
            --glass-shadow-opacity: 0.25 !important;
        }
        .ling-pet-compass:hover .ling-pet-compass__text { 
            transform: scale(1.03);
        }

        .ling-pet-compass[data-state="day"]:hover    { border-color: rgba(59, 130, 246, 0.6); }
        .ling-pet-compass[data-state="night"]:hover  { border-color: rgba(56, 189, 248, 0.6); } 
        .ling-pet-compass[data-state="sunset"]:hover { border-color: rgba(249, 115, 22, 0.6); }
        .ling-pet-compass[data-state="sky"]:hover    { border-color: rgba(34, 211, 238, 0.6); }

        /* 点击/拖拽（Active）按下沉降 */
        .ling-pet-compass:active { 
            transform: scale(0.96) !important; 
            --glass-shadow-y: 2px !important; 
            --glass-shadow-blur: 6px !important; 
        }
        .ling-pet-compass:active .ling-pet-compass__text { 
            transform: translateY(0.5px) scale(0.95) !important; 
        }

        /* 状态切换冲击波（柔和的光晕一闪） */
        .ling-pulse-trigger { animation: glassShock 0.4s ease-out !important; }
        @keyframes glassShock {
            0% { box-shadow: 0 0 0 0px rgba(255,255,255,0.4); }
            100% { box-shadow: 0 0 0 12px rgba(255,255,255,0); }
        }

        /* 内部极光微幅呼吸动效 */
        @keyframes glassBreathe {
            0% { transform: scale(1) translate(0px, 0px); filter: brightness(1); }
            100% { transform: scale(1.05) translate(1px, 1px); filter: brightness(1.1); }
        }

        @media screen and (max-width: 768px) {
            .ling-pet-compass { width: 56px; height: 30px; border-radius: 15px; }
            .ling-pet-compass__text { font-size: 13px; }
        }
    `;

    const styleNode = document.createElement('style');
    styleNode.textContent = STYLES;
    document.head.appendChild(styleNode);

    // ================= 2. 铸造全新 DOM 架构 =================
    const dot = document.createElement('div');
    dot.className = 'ling-pet-compass';
    dot.setAttribute('role', 'button');
    dot.setAttribute('aria-live', 'polite');
    dot.setAttribute('data-state', 'day'); 
    dot.setAttribute('data-system-drag', '1'); 

    // 全新极光内心
    const auroraCore = document.createElement('div');
    auroraCore.className = 'ling-pet-compass__aurora-core';
    dot.appendChild(auroraCore);

    // 文字层
    const textLayer = document.createElement('div');
    textLayer.className = 'ling-pet-compass__text';
    textLayer.textContent = '---';
    dot.appendChild(textLayer);

    document.body.appendChild(dot);

    // ================= 3. 时辰监听与极光状态切换 =================
    let lastState = ""; 

    function triggerShockwave() {
        dot.classList.add('ling-pulse-trigger');
        setTimeout(() => { dot.classList.remove('ling-pulse-trigger'); }, 400); 
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

    // ================= 4. 严密物理拖拽与精细重绘吸附 =================
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

        dot.style.transition = 'box-shadow 0.25s ease, transform 0.3s ease, left 0.4s cubic-bezier(0.25, 1, 0.5, 1), top 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
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

    dot.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
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