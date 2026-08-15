/**
 * WorldMap - 2D Cyber Grid Environment & Sector Factory
 * Implements Factory and Strategy Pattern
 */
export class WorldMap {
  constructor(particleSystem, soundSynthesizer, eventBus) {
    this.width = 2400;
    this.height = 2400;
    this.particles = particleSystem;
    this.sound = soundSynthesizer;
    this.events = eventBus;

    // Sector Checkpoints & Beacons
    this.sectors = [
      {
        id: "sector1",
        title: "Sector 01: Bosch ADAS & Parking Testbed",
        badge: "Robert Bosch GmbH",
        x: 600,
        y: 600,
        radius: 80,
        color: "#00e5ff",
        icon: "🚗",
        unlocked: false,
        theme: "autonomous-parking"
      },
      {
        id: "sector2",
        title: "Sector 02: Robotics & 3D Vision Lab",
        badge: "FHWS & RoboCup",
        x: 1800,
        y: 600,
        radius: 80,
        color: "#a855f7",
        icon: "🤖",
        unlocked: false,
        theme: "robotics"
      },
      {
        id: "sector3",
        title: "Sector 03: Tech Matrix & Power Core",
        badge: "Skills & Certifications",
        x: 600,
        y: 1800,
        radius: 80,
        color: "#00ff88",
        icon: "⚡",
        unlocked: false,
        theme: "tech-matrix"
      },
      {
        id: "sector4",
        title: "Sector 04: Off-Duty Basecamp",
        badge: "Bouldering & Dance",
        x: 1800,
        y: 1800,
        radius: 80,
        color: "#ff007f",
        icon: "🧗",
        unlocked: false,
        theme: "lifestyle"
      }
    ];

    // Collectable Tech Orbs across the world
    this.collectables = [
      { id: "c1", x: 750, y: 700, label: "C++17", collected: false, color: "#00e5ff" },
      { id: "c2", x: 450, y: 550, label: "AVP", collected: false, color: "#00e5ff" },
      { id: "c3", x: 1650, y: 720, label: "ROS", collected: false, color: "#a855f7" },
      { id: "c4", x: 1920, y: 520, label: "PCL", collected: false, color: "#a855f7" },
      { id: "c5", x: 700, y: 1680, label: "Docker", collected: false, color: "#00ff88" },
      { id: "c6", x: 480, y: 1900, label: "Jenkins", collected: false, color: "#00ff88" },
      { id: "c7", x: 750, y: 1920, label: "PSM I", collected: false, color: "#00ff88" },
      { id: "c8", x: 1650, y: 1920, label: "Bouldering", collected: false, color: "#ff007f" },
      { id: "c9", x: 1920, y: 1700, label: "Salsa", collected: false, color: "#ff007f" }
    ];

    // Decorative static features (parking bays, arena zones, walls)
    this.initFeatures();
  }

  initFeatures() {
    this.parkingBays = [
      { x: 500, y: 480, w: 90, h: 50, label: "BAY A1 (PSD)" },
      { x: 610, y: 480, w: 90, h: 50, label: "BAY A2 (AVP)" },
      { x: 720, y: 480, w: 90, h: 50, label: "BAY A3 (GPA)" }
    ];
  }

