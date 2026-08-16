/**
 * Legal Renderer - Dynamically renders Privacy Policy and Legal Notice from assets/data/legal.json
 * Eliminates all duplication between HTML and legal.json.
 */

function getAssetPrefix() {
  return window.location.pathname.includes('/pages/') ? '../' : '';
}

async function renderLegal() {
  const prefix = getAssetPrefix();
  const scriptTag = document.currentScript || document.querySelector('script[data-legal]');
  const legalType = scriptTag ? scriptTag.getAttribute('data-legal') : 'privacy';

  const container = document.getElementById('legal-app');
  if (!container) return;

  try {
    const res = await fetch(`${prefix}assets/data/legal.json`);
    if (!res.ok) throw new Error('Failed to load legal data store');
    const legalData = await res.json();
    
    // Choose privacy or legalNotice
    const doc = legalType === 'legal-notice' || legalType === 'legalNotice' ? legalData.legalNotice : legalData.privacy;
    if (!doc) throw new Error(`Document type "${legalType}" not found in legal.json`);

    document.title = `${doc.title} | Lukas Kraus`;

    let html = `
      <div class="static-page-header">
        <h1><i class="${legalType.includes('notice') ? 'fas fa-file-contract' : 'fas fa-shield-alt'} text-cyan"></i> ${doc.title}</h1>
        <a href="${prefix}index.html" class="cyber-btn" onclick="if (window.opener) { window.close(); return false; }"><i class="fas fa-arrow-left"></i> Back to Game</a>
      </div>
      <div class="static-page-content">
    `;

    if (doc.subtitle) {
      html += `<p style="color: var(--text-muted); font-size: 13px; margin-bottom: 20px;"><em>${doc.subtitle}</em></p>`;
    }

    if (doc.sections) {
      doc.sections.forEach(sec => {
        html += `<h2>${sec.heading}</h2>`;
        if (sec.content) html += `<p>${sec.content}</p>`;

        if (sec.list && sec.list.length > 0) {
          html += `<ul style="margin-left: 20px; color: #cbd5e1; margin-bottom: 16px; line-height: 1.8;">`;
          sec.list.forEach(item => {
            html += `<li>${item}</li>`;
          });
          html += `</ul>`;
        }
      });
    }

    html += `
      </div>
      <div style="margin-top: 32px; text-align: center;">
        <a href="${prefix}index.html" class="cyber-btn" onclick="if (window.opener) { window.close(); return false; }"><i class="fas fa-gamepad"></i> Back to Game</a>
      </div>
    `;

    container.innerHTML = html;
  } catch (err) {
    console.error('Error rendering legal document:', err);
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #f43f5e; font-family: var(--font-mono);">
        <h3>Error Loading Legal Document</h3>
        <p>${err.message}</p>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', renderLegal);
