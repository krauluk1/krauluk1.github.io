/**
 * HUDController - User Interface & Dossier Modal Manager
 * Implements Observer / Presentation Model
 * Supports 5 Career Sectors, 26 Sub-Items, English Navigation, and 100% Celebration.
 */
import { PORTFOLIO_CONTENT } from './content.js';

export class HUDController {
  constructor(eventBus, soundSynthesizer, storageService, particleSystem = null) {
    this.events = eventBus;
    this.sound = soundSynthesizer;
    this.storage = storageService;
    this.particles = particleSystem;

    this.unlockedSectors = new Set();
    this.collectedItems = new Set();
    this.totalSectors = 5;
    this.totalCollectables = 26;
    this.hasTriggeredVictory = false;
    this.isFastPassActive = false;

    // DOM Elements
    this.progressFill = document.getElementById('hud-progress-fill');
    this.progressText = document.getElementById('hud-progress-text');
    this.soundToggleBtn = document.getElementById('sound-toggle-btn');
    this.fastPassBtn = document.getElementById('fast-pass-btn');
    this.resetBtn = document.getElementById('reset-btn');
    this.codexBtn = document.getElementById('codex-btn');

    this.modal = document.getElementById('dossier-modal');
    this.modalTitle = document.getElementById('modal-title');
    this.modalBody = document.getElementById('modal-body');
    this.modalCloseBtn = document.getElementById('modal-close-btn');

    this.minimapCanvas = document.getElementById('minimap-canvas');
    this.minimapCtx = this.minimapCanvas ? this.minimapCanvas.getContext('2d') : null;

    this.initEventListeners();
    this.loadPersistedState();
  }

  setParticleSystem(particles) {
    this.particles = particles;
  }

  loadPersistedState() {
    if (!this.storage) return;
    const saved = this.storage.load();
    if (saved) {
      if (saved.fastPassUsed) {
        this.isFastPassActive = true;
      }
      if (Array.isArray(saved.unlockedSectors)) {
        saved.unlockedSectors.forEach(id => {
          if (PORTFOLIO_CONTENT.sectors[id]) {
            this.unlockedSectors.add(id);
          }
        });
      }
      if (Array.isArray(saved.collectedItems)) {
        saved.collectedItems.forEach(id => {
          if (PORTFOLIO_CONTENT.subItems.some(si => si.id === id)) {
            this.collectedItems.add(id);
          }
        });
      }
      if (saved.soundMuted) {
        this.sound.setMuted(true);
        if (this.soundToggleBtn) {
          this.soundToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i> Muted';
          this.soundToggleBtn.classList.add('muted');
        }
      }
      this.updateProgress();
      this.events.emit('stateLoaded', {
        unlockedSectors: Array.from(this.unlockedSectors),
        collectedItems: Array.from(this.collectedItems)
      });
    }
  }

  saveState() {
    if (!this.storage) return;
    this.storage.save({
      unlockedSectors: Array.from(this.unlockedSectors),
      collectedItems: Array.from(this.collectedItems),
      fastPassUsed: this.isFastPassActive,
      soundMuted: this.sound.muted
    });
  }

