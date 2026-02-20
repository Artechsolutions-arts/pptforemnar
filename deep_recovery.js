const fs = require('fs');
const path = require('path');

const filePath = path.join('e:', 'pharma', 'pitch_deck.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Wrap content of each slide in <div class="content-wrap">
// We find each <section class="slide ..."> and wrap everything inside except orbs
content = content.replace(/<section class="slide ([^"]*)" id="([^"]*)">([\s\S]*?)<\/section>/g, (match, classes, id, inner) => {
    // Separate orbs from rest of content
    const orbs = [];
    let rest = inner.replace(/<div class="orb"[^>]*><\/div>/g, (orb) => {
        orbs.push(orb);
        return '';
    });

    // Clean up extra whitespace/newlines
    rest = rest.trim();

    return `<section class="slide ${classes}" id="${id}">
        ${orbs.join('\n        ')}
        <div class="content-wrap">
            ${rest}
        </div>
    </section>`;
});

// 2. Comprehensive CSS Reset for Slides
const cssStart = content.indexOf('/* ── DECK ── */');
const cssEnd = content.indexOf('/* orbs */');

if (cssStart !== -1 && cssEnd !== -1) {
    const newCSS = `/* ── DECK ── */
        #deck {
            width: 100vw;
            height: 100vh;
            position: relative;
            background: #F8FAFC;
        }

        #global-logo {
            position: fixed;
            top: 24px;
            right: 24px;
            z-index: 1000;
            pointer-events: none;
        }

        #global-logo img {
            height: 60px;
            width: auto;
            opacity: 0.9;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }

        .fm {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: .65rem;
            letter-spacing: 2px;
            color: rgba(15, 23, 42, 0.2);
            text-transform: uppercase;
            padding: 20px;
            z-index: 1000;
            pointer-events: none;
        }

        .slide {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.8s ease, transform 0.8s ease;
            transform: translateY(20px);
            padding: 80px 60px;
            box-sizing: border-box;
            background: var(--slide-bg);
        }

        .slide.active {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
            z-index: 10;
        }

        .slide.exit {
            opacity: 0;
            transform: translateY(-20px);
        }

        /* The Content Wrap - Boradroom Level Centering */
        .content-wrap {
            width: 100%;
            max-width: 1100px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            position: relative;
            z-index: 5;
        }

        /* Ensure text is visible in light mode */
        body, .slide {
            color: #1E293B; /* Slate 800 */
        }

        h1, h2, h3, h4, strong {
            color: #0F172A; /* Slate 900 */
        }

        /* Backgrounds */
        .s1 { background: radial-gradient(circle at center, #E0F2FE, #F8FAFC); }
        .s2 { background: radial-gradient(circle at center, #F1F5F9, #F8FAFC); }
        .s3 { background: radial-gradient(circle at center, #ECFDF5, #F8FAFC); }
        .s4 { background: radial-gradient(circle at center, #F5F3FF, #F8FAFC); }
        .s5 { background: radial-gradient(circle at center, #FFFBEB, #F8FAFC); }
        .s6 { background: radial-gradient(circle at center, #FEF2F2, #F8FAFC); }
        .s7 { background: radial-gradient(circle at center, #E0F2FE, #F8FAFC); }
        .s8 { background: radial-gradient(circle at center, #ECFDF5, #F8FAFC); }
        .s9 { background: radial-gradient(circle at center, #F1F5F9, #F8FAFC); }
        .s10 { background: radial-gradient(circle at center, #ECFDF5, #F8FAFC); }
        .s11 { background: radial-gradient(circle at center, #E0F2FE, #F8FAFC); }

        `;
    content = content.substring(0, cssStart) + newCSS + content.substring(cssEnd);
}

// 3. Fix potential body hidden issue
content = content.replace(/html,\s*body\s*\{[^}]*\}/s, `html, body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: #F8FAFC;
        }`);

fs.writeFileSync(filePath, content);
console.log('Deep recovery complete.');
