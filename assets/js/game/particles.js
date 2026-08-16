/**
 * ParticleSystem - Visual Effects & Particle Factory
 * Implements Object Pool and Factory Pattern
 */
export class Particle {
  constructor(x, y, vx, vy, color, life, size = 3, decay = 0.98, type = 'spark') {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.maxLife = life;
    this.life = life;
    this.size = size;
    this.decay = decay;
    this.type = type;
  }

  update(dt) {
    this.x += this.vx * dt * 60;
    this.y += this.vy * dt * 60;
    this.vx *= this.decay;
    this.vy *= this.decay;
    this.life -= dt;
    return this.life > 0;
  }

  render(ctx) {
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;

    if (this.type === 'circle' || this.type === 'spark') {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'ring') {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const currentRadius = (1 - alpha) * this.size;
      ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }
}

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  emit(x, y, count = 5, options = {}) {
    const {
      color = '#00e5ff',
      speed = 2,
      life = 0.5,
      size = 3,
      decay = 0.96,
      type = 'spark',
      spread = Math.PI * 2,
      baseAngle = 0
    } = options;

    for (let i = 0; i < count; i++) {
      const angle = baseAngle + (Math.random() - 0.5) * spread;
      const velocity = (Math.random() * 0.5 + 0.5) * speed;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;
      const particleLife = life * (0.8 + Math.random() * 0.4);

      this.particles.push(new Particle(x, y, vx, vy, color, particleLife, size, decay, type));
    }

    // Defensive particle ceiling to prevent memory leaks and mobile frame drops
    if (this.particles.length > 250) {
      this.particles.splice(0, this.particles.length - 250);
    }
  }

  emitRoverExhaust(x, y, angle, speedRatio) {
    if (Math.random() > 0.4 * speedRatio) return;
    const exhaustAngle = angle + Math.PI + (Math.random() - 0.5) * 0.4;
    this.emit(x, y, 1, {
      color: '#00ffff',
      speed: 1.2,
      life: 0.3,
      size: 2.5,
      decay: 0.92,
      baseAngle: exhaustAngle,
      spread: 0.2
    });
  }

  emitShockwave(x, y, color = '#00ff88', maxRadius = 40) {
    this.particles.push(new Particle(x, y, 0, 0, color, 0.4, maxRadius, 1, 'ring'));
    if (this.particles.length > 250) {
      this.particles.splice(0, this.particles.length - 250);
    }
  }

  emitExplosion(x, y, color = '#ff007f', count = 25) {
    this.emit(x, y, count, {
      color: color,
      speed: 4.5,
      life: 0.7,
      size: 4,
      decay: 0.94,
      type: 'circle'
    });
  }

  emitVictoryCelebration(centerX, centerY) {
    const colors = ['#00e5ff', '#00ff88', '#a855f7', '#ff007f', '#f59e0b', '#ffffff'];
    for (let b = 0; b < 6; b++) {
      const offsetX = (Math.random() - 0.5) * 400;
      const offsetY = (Math.random() - 0.5) * 300;
      const color = colors[b % colors.length];
      this.emitExplosion(centerX + offsetX, centerY + offsetY, color, 25);
      this.emitShockwave(centerX + offsetX, centerY + offsetY, color, 70);
    }
  }

  update(dt) {
    this.particles = this.particles.filter(p => p.update(dt));
  }

  render(ctx) {
    if (!ctx) return;
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].render(ctx);
    }
  }
}
