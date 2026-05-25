// ==UserScript==
// @name         灵界时辰天道液态玻璃珠 (v20.6.7 纳芥袖珍版)
// @namespace    http://tampermonkey.net/
// @version      20.6.7
// @description  基于20.6.6大版本。极致袖珍化微调：缩小古法篆体真言字号，拉大内部留白，使法宝界面更显玲珑精致、微雕质感。
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

    // 注入古法真言专属字体声明
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

    // ================= 1. 殿堂级天道美化 CSS (袖珍精细化微调) =================
    const STYLES = `
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
            overflow: hidden; 
            
            backdrop-filter: blur(12px) saturate(210%);
            -webkit-backdrop-filter: blur(12px) saturate(210%);
            
            /* 极致3D复合玻璃阴影 */
            box-shadow: 
                0 10px 30px rgba(0, 0, 0, 0.45),                    
                inset 5px 5px 10px rgba(255, 255, 255, 0.6),       
                inset -4px -4px 8px rgba(0, 0, 0, 0.45),            
                inset 0 0 12px rgba(255, 255, 255, 0.2);           
                
            border: 1px solid rgba(255, 255, 255, 0.4);
            transition: border-color 1s ease,
                        box-shadow 0.4s ease,
                        transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* 2. 四象法相独立底色图层 */
        .ling-aura-layer {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            border-radius: 50%;
            opacity: 0; 
            z-index: 1;
            background-size: 160% 160%, 100% 100%;
            transition: opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1); 
        }

        /* 各界域法相专属流光与潮汐位移 */
        .aura-day {
            background-color: #f4f3f0;
            background-image: 
                radial-gradient(circle at 45% 45%, rgba(138, 180, 248, 0.9) 0%, transparent 45%), 
                radial-gradient(circle at 52% 52%, rgba(255, 182, 193, 0.6) 0%, rgba(244, 243, 240, 0.2) 70%, rgba(230, 225, 215, 0.6) 100%);
            animation: tideDayPure 14s infinite cubic-bezier(0.25, 1, 0.2, 1);
        }
        .aura-night {
            background-color: #111;
            background-image: 
                radial-gradient(circle at 46% 46%, rgba(139, 92, 246, 0.95) 0%, transparent 50%), 
                radial-gradient(circle at 54% 54%, rgba(29, 78, 216, 0.6) 0%, rgba(20, 24, 30, 0.8) 75%, rgba(10, 12, 15, 0.95) 100%);
            animation: tideNightPure 14s infinite cubic-bezier(0.25, 1, 0.2, 1);
        }
        .aura-sunset { background: radial-gradient(circle at 45% 45%, #ff4e50 0%, #f97316 50%, #feb47b 100%); }
        .aura-sky { background: radial-gradient(circle at 45% 45%, #06b6d4 0%, #3b82f6 50%, #111827 100%); }

        .ling-aura-layer.active { opacity: 1; }

        /* 3. 【20.6.7 核心调优】袖珍真言层 (降低字号，拉出边缘留白空间) */
        #ling-time-text {
            position: relative;
            z-index: 5; 
            font-family: "ShuowenZuan", "LiSu", "KaiTi", serif; 
            font-size: 14px; /* 从 20px 缩敛至 14px，视觉聚焦更为袖珍 */
            font-weight: 700;
            text-align: center;
            line-height: 44px;
            width: 100%; height: 100%;
            display: flex; align-items: center; justify-content: center;
            /* 篆体字形普遍靠上，加一个微调位移确保在小字号下绝对居中 */
            padding-top: 1px; 
            box-sizing: border-box;
            transition: color 0.2s ease-in-out, 
                        text-shadow 0.2s ease-in-out, 
                        -webkit-text-stroke 0.2s ease-in-out, 
                        font-weight 0.2s ease-in-out;
        }

        /* 4. 处于不同界域时，真言文字字体的基础调色 */
        .text-day-style { color: #2c353e; text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8); -webkit-text-stroke: 0px transparent; }
        .text-night-style { color: #e2e8f0; text-shadow: 0 1px 3px rgba(139, 92, 246, 0.8); -webkit-text-stroke: 0px transparent; }
        .text-sunset-style { color: #ffffff; text-shadow: 0 1px 3px rgba(255, 0, 0, 0.7); -webkit-text-stroke: 0px transparent; }
        .text-sky-style { color: #ffffff; text-shadow: 0 1px 3px rgba(0, 136, 255, 0.8); -webkit-text-stroke: 0px transparent; }

        /* 5. 悬浮激活态 */
        #ling-time-dot:hover { transform: scale(1.12); }
        #ling-time-dot:hover .ling-aura-layer { animation-play-state: paused !important; }
        #ling-time-dot:hover::before, #ling-time-dot:hover::after { animation-play-state: paused !important; }

        /* 袖珍版 Hover 篆体字形爆破显化（字号略微回升到 15px 配合描边，保持袖珍美感） */
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

        /* 6. 外围浑天星轨 */
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

        /* 星轨挂机静谧转动 */
        .run-rotate-day::before { animation: starRotateClockwise 25s linear infinite; }
        .run-rotate-night::before { animation: starRotateClockwise 30s linear infinite; }
        .run-rotate-night::after { border: 1px dashed rgba(255, 255, 255, 0.05); opacity: 0.5; animation: starRotateCounter 40s linear infinite; }

        /* 时辰突变震荡 */
        .ling-pulse-trigger { animation: lingShock 0.45s cubic-bezier(0.25, 1, 0.5, 1) !important; }
        @keyframes lingShock {
            0% { transform: scale(1); }
            30% { transform: scale(1.15); box-shadow: 0 0 35px rgba(255,255,255,0.6), 0 10px 30px rgba(0,0,0,0.45); }
            100% { transform: scale(1); }
        }

        /* 潮汐位移 */
        @keyframes tideDayPure {
            0%, 100% { background-position: 0% 0%, 100% 100%; }
            15% { background-position: 30% 20%, 70% 80%; }
        }
        @keyframes tideNightPure {
            0%, 100% { background-position: 0% 100%, 100% 0%; }
            15% { background-position: 40% 60%, 60% 40%; }
        }
        @keyframes starRotateClockwise { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes starRotateCounter { 0% { transform: rotate(0deg); } 100% { transform: rotate(-360deg); } }

        /* 移动端更精细的比例缩减 */
        @media screen and (max-width: 768px) {
            #ling-time-dot { width: 40px; height: 40px; }
            #ling-time-text { font-size: 13px; line-height: 40px; }
            #ling-time-dot.state-day:hover #ling-time-text,
            #ling-time-dot.state-night:hover #ling-time-text,
            #ling-time-dot.state-sunset:hover #ling-time-text,
            #ling-time-dot.state-sky:hover #ling-time-text { font-size: 14px; }
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

    function loadSavedPosition() {
        const savedPos = localStorage.getItem('ling_time_dot_position');
        if (savedPos) {
            try {
                const pos = JSON.parse(savedPos);
                const maxLeft = window.innerWidth - 44;
                const maxTop = window.innerHeight - 44;
                dot.style.left = Math.max(0, Math.min(maxLeft, pos.left)) + 'px';
                dot.style.top = Math.max(0, Math.min(maxTop, pos.top)) + 'px';
                dot.style.right = 'auto'; 
            } catch (e) {}
        }
    }

    // ================= 3. 核心解耦切换逻辑 =================
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

        let currentKey = ""; 
        let textStyle = "";  
        let shellState = ""; 

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
                if (key === currentKey) {
                    auraLayers[key].classList.add('active');
                } else {
                    auraLayers[key].classList.remove('active');
                }
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

    // ================= 4. 静默变动监听 =================
    const observer = new MutationObserver(() => {
        if (window.dotTimer) clearTimeout(window.dotTimer);
        window.dotTimer = setTimeout(updateDotStyle, 100);
    });

    const targetNode = document.getElementById('headerGameTime');
    if (targetNode) {
        observer.observe(targetNode, { childList: true, characterData: true, subtree: true, attributes: true });
    }

    loadSavedPosition();
    setTimeout(updateDotStyle, 500);

    // ================= 5. 严格内窗口移动拖拽 =================
    let isDragging = false;
    let offsetX, offsetY;

    const startDrag = (clientX, clientY) => {
        isDragging = true;
        offsetX = clientX - dot.getBoundingClientRect().left;
        offsetY = clientY - dot.getBoundingClientRect().top;
        dot.style.transition = 'none'; 
    };

    const moveDrag = (clientX, clientY, isTouch = false) => {
        if (!isDragging) return;
        let targetLeft = clientX - offsetX;
        let targetTop = clientY - offsetY;
        if (isTouch) {
            const currentLeft = parseFloat(dot.style.left) || dot.getBoundingClientRect().left;
            const currentTop = parseFloat(dot.style.top) || dot.getBoundingClientRect().top;
            targetLeft = currentLeft + (targetLeft - currentLeft) * 0.85; 
            targetTop = currentTop + (targetTop - currentTop) * 0.85;
        }
        const maxLeft = window.innerWidth - dot.offsetWidth;
        const maxTop = window.innerHeight - dot.offsetHeight;
        dot.style.left = Math.max(0, Math.min(maxLeft, targetLeft)) + 'px';
        dot.style.top = Math.max(0, Math.min(maxTop, targetTop)) + 'px';
        dot.style.right = 'auto';
    };

    const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        dot.style.transition = 'border-color 0.8s, left 0.15s ease, top 0.15s ease, transform 0.2s ease';
        localStorage.setItem('ling_time_dot_position', JSON.stringify({
            left: parseFloat(dot.style.left),
            top: parseFloat(dot.style.top)
        }));
    };

    dot.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
    document.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
    document.addEventListener('mouseup', endDrag);

    dot.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    dot.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) moveDrag(e.touches[0].clientX, e.touches[0].clientY, true);
    }, { passive: true });
    dot.addEventListener('touchend', endDrag);

    window.addEventListener('resize', () => {
        if (!dot.style.left) return;
        const maxLeft = window.innerWidth - dot.offsetWidth;
        const maxTop = window.innerHeight - dot.offsetHeight;
        dot.style.left = Math.max(0, Math.min(maxLeft, parseFloat(dot.style.left))) + 'px';
        dot.style.top = Math.max(0, Math.min(maxTop, parseFloat(dot.style.top))) + 'px';
    });

})();
