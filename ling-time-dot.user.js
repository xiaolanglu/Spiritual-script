// ==UserScript==
// @name         灵界时辰天道液态玻璃珠
// @namespace    http://tampermonkey.net/
// @version      20.7.0
// @description  交互视觉终极版。重构绝对向内微雕描边（True Inset Border），引入高透冰晶折射层，彻底消除外溢锯齿，使袖珍体态更具法宝灵性。
// @author       修仙道友
// @match        https://ling.muge.info/game.html
// @match        http://ling.muge.info/game.html
// @icon         https://ling.muge.info/favicon.svg
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 引入云端古法篆书字体
    const FONT_LINK = document.createElement('link');
    FONT_LINK.href = 'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@700;900&display=swap'; 
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

    // ================= 1. 殿堂级天道美化 CSS (绝对向内描边重构) =================
    const STYLES = `
        :root {
            --ling-light-x: 45%;
            --ling-light-y: 45%;
            --ling-shadow-x: 0px;
            --ling-shadow-y: 10px;
            --ling-shadow-blur: 30px;
            
            /* 【20.7.0 独创】天道向内流色描边变量，由各时辰独立继承 */
            --ling-inset-border-color: rgba(255, 255, 255, 0.4);
        }

        /* 1. 法宝外壳及主容器 */
        #ling-time-dot {
            position: fixed;
            top: 85px;
            right: 20px;
            z-index: 10000;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            cursor: move;
            user-select: none;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            overflow: hidden; /* 锁死一切向内的光效 */
            
            backdrop-filter: blur(12px) saturate(210%);
            -webkit-backdrop-filter: blur(12px) saturate(210%);
            
            /* 【20.7.0 重磅：废除外部 Border，全部转化为 3D Inset 复合向内描边】 */
            box-shadow: 
                var(--ling-shadow-x) var(--ling-shadow-y) var(--ling-shadow-blur) rgba(0, 0, 0, 0.45),                    
                inset 4px 4px 8px rgba(255, 255, 255, 0.6),       
                inset -4px -4px 8px rgba(0, 0, 0, 0.45),            
                inset 0 0 12px rgba(255, 255, 255, 0.2),
                
                /* 以下两行为核心向内微雕描边：第一层为时辰流色，第二层为冰晶高光折射 */
                inset 0 0 0 1px var(--ling-inset-border-color),
                inset 0 0 0 2px rgba(255, 255, 255, 0.25); 
                
            /* 废除外部粗糙描边，改为高精度裁切线 */
            border: none; 
            
            transition: box-shadow 0.3s cubic-bezier(0.25, 1, 0.5, 1),
                        opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1),
                        transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* 【20.7.0 独立界域·常态向内金丝法则】 */
        #ling-time-dot.state-day    { --ling-inset-border-color: rgba(44, 53, 62, 0.25); }   /* 白昼：内敛乌金 */
        #ling-time-dot.state-night  { --ling-inset-border-color: rgba(197, 160, 89, 0.35); } /* 黑夜：玄铁暗金 */
        #ling-time-dot.state-sunset { --ling-inset-border-color: rgba(255, 78, 80, 0.5); }  /* 夕照：落日熔金 */
        #ling-time-dot.state-sky    { --ling-inset-border-color: rgba(6, 182, 212, 0.5); }     /* 破晓：寒冰极光 */

        /* 【20.7.0 独立界域·Hover觉醒向内高亮法则】 */
        #ling-time-dot.state-day:hover    { --ling-inset-border-color: rgba(0, 0, 0, 0.8); }
        #ling-time-dot.state-night:hover  { --ling-inset-border-color: rgba(197, 160, 89, 0.85); }
        #ling-time-dot.state-sunset:hover { --ling-inset-border-color: rgba(255, 78, 80, 0.9); }
        #ling-time-dot.state-sky:hover    { --ling-inset-border-color: rgba(6, 182, 212, 0.9); }

        /* 2. 四象法相独立底色图层 */
        .ling-aura-layer {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            border-radius: 50%;
            opacity: 0; 
            z-index: 1;
            background-size: 160% 160%, 100% 100%;
            transition: opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1); 
        }

        .aura-day {
            background-color: #f4f3f0;
            background-image: 
                radial-gradient(circle at var(--ling-light-x) var(--ling-light-y), rgba(138, 180, 248, 0.9) 0%, transparent 45%), 
                radial-gradient(circle at 52% 52%, rgba(255, 182, 193, 0.6) 0%, rgba(244, 243, 240, 0.2) 70%, rgba(230, 225, 215, 0.6) 100%);
        }
        .aura-night {
            background-color: #111;
            background-image: 
                radial-gradient(circle at var(--ling-light-x) var(--ling-light-y), rgba(139, 92, 246, 0.95) 0%, transparent 50%), 
                radial-gradient(circle at 54% 54%, rgba(29, 78, 216, 0.6) 0%, rgba(20, 24, 30, 0.8) 75%, rgba(10, 12, 15, 0.95) 100%);
        }
        .aura-sunset { background: radial-gradient(circle at var(--ling-light-x) var(--ling-light-y), #ff4e50 0%, #f97316 50%, #feb47b 100%); }
        .aura-sky { background: radial-gradient(circle at var(--ling-light-x) var(--ling-light-y), #06b6d4 0%, #3b82f6 50%, #111827 100%); }

        .ling-aura-layer.active { opacity: 1; }

        /* 3. 袖珍真言层 */
        #ling-time-text {
            position: relative;
            z-index: 5; 
            font-family: "ShuowenZuan", "LiSu", "KaiTi", serif; 
            font-size: 14px; 
            font-weight: 700;
            text-align: center;
            line-height: 44px;
            width: 100%; height: 100%;
            display: flex; align-items: center; justify-content: center;
            padding-top: 1px; 
            box-sizing: border-box;
            transition: color 0.2s ease-in-out, text-shadow 0.2s ease-in-out, -webkit-text-stroke 0.2s ease-in-out;
        }

        .text-day-style { color: #2c353e; text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8); }
        .text-night-style { color: #e2e8f0; text-shadow: 0 1px 3px rgba(139, 92, 246, 0.8); }
        .text-sunset-style { color: #ffffff; text-shadow: 0 1px 3px rgba(255, 0, 0, 0.7); }
        .text-sky-style { color: #ffffff; text-shadow: 0 1px 3px rgba(0, 136, 255, 0.8); }

        /* 4. 悬浮激活态 */
        #ling-time-dot:hover { transform: scale(1.12); opacity: 1 !important; }

        #ling-time-dot.state-day:hover #ling-time-text {
            font-size: 15px; color: #000000 !important; font-weight: 900 !important; -webkit-text-stroke: 0.5px #000000; 
            text-shadow: 0px 1px 2px rgba(255, 255, 255, 0.9);
        }
        #ling-time-dot.state-night:hover #ling-time-text {
            font-size: 15px; color: #050508 !important; font-weight: 900 !important; -webkit-text-stroke: 0.7px #c5a059; 
            text-shadow: 0 0 5px rgba(139, 92, 246, 0.9), 0 0 10px rgba(29, 78, 216, 0.7);
        }
        #ling-time-dot.state-sunset:hover #ling-time-text {
            font-size: 15px; color: #4a0000 !important; font-weight: 900 !important; -webkit-text-stroke: 0.5px #4a0000;
            text-shadow: 0 0 6px rgba(255, 78, 80, 0.8);
        }
        #ling-time-dot.state-sky:hover #ling-time-text {
            font-size: 15px; color: #001133 !important; font-weight: 900 !important; -webkit-text-stroke: 0.5px #001133;
            text-shadow: 0 0 6px rgba(6, 182, 212, 0.9);
        }

        #ling-time-dot:active { transform: scale(0.95); }

        /* 5. 外围浑天星轨 */
        #ling-time-dot::before {
            content: ''; position: absolute; top: -6px; left: -6px; right: -6px; bottom: -6px;
            border-radius: 50%; border: 1px dashed rgba(255, 255, 255, 0.15);
            pointer-events: none; z-index: 10; opacity: 0.8;
            transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        #ling-time-dot::after {
            content: ''; position: absolute; top: -12px; left: -12px; right: -12px; bottom: -12px;
            border-radius: 50%; background: transparent; border: 1px dashed rgba(255, 255, 255, 0); 
            pointer-events: none; z-index: 9; opacity: 0;
            transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        #ling-time-dot:hover::before { border: 1px dashed rgba(197, 160, 89, 0.6); transform: rotate(180deg); top: -8px; left: -8px; right: -8px; bottom: -8px; opacity: 1; }
        #ling-time-dot:hover::after { border: 1px dashed rgba(230, 230, 230, 0.15); transform: rotate(-120deg); top: -14px; left: -14px; right: -14px; bottom: -14px; opacity: 1; }

        .run-rotate-day::before { animation: starRotateClockwise 25s linear infinite; }
        .run-rotate-night::before { animation: starRotateClockwise 30s linear infinite; }
        .run-rotate-night::after { border: 1px dashed rgba(255, 255, 255, 0.05); opacity: 0.5; animation: starRotateCounter 40s linear infinite; }

        .ling-pulse-trigger { animation: lingShock 0.45s cubic-bezier(0.25, 1, 0.5, 1) !important; }
        @keyframes lingShock {
            0% { transform: scale(1); }
            30% { transform: scale(1.15); box-shadow: 0 0 35px rgba(255,255,255,0.6); }
            100% { transform: scale(1); }
        }

        @keyframes starRotateClockwise { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes starRotateCounter { 0% { transform: rotate(0deg); } 100% { transform: rotate(-360deg); } }

        @media screen and (max-width: 768px) {
            #ling-time-dot { width: 40px; height: 40px; }
            #ling-time-text { font-size: 13px; line-height: 40px; }
        }
    `;

    const styleNode = document.createElement('style');
    styleNode.textContent = STYLES;
    document.head.appendChild(styleNode);

    // ================= 2. 创建复合 DOM 架构 =================
    const dot = document.createElement('div');
    dot.id = 'ling-time-dot';

    const auraLayers = {
        'day': createAuraLayer('aura-day'),
        'night': createAuraLayer('aura-night'),
        'sunset': createAuraLayer('aura-sunset'),
        'sky': createAuraLayer('aura-sky')
    };
    Object.values(auraLayers).forEach(layer => dot.appendChild(layer));

    const textLayer = document.createElement('div');
    textLayer.id = 'ling-time-text';
    textLayer.textContent = '---';
    dot.appendChild(textLayer);

    document.body.appendChild(dot);

    function createAuraLayer(className) {
        const layer = document.createElement('div');
        layer.className = `ling-aura-layer ${className}`;
        return layer;
    }

    // ================= 3. 神识避光：鼠标坐标联动算法 =================
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
            const lightX = 45 - (deltaX / distance) * 12 * influence;
            const lightY = 45 - (deltaY / distance) * 12 * influence;
            
            const shadowX = (deltaX / distance) * 14 * influence;
            const shadowY = 10 + (deltaY / distance) * 14 * influence;
            const shadowBlur = 30 + influence * 15;

            dot.style.setProperty('--ling-light-x', `${lightX}%`);
            dot.style.setProperty('--ling-light-y', `${lightY}%`);
            dot.style.setProperty('--ling-shadow-x', `${shadowX}px`);
            dot.style.setProperty('--ling-shadow-y', `${shadowY}px`);
            dot.style.setProperty('--ling-shadow-blur', `${shadowBlur}px`);
        } else {
            dot.style.setProperty('--ling-light-x', '45%');
            dot.style.setProperty('--ling-light-y', '45%');
            dot.style.setProperty('--ling-shadow-x', '0px');
            dot.style.setProperty('--ling-shadow-y', '10px');
            dot.style.setProperty('--ling-shadow-blur', '30px');
        }
    });

    // ================= 4. 纳芥收敛：3秒无交互自适应半隐 =================
    let fadeTimer = null;
    function resetFadeTimer() {
        clearTimeout(fadeTimer);
        dot.style.opacity = '1'; 
        fadeTimer = setTimeout(() => {
            if (!isDragging) dot.style.opacity = '0.3'; 
        }, 3000);
    }
    
    dot.addEventListener('mouseenter', resetFadeTimer);
    dot.addEventListener('mousemove', resetFadeTimer);

    // ================= 5. 核心时辰监听逻辑 =================
    let lastKey = ""; 

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

        let currentKey = ""; let textStyle = ""; let shellState = ""; 

        switch (hour) {
            case '寅': currentKey = "sky"; textStyle = "text-sky-style"; shellState = "state-sky"; break;
            case '酉': currentKey = "sunset"; textStyle = "text-sunset-style"; shellState = "state-sunset"; break;
            case '卯': case '辰': case '巳': case '午': case '未': case '申':
                currentKey = "day"; textStyle = "text-day-style"; shellState = "state-day"; break;
            case '戌': case '亥': case '子': case '丑':
                currentKey = "night"; textStyle = "text-night-style"; shellState = "state-night"; break;
        }

        if (lastKey !== currentKey) {
            Object.keys(auraLayers).forEach(key => {
                if (key === currentKey) auraLayers[key].classList.add('active');
                else auraLayers[key].classList.remove('active');
            });
            dot.className = shellState;
            dot.classList.remove('run-rotate-day', 'run-rotate-night');
            if (currentKey === 'day') dot.classList.add('run-rotate-day');
            if (currentKey === 'night') dot.classList.add('run-rotate-night');
            textLayer.className = textStyle;
            if (lastKey !== "") triggerShockwave();
            lastKey = currentKey;
        }
    }

    const observer = new MutationObserver(() => {
        if (window.dotTimer) clearTimeout(window.dotTimer);
        window.dotTimer = setTimeout(updateDotStyle, 100);
    });
    const targetNode = document.getElementById('headerGameTime');
    if (targetNode) observer.observe(targetNode, { childList: true, characterData: true, subtree: true, attributes: true });

    // ================= 6. 严格四维磁力吸附拖拽 =================
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

        // 磁吸时的缓动控制
        dot.style.transition = 'left 0.4s cubic-bezier(0.25, 1, 0.5, 1), top 0.4s cubic-bezier(0.25, 1, 0.5, 1), transform 0.2s, opacity 0.6s';
        dot.style.left = finalLeft + 'px';
        dot.style.top = finalTop + 'px';

        localStorage.setItem('ling_time_dot_position', JSON.stringify({ left: finalLeft, top: finalTop }));
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
        snapToEdges(parseFloat(dot.style.left), parseFloat(dot.style.top));
    });

    loadSavedPosition();
    setTimeout(updateDotStyle, 500);

})();