  initEventListeners() {
    // Sound toggle
    if (this.soundToggleBtn) {
      this.soundToggleBtn.addEventListener('click', () => {
        const isMuted = this.sound.toggleMute();
        this.soundToggleBtn.innerHTML = isMuted ? '<i class="fas fa-volume-mute"></i> Muted' : '<i class="fas fa-volume-up"></i> SFX On';
        this.soundToggleBtn.classList.toggle('muted', isMuted);
        this.saveState();
      });
    }

    // Fast Pass Button
    if (this.fastPassBtn) {
      this.fastPassBtn.addEventListener('click', () => {
        this.unlockAllFastPass();
      });
    }

    // Reset Progress Button (Front-page HUD)
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => {
        this.resetProgress();
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

    // Modal close on backdrop click
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.closeModal();
        }
      });
    }

    // Modal close on ESC key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (this.modal && this.modal.classList.contains('active')) {
          this.closeModal();
        }
      }
    });

    // Subscribe to game events
    this.events.on('sectorUnlocked', (sectorId) => {
      this.onSectorUnlocked(sectorId);
    });

    this.events.on('itemCollected', (item) => {
      this.onItemCollected(item);
    });
  }

  onSectorUnlocked(sectorId) {
    if (!PORTFOLIO_CONTENT.sectors[sectorId]) return;
    this.unlockedSectors.add(sectorId);
    this.saveState();
    this.updateProgress();
    const sec = PORTFOLIO_CONTENT.sectors[sectorId];
    this.showNotification(`Dossier Unlocked: ${sec ? sec.name : sectorId}`);
    this.openSectorModal(sectorId);
  }

  onItemCollected(item) {
    if (!item) return;
    const itemId = item.id || item;
    this.collectedItems.add(itemId);
    this.saveState();
    this.updateProgress();
    this.showNotification(`+ Collected Milestone: ${item.label || itemId} (${item.category || 'Milestone'})`);
  }

  updateProgress() {
    const validUnlocked = Array.from(this.unlockedSectors).filter(id => PORTFOLIO_CONTENT.sectors[id]);
    const validCollected = Array.from(this.collectedItems).filter(id => PORTFOLIO_CONTENT.subItems.some(si => si.id === id));

    const sectorWeight = (validUnlocked.length / this.totalSectors) * 50;
    const itemWeight = (validCollected.length / this.totalCollectables) * 50;
    const totalPercent = Math.min(100, Math.round(sectorWeight + itemWeight));

    if (this.progressFill) {
      this.progressFill.style.width = `${totalPercent}%`;
    }
    if (this.progressText) {
      this.progressText.textContent = `${totalPercent}% Explored`;
    }

    // Victory celebration only triggers on natural gameplay (NOT Fast-Pass)
    if (totalPercent >= 100 && !this.hasTriggeredVictory && !this.isFastPassActive) {
      this.hasTriggeredVictory = true;
      this.events.emit('gameCompleted');
      setTimeout(() => {
        if (this.particles && typeof this.particles.emitVictoryCelebration === 'function') {
          this.particles.emitVictoryCelebration(1600, 1600);
        }
        this.openVictoryModal();
      }, 600);
    }
  }

  showNotification(text) {
    // Limit active notifications to max 3 to prevent visual clutter
    const existing = document.querySelectorAll('.cyber-notification');
    if (existing.length >= 3) {
      existing[0].remove();
    }

    const notif = document.createElement('div');
    notif.className = 'cyber-notification';
    notif.innerHTML = `<span>⚡</span> <span>${text}</span>`;
    document.body.appendChild(notif);

    setTimeout(() => {
      notif.classList.add('fade-out');
      setTimeout(() => notif.remove(), 400);
    }, 3400);
  }

  openSectorModal(sectorId) {
    const sector = PORTFOLIO_CONTENT.sectors[sectorId];
    if (!sector) return;

    this.sound.playClick();
    const iconSymbol = sector.icon === 'car-autonomous' ? '🚗' : sector.icon === 'robot-arm' ? '🤖' : sector.icon === 'cpu-chip' ? '⚡' : sector.icon === 'certificate-shield' ? '🛡' : '🧗';
    this.modalTitle.innerHTML = `<span style="color: ${sector.color};">${iconSymbol}</span> ${sector.name}`;

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
      contentHtml += `<div class="dossier-section-title">Core Milestones &amp; Responsibilities</div><div class="highlights-grid">`;
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
      contentHtml += `<div class="dossier-section-title">Engineering Stack &amp; Toolchain</div><div class="skills-container">`;
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
      contentHtml += `<div class="dossier-section-title">Verified Official Credentials</div><div class="highlights-grid">`;
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

    // Render Project Links (always open in new tab _blank)
    if (sector.links && sector.links.length > 0) {
      contentHtml += `<div class="dossier-section-title">Deep Dive Articles &amp; Media</div><div class="links-row">`;
      sector.links.forEach(l => {
        contentHtml += `<a href="${l.url}" class="cyber-btn-outline" target="_blank" rel="noopener noreferrer">${l.label} <i class="fas fa-external-link-alt" style="font-size:10px; margin-left:4px;"></i></a>`;
      });
      contentHtml += `</div>`;
    }

    // Sector Sub-Items in this area
    const subItemsInSector = PORTFOLIO_CONTENT.subItems.filter(si => si.sectorId === sectorId);
    if (subItemsInSector.length > 0) {
      contentHtml += `<div class="dossier-section-title">Sub-Item Relics in this Zone</div><div class="highlights-grid">`;
      subItemsInSector.forEach(si => {
        const isCollected = this.collectedItems.has(si.id);
        contentHtml += `
          <div class="highlight-card" style="border-left: 3px solid ${isCollected ? '#00ff88' : '#64748b'};">
            <h4>${isCollected ? '✔' : '⚪'} ${si.label}</h4>
            <p>${si.desc}</p>
          </div>
        `;
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
    this.modalTitle.innerHTML = `<span>📂</span> Mission Codex &amp; Career Dossiers`;

    let html = `
      <div class="codex-intro" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <p style="margin:0;">Status: <strong>${this.unlockedSectors.size}/${this.totalSectors} Sectors</strong> &bull; <strong>${this.collectedItems.size}/${this.totalCollectables} Milestones Collected</strong></p>
        <button class="cyber-btn-sm" id="codex-reset-btn" style="border-color:#f43f5e; color:#fda4af;"><i class="fas fa-redo"></i> Reset Mission (0%)</button>
      </div>
      <div class="codex-grid" style="margin-top:14px;">
    `;

    Object.values(PORTFOLIO_CONTENT.sectors).forEach(sec => {
      const isUnlocked = this.unlockedSectors.has(sec.id);
      html += `
        <div class="codex-card ${isUnlocked ? 'unlocked' : 'locked'}" data-sector="${sec.id}">
          <div class="codex-card-header">
            <span class="codex-status">${isUnlocked ? '✔ UNLOCKED' : '🔒 ENCRYPTED'}</span>
            <span class="codex-badge" style="color:${sec.color}">${sec.badge || sec.category}</span>
          </div>
          <h3>${sec.name}</h3>
          <p>${isUnlocked ? sec.summary : 'Drive your rover into this sector beacon to decrypt.'}</p>
          ${isUnlocked ? `<button class="view-sector-btn cyber-btn-sm" data-sec-id="${sec.id}">Inspect Dossier</button>` : ''}
        </div>
      `;
    });

    html += `</div>`;

    // Sub-items collection grid
    html += `
      <div class="dossier-section-title" style="margin-top:24px;">Collected CV Milestones (${this.collectedItems.size}/${this.totalCollectables})</div>
      <div class="highlights-grid">
    `;

    PORTFOLIO_CONTENT.subItems.forEach(item => {
      const isCollected = this.collectedItems.has(item.id);
      html += `
        <div class="highlight-card" style="opacity: ${isCollected ? '1' : '0.45'}; border-left: 3px solid ${isCollected ? item.color : '#334155'};">
          <div style="font-size:10px; color:${item.color}; font-family:var(--font-mono);">${item.category}</div>
          <h4>${isCollected ? '✔' : '🔒'} ${item.label}</h4>
          <p>${isCollected ? item.desc : 'Explore the map to locate and decrypt this data node.'}</p>
        </div>
      `;
    });

    html += `</div>`;

    // Social Links footer (target="_blank") - LinkedIn & XING only
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

    const resetBtn = document.getElementById('codex-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetProgress());
    }

    this.modal.classList.add('active');
  }

  openVictoryModal() {
    this.sound.playVictory();
    this.modalTitle.innerHTML = `<span>🏆</span> 100% MISSION ACCOMPLISHED!`;

    let html = `
      <div style="text-align: center; padding: 10px 0 20px 0;">
        <div style="font-size: 52px; margin-bottom: 10px;">🎉</div>
        <h3 style="font-family: var(--font-heading); font-size: 24px; color: var(--green); margin-bottom: 8px;">
          Congratulations, Explorer!
        </h3>
        <p style="font-size: 15px; color: #e2e8f0; max-width: 600px; margin: 0 auto 16px auto; line-height: 1.6;">
          You have successfully surveyed all <strong>5 Career Sectors</strong> and collected all <strong>26 Engineering Milestones</strong> in Lukas Kraus's Autonomous Systems &amp; Robotics Portfolio!
        </p>
        <div style="display: inline-block; background: rgba(0, 255, 136, 0.12); border: 1px solid var(--green); padding: 6px 18px; border-radius: 20px; font-family: var(--font-mono); font-size: 13px; color: var(--green); margin-bottom: 24px;">
          ✔ 100% AUTONOMOUS ODYSSEY COMPLETED
        </div>
      </div>

      <div class="dossier-section-title">Let's Connect &amp; Collaborate</div>
      <p style="color: #94a3b8; font-size: 13px; margin-bottom: 16px;">
        Interested in discussing Autonomous Driving (ADAS), Parking Space Detection, 3D Computer Vision, or Embedded Robotics? Feel free to reach out via professional networks:
      </p>

      <div class="social-connect-row" style="justify-content: center; gap: 16px; margin-bottom: 24px;">
        <a href="https://www.linkedin.com/in/lukaskraus97/" target="_blank" rel="noopener noreferrer" class="social-chip" style="background: rgba(0, 119, 181, 0.25); border-color: #0077b5; font-size: 14px; padding: 10px 22px;">
          <i class="fab fa-linkedin"></i> Connect on LinkedIn &rarr;
        </a>
        <a href="https://www.xing.com/profile/Lukas_Kraus13/" target="_blank" rel="noopener noreferrer" class="social-chip" style="background: rgba(0, 101, 103, 0.25); border-color: #0284c7; font-size: 14px; padding: 10px 22px;">
          <i class="fab fa-xing-square"></i> Connect on XING &rarr;
        </a>
      </div>

      <div style="text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 18px; display: flex; justify-content: center; gap: 12px;">
        <button class="cyber-btn" id="victory-continue-btn"><i class="fas fa-gamepad"></i> Continue Driving</button>
        <button class="cyber-btn cyber-btn-outline" id="victory-reset-btn"><i class="fas fa-redo"></i> Reset Mission (0%)</button>
      </div>
    `;

    this.modalBody.innerHTML = html;

    const continueBtn = document.getElementById('victory-continue-btn');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => this.closeModal());
    }

    const resetBtn = document.getElementById('victory-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetProgress());
    }

    this.modal.classList.add('active');
  }

  resetProgress() {
    this.unlockedSectors.clear();
    this.collectedItems.clear();
    this.hasTriggeredVictory = false;
    this.isFastPassActive = false;
    if (this.storage) this.storage.reset();
    this.updateProgress();
    this.events.emit('gameReset');
    this.showNotification('Mission Progress Reset to 0%. Start Exploring!');
    this.closeModal();
  }

  unlockAllFastPass() {
    // Fast pass directly decrypts dossiers for recruiters without triggering victory congratulations
    this.isFastPassActive = true;
    this.sound.playClick();
    Object.keys(PORTFOLIO_CONTENT.sectors).forEach(id => this.unlockedSectors.add(id));
    PORTFOLIO_CONTENT.subItems.forEach(it => this.collectedItems.add(it.id));
    this.saveState();
    this.updateProgress();
    this.events.emit('fastPassUnlocked');
    this.showNotification('Recruiter Fast-Pass Active: All Dossiers Decrypted!');
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
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, w, h);

    // Draw Obstacles / Craters
    world.obstacles.forEach(obs => {
      ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(obs.x * scaleX, obs.y * scaleY, obs.radius * scaleX, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // Draw Sectors
    world.sectors.forEach(sec => {
      ctx.fillStyle = this.unlockedSectors.has(sec.id) ? sec.color : 'rgba(148, 163, 184, 0.6)';
      ctx.beginPath();
      ctx.arc(sec.x * scaleX, sec.y * scaleY, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Sub-Item Collectables
    world.collectables.forEach(item => {
      if (!this.collectedItems.has(item.id)) {
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(item.x * scaleX, item.y * scaleY, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw Rover
    ctx.fillStyle = '#00ffcc';
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#00ffcc';
    ctx.beginPath();
    ctx.arc(rover.x * scaleX, rover.y * scaleY, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}
