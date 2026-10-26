/**
 * CHERIAN JAMES - DEEP 3D SCROLL ILLUSION TUNNEL
 * Inspired by Reference: illusion reference.mp4
 * Creates a hypnotic, deep 3D optical vortex tunnel of nested golden geometric portal rings,
 * floating golden beads, and hyperspace motion streaks that progresses with scroll depth
 * and seamlessly transitions into the Works Section.
 */

(function () {
  const section = document.getElementById('illusion-tunnel');
  const canvas = document.getElementById('illusionCanvas');
  if (!section || !canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  let scrollProgress = 0; // 0 to 1 through the illusion section
  let targetProgress = 0;
  let animationFrameId;

  // Tunnel Configuration
  const tunnelConfig = {
    ringCount: 26,
    maxDepth: 3600,
    baseRadius: 260,
    cameraSpeed: 3800,
    particleCount: 110,
    glowColor: '#00f0ff',
    accentColor: '#0066ff',
    highlightColor: '#e0f2fe'
  };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    initTunnelParticles();
  }

  // 3D Math Helper
  class Point3D {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.projX = 0;
      this.projY = 0;
      this.scale = 1;
    }

    project(fov, viewDist, cx, cy) {
      const dist = viewDist + this.z;
      this.scale = fov / (dist > 1 ? dist : 1);
      this.projX = this.x * this.scale + cx;
      this.projY = this.y * this.scale + cy;
    }
  }

  // Floating Golden Beads and Shards (from Reference 2)
  let particles = [];
  function initTunnelParticles() {
    particles = [];
    for (let i = 0; i < tunnelConfig.particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 120 + Math.random() * 380;
      particles.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        baseZ: Math.random() * tunnelConfig.maxDepth,
        size: 2.5 + Math.random() * 4.5,
        type: Math.random() > 0.4 ? 'circle' : 'square',
        rotSpeed: (Math.random() - 0.5) * 0.04,
        rot: Math.random() * Math.PI,
        color: Math.random() > 0.3 ? '#00f0ff' : '#0066ff'
      });
    }
  }

  // Draw a rounded rectangle / squircle ring (Inspired by Reference)
  function drawSquirclePath(cx, cy, halfW, halfH, r, rot) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    ctx.beginPath();
    ctx.moveTo(-halfW + r, -halfH);
    ctx.lineTo(halfW - r, -halfH);
    ctx.quadraticCurveTo(halfW, -halfH, halfW, -halfH + r);
    ctx.lineTo(halfW, halfH - r);
    ctx.quadraticCurveTo(halfW, halfH, halfW - r, halfH);
    ctx.lineTo(-halfW + r, halfH);
    ctx.quadraticCurveTo(-halfW, halfH, -halfW, halfH - r);
    ctx.lineTo(-halfW, -halfH + r);
    ctx.quadraticCurveTo(-halfW, -halfH, -halfW + r, -halfH);
    ctx.closePath();

    ctx.restore();
  }

  // Update Scroll Progress relative to the illusion section
  function updateScroll() {
    const rect = section.getBoundingClientRect();
    const totalDist = section.offsetHeight - window.innerHeight;
    if (totalDist > 0) {
      const current = -rect.top;
      targetProgress = Math.max(0, Math.min(1, current / totalDist));
    }

    // Update Text Overlay Phases
    const phases = section.querySelectorAll('.illusion-phase');
    if (phases.length) {
      const phaseIndex = Math.min(phases.length - 1, Math.floor(targetProgress * phases.length));
      phases.forEach((p, idx) => {
        p.classList.toggle('active', idx === phaseIndex);
      });
    }
  }

  window.addEventListener('scroll', updateScroll, { passive: true });

  // Main Render Loop
  function render() {
    ctx.clearRect(0, 0, width, height);

    // Smooth scroll interpolation
    scrollProgress += (targetProgress - scrollProgress) * 0.08;

    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const fov = 480;
    const viewDist = 550;
    const cameraZ = scrollProgress * tunnelConfig.cameraSpeed;

    // 1. Draw Central Cyan-Sapphire Optical Singularity
    const vortexPulse = (Math.sin(Date.now() * 0.003) + 1) * 0.5;
    const centerGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 180);
    centerGrad.addColorStop(0, `rgba(0, 240, 255, ${0.35 + vortexPulse * 0.15})`);
    centerGrad.addColorStop(0.4, `rgba(0, 102, 255, 0.2)`);
    centerGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = centerGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 180, 0, Math.PI * 2);
    ctx.fill();

    // 2. Render Nested Concentric Dark Blue / Cyan Squircles / Rings
    for (let i = 0; i < tunnelConfig.ringCount; i++) {
      // Loop z-depth continuously based on scroll and index
      const initialZ = (i / tunnelConfig.ringCount) * tunnelConfig.maxDepth;
      let relZ = (initialZ - (cameraZ % tunnelConfig.maxDepth) + tunnelConfig.maxDepth) % tunnelConfig.maxDepth;

      // Avoid clipping through near plane
      if (relZ < 15) continue;

      const scale = fov / (viewDist + relZ);
      const ringRadius = tunnelConfig.baseRadius * scale;
      const alpha = Math.min(1, Math.max(0, (tunnelConfig.maxDepth - relZ) / (tunnelConfig.maxDepth * 0.65)));

      // Hypnotic alternating twist (Inspired by Ref 2)
      const twist = (i * 0.22) + (scrollProgress * Math.PI * 3.5) + (Date.now() * 0.0006 * (i % 2 === 0 ? 1 : -1));

      // Cyan / Sapphire Gradient for Ring Edge
      const strokeGrad = ctx.createLinearGradient(
        centerX - ringRadius, centerY - ringRadius,
        centerX + ringRadius, centerY + ringRadius
      );
      strokeGrad.addColorStop(0, `rgba(230, 250, 255, ${alpha * 0.95})`);
      strokeGrad.addColorStop(0.5, `rgba(0, 240, 255, ${alpha * 0.85})`);
      strokeGrad.addColorStop(1, `rgba(0, 102, 255, ${alpha * 0.7})`);

      ctx.lineWidth = Math.max(1.8, 5.5 * scale);
      ctx.strokeStyle = strokeGrad;

      // Draw Alternating Rounded Squircle vs Faceted Portal
      const cornerRadius = 38 * scale;
      drawSquirclePath(centerX, centerY, ringRadius, ringRadius * 0.95, cornerRadius, twist);
      ctx.stroke();

      // Inner Accent Wire Ring
      if (i % 2 === 0) {
        ctx.lineWidth = Math.max(1, 2.2 * scale);
        ctx.strokeStyle = `rgba(0, 102, 255, ${alpha * 0.45})`;
        drawSquirclePath(centerX, centerY, ringRadius * 0.88, ringRadius * 0.83, cornerRadius * 0.8, -twist * 0.6);
        ctx.stroke();
      }
    }

    // 3. Render Floating Cyan & Sapphire Beads and Kinetic Shards (Ref 2 Aesthetic)
    particles.forEach(p => {
      p.rot += p.rotSpeed;
      let relZ = (p.baseZ - (cameraZ % tunnelConfig.maxDepth) + tunnelConfig.maxDepth) % tunnelConfig.maxDepth;
      if (relZ < 20) return;

      const scale = fov / (viewDist + relZ);
      const projX = p.x * scale + centerX;
      const projY = p.y * scale + centerY;
      const alpha = Math.min(1, Math.max(0, (tunnelConfig.maxDepth - relZ) / tunnelConfig.maxDepth));
      const size = Math.max(1.5, p.size * scale);

      ctx.fillStyle = p.color === '#00f0ff'
        ? `rgba(0, 240, 255, ${alpha * 0.9})`
        : `rgba(0, 102, 255, ${alpha * 0.85})`;

      if (p.type === 'circle') {
        ctx.beginPath();
        ctx.arc(projX, projY, size, 0, Math.PI * 2);
        ctx.fill();

        // Soft outer glow halo
        ctx.fillStyle = `rgba(0, 240, 255, ${alpha * 0.25})`;
        ctx.beginPath();
        ctx.arc(projX, projY, size * 2.4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.save();
        ctx.translate(projX, projY);
        ctx.rotate(p.rot);
        ctx.fillRect(-size / 2, -size / 2, size, size);
        ctx.restore();
      }
    });

    animationFrameId = requestAnimationFrame(render);
  }

  window.addEventListener('resize', resize);
  resize();
  updateScroll();
  render();

  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(animationFrameId);
  });
})();
