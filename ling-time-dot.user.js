// ==UserScript==
// @name         灵界时辰天道液态玻璃珠 (v20.6.5 本源独立版)
// @namespace    http://tampermonkey.net/
// @version      20.6.5
// @description  基于20.6.4真言悬浮版。彻底重构逻辑：去掉游戏原生昼夜判定，灵珠光效状态完全由时辰汉字（地支）独立自主掌控。
// @author       修仙道友
// @match        https://ling.muge.info/game.html
// @match        http://ling.muge.info/game.html
// @icon         https://ling.muge.info/favicon.svg
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // ================= 1. 殿堂级天道美化 CSS =================
    const STYLES = `
        #ling-time-dot {
            position: fixed;
            top: 85px;
            right: 20px;
            z-index: 10000;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
            font-size: 16px;
            font-weight: bold;
            cursor: move;
            user-select: none;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            
            backdrop-filter: blur(12px) saturate(210%);
            -webkit-backdrop-filter: blur(12px) saturate(210%);
            
            /* 极致3D复合阴影 */
            box-shadow: 
                0 10px 30px rgba(0, 0, 0, 0.45),                    
                inset 5px 5px 10px rgba(255, 255, 255, 0.6),       
                inset -4px -4px 8px rgba(0, 0, 0, 0.45),            
                inset 0 0 12px rgba(255, 255, 255, 0.2);           
                
            transition: background 1.2s cubic-bezier(0.4, 0, 0.2, 1), 
                        color 0.2s ease-in-out, 
                        border-color 0.8s ease-in-out, 
                        box-shadow 0.4s ease-in-out,
                        text-shadow 0.2s ease-in-out,
                        -webkit-text-stroke 0.2s ease-in-out,
                        font-weight 0.2s ease-in-out,
                        transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* 星轨::before：白昼自转与潮汐 */
        #ling-time-dot::before {
            content: '';
            position: absolute;
            top: -6px; left: -6px; right: -6px; bottom: -6px;
            border-radius: 50%;
            border: 1px dashed rgba(255, 255, 255, 0.15);
            pointer-events: none;
            z-index: -1;
            opacity: 0.8;
            transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* 星轨::after：黑夜自转与潮汐 */
        #ling-time-dot::after {
            content: '';
            position: absolute;
            top: -12px; left: -12px; right: -12px; bottom: -12px;
            border-radius: 50%;
            background: transparent;
            border: 1px dashed rgba(255, 255, 255, 0); 
            pointer-events: none;
            z-index: -2;
            opacity: 0;
            transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* 悬浮激活态（文字绝对不动，星轨动画暂停） */
        #ling-time-dot:hover { transform: scale(1.12); }
        #ling-time-dot:hover::before, #ling-time-dot:hover::after { animation-play-state: paused !important; }
        
        #ling-time-dot:hover::before {
            border: 1px dashed rgba(197, 160, 89, 0.6);
            transform: rotate(180deg); top: -8px; left: -8px; right: -8px; bottom: -8px; opacity: 1;
        }
        #ling-time-dot:hover::after {
            border: 1px dashed rgba(230, 230, 230, 0.15); 
            transform: rotate(-120deg); top: -14px; left: -14px; right: -14px; bottom: -14px; opacity: 1;
        }

        #ling-time-dot:active { transform: scale(0.95); }

        /* 时辰突变震荡 */
        .ling-pulse-trigger { animation: lingShock 0.45s cubic-bezier(0.25, 1, 0.5, 1) !important; }
        @keyframes lingShock {
            0% { transform: scale(1); box-shadow: 0 0 0px rgba(255,255,255,0); }
            30% { transform: scale(1.18); box-shadow: 0 0 40px rgba(255,255,255,0.75); }
            100% { transform: scale(1); box-shadow: 0 10px 30px rgba(0,0,0,0.45); }
        }

        /* 潮汐位移动画 */
        @keyframes tideDayPure {
            0%, 100% { box-shadow: 0 10px 30px rgba(0,0,0,0.45), inset 5px 5px 10px rgba(255,255,255,0.6); background-position: 0% 0%, 100% 100%; }
            15% { box-shadow: 0 12px 35px rgba(138,180,248,0.25), inset 5px 5px 10px rgba(255,255,255,0.7); background-position: 30% 20%, 70% 80%; }
        }
        @keyframes tideNightPure {
            0%, 100% { box-shadow: 0 10px 30px rgba(0,0,0,0.45), 0 0 15px rgba(139,92,246,0.1); background-position: 0% 100%, 100% 0%; }
            15% { box-shadow: 0 14px 35px rgba(0,0,0,0.5), 0 0 25px rgba(139,92,246,0.3); background-position: 40% 60%, 60% 40%; }
        }

        @keyframes starRotateClockwise { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes starRotateCounter { 0% { transform: rotate(0deg); } 100% { transform: rotate(-360deg); } }

        /* 1. 白昼极光 (卯、辰、巳、午、未、申) */
        .ling-state-day {
            background-color: #f4f3f0;
            color: #2c353e; font-weight: 700;
            border: 1px solid rgba(255, 255, 255, 0.55);
            text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
            background-image: 
                radial-gradient(circle at 45% 45%, rgba(138, 180, 248, 0.9) 0%, transparent 45%), 
                radial-gradient(circle at 52% 52%, rgba(255, 182, 193, 0.6) 0%, rgba(244, 243, 240, 0.2) 70%, rgba(230, 225, 215, 0.6) 100%);
            background-size: 160% 160%, 100% 100%;
            animation: tideDayPure 14s infinite cubic-bezier(0.25, 1, 0.2, 1); 
        }
        .ling-state-day::before { animation: starRotateClockwise 25s linear infinite; }
        .ling-state-day:hover {
            color: #000000 !important; font-weight: 900 !important; -webkit-text-stroke: 0.6px #000000; 
            text-shadow: 0px 1px 2px rgba(255, 255, 255, 0.9); 
            box-shadow: 0 18px 45px rgba(0, 0, 0, 0.55), inset 7px 7px 12px rgba(255, 255, 255, 0.7);
        }
        
        /* 2. 黑夜霓虹 (戌、亥、子、丑) */
        .ling-state-night {
            background-color: #111;
            color: #e2e8f0; font-weight: 700;
            border: 1px solid rgba(197, 160, 89, 0.35);
            text-shadow: 0 1px 4px rgba(139, 92, 246, 0.8);
            background-image: 
                radial-gradient(circle at 46% 46%, rgba(139, 92, 246, 0.95) 0%, transparent 50%), 
                radial-gradient(circle at 54% 54%, rgba(29, 78, 216, 0.6) 0%, rgba(20, 24, 30, 0.8) 75%, rgba(10, 12, 15, 0.95) 100%);
            background-size: 160% 160%, 100% 100%;
            animation: tideNightPure 14s infinite cubic-bezier(0.25, 1, 0.2, 1);
        }
        .ling-state-night::before { animation: starRotateClockwise 30s linear infinite; }
        .ling-state-night::after { border: 1px dashed rgba(255, 255, 255, 0.05); opacity: 0.5; animation: starRotateCounter 40s linear infinite; }
        .ling-state-night:hover {
            color: #050508 !important; font-weight: 900 !important; -webkit-text-stroke: 0.8px #c5a059; 
            text-shadow: 0 0 6px rgba(139, 92, 246, 0.9), 0 0 12px rgba(29, 78, 216, 0.7);
            box-shadow: 0 18px 45px rgba(0, 0, 0, 0.55), 0 0 25px rgba(139,92,246,0.25);
        }

        /* 3. 酉时夕照 */
        .ling-state-sunset {
            background: radial-gradient(circle at 45% 45%, #ff4e50 0%, #f97316 50%, #feb47b 100%);
            color: #ffffff; font-weight: 700;
            border: 1px solid rgba(255, 78, 80, 0.5);
            text-shadow: 0 1px 4px rgba(255, 0, 0, 0.7);
        }
        .ling-state-sunset:hover { 
            color: #4a0000 !important; font-weight: 900 !important; -webkit-text-stroke: 0.6px #4a0000;
            text-shadow: 0 0 8px rgba(255, 78, 80, 0.8); 
        }

        /* 4. 寅时破晓 */
        .ling-state-sky {
            background: radial-gradient(circle at 45% 45%, #06b6d4 0%, #3b82f6 50%, #111827 100%);
            color: #ffffff; font-weight: 700;
            border: 1px solid rgba(59, 130, 246, 0.5);
            text-shadow: 0 1px 4px rgba(0, 136, 255, 0.8);
        }
        .ling-state-sky:hover { 
            color: #001133 !important; font-weight: 900 !important; -webkit-text-stroke: 0.6px #001133;
            text-shadow: 0 0 8px rgba(6, 182, 212, 0.9); 
        }

        /* 5. 混沌断线兜底 */
        .ling-state-unknown {
            background: radial-gradient(circle at center, rgba(130,130,130,0.8) 0%, rgba(20,20,20,0.9) 100%);
            color: #666; border: 1px solid rgba(150,150,150,0.4); text-shadow: none;
        }

        @media screen and (max-width: 768px) {
            #ling-time-dot { width: 40px; height: 40px; font-size: 14px; }
        }
    `;

    const styleNode = document.createElement('style');
    styleNode.textContent = STYLES;
    document.head.appendChild(styleNode);

    // ================= 2. 创建 DOM 并读取历史位置 =================
    const dot = document.createElement('div');
    dot.id = 'ling-time-dot';
    dot.className = 'ling-state-unknown'; 
    dot.textContent = '---';
    document.body.appendChild(dot);

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

    // ================= 3. 核心解耦切换逻辑 (【20.6.5 斩断因果】) =================
    let lastClass = "";

    function triggerShockwave() {
        dot.classList.add('ling-pulse-trigger');
        setTimeout(() => { dot.classList.remove('ling-pulse-trigger'); }, 450); 
    }

    function updateDotStyle() {
        const headerNode = document.getElementById('headerGameTime');
        
        if (!headerNode || !headerNode.textContent) {
            if (lastClass !== "ling-state-unknown") {
                dot.className = "ling-state-unknown";
                dot.textContent = "---";
                lastClass = "ling-state-unknown";
            }
            return;
        }

        const rawText = headerNode.textContent.trim();
        const hourMatch = rawText.match(/([子丑寅卯辰巳午未申酉戌亥])时/);
        if (!hourMatch) return;
        
        const hour = hourMatch[1];
        if (dot.textContent !== hour) dot.textContent = hour; 

        // --- 核心重构：彻底删除原生 is-night 与 (夜) 的状态获取 ---
        let currentClass = "";
        
        // 按照纯粹的地支属性，进行大界域光效分配
        switch (hour) {
            case '寅':
                currentClass = "ling-state-sky";     // 破晓冰蓝
                break;
            case '酉':
                currentClass = "ling-state-sunset";  // 夕照琥珀
                break;
            case '卯':
            case '辰':
            case '巳':
            case '午':
            case '未':
            case '申':
                currentClass = "ling-state-day";     // 绝对白昼
                break;
            case '戌':
            case '亥':
            case '子':
            case '丑':
                currentClass = "ling-state-night";   // 绝对黑夜
                break;
            default:
                currentClass = "ling-state-unknown";
        }

        if (lastClass !== currentClass) {
            dot.className = currentClass;
            if (lastClass !== "") { 
                triggerShockwave();
            }
            lastClass = currentClass;
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

    // ================= 5. 严格内窗口移动拖拽与手感阻尼 =================
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
        dot.style.transition = 'background 0.8s, color 0.2s, border-color 0.8s, left 0.15s ease, top 0.15s ease, text-shadow 0.2s, -webkit-text-stroke 0.2s, font-weight 0.2s, transform 0.2s ease';
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
