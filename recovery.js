const fs = require('fs');
const path = require('path');

const filePath = path.join('e:', 'pharma', 'pitch_deck.html');
let content = fs.readFileSync(filePath, 'utf8');

// Fix the CSS mess
const cssStart = content.indexOf('/* ── DECK ── */');
const cssEnd = content.indexOf('/* orbs */');

if (cssStart !== -1 && cssEnd !== -1) {
    const newCSS = `/* ── DECK ── */
        #deck {
            width: 100%;
            height: 100%;
            position: relative;
        }

        /* ── FIXED GLOBAL LOGO ── */
        #global-logo {
            position: fixed;
            top: 24px;
            right: 24px;
            z-index: 500;
            pointer-events: none;
        }

        #global-logo img {
            height: 70px;
            width: auto;
            max-width: 200px;
            object-fit: contain;
            display: block;
            opacity: 0.88;
            filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.18));
        }

        /* ── SLIDE LAYOUT FIX ── */
        .slide {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity .65s ease, transform .65s ease;
            transform: translateY(28px);
            padding: 100px 60px 80px 60px;
            overflow: hidden;
            box-sizing: border-box;
            text-align: center;
            z-index: 1;
            background: var(--slide-bg);
        }

        .slide.active {
            opacity: 1;
            pointer-events: all;
            transform: translateY(0);
        }

        .slide.exit {
            opacity: 0;
            transform: translateY(-28px);
        }

        /* Target all direct children except orbs to ensure they stay within max-width */
        .slide > *:not(.orb) {
            width: 100%;
            max-width: 1100px;
            margin-left: auto;
            margin-right: auto;
            position: relative;
            z-index: 2;
            flex-shrink: 0;
        }

        /* BG per slide — pharma enterprise */
        .s1 { background: radial-gradient(ellipse at 25% 55%, #dbeafe 0%, var(--slide-bg) 70%); }
        .s2 { background: radial-gradient(ellipse at 75% 25%, #e0e7f5 0%, var(--slide-bg) 70%); }
        .s3 { background: radial-gradient(ellipse at 20% 70%, #dbeafe 0%, var(--slide-bg) 70%); }
        .s4 { background: radial-gradient(ellipse at 70% 60%, #e0e7f5 0%, var(--slide-bg) 70%); }
        .s5 { background: radial-gradient(ellipse at 30% 30%, #dbeafe 0%, var(--slide-bg) 70%); }
        .s6 { background: radial-gradient(ellipse at 75% 40%, #d1fae5 0%, var(--slide-bg) 70%); }
        .s7 { background: radial-gradient(ellipse at 40% 65%, #dbeafe 0%, var(--slide-bg) 70%); }
        .s8 { background: radial-gradient(ellipse at 20% 40%, #e0e7f5 0%, var(--slide-bg) 70%); }
        .s9 { background: radial-gradient(ellipse at 65% 50%, #dbeafe 0%, var(--slide-bg) 70%); }
        .s10 { background: radial-gradient(ellipse at 35% 55%, #d1fae5 0%, var(--slide-bg) 70%); }
        .s11 { background: radial-gradient(ellipse at 50% 50%, #dbeafe 0%, var(--slide-bg) 70%); }

        `;
    content = content.substring(0, cssStart) + newCSS + content.substring(cssEnd);
}

// Ensure html, body have required styles
content = content.replace(/html,\s*body\s*\{[^}]*\}/s, `html, body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
            background: var(--bg);
            color: var(--white);
            overflow: hidden;
            background-color: #F8FAFC; /* Fallback for light theme */
        }`);

fs.writeFileSync(filePath, content);
console.log('Final layout recovery executed.');
