/**
 * WorldMap - 2D Cyber Planetary Environment & Sector Grid
 * Implements Factory, Strategy & Spatial Partitioning Patterns
 * Features 5 Main Career Sectors, 25 Collectable Sub-Items, and Impact Crater Obstacles.
 */
import { PORTFOLIO_CONTENT } from './content.js';

export class WorldMap {
  constructor(particleSystem, soundSynthesizer, eventBus) {
    this.width = 3200;
    this.height = 3200;
    this.particles = particleSystem;
    this.sound = soundSynthesizer;
    this.events = eventBus;

    // 5 Main Sector Checkpoints
    this.sectors = [
      {
        id: "sector1",
        title: "Sector 01: Work Experience",
        badge: "Robert Bosch & IAV",
        x: 700,
        y: 700,
        radius: 90,
        color: "#00e5ff",
        icon: "🚗",
        unlocked: false,
        theme: "work-experience"
      },
      {
        id: "sector2",
        title: "Sector 02: Academic Education",
        badge: "FHWS & RoboCup@Work",
        x: 2500,
        y: 700,
        radius: 90,
        color: "#a855f7",
        icon: "🤖",
        unlocked: false,
        theme: "education"
      },
      {
        id: "sector3",
        title: "Sector 03: IT & Technical Skills",
        badge: "Tech Matrix & Languages",
        x: 700,
        y: 2500,
        radius: 90,
        color: "#00ff88",
        icon: "⚡",
        unlocked: false,
        theme: "it-skills"
      },
      {
        id: "sector4",
        title: "Sector 04: Qualifications & Certificates",
        badge: "Scrum & AEVO Vault",
        x: 2500,
        y: 2500,
        radius: 90,
        color: "#f59e0b",
        icon: "🛡",
        unlocked: false,
        theme: "certifications"
      },
      {
        id: "sector5",
        title: "Sector 05: Volunteering & Interests",
        badge: "ISC, Dance & Bouldering",
        x: 1600,
        y: 450,
        radius: 90,
        color: "#ff007f",
        icon: "🧗",
        unlocked: false,
        theme: "interests"
      }
    ];

    // 25 Collectable CV Sub-Items
    this.collectables = PORTFOLIO_CONTENT.subItems.map(item => ({
      ...item,
      collected: false
    }));

    // Impact Crater Obstacles across the terrain
    this.obstacles = [
      { id: "crater_nw", x: 1150, y: 1100, radius: 105, name: "Crater Alpha", color: "#00e5ff" },
      { id: "crater_ne", x: 2050, y: 1100, radius: 110, name: "Crater Beta", color: "#a855f7" },
      { id: "crater_sw", x: 1150, y: 2050, radius: 115, name: "Crater Gamma", color: "#00ff88" },
      { id: "crater_se", x: 2050, y: 2050, radius: 105, name: "Crater Delta", color: "#f59e0b" },
      { id: "crater_n1", x: 1250, y: 550, radius: 85, name: "Crater Epsilon", color: "#ff007f" },
      { id: "crater_n2", x: 1950, y: 550, radius: 85, name: "Crater Zeta", color: "#ff007f" },
      { id: "crater_w", x: 650, y: 1600, radius: 95, name: "Crater Theta", color: "#00e5ff" },
      { id: "crater_e", x: 2550, y: 1600, radius: 95, name: "Crater Iota", color: "#a855f7" },
      { id: "crater_s", x: 1600, y: 2600, radius: 110, name: "Crater Kappa", color: "#00ff88" },
      { id: "crater_center_n", x: 1600, y: 1050, radius: 75, name: "North Ridge Crater", color: "#38bdf8" }
    ];

    // Sector decals and zone layout
    this.initFeatures();

    // Listen to reset
    this.events.on('gameReset', () => {
      this.sectors.forEach(s => s.unlocked = false);
      this.collectables.forEach(c => c.collected = false);
    });
  }

  initFeatures() {
    // Sector 1: Bosch Parking Simulation Bays
    this.parkingBays = [
      { x: 590, y: 560, w: 100, h: 50, label: "BAY A1 (PSD)" },
      { x: 710, y: 560, w: 100, h: 50, label: "BAY A2 (AVP)" },
      { x: 830, y: 560, w: 100, h: 50, label: "BAY A3 (GPA)" }
    ];
  }

