/**
 * HUDController - User Interface & Dossier Modal Manager
 * Implements Observer / Presentation Model
 */
import { PORTFOLIO_CONTENT } from './content.js';

export class HUDController {
  constructor(eventBus, soundSynthesizer, storageService) {
    this.events = eventBus;
    this.sound = soundSynthesizer;
    this.storage = storageService;

    this.unlockedSectors = new Set();
    this.collectedItems = new Set();
    this.totalSectors = 4;
    this.totalCollectables = 9;

    // DOM Elements
    this.progressFill = document.getElementById('hud-progress-fill');
    this.progressText = document.getElementById('hud-progress-text');
    this.sectorTitle = document.getElementById('hud-sector-title');
    this.soundToggleBtn = document.getElementById('sound-toggle-btn');
    this.fastPassBtn = document.getElementById('fast-pass-btn');
    this.codexBtn = document.getElementById('codex-btn');

    this.modal = document.getElementById('dossier-modal');
    this.modalTitle = document.getElementById('modal-title');
    this.modalBody = document.getElementById('modal-body');
    this.modalCloseBtn = document.getElementById('modal-close-btn');

    this.minimapCanvas = document.getElementById('minimap-canvas');
    this.minimapCtx = this.minimapCanvas ? this.minimapCanvas.getContext('2d') : null;

    this.initEventListeners();
  }

