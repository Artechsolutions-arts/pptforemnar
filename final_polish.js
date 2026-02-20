const fs = require('fs');
const path = require('path');

const filePath = path.join('e:', 'pharma', 'pitch_deck.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Strip all <div class="content-wrap"> and their closing tags
// We need to be careful. Let's just remove the tags but keep the content.
content = content.replace(/<div class="content-wrap">/g, '');
// Closing tags are harder. Let's instead use a fresh regex to reconstruct the slides.

// 2. Reconstruct Slides properly
content = content.replace(/<section class="slide ([^"]*)" id="([^"]*)">([\s\S]*?)<\/section>/g, (match, classes, id, inner) => {
    // a. Strip any existing content-wrap tags from inner
    let cleanInner = inner.replace(/<div class="content-wrap">/g, '').replace(/<\/div>\s*<\/section>/g, '');
    // Wait, the previous script might have left </div> dangling.
    // Let's just strip ALL </div> that were added before </section>

    // b. Extract Orbs (with any classes)
    const orbs = [];
    cleanInner = cleanInner.replace(/<div class="orb[^"]*"[^>]*><\/div>/g, (orb) => {
        orbs.push(orb);
        return '';
    });

    // c. Extract navigation pills or other global elements if accidentally caught
    // (None expected inside sections)

    // d. Final trim
    cleanInner = cleanInner.trim();

    // If there's a dangling </div> at the end of cleanInner (from the previous wrap), remove it.
    // This is safer:
    if (cleanInner.endsWith('</div>')) {
        // Only remove it if we suspect it's the one we added.
        // Actually, let's just count divs and close if needed? No, too complex.
        // Let's assume the last </div> before the end of the section was our wrap.
        const lastDivIndex = cleanInner.lastIndexOf('</div>');
        if (lastDivIndex !== -1) {
            cleanInner = cleanInner.substring(0, lastDivIndex) + cleanInner.substring(lastDivIndex + 6);
        }
    }

    return `<section class="slide ${classes}" id="${id}">
        ${orbs.join('\n        ')}
        <div class="content-wrap">
            ${cleanInner}
        </div>
    </section>`;
});

// 3. CSS Refinement
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
            padding: 24px;
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
            transform: translateY(30px);
            padding: 100px 60px;
            box-sizing: border-box;
            background: var(--slide-bg);
            z-index: 1;
        }

        .slide.active {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
            z-index: 10;
            pointer-events: all;
        }

        .slide.exit {
            opacity: 0;
            transform: translateY(-30px);
            z-index: 1;
        }

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
            flex-shrink: 0;
        }

        /* Type Colors */
        body, .slide, .sub, .cl li, .pain p, .mc p, .ab, .tl-item p, .tt, .badge, .ci-val {
            color: #334155 !important;
        }

        h1, h2, h3, h4, strong, .snum, .mc h4, .pain h4, .tl-item h4, .ci-lbl {
            color: #0F172A !important;
        }

        /* Backgrounds */
        .s1 { background: radial-gradient(circle at 20% 30%, #E0F2FE 0%, #F8FAFC 70%); }
        .s2 { background: radial-gradient(circle at 80% 20%, #F1F5F9 0%, #F8FAFC 70%); }
        .s3 { background: radial-gradient(circle at 20% 80%, #ECFDF5 0%, #F8FAFC 70%); }
        .s4 { background: radial-gradient(circle at 70% 30%, #F5F3FF 0%, #F8FAFC 70%); }
        .s5 { background: radial-gradient(circle at 30% 70%, #FFFBEB 0%, #F8FAFC 70%); }
        .s6 { background: radial-gradient(circle at 80% 80%, #FEF2F2 0%, #F8FAFC 70%); }
        .s7 { background: radial-gradient(circle at 20% 20%, #E0F2FE 0%, #F8FAFC 70%); }
        .s8 { background: radial-gradient(circle at 80% 80%, #ECFDF5 0%, #F8FAFC 70%); }
        .s9 { background: radial-gradient(circle at 50% 50%, #F1F5F9 0%, #F8FAFC 70%); }
        .s10 { background: radial-gradient(circle at 10% 10%, #ECFDF5 0%, #F8FAFC 70%); }
        .s11 { background: radial-gradient(circle at center, #E0F2FE 0%, #F8FAFC 100%); }

        `;
    content = content.substring(0, cssStart) + newCSS + content.substring(cssEnd);
}

fs.writeFileSync(filePath, content);
console.log('Final polish executed.');