  clampToBounds(x, y, radius) {
    const minX = radius + 25;
    const maxX = this.width - radius - 25;
    const minY = radius + 25;
    const maxY = this.height - radius - 25;

    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y))
    };
  }

  /**
   * Tests collision between a moving circle (Rover) and static obstacles (Craters).
   * Returns collision normal and overlap depth for smooth slide response.
   */
  checkObstacleCollision(x, y, radius) {
    for (const obs of this.obstacles) {
      const dx = x - obs.x;
      const dy = y - obs.y;
      const dist = Math.hypot(dx, dy);
      const minDist = obs.radius + radius;

      if (dist < minDist && dist > 0.001) {
        const overlap = minDist - dist;
        const normalX = dx / dist;
        const normalY = dy / dist;
        return {
          collided: true,
          obstacle: obs,
          normalX,
          normalY,
          overlap,
          dist
        };
      }
    }
    return { collided: false };
  }

  update(dt, rover) {
    // 1. Check Sector Beacon Proximity
    for (const sector of this.sectors) {
      const dist = Math.hypot(rover.x - sector.x, rover.y - sector.y);
      if (dist < sector.radius + rover.radius) {
        if (!sector.unlocked) {
          sector.unlocked = true;
          this.particles.emitExplosion(sector.x, sector.y, sector.color, 40);
          this.particles.emitShockwave(sector.x, sector.y, sector.color, 110);
          this.sound.playUnlock();
          this.events.emit('sectorUnlocked', sector.id);
        }
      }
    }

    // 2. Check Collectables Proximity
    for (const item of this.collectables) {
      if (!item.collected) {
        const dist = Math.hypot(rover.x - item.x, rover.y - item.y);
        if (dist < 34 + rover.radius) {
          item.collected = true;
          this.particles.emitExplosion(item.x, item.y, item.color, 20);
          this.sound.playCollect();
          this.events.emit('itemCollected', item);
        }
      }
    }
  }

  render(ctx, camera) {
    // 1. Cyber Grid Surface
    this.renderGrid(ctx);

    // 2. Connecting Sci-Fi Highway Networks
    this.renderHighways(ctx);

    // 3. Impact Craters (Obstacles)
    this.renderObstacles(ctx);

    // 4. Central Command Spawn Pad
    this.renderSpawnPad(ctx);

    // 5. Sector Arenas & Decals
    this.renderSectorZones(ctx);

    // 6. 25 Collectable Sub-Items
    this.renderCollectables(ctx);

    // 7. Sector Beacons & Hologram Pillars
    this.renderBeacons(ctx);
  }

  renderGrid(ctx) {
    const gridSize = 100;
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.lineWidth = 1;

    ctx.beginPath();
    for (let x = 0; x <= this.width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
    }
    for (let y = 0; y <= this.height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
    }
    ctx.stroke();

    // Subtle star dust particles
    ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
    for (let x = 150; x < this.width; x += 300) {
      for (let y = 150; y < this.height; y += 300) {
        ctx.fillRect(x, y, 2.5, 2.5);
      }
    }

    // World Boundary Border
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 6;
    ctx.strokeRect(12, 12, this.width - 24, this.height - 24);

    // Outer warning stripes
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 15]);
    ctx.strokeRect(20, 20, this.width - 40, this.height - 40);
    ctx.setLineDash([]);
  }

  renderHighways(ctx) {
    const cx = 1600;
    const cy = 1600;

    ctx.save();
    ctx.lineWidth = 44;
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.55)';
    ctx.beginPath();
    
    // Radiating highways to all 5 sectors
    this.sectors.forEach(sec => {
      ctx.moveTo(cx, cy);
      ctx.lineTo(sec.x, sec.y);
    });

    // Outer perimeter highway connecting sector hubs
    ctx.moveTo(this.sectors[0].x, this.sectors[0].y);
    ctx.lineTo(this.sectors[4].x, this.sectors[4].y);
    ctx.lineTo(this.sectors[1].x, this.sectors[1].y);
    ctx.lineTo(this.sectors[3].x, this.sectors[3].y);
    ctx.lineTo(this.sectors[2].x, this.sectors[2].y);
    ctx.lineTo(this.sectors[0].x, this.sectors[0].y);

    ctx.stroke();

    // Neon center line strip
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.45)';
    ctx.setLineDash([14, 14]);
    ctx.beginPath();
    this.sectors.forEach(sec => {
      ctx.moveTo(cx, cy);
      ctx.lineTo(sec.x, sec.y);
    });
    ctx.stroke();
    ctx.restore();
  }

  renderObstacles(ctx) {
    const pulse = (Math.sin(Date.now() * 0.003) + 1) * 0.5;

    this.obstacles.forEach(obs => {
      ctx.save();
      ctx.translate(obs.x, obs.y);

      // Deep Shadow Crater Interior
      const craterGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, obs.radius);
      craterGrad.addColorStop(0, '#020617');
      craterGrad.addColorStop(0.65, '#090d1a');
      craterGrad.addColorStop(0.88, '#1e293b');
      craterGrad.addColorStop(1, '#0f172a');

      ctx.fillStyle = craterGrad;
      ctx.beginPath();
      ctx.arc(0, 0, obs.radius, 0, Math.PI * 2);
      ctx.fill();

      // Inner depth contours
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, obs.radius * 0.65, 0, Math.PI * 2);
      ctx.stroke();

      // Rocky Crater Rim with Glowing Warning Edge
      ctx.strokeStyle = obs.color;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 14 + pulse * 6;
      ctx.shadowColor = obs.color;
      ctx.beginPath();
      ctx.arc(0, 0, obs.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Hazard Warning Text
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⚠ HAZARD CRATER', 0, -obs.radius + 18);
      ctx.fillText(obs.name.toUpperCase(), 0, 0);

      ctx.restore();
    });
  }

  renderSpawnPad(ctx) {
    const cx = 1600;
    const cy = 1600;

    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00e5ff';

    ctx.beginPath();
    ctx.arc(cx, cy, 130, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Concentric command ring
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(cx, cy, 95, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Center emblem
    ctx.fillStyle = '#00e5ff';
    ctx.font = 'bold 17px Outfit, Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('COMMAND BASECAMP', cx, cy - 22);

    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Drive Rover to Explore All 5 Sectors', cx, cy + 6);
    ctx.fillText('▲ WASD / Arrow Keys / Click Map ▲', cx, cy + 26);
    ctx.restore();
  }

  renderSectorZones(ctx) {
    // Sector 1: Bosch Parking Simulation Bays
    this.parkingBays.forEach(bay => {
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.65)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(bay.x, bay.y, bay.w, bay.h);
      ctx.fillStyle = 'rgba(0, 229, 255, 0.85)';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(bay.label, bay.x + bay.w / 2, bay.y + bay.h / 2 + 3);
      ctx.restore();
    });

    // Sector 2: RoboCup@Work Arena Boundary
    ctx.save();
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(2340, 540, 320, 320);
    ctx.fillStyle = 'rgba(168, 85, 247, 0.85)';
    ctx.font = '12px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ROBOCUP@WORK 2021 WORLD ARENA', 2500, 565);
    ctx.restore();

    // Sector 3: IT Skills Matrix Power Grid
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.35)';
    ctx.lineWidth = 1.5;
    for (let r = 60; r <= 180; r += 40) {
      ctx.beginPath();
      ctx.arc(700, 2500, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // Sector 4: Qualifications & Certificates Vault Rings
    ctx.save();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.arc(2500, 2500, 160, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Sector 5: Off-Duty Basecamp (Bouldering Contour & Dance)
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 0, 127, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(1600, 450, 160, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  renderCollectables(ctx) {
    const time = Date.now() * 0.004;

    this.collectables.forEach(item => {
      if (item.collected) return;
      ctx.save();
      const floatOffset = Math.sin(time + item.x * 0.05) * 4;

      ctx.fillStyle = item.color;
      ctx.shadowBlur = 14;
      ctx.shadowColor = item.color;

      ctx.beginPath();
      ctx.arc(item.x, item.y + floatOffset, 12, 0, Math.PI * 2);
      ctx.fill();

      // Inner shiny core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(item.x, item.y + floatOffset, 4, 0, Math.PI * 2);
      ctx.fill();

      // Label text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Outfit, Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.label, item.x, item.y + floatOffset - 16);
      ctx.restore();
    });
  }

  renderBeacons(ctx) {
    const pulse = (Math.sin(Date.now() * 0.005) + 1) * 0.5;

    this.sectors.forEach(sec => {
      ctx.save();
      ctx.translate(sec.x, sec.y);

      // Glowing Beacon Rings
      ctx.strokeStyle = sec.color;
      ctx.lineWidth = 3.5;
      ctx.shadowBlur = 22;
      ctx.shadowColor = sec.color;

      ctx.beginPath();
      ctx.arc(0, 0, sec.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Pulsing secondary expansion ring
      ctx.beginPath();
      ctx.arc(0, 0, sec.radius * (0.85 + pulse * 0.3), 0, Math.PI * 2);
      ctx.strokeStyle = sec.color;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Central Pillar
      ctx.fillStyle = sec.color;
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();

      // Sector Title & Badge
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Outfit, Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(sec.title, 0, -sec.radius - 28);

      ctx.font = '12px JetBrains Mono, monospace';
      ctx.fillStyle = sec.unlocked ? '#00ff88' : '#cbd5e1';
      ctx.fillText(sec.unlocked ? '✔ DOSSIER UNLOCKED' : '⚡ DRIVE HERE TO UNLOCK', 0, -sec.radius - 10);

      ctx.restore();
    });
  }
}
