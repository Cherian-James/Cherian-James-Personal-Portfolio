/**
 * CHERIAN JAMES - FULL-SCREEN ILLUSION TUNNEL & PIPELINE LOGOS (OPTIMIZED FOR MOBILE & DESKTOP)
 * 
 * 1. Title Card Zone: Clean, unhurried reading space on top with the 3D Glass Cube floating below it.
 * 2. Full-Screen Concentric Rings Tunnel: Camera dives deep into golden/cyan circular portal rounds.
 * 3. 3D Glass Cube: Navigates with cursor/touch, diving into the vortex center.
 * 4. Exact Uploaded Logo PNGs (Clean, no text labels, no synthetic outlines):
 *    - 1st: Blender PNG
 *    - 2nd: Unreal Engine PNG
 *    - 3rd: Higgsfield AI PNG
 *    - 4th: After Effects PNG
 * 5. Climax: "WELCOME TO MY WORKS" reveals smoothly, leading into the Selected Works section.
 * 6. Responsive: Optimized runways, touch tilt gestures, and mobile DPR scaling for 60 FPS.
 */

(function () {
  const canvas = document.getElementById('experienceCanvas');
  const voyageSection = document.getElementById('hero');
  const endingText = document.getElementById('voyageEndingText');
  if (!canvas || !voyageSection) return;

  const ctx = canvas.getContext('2d');
  let width = 0, height = 0, dpr = 1;
  let isMobile = false;

  let illusionProgress = 0;        // 0 to 1 through the illusion tunnel
  let targetIllusionProgress = 0;
  let scrollY = 0;
  let animationFrameId = null;
  let isCanvasActive = true;

  // Interactive Cursor / Touch Position (-1 to 1)
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      targetMouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      targetMouseY = (e.touches[0].clientY / window.innerHeight) * 2 - 1;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      targetMouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      targetMouseY = (e.touches[0].clientY / window.innerHeight) * 2 - 1;
    }
  }, { passive: true });

  // -------------------------------------------------------------
  // EXACT UPLOADED LOGO PNGs (Clean PNGs, no text, no synthetic outlines)
  // -------------------------------------------------------------
  const logoImgs = {
    blender: new Image(),
    unreal: new Image(),
    higgsfield: new Image(),
    aftereffects: new Image()
  };
  logoImgs.blender.src = 'assets/images/logos/blender.png';
  logoImgs.unreal.src = 'assets/images/logos/unreal.png';
  logoImgs.higgsfield.src = 'assets/images/logos/higgsfield.png';
  logoImgs.aftereffects.src = 'assets/images/logos/aftereffects.png';

  // Sequenced Milestones in the Illusion Tunnel (0.0 to 1.0):
  // 0.00 - 0.18: Hypnotic tunnel entrance & deep diving rings
  // 0.18 - 0.38: Blender PNG (peaks at 0.28)
  // 0.36 - 0.56: Unreal Engine PNG (peaks at 0.46)
  // 0.54 - 0.74: Higgsfield AI PNG (peaks at 0.64)
  // 0.72 - 0.90: After Effects PNG (peaks at 0.81)
  // 0.88 - 0.98: "WELCOME TO MY WORKS" climax
  // 1.00: Selected Works section
  const milestoneLogos = [
    {
      id: 'blender',
      targetT: 0.28,
      img: logoImgs.blender
    },
    {
      id: 'unreal',
      targetT: 0.46,
      img: logoImgs.unreal
    },
    {
      id: 'higgsfield',
      targetT: 0.64,
      img: logoImgs.higgsfield
    },
    {
      id: 'aftereffects',
      targetT: 0.81,
      img: logoImgs.aftereffects
    }
  ];

  // -------------------------------------------------------------
  // SCROLL PROGRESS CALCULATION
  // -------------------------------------------------------------
  function updateScroll() {
    scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const heroRect = voyageSection.getBoundingClientRect();

    // Check if the hero section is visible in the viewport
    if (heroRect.bottom <= 0) {
      if (isCanvasActive) {
        isCanvasActive = false;
        canvas.style.display = 'none';
      }
      return;
    } else {
      if (!isCanvasActive) {
        isCanvasActive = true;
        canvas.style.display = 'block';
        if (!animationFrameId) render();
      }
    }

    const heroContent = document.querySelector('.hero-content-layer');
    const heroContentHeight = heroContent ? heroContent.offsetHeight : window.innerHeight;
    const totalDist = voyageSection.offsetHeight - window.innerHeight;

    // Transition start point: Title card is reading space; illusion accelerates as title card scrolls away
    const transitionStart = isMobile ? heroContentHeight * 0.35 : heroContentHeight * 0.40;
    const runwayDistance = Math.max(1, totalDist - transitionStart);

    if (totalDist > 0 && scrollY > transitionStart) {
      const norm = (scrollY - transitionStart) / runwayDistance;
      targetIllusionProgress = Math.max(0, Math.min(1, norm));
    } else {
      targetIllusionProgress = 0;
    }

    // Climax reveal: "WELCOME TO MY WORKS"
    if (endingText) {
      if (illusionProgress >= 0.87 && illusionProgress <= 0.99) {
        endingText.classList.add('visible');
      } else {
        endingText.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', updateScroll, { passive: true });

  // -------------------------------------------------------------
  // RESIZE & DPR ADAPTATION
  // -------------------------------------------------------------
  function resize() {
    isMobile = window.innerWidth <= 768;
    // Cap DPR on mobile to 1.75 for maximum smoothness and battery efficiency
    dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.75 : 2);
    width = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initTunnelParticles();
  }

  // -------------------------------------------------------------
  // CONCENTRIC SIMPLE ROUNDS ILLUSION TUNNEL CONFIGURATION
  // -------------------------------------------------------------
  const tunnelConfig = {
    ringCount: 30,
    maxDepth: 4200,
    cameraSpeed: 5000,
    beadCount: 95
  };

  // Floating Cyan & Sapphire Droplets / Beads
  let goldenBeads = [];
  function initTunnelParticles() {
    goldenBeads = [];
    const count = isMobile ? 48 : tunnelConfig.beadCount;
    const cornerDist = Math.hypot(width, height) * 0.55;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 60 + Math.random() * (cornerDist * 1.35);
      goldenBeads.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        baseZ: Math.random() * tunnelConfig.maxDepth,
        size: isMobile ? (1.8 + Math.random() * 3.0) : (2.2 + Math.random() * 4.2),
        color: Math.random() > 0.45 ? '#00f0ff' : '#0066ff',
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  // -------------------------------------------------------------
  // 3D GLASS CUBE (The Interactive Vessel)
  // -------------------------------------------------------------
  const heroCube = {
    size: 130,
    rotX: 0.35,
    rotY: 0.45,
    rotZ: 0.15,
    speedX: 0.0035,
    speedY: 0.0055,
    speedZ: 0.002
  };

  const baseCubeVertices = [
    [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
    [-1, -1,  1], [1, -1,  1], [1, 1,  1], [-1, 1,  1]
  ];

  const cubeEdges = [
    [0, 1], [1, 2], [2, 3], [3, 0], // Back
    [4, 5], [5, 6], [6, 7], [7, 4], // Front
    [0, 4], [1, 5], [2, 6], [3, 7]  // Connectors
  ];

  const cubeFaces = [
    [0, 1, 2, 3], // Back
    [4, 5, 6, 7], // Front
    [0, 1, 5, 4], // Top
    [2, 3, 7, 6], // Bottom
    [0, 3, 7, 4], // Left
    [1, 2, 6, 5]  // Right
  ];

  class Point3D {
    constructor(x = 0, y = 0, z = 0) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
    rotateX(angle) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const y = this.y * cos - this.z * sin;
      const z = this.y * sin + this.z * cos;
      this.y = y;
      this.z = z;
      return this;
    }
    rotateY(angle) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x = this.x * cos + this.z * sin;
      const z = -this.x * sin + this.z * cos;
      this.x = x;
      this.z = z;
      return this;
    }
    rotateZ(angle) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x = this.x * cos - this.y * sin;
      const y = this.x * sin + this.y * cos;
      this.x = x;
      this.y = y;
      return this;
    }
  }

  // -------------------------------------------------------------
  // DRAW EXACT UPLOADED LOGO PNG (Clean, no text, no synthetic outlines)
  // -------------------------------------------------------------
  function drawCleanLogoPNG(item, progress, fov, viewDist, centerX, centerY) {
    const dist = progress - item.targetT;
    const halfWindow = isMobile ? 0.10 : 0.09;
    if (Math.abs(dist) > halfWindow) return;

    // Normalized curve: -1 (approaching from depth) -> 0 (peak) -> +1 (flying past)
    const normDist = dist / halfWindow;

    // Smooth bell-curve alpha: peaks at 1.0, gently fades at boundaries
    const alpha = Math.cos(normDist * Math.PI * 0.5);
    if (alpha <= 0.02) return;

    // 3D relative Z distance through the concentric tunnel
    const relZ = 320 - normDist * 280;
    const scale = fov / (viewDist + Math.max(40, relZ));

    // Responsive size: adapted for mobile and desktop screens
    const baseDim = isMobile ? Math.min(width, height) * 0.32 : Math.min(width, height) * 0.22;
    const normScale = 620 / (viewDist + Math.max(40, relZ));
    const maxAllowed = isMobile ? 150 : 230;
    const minAllowed = isMobile ? 65 : 90;
    const logoSize = Math.max(minAllowed, Math.min(maxAllowed, baseDim * normScale));

    // Centered in tunnel with touch/cursor parallax
    const itemX = centerX + (mouseX * (isMobile ? 24 : 38) * Math.min(1.4, scale));
    const itemY = centerY + (mouseY * (isMobile ? 18 : 28) * Math.min(1.4, scale));

    ctx.save();
    ctx.translate(itemX, itemY);

    // Soft atmospheric radial aura behind the logo
    const glowGrad = ctx.createRadialGradient(0, 0, logoSize * 0.1, 0, 0, logoSize * 0.72);
    glowGrad.addColorStop(0, `rgba(0, 240, 255, ${alpha * 0.38})`);
    glowGrad.addColorStop(0.5, `rgba(0, 102, 255, ${alpha * 0.16})`);
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(0, 0, logoSize * 0.72, 0, Math.PI * 2);
    ctx.fill();

    // Draw the exact uploaded logo PNG
    if (item.img && item.img.complete && item.img.naturalWidth > 0) {
      ctx.globalAlpha = alpha;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = isMobile ? 12 : 20;
      ctx.drawImage(item.img, -logoSize / 2, -logoSize / 2, logoSize, logoSize);
    }

    ctx.restore();
  }

  // -------------------------------------------------------------
  // MAIN RENDER LOOP
  // -------------------------------------------------------------
  function render() {
    if (!isCanvasActive) {
      animationFrameId = null;
      return;
    }

    ctx.clearRect(0, 0, width, height);

    // Smooth Cursor / Touch Lerp
    mouseX += (targetMouseX - mouseX) * 0.08;
    mouseY += (targetMouseY - mouseY) * 0.08;

    // Smooth Illusion Progress Lerp
    illusionProgress += (targetIllusionProgress - illusionProgress) * 0.08;

    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const cornerDist = Math.hypot(width, height) * 0.5;
    const fov = Math.max(width, height) * 0.88;
    const viewDist = 400;

    // Base radius scaled to sweep beyond screen boundaries
    const baseRadius = cornerDist * 1.30;

    // -----------------------------------------------------------
    // 1. CENTRAL OPTICAL SINGULARITY (Pulsing Cyan-Sapphire Core)
    // -----------------------------------------------------------
    const pulse = (Math.sin(Date.now() * 0.0025) + 1) * 0.5;
    const coreIntensity = Math.min(1, 0.30 + illusionProgress * 0.70);
    const centerGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, isMobile ? 260 : 340);
    centerGrad.addColorStop(0, `rgba(224, 247, 255, ${0.85 * coreIntensity + pulse * 0.15})`);
    centerGrad.addColorStop(0.18, `rgba(0, 240, 255, ${0.70 * coreIntensity + pulse * 0.10})`);
    centerGrad.addColorStop(0.45, `rgba(0, 102, 255, ${0.48 * coreIntensity})`);
    centerGrad.addColorStop(0.75, `rgba(10, 25, 70, ${0.30 * coreIntensity})`);
    centerGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = centerGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, isMobile ? 260 : 340, 0, Math.PI * 2);
    ctx.fill();

    // -----------------------------------------------------------
    // 2. CONCENTRIC SIMPLE ROUNDS ILLUSION TUNNEL
    // -----------------------------------------------------------
    const cameraZ = illusionProgress * tunnelConfig.cameraSpeed;
    const inIllusion = illusionProgress > 0.01;
    const illusionAlpha = Math.min(1, illusionProgress * 3.5);

    if (inIllusion) {
      const activeRings = isMobile ? 20 : tunnelConfig.ringCount;
      for (let i = 0; i < activeRings; i++) {
        const initialZ = (i / activeRings) * tunnelConfig.maxDepth;
        let relZ = (initialZ - (cameraZ % tunnelConfig.maxDepth) + tunnelConfig.maxDepth) % tunnelConfig.maxDepth;

        if (relZ < 20) continue;

        const scale = fov / (viewDist + relZ);
        const ringRadius = baseRadius * scale;
        const depthAlpha = Math.min(1, Math.max(0, (tunnelConfig.maxDepth - relZ) / (tunnelConfig.maxDepth * 0.7)));
        const alpha = depthAlpha * illusionAlpha;

        // Subtle organic float offset
        const waveX = Math.sin((i * 0.25) + (illusionProgress * Math.PI * 2.8)) * (25 * scale);
        const waveY = Math.cos((i * 0.2) + (illusionProgress * Math.PI * 2.2)) * (20 * scale);

        // Perspective camera steering with touch/mouse
        const steerX = mouseX * (isMobile ? 35 : 55) * Math.min(1, 1 / scale);
        const steerY = mouseY * (isMobile ? 25 : 40) * Math.min(1, 1 / scale);

        const ringX = centerX + waveX + steerX;
        const ringY = centerY + waveY + steerY;

        // Radiant Electric Sapphire into Neon Cyan Gradient
        const strokeGrad = ctx.createLinearGradient(
          ringX - ringRadius, ringY - ringRadius,
          ringX + ringRadius, ringY + ringRadius
        );
        strokeGrad.addColorStop(0, `rgba(230, 250, 255, ${alpha * 0.98})`);
        strokeGrad.addColorStop(0.35, `rgba(0, 220, 255, ${alpha * 0.92})`);
        strokeGrad.addColorStop(0.70, `rgba(0, 102, 255, ${alpha * 0.88})`);
        strokeGrad.addColorStop(1, `rgba(8, 28, 80, ${alpha * 0.70})`);

        // Primary Round
        ctx.beginPath();
        ctx.arc(ringX, ringY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = strokeGrad;
        ctx.lineWidth = Math.max(isMobile ? 1.8 : 2.2, (isMobile ? 4.5 : 6.2) * scale);
        ctx.stroke();

        // Stepped Concentric Middle Round
        ctx.beginPath();
        ctx.arc(ringX, ringY, ringRadius * 0.88, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 210, 255, ${alpha * 0.75})`;
        ctx.lineWidth = Math.max(1.2, 3.0 * scale);
        ctx.stroke();

        // Inner Precision Hairline Round
        if (i % 2 === 0) {
          ctx.beginPath();
          ctx.arc(ringX, ringY, ringRadius * 0.76, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(70, 140, 255, ${alpha * 0.60})`;
          ctx.lineWidth = Math.max(1.0, 1.8 * scale);
          ctx.stroke();
        }
      }

      // ---------------------------------------------------------
      // 3. FLOATING CYAN & SAPPHIRE BEADS / DROPLETS
      // ---------------------------------------------------------
      goldenBeads.forEach(b => {
        b.pulse += 0.02;
        let relZ = (b.baseZ - (cameraZ % tunnelConfig.maxDepth) + tunnelConfig.maxDepth) % tunnelConfig.maxDepth;
        if (relZ < 25) return;

        const scale = fov / (viewDist + relZ);
        const projX = b.x * scale + centerX;
        const projY = b.y * scale + centerY;
        const depthAlpha = Math.min(1, Math.max(0, (tunnelConfig.maxDepth - relZ) / tunnelConfig.maxDepth));
        const alpha = depthAlpha * illusionAlpha;
        const size = Math.max(1.5, b.size * scale);

        ctx.fillStyle = b.color === '#00f0ff'
          ? `rgba(0, 240, 255, ${alpha * 0.92})`
          : `rgba(0, 102, 255, ${alpha * 0.90})`;

        ctx.beginPath();
        ctx.arc(projX, projY, size, 0, Math.PI * 2);
        ctx.fill();

        if (scale > 0.4 && !isMobile) {
          ctx.fillStyle = b.color === '#00f0ff'
            ? `rgba(0, 240, 255, ${alpha * 0.28})`
            : `rgba(0, 102, 255, ${alpha * 0.28})`;
          ctx.beginPath();
          ctx.arc(projX, projY, size * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // ---------------------------------------------------------
      // 4. DRAW EXACT UPLOADED LOGO PNGs IN SEQUENCE
      // ---------------------------------------------------------
      milestoneLogos.forEach(item => {
        drawCleanLogoPNG(item, illusionProgress, fov, viewDist, centerX, centerY);
      });
    }

    // -----------------------------------------------------------
    // 5. THE 3D REFRACTIVE GLASS CUBE (Interactive Vessel)
    // Sits gracefully below Title Card in Hero, dives deeper into
    // the vortex center on scroll, steered actively by cursor/touch!
    // -----------------------------------------------------------
    heroCube.rotX += heroCube.speedX + (mouseY * 0.0035);
    heroCube.rotY += heroCube.speedY + (mouseX * 0.0045);
    heroCube.rotZ += heroCube.speedZ;

    const heroDrop = isMobile ? Math.min(130, height * 0.16) : Math.min(180, height * 0.20);
    const heroCubeX = centerX + (mouseX * (isMobile ? 55 : 95));
    const heroCubeY = centerY + heroDrop + (mouseY * (isMobile ? 40 : 70));
    const heroScale = isMobile ? 0.85 : 1.05;

    const illusionCubeX = centerX + (mouseX * (isMobile ? 75 : 130));
    const illusionCubeY = centerY + (mouseY * (isMobile ? 60 : 100));
    const illusionScale = (isMobile ? 0.78 : 0.95) + Math.sin(illusionProgress * Math.PI) * 0.15;

    const cubeX = heroCubeX + (illusionCubeX - heroCubeX) * illusionProgress;
    const cubeY = heroCubeY + (illusionCubeY - heroCubeY) * illusionProgress;
    const cubeScale = heroScale + (illusionScale - heroScale) * illusionProgress;

    drawRefractiveGlassCube(cubeX, cubeY, cubeScale);

    animationFrameId = requestAnimationFrame(render);
  }

  // -------------------------------------------------------------
  // DRAW 3D REFRACTIVE GLASS CUBE WITH CHROMATIC DISPERSION
  // -------------------------------------------------------------
  function drawRefractiveGlassCube(cx, cy, overallScale) {
    const baseSize = isMobile ? 85 : 125;
    const thickness = isMobile ? 14 : 22;
    const sOuter = baseSize * overallScale;
    const sInner = (baseSize - thickness) * overallScale;

    const projOuter = [];
    const projInner = [];

    // Transform 8 Outer & Inner Vertices
    for (let i = 0; i < 8; i++) {
      const bv = baseCubeVertices[i];
      // Outer
      const po = new Point3D(bv[0] * sOuter, bv[1] * sOuter, bv[2] * sOuter);
      po.rotateX(heroCube.rotX);
      po.rotateY(heroCube.rotY);
      po.rotateZ(heroCube.rotZ);
      projOuter.push({ x: po.x + cx, y: po.y + cy, z: po.z, scale: overallScale });

      // Inner
      const pi = new Point3D(bv[0] * sInner, bv[1] * sInner, bv[2] * sInner);
      pi.rotateX(heroCube.rotX);
      pi.rotateY(heroCube.rotY);
      pi.rotateZ(heroCube.rotZ);
      projInner.push({ x: pi.x + cx, y: pi.y + cy, z: pi.z, scale: overallScale });
    }

    // Sort Faces for Depth Shading
    const sortedFaces = cubeFaces.map((indices, fIdx) => {
      let avgZ = 0;
      indices.forEach(idx => avgZ += projOuter[idx].z);
      avgZ /= indices.length;
      return { indices, fIdx, avgZ };
    }).sort((a, b) => a.avgZ - b.avgZ);

    // 1. Draw Translucent Frosted Glass Faces
    sortedFaces.forEach(face => {
      const idx = face.indices;
      const p0 = projOuter[idx[0]];
      const p1 = projOuter[idx[1]];
      const p2 = projOuter[idx[2]];
      const p3 = projOuter[idx[3]];

      const v1x = p1.x - p0.x, v1y = p1.y - p0.y;
      const v2x = p2.x - p0.x, v2y = p2.y - p0.y;
      const normalZ = v1x * v2y - v1y * v2x;

      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.closePath();

      if (normalZ > 0) {
        // Front-facing: Radiant electric cyan & sapphire glass reflection
        const faceGrad = ctx.createLinearGradient(p0.x, p0.y, p2.x, p2.y);
        faceGrad.addColorStop(0, 'rgba(0, 240, 255, 0.22)');
        faceGrad.addColorStop(0.5, 'rgba(0, 102, 255, 0.12)');
        faceGrad.addColorStop(1, 'rgba(10, 30, 90, 0.24)');
        ctx.fillStyle = faceGrad;
        ctx.fill();
      } else {
        // Back-facing: Deep midnight navy tint
        ctx.fillStyle = 'rgba(6, 12, 28, 0.50)';
        ctx.fill();
      }
    });

    // 2. Draw Inner Refracted Wireframe Cavity
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = Math.max(1, 1.3 * overallScale);
    cubeEdges.forEach(([i1, i2]) => {
      const p1 = projInner[i1];
      const p2 = projInner[i2];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    });

    // 3. Chromatic Dispersion on Outer Bevel Edges
    // Electric Sapphire Channel (offset -1.6px)
    ctx.strokeStyle = 'rgba(0, 102, 255, 0.70)';
    ctx.lineWidth = Math.max(1.4, (isMobile ? 2.4 : 3.0) * overallScale);
    cubeEdges.forEach(([i1, i2]) => {
      const p1 = projOuter[i1];
      const p2 = projOuter[i2];
      ctx.beginPath();
      ctx.moveTo(p1.x - 1.6, p1.y - 1.6);
      ctx.lineTo(p2.x - 1.6, p2.y - 1.6);
      ctx.stroke();
    });

    // Radiant Neon Cyan Channel (offset +1.6px)
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.70)';
    ctx.lineWidth = Math.max(1.4, (isMobile ? 2.4 : 3.0) * overallScale);
    cubeEdges.forEach(([i1, i2]) => {
      const p1 = projOuter[i1];
      const p2 = projOuter[i2];
      ctx.beginPath();
      ctx.moveTo(p1.x + 1.6, p1.y + 1.6);
      ctx.lineTo(p2.x + 1.6, p2.y + 1.6);
      ctx.stroke();
    });

    // Core Ice-White Brilliant Edge
    ctx.strokeStyle = 'rgba(235, 250, 255, 0.98)';
    ctx.lineWidth = Math.max(1.6, (isMobile ? 2.6 : 3.6) * overallScale);
    cubeEdges.forEach(([i1, i2]) => {
      const p1 = projOuter[i1];
      const p2 = projOuter[i2];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    });

    // 4. Specular Corner Sparkles
    projOuter.forEach((p, idx) => {
      if (p.z < 0) {
        const glintAlpha = Math.min(1, Math.max(0, -p.z / (160 * overallScale)));
        ctx.fillStyle = `rgba(255, 255, 255, ${glintAlpha * 0.95})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, (isMobile ? 3 : 4) * overallScale, 0, Math.PI * 2);
        ctx.fill();

        if ((idx === 0 || idx === 1 || idx === 2) && !isMobile) {
          ctx.strokeStyle = `rgba(0, 240, 255, ${glintAlpha * 0.85})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(p.x - 8 * overallScale, p.y);
          ctx.lineTo(p.x + 8 * overallScale, p.y);
          ctx.moveTo(p.x, p.y - 8 * overallScale);
          ctx.lineTo(p.x, p.y + 8 * overallScale);
          ctx.stroke();
        }
      }
    });
  }

  window.addEventListener('resize', resize);
  resize();
  updateScroll();
  render();

  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(animationFrameId);
  });
})();