  initEventListeners() {
    // Sound toggle
    if (this.soundToggleBtn) {
      this.soundToggleBtn.addEventListener('click', () => {
        const isMuted = this.sound.toggleMute();
        this.soundToggleBtn.innerHTML = isMuted ? '<i class="fas fa-volume-mute"></i> Muted' : '<i class="fas fa-volume-up"></i> SFX On';
        this.soundToggleBtn.classList.toggle('muted', isMuted);
      });
    }

    // Fast Pass Button
    if (this.fastPassBtn) {
      this.fastPassBtn.addEventListener('click', () => {
        this.unlockAllFastPass();
      });
    }

    // Codex / Dossier Drawer Button
    if (this.codexBtn) {
      this.codexBtn.addEventListener('click', () => {
        this.openDossierOverview();
      });
    }

    // Modal close
    if (this.modalCloseBtn) {
      this.modalCloseBtn.addEventListener('click', () => {
        this.closeModal();
      });
    }

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.closeModal();
        }
      });
    }

    // Subscribe to game events
    this.events.on('sectorUnlocked', (sectorId) => {
      this.onSectorUnlocked(sectorId);
    });

    this.events.on('itemCollected', (item) => {
      this.onItemCollected(item);
    });
  }

  onSectorUnlocked(sectorId) {
    this.unlockedSectors.add(sectorId);
    this.updateProgress();
    this.showNotification(`Dossier Unlocked: ${PORTFOLIO_CONTENT.sectors[sectorId]?.shortTitle || sectorId}`);
    this.openSectorModal(sectorId);
  }

  onItemCollected(item) {
    this.collectedItems.add(item.id);
    this.updateProgress();
    this.showNotification(`+ Energy Tech Orb: ${item.label}`);
  }

  updateProgress() {
    const sectorWeight = (this.unlockedSectors.size / this.totalSectors) * 80;
    const itemWeight = (this.collectedItems.size / this.totalCollectables) * 20;
    const totalPercent = Math.min(100, Math.round(sectorWeight + itemWeight));

    if (this.progressFill) {
      this.progressFill.style.width = `${totalPercent}%`;
    }
    if (this.progressText) {
      this.progressText.textContent = `${totalPercent}% Explored`;
    }

    if (totalPercent >= 100) {
      this.events.emit('gameCompleted');
    }
  }

  showNotification(text) {
    const notif = document.createElement('div');
    notif.className = 'cyber-notification';
    notif.innerHTML = `<span>⚡</span> <span>${text}</span>`;
    document.body.appendChild(notif);

    setTimeout(() => {
      notif.classList.add('fade-out');
      setTimeout(() => notif.remove(), 400);
    }, 3200);
  }

  openSectorModal(sectorId) {
    const sector = PORTFOLIO_CONTENT.sectors[sectorId];
    if (!sector) return;

    this.sound.playClick();
    this.modalTitle.innerHTML = `<span style="color: ${sector.color};">${sector.icon === 'car-autonomous' ? '🚗' : sector.icon === 'robot-arm' ? '🤖' : sector.icon === 'cpu-chip' ? '⚡' : '🧗'}</span> ${sector.name}`;

    let contentHtml = `
      <div class="modal-sector-header">
        <div class="sector-badge" style="border-color: ${sector.color}; color: ${sector.color}">${sector.badge || sector.category}</div>
        <div class="sector-timeframe">${sector.timeframe || ''}</div>
      </div>
      <div class="sector-role-line">
        <strong>${sector.role}</strong> &bull; <span class="text-cyan">${sector.company}</span>
      </div>
      <p class="sector-summary">${sector.summary}</p>
    `;

    // Render Highlights
    if (sector.highlights && sector.highlights.length > 0) {
      contentHtml += `<div class="dossier-section-title">Core Engineering Highlights</div><div class="highlights-grid">`;
      sector.highlights.forEach(h => {
        contentHtml += `
          <div class="highlight-card">
            <h4>${h.title}</h4>
            <p>${h.desc}</p>
          </div>
        `;
      });
      contentHtml += `</div>`;
    }

    // Render Skills if available
    if (sector.skills) {
      contentHtml += `<div class="dossier-section-title">Skills & Stack</div><div class="skills-container">`;
      sector.skills.forEach(sg => {
        contentHtml += `
          <div class="skill-group">
            <h5>${sg.group}</h5>
            <div class="skill-tags">
              ${sg.items.map(it => `<span class="skill-tag">${it}</span>`).join('')}
            </div>
          </div>
        `;
      });
      contentHtml += `</div>`;
    }

    // Render Certifications if available
    if (sector.certifications) {
      contentHtml += `<div class="dossier-section-title">Official Certifications</div><div class="highlights-grid">`;
      sector.certifications.forEach(cert => {
        contentHtml += `
          <div class="highlight-card cert-card">
            <div class="cert-issuer">${cert.issuer}</div>
            <h4>${cert.title}</h4>
            <p>${cert.desc}</p>
          </div>
        `;
      });
      contentHtml += `</div>`;
    }

    // Render Project Links if available
    if (sector.links && sector.links.length > 0) {
      contentHtml += `<div class="dossier-section-title">Deep Dive Articles</div><div class="links-row">`;
      sector.links.forEach(l => {
        contentHtml += `<a href="${l.url}" class="cyber-btn-outline" target="${l.url.startsWith('http') ? '_blank' : '_self'}">${l.label} &rarr;</a>`;
      });
      contentHtml += `</div>`;
    }

    // Tags
    if (sector.tags) {
      contentHtml += `<div class="sector-tags-row">`;
      sector.tags.forEach(t => {
        contentHtml += `<span class="tag-pill" style="border-color:${sector.color}; color:${sector.color}">#${t}</span>`;
      });
      contentHtml += `</div>`;
    }

    this.modalBody.innerHTML = contentHtml;
    this.modal.classList.add('active');
  }

  openDossierOverview() {
    this.sound.playClick();
    this.modalTitle.innerHTML = `<span>📂</span> Mission Codex & Unlocked Dossiers`;

    let html = `
      <div class="codex-intro">
        <p>Your current exploration progress: <strong>${this.unlockedSectors.size}/4 Sectors Unlocked</strong></p>
      </div>
      <div class="codex-grid">
    `;

    Object.values(PORTFOLIO_CONTENT.sectors).forEach(sec => {
      const isUnlocked = this.unlockedSectors.has(sec.id);
      html += `
        <div class="codex-card ${isUnlocked ? 'unlocked' : 'locked'}" data-sector="${sec.id}">
          <div class="codex-card-header">
            <span class="codex-status">${isUnlocked ? '✔ UNLOCKED' : '🔒 ENCRYPTED'}</span>
            <span class="codex-badge" style="color:${sec.color}">${sec.badge || sec.category}</span>
          </div>
          <h3>${sec.shortTitle}</h3>
          <p>${isUnlocked ? sec.summary : 'Drive your rover into this sector beacon to decrypt.'}</p>
          ${isUnlocked ? `<button class="view-sector-btn cyber-btn-sm" data-sec-id="${sec.id}">Inspect Dossier</button>` : ''}
        </div>
      `;
    });

    html += `</div>`;

    // Social Links footer
    html += `
      <div class="dossier-section-title" style="margin-top:24px;">Connect with Lukas</div>
      <div class="social-connect-row">
        ${PORTFOLIO_CONTENT.socialLinks.map(s => `
          <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="social-chip">
            <i class="${s.icon}"></i> ${s.name}
          </a>
        `).join('')}
      </div>
    `;

    this.modalBody.innerHTML = html;

    // Attach click handlers to inspect buttons
    const inspectBtns = this.modalBody.querySelectorAll('.view-sector-btn');
    inspectBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const secId = e.currentTarget.getAttribute('data-sec-id');
        this.openSectorModal(secId);
      });
    });

    this.modal.classList.add('active');
  }

  unlockAllFastPass() {
    this.sound.playVictory();
    Object.keys(PORTFOLIO_CONTENT.sectors).forEach(id => this.unlockedSectors.add(id));
    this.updateProgress();
    this.showNotification('Recruiter Fast-Pass Active: All 4 Dossiers Decrypted!');
    this.openDossierOverview();
  }

  closeModal() {
    this.sound.playClick();
    if (this.modal) {
      this.modal.classList.remove('active');
    }
  }

  renderMinimap(rover, world) {
    if (!this.minimapCtx || !rover || !world) return;
    const ctx = this.minimapCtx;
    const w = this.minimapCanvas.width;
    const h = this.minimapCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Scale factors
    const scaleX = w / world.width;
    const scaleY = h / world.height;

    // Background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, w, h);

    // Draw Sectors
    world.sectors.forEach(sec => {
      ctx.fillStyle = sec.unlocked ? sec.color : 'rgba(100, 116, 139, 0.5)';
      ctx.beginPath();
      ctx.arc(sec.x * scaleX, sec.y * scaleY, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Rover
    ctx.fillStyle = '#00ffcc';
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#00ffcc';
    ctx.beginPath();
    ctx.arc(rover.x * scaleX, rover.y * scaleY, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
}
