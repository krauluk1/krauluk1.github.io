/**
 * Article Renderer - Dynamically renders articles from assets/data/articles.json
 * Eliminates all content duplication between HTML and JSON data stores.
 * Supports execution from root and /pages/ subdirectories.
 */

function getAssetPrefix() {
  return window.location.pathname.includes('/pages/') ? '../' : '';
}

function resolveAssetUrl(url) {
  if (!url || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/') || url.startsWith('mailto:') || url.startsWith('#')) {
    return url;
  }
  return getAssetPrefix() + url;
}

async function renderArticle() {
  const prefix = getAssetPrefix();
  const scriptTag = document.currentScript || document.querySelector('script[data-article]');
  const defaultArticleKey = scriptTag ? scriptTag.getAttribute('data-article') : 'robocup';

  const urlParams = new URLSearchParams(window.location.search);
  const articleKey = urlParams.get('id') || defaultArticleKey;

  const container = document.getElementById('article-app');
  if (!container) return;

  try {
    const res = await fetch(`${prefix}assets/data/articles.json`);
    if (!res.ok) throw new Error('Failed to load articles data store');
    const articles = await res.json();
    const article = articles[articleKey];

    if (!article) {
      throw new Error(`Article with ID "${articleKey}" not found in articles.json`);
    }

    document.title = `${article.title} — Lukas Kraus`;

    let html = `
      <div class="static-page-header">
        <div>
          <div style="font-family: var(--font-mono); font-size: 11px; color: var(--cyan); text-transform: uppercase; margin-bottom: 4px; letter-spacing: 1px;">
            ${article.category}
          </div>
          <h1>${article.title}</h1>
        </div>
      </div>
    `;

    // Hero Media Header
    if (article.youtubeEmbedUrl) {
      html += `
        <div style="margin-bottom: 20px;">
          <img src="${resolveAssetUrl(article.heroImage)}" alt="${article.title}" style="width: 100%; border-radius: 12px; border: 1px solid var(--border-cyan); box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
          <div style="font-size: 12px; color: var(--text-muted); margin-top: 10px; font-family: var(--font-mono); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <span><i class="far fa-calendar-alt"></i> ${article.date} &bull; Author: ${article.author}</span>
            ${article.achievement ? `<span style="color: var(--green); font-weight: 600;"><i class="fas fa-trophy"></i> ${article.achievement}</span>` : ''}
          </div>
        </div>
      `;
    } else if (article.gallery) {
      html += `
        <div style="margin-bottom: 24px;">
          <div class="gallery-hero-wrapper" style="cursor: zoom-in;" onclick="openLightbox('${resolveAssetUrl(article.heroImage)}', '${article.heroCaption || article.title}')">
            <img src="${resolveAssetUrl(article.heroImage)}" alt="${article.title}" style="width: 100%; border-radius: 12px; border: 1px solid var(--border-cyan); box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
          </div>
          <div style="font-size: 12px; color: var(--text-muted); margin-top: 10px; font-family: var(--font-mono); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <span><i class="far fa-calendar-alt"></i> ${article.date} &bull; Author: ${article.author}</span>
            <span style="color: var(--cyan);"><i class="fas fa-search-plus"></i> Click any photo to enlarge in full-resolution</span>
          </div>
        </div>
      `;
    } else if (article.heroImage) {
      html += `
        <div style="margin-bottom: 24px; text-align: center;">
          <img src="${resolveAssetUrl(article.heroImage)}" alt="${article.title}" style="max-height: 200px; border-radius: 50%; border: 3px solid var(--pink); box-shadow: 0 0 30px rgba(255, 0, 127, 0.35);">
          <div style="font-size: 12px; color: var(--text-muted); margin-top: 14px; font-family: var(--font-mono); display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
            <span><i class="far fa-calendar-alt"></i> ${article.date || ''}</span>
            <span><i class="fas fa-user-astronaut"></i> Author: ${article.author}</span>
            ${article.achievement ? `<span style="color: var(--pink); font-weight: 600;"><i class="fas fa-trophy"></i> ${article.achievement}</span>` : ''}
          </div>
        </div>
      `;
    }

    html += `<div class="static-page-content">`;

    // Responsibility Callout Box (if specified)
    if (article.responsibility) {
      html += `
        <div style="background: rgba(0, 229, 255, 0.08); border: 1px solid var(--border-cyan); border-radius: 10px; padding: 16px; margin-bottom: 20px;">
          <h4 style="color: var(--cyan); margin-bottom: 6px; font-family: var(--font-heading);"><i class="fas fa-user-cog"></i> My Engineering Responsibility in Team SWOT</h4>
          <p style="margin: 0; color: #e2e8f0; font-size: 14px; line-height: 1.6;">${article.responsibility}</p>
        </div>
      `;
    }

    // Render Text Sections
    if (article.sections) {
      article.sections.forEach(sec => {
        if (article.responsibility && sec.heading.includes('My Engineering Responsibility')) return;

        html += `<h2>${sec.heading}</h2>`;
        if (sec.content) html += `<p>${sec.content}</p>`;

        if (sec.link) {
          html += `<p><a href="${sec.link.url}" target="_blank" rel="noopener noreferrer" style="color: var(--cyan); text-decoration: underline;">${sec.link.label} &rarr;</a></p>`;
        }

        if (sec.list && sec.list.length > 0) {
          html += `<ul style="margin-left: 20px; color: #cbd5e1; margin-bottom: 16px; line-height: 1.8;">`;
          sec.list.forEach(item => {
            const parts = item.split(':');
            if (parts.length > 1) {
              html += `<li><strong>${parts[0]}:</strong>${parts.slice(1).join(':')}</li>`;
            } else {
              html += `<li>${item}</li>`;
            }
          });
          html += `</ul>`;
        }

        if (sec.danceCards && sec.danceCards.length > 0) {
          html += `<div class="highlights-grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; margin: 20px 0;">`;
          sec.danceCards.forEach(card => {
            html += `
              <div class="highlight-card" style="border-left: 3px solid ${card.color};">
                <h4 style="color: ${card.color};"><i class="${card.icon}"></i> ${card.title}</h4>
                <p>${card.desc}</p>
              </div>
            `;
          });
          html += `</div>`;
        }
      });
    }

    // Render YouTube Video Player
    if (article.youtubeEmbedUrl) {
      html += `
        <div class="video-wrapper">
          <iframe id="roboCupVideo"
            src="${article.youtubeEmbedUrl}"
            title="${article.title}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
          </iframe>
        </div>
      `;
    }

    // Render WSDC Profile Card
    if (article.wsdcProfile) {
      html += `
        <div style="background: rgba(30, 41, 59, 0.6); border: 1px solid var(--border-cyan); border-radius: 12px; padding: 18px; margin: 20px 0;">
          <h4 style="color: var(--green); margin-bottom: 8px; font-family: var(--font-heading);"><i class="fas fa-certificate"></i> Official WSDC Competitor Profile</h4>
          <ul style="list-style: none; padding-left: 0; line-height: 1.9; font-size: 13px; font-family: var(--font-mono); color: #cbd5e1;">
            <li><strong>Dancer Name:</strong> ${article.wsdcProfile.name}</li>
            <li><strong>WSDC Registry ID:</strong> <a href="${article.wsdcProfile.registryUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--cyan); text-decoration: underline;">${article.wsdcProfile.wsdcId} (Verify in Official Registry &rarr;)</a></li>
            <li><strong>Primary Role:</strong> ${article.wsdcProfile.role}</li>
            <li><strong>Competition Level:</strong> ${article.wsdcProfile.level}</li>
            <li><strong>First Official Point:</strong> ${article.wsdcProfile.firstPoint}</li>
          </ul>
        </div>
      `;
    }

    // Render Interactive Photo Gallery with Lightbox
    if (article.gallery && article.gallery.length > 0) {
      html += `
        <h2>Featured Destinations &amp; Interactive Gallery</h2>
        <div class="highlights-grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
      `;
      article.gallery.forEach(item => {
        const resolvedImg = resolveAssetUrl(item.image);
        html += `
          <div class="highlight-card gallery-item-card" onclick="openLightbox('${resolvedImg}', '${item.caption}')">
            <div style="position: relative; overflow: hidden; border-radius: 8px; cursor: zoom-in;">
              <img src="${resolvedImg}" alt="${item.name}" style="width:100%; border-radius:8px; display:block; transition: transform 0.3s ease;">
              <div class="zoom-badge"><i class="fas fa-expand"></i> Zoom</div>
            </div>
            <div style="margin-top: 10px;">
              <h4>${item.name}</h4>
              <p>${item.desc}</p>
              <a href="${item.mapsUrl}" target="_blank" rel="noopener noreferrer" class="location-link" onclick="event.stopPropagation();">
                <i class="fas fa-map-marker-alt text-cyan"></i> View on Google Maps &rarr;
              </a>
            </div>
          </div>
        `;
      });
      html += `</div>`;
    }

    html += `</div>`;
    container.innerHTML = html;
  } catch (err) {
    console.error('Error rendering article:', err);
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #f43f5e; font-family: var(--font-mono);">
        <h3>Error Loading Article</h3>
        <p>${err.message}</p>
      </div>
    `;
  }
}

// Lightbox controller functions
function openLightbox(src, caption) {
  const lightbox = document.getElementById('image-lightbox');
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');
  if (!lightbox || !img) return;
  img.src = src;
  if (cap) cap.textContent = caption || '';
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('image-lightbox');
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = 'auto';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderArticle);
} else {
  renderArticle();
}