  clampToBounds(x, y, radius) {
    const minX = radius + 20;
    const maxX = this.width - radius - 20;
    const minY = radius + 20;
    const maxY = this.height - radius - 20;

    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y))
    };
  }

  update(dt, rover) {
    // 1. Check Sector Beacon Proximity
    for (const sector of this.sectors) {
      const dist = Math.hypot(rover.x - sector.x, rover.y - sector.y);
      if (dist < sector.radius + rover.radius) {
        if (!sector.unlocked) {
          sector.unlocked = true;
          this.particles.emitExplosion(sector.x, sector.y, sector.color, 35);
          this.particles.emitShockwave(sector.x, sector.y, sector.color, 90);
          this.sound.playUnlock();
          this.events.emit('sectorUnlocked', sector.id);
        }
      }
    }

    // 2. Check Collectables Proximity
    for (const item of this.collectables) {
      if (!item.collected) {
        const dist = Math.hypot(rover.x - item.x, rover.y - item.y);
        if (dist < 32 + rover.radius) {
          item.collected = true;
          this.particles.emitExplosion(item.x, item.y, item.color, 18);
          this.sound.playCollect();
          this.events.emit('itemCollected', item);
        }
      }
    }
  }

  render(ctx, camera) {
    // 1. Cyber Grid Floor
    this.renderGrid(ctx);

    // 2. Connecting Sci-Fi Highway Tracks
    this.renderHighways(ctx);

    // 3. Central Spawn Pad
    this.renderSpawnPad(ctx);

    // 4. Sector Arenas & Decals
    this.renderSectorZones(ctx);

    // 5. Collectable Orbs
    this.renderCollectables(ctx);

    // 6. Sector Beacons & Holograms
    this.renderBeacons(ctx);
  }

  renderGrid(ctx) {
    const gridSize = 80;
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.7)';
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

    // Subtle starfield / dust background dots
    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    for (let x = 120; x < this.width; x += 240) {
      for (let y = 120; y < this.height; y += 240) {
        ctx.fillRect(x, y, 2, 2);
      }
    }

    // World Boundary Border
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, this.width - 20, this.height - 20);
  }

  renderHighways(ctx) {
    const centerX = 1200;
    const centerY = 1200;

    ctx.save();
    ctx.lineWidth = 40;
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.5)';
    ctx.beginPath();
    // Diagonal roads to all 4 sectors
    this.sectors.forEach(sec => {
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(sec.x, sec.y);
    });
    ctx.stroke();

    // Center guide light strip
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
    ctx.setLineDash([12, 12]);
    ctx.beginPath();
    this.sectors.forEach(sec => {
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(sec.x, sec.y);
    });
    ctx.stroke();
    ctx.restore();
  }

  renderSpawnPad(ctx) {
    const cx = 1200;
    const cy = 1200;

    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00e5ff';

    ctx.beginPath();
    ctx.arc(cx, cy, 110, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Center emblem
    ctx.fillStyle = '#00e5ff';
    ctx.font = 'bold 16px Outfit, Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('COMMAND HUB', cx, cy - 18);

    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Drive rover to explore sectors', cx, cy + 8);
    ctx.fillText('▲ WASD / Touch / Click ▲', cx, cy + 26);
    ctx.restore();
  }

  renderSectorZones(ctx) {
    // Sector 1: Parking Bays
    this.parkingBays.forEach(bay => {
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(bay.x, bay.y, bay.w, bay.h);
      ctx.fillStyle = 'rgba(0, 229, 255, 0.7)';
      ctx.font = '10px Inter, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(bay.label, bay.x + bay.w / 2, bay.y + bay.h / 2 + 3);
      ctx.restore();
    });

    // Sector 2: Robotics Arena lines
    ctx.save();
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1650, 450, 300, 300);
    ctx.fillStyle = 'rgba(168, 85, 247, 0.8)';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ROBOCUP@WORK ARENA', 1800, 475);
    ctx.restore();

    // Sector 3: Matrix Power Grid
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
    ctx.lineWidth = 1.5;
    for (let r = 50; r <= 160; r += 35) {
      ctx.beginPath();
      ctx.arc(600, 1800, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // Sector 4: Basecamp Bouldering & Dance Decal
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 0, 127, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(1800, 1800, 150, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  renderCollectables(ctx) {
    const time = Date.now() * 0.004;

    this.collectables.forEach(item => {
      if (item.collected) return;
      ctx.save();
      const floatOffset = Math.sin(time + item.x) * 4;

      ctx.fillStyle = item.color;
      ctx.shadowBlur = 12;
      ctx.shadowColor = item.color;

      ctx.beginPath();
      ctx.arc(item.x, item.y + floatOffset, 12, 0, Math.PI * 2);
      ctx.fill();

      // Label
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
      ctx.lineWidth = 3;
      ctx.shadowBlur = 20;
      ctx.shadowColor = sec.color;

      ctx.beginPath();
      ctx.arc(0, 0, sec.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Pulsing secondary ring
      ctx.beginPath();
      ctx.arc(0, 0, sec.radius * (0.85 + pulse * 0.3), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${sec.color === '#00e5ff' ? '0, 229, 255' : sec.color === '#a855f7' ? '168, 85, 247' : sec.color === '#00ff88' ? '0, 255, 136' : '255, 0, 127'}, ${0.4 * (1 - pulse)})`;
      ctx.stroke();

      // Central Pillar
      ctx.fillStyle = sec.color;
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();

      // Sector Title & Badge
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px Outfit, Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(sec.title, 0, -sec.radius - 24);

      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = sec.unlocked ? '#00ff88' : '#cbd5e1';
      ctx.fillText(sec.unlocked ? '✔ DOSSIER UNLOCKED' : '⚡ DRIVE HERE TO UNLOCK', 0, -sec.radius - 8);

      ctx.restore();
    });
  }
}
