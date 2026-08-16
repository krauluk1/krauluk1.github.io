/**
 * Rover - Autonomous Exploration Rover Entity
 * Implements Entity Component & Steering Behaviors
 * Includes procedural vector rendering, physics, particle trails, and active LIDAR scanning.
 */
export class Rover {
  constructor(x = 1600, y = 1600, particleSystem, soundSynthesizer, eventBus) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.angle = -Math.PI / 2; // Facing upwards by default
    this.speed = 0;
    this.maxSpeed = 5.2;
    this.acceleration = 0.24;
    this.friction = 0.92;
    this.turnSpeed = 0.07;
    this.radius = 22;

    this.particles = particleSystem;
    this.sound = soundSynthesizer;
    this.events = eventBus;

    // Autonomous Waypoint Navigation
    this.targetWaypoint = null;
    this.isAutoNavigating = false;

    // Obstacle bump cooldown
    this.lastBumpTime = 0;

    // LIDAR properties
    this.lidarAngle = 0;
    this.lidarSweepSpeed = 0.06;
    this.lidarRadius = 150;
    this.lidarPulse = 0;

    // Input state
    this.inputs = {
      forward: false,
      backward: false,
      left: false,
      right: false
    };

    // Wheel animation
    this.wheelRotation = 0;
  }

  setWaypoint(x, y) {
    this.targetWaypoint = { x, y };
    this.isAutoNavigating = true;
    this.particles.emitShockwave(x, y, '#00e5ff', 25);
    this.sound.playPing(600);
  }

  clearWaypoint() {
    this.targetWaypoint = null;
    this.isAutoNavigating = false;
  }

  update(dt, world) {
    // 1. Handle autonomous waypoint navigation if set
    if (this.isAutoNavigating && this.targetWaypoint) {
      const dx = this.targetWaypoint.x - this.x;
      const dy = this.targetWaypoint.y - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 18) {
        this.clearWaypoint();
      } else {
        const desiredAngle = Math.atan2(dy, dx);
        let angleDiff = desiredAngle - this.angle;

        // Normalize angle difference to [-PI, PI]
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        if (Math.abs(angleDiff) > 0.05) {
          this.angle += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), this.turnSpeed * 1.5);
        }

        // Accelerate when roughly facing target
        if (Math.abs(angleDiff) < Math.PI / 2) {
          this.speed += this.acceleration * 1.1;
        }
      }
    } else {
      // 2. Handle manual user controls
      if (this.inputs.left) {
        this.angle -= this.turnSpeed;
      }
      if (this.inputs.right) {
        this.angle += this.turnSpeed;
      }
      if (this.inputs.forward) {
        this.speed += this.acceleration;
      }
      if (this.inputs.backward) {
        this.speed -= this.acceleration * 0.7;
      }
    }

    // Apply speed limits & friction
    this.speed = Math.max(-this.maxSpeed * 0.5, Math.min(this.maxSpeed, this.speed));
    this.speed *= this.friction;

    if (Math.abs(this.speed) < 0.01) this.speed = 0;

    // Update velocity & test candidate position
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;

    let nextX = this.x + this.vx * dt * 60;
    let nextY = this.y + this.vy * dt * 60;

    // Check world boundaries
    if (world) {
      const bounded = world.clampToBounds(nextX, nextY, this.radius);
      nextX = bounded.x;
      nextY = bounded.y;

      // Check obstacle (crater) collisions
      const collision = world.checkObstacleCollision(nextX, nextY, this.radius);
      if (collision.collided) {
        // Push out of obstacle
        nextX += collision.normalX * (collision.overlap + 0.5);
        nextY += collision.normalY * (collision.overlap + 0.5);

        // Slide along obstacle boundary: project velocity onto tangent
        const tangentX = -collision.normalY;
        const tangentY = collision.normalX;
        const dot = this.vx * tangentX + this.vy * tangentY;
        
        this.vx = tangentX * dot * 0.85;
        this.vy = tangentY * dot * 0.85;
        this.speed *= 0.6;

        // Spark / dust particles at contact point
        const contactX = collision.obstacle.x + (collision.obstacle.radius * (nextX - collision.obstacle.x) / collision.dist);
        const contactY = collision.obstacle.y + (collision.obstacle.radius * (nextY - collision.obstacle.y) / collision.dist);
        this.particles.emitExplosion(contactX, contactY, '#38bdf8', 4);

        // Audio bump effect with throttle
        const now = Date.now();
        if (now - this.lastBumpTime > 250) {
          this.sound.playBump();
          this.lastBumpTime = now;
        }
      }
    }

    this.x = nextX;
    this.y = nextY;

    // Wheel rotation and particle exhaust
    if (Math.abs(this.speed) > 0.1) {
      this.wheelRotation += this.speed * 0.2;
      const speedRatio = Math.abs(this.speed) / this.maxSpeed;
      this.particles.emitRoverExhaust(this.x, this.y, this.angle, speedRatio);
    }

    // LIDAR Sweep
    this.lidarAngle = (this.lidarAngle + this.lidarSweepSpeed) % (Math.PI * 2);
    this.lidarPulse = (this.lidarPulse + dt * 2) % 1;
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // 1. Draw LIDAR Range and Beam
    this.renderLidar(ctx);

    // 2. Rotate to rover heading
    ctx.rotate(this.angle);

    // 3. Draw Headlight illumination cones
    this.renderHeadlights(ctx);

    // 4. Draw Rover Chassis, Wheels, and Sci-Fi Details
    this.renderChassis(ctx);

    ctx.restore();

    // 5. Draw target waypoint marker if active
    if (this.targetWaypoint) {
      this.renderWaypointMarker(ctx, this.targetWaypoint.x, this.targetWaypoint.y);
    }
  }

  renderLidar(ctx) {
    ctx.save();
    // LIDAR perimeter rings
    ctx.beginPath();
    ctx.arc(0, 0, this.lidarRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.14)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Expanding pulse ring
    const pulseRad = this.lidarRadius * this.lidarPulse;
    ctx.beginPath();
    ctx.arc(0, 0, pulseRad, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0, 229, 255, ${0.25 * (1 - this.lidarPulse)})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Sweeping beam arc
    const beamSpread = 0.45;
    const gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, this.lidarRadius);
    gradient.addColorStop(0, 'rgba(0, 229, 255, 0.4)');
    gradient.addColorStop(0.8, 'rgba(0, 229, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, this.lidarRadius, this.lidarAngle - beamSpread, this.lidarAngle + beamSpread);
    ctx.closePath();
    ctx.fill();

    // Beam leading line
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.65)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(this.lidarAngle) * this.lidarRadius, Math.sin(this.lidarAngle) * this.lidarRadius);
    ctx.stroke();

    ctx.restore();
  }

  renderHeadlights(ctx) {
    ctx.save();
    // Dual front beam lights
    const lightGradient = ctx.createRadialGradient(20, 0, 5, 85, 0, 120);
    lightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    lightGradient.addColorStop(0.3, 'rgba(0, 229, 255, 0.25)');
    lightGradient.addColorStop(1, 'rgba(0, 229, 255, 0)');

    ctx.fillStyle = lightGradient;
    ctx.beginPath();
    ctx.moveTo(15, -10);
    ctx.lineTo(95, -45);
    ctx.lineTo(95, 45);
    ctx.lineTo(15, 10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  renderChassis(ctx) {
    // Four All-Terrain Wheels
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 1;

    const wheelW = 14;
    const wheelH = 8;
    const wheelPositions = [
      { x: -14, y: -16 },
      { x: 10, y: -16 },
      { x: -14, y: 16 },
      { x: 10, y: 16 }
    ];

    wheelPositions.forEach(pos => {
      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.fillRect(-wheelW / 2, -wheelH / 2, wheelW, wheelH);
      ctx.strokeRect(-wheelW / 2, -wheelH / 2, wheelW, wheelH);

      // Tread patterns
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.6)';
      ctx.beginPath();
      const offset = (this.wheelRotation % 6);
      ctx.moveTo(-wheelW / 2 + offset, -wheelH / 2);
      ctx.lineTo(-wheelW / 2 + offset, wheelH / 2);
      ctx.stroke();
      ctx.restore();
    });

    // Main Armor Chassis Body
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00e5ff';

    ctx.beginPath();
    ctx.roundRect(-16, -12, 32, 24, 6);
    ctx.fill();
    ctx.stroke();

    // Top Sensor Dome / LIDAR Turret
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#00ffcc';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    // Neon status lights
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(-12, -8, 3, 3);
    ctx.fillRect(-12, 5, 3, 3);

    // Front Optical Sensors
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(14, -6, 2.5, 0, Math.PI * 2);
    ctx.arc(14, 6, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  renderWaypointMarker(ctx, wx, wy) {
    ctx.save();
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(wx, wy, 10, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(wx - 14, wy);
    ctx.lineTo(wx + 14, wy);
    ctx.moveTo(wx, wy - 14);
    ctx.lineTo(wx, wy + 14);
    ctx.stroke();

    // Dashed line from rover to target
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(wx, wy);
    ctx.stroke();

    ctx.restore();
  }
}
