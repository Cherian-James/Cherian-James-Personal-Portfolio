/**
 * CHERIAN JAMES - FULL-SCREEN CIRCLES ILLUSION & SEQUENCED PIPELINE LOGOS
 * 
 * Features:
 * 1. Webpage opens cleanly with the Title Card on top (unhurried reading buffer).
 * 2. 3D Glass Cube sits below title card, tracking cursor.
 * 3. Scrolling moves into the illusion slowly.
 * 4. PURE FULL-SCREEN CIRCLES: The user scrolls for some time diving deep into the
 *    golden concentric circles before any logos appear.
 * 5. SEQUENCED EXACT UPLOADED LOGO PNGs:
 *    - Only the clean logo PNG: NO text, NO outlines, NO cards around it.
 *    - 1st: Blender PNG
 *    - 2nd: Unreal Engine PNG
 *    - 3rd: Higgsfield AI PNG
 *    - 4th: After Effects PNG
 *    - Generous scroll spacing so each logo is admired one by one.
 * 6. Climax reveal: "WELCOME TO MY WORKS" with ample reading time, leading into Works.
 */

(function () {
  const canvas = document.getElementById('experienceCanvas');
  const voyageSection = document.getElementById('hero');
  const endingText = document.getElementById('voyageEndingText');
  if (!canvas || !voyageSection) return;

  const ctx = canvas.getContext('2d');
  let width = 0, height = 0, dpr = 1;
  let rawProgress = 0;       // 0 to 1 through the whole hero-voyage section
  let illusionProgress = 0;  // 0 to 1 (starts slowly after reading zone)
  let targetIllusionProgress = 0;
  let scrollY = 0;
  let animationFrameId;

  // Interactive Cursor Position (-1 to 1)
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      targetMouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      targetMouseY = (e.touches[0].clientY / window.innerHeight) * 2 - 1;
    }
  }, { passive: true });

  // -------------------------------------------------------------
  // EXACT UPLOADED LOGO PNGs WITH WHITE STROKE OUTLINE & NAMES
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

  // White Silhouette Cache for High-Fidelity Stroke Outlines
  const silhouetteCache = new WeakMap();

  function getWhiteSilhouette(img) {
    if (!img || !img.complete || img.naturalWidth === 0) return null;
    if (silhouetteCache.has(img)) return silhouetteCache.get(img);

    try {
      const off = document.createElement('canvas');
      off.width = img.naturalWidth;
      off.height = img.naturalHeight;
      const offCtx = off.getContext('2d');
      offCtx.drawImage(img, 0, 0);
      offCtx.globalCompositeOperation = 'source-in';
      offCtx.fillStyle = '#ffffff';
      offCtx.fillRect(0, 0, off.width, off.height);
      silhouetteCache.set(img, off);
      return off;
    } catch (e) {
      return null;
    }
  }

  // Pre-generate silhouettes once images load
  ['blender', 'unreal', 'higgsfield', 'aftereffects'].forEach(key => {
    logoImgs[key].onload = () => {
      getWhiteSilhouette(logoImgs[key]);
    };
  });

  // Sequenced Milestones in the Illusion Depth:
  // 1. Scroll into deep circles first.
  // 2. Each logo has an extended viewing runway (~1100px scroll per logo) with white outline & all-caps name below.
  const milestoneLogos = [
    {
      id: 'blender',
      name: 'BLENDER',
      targetT: 0.33,      // 1st: BLENDER (visible ~0.25 to 0.41)
      img: logoImgs.blender
    },
    {
      id: 'unreal',
      name: 'UNREAL ENGINE',
      targetT: 0.48,      // 2nd: UNREAL ENGINE (visible ~0.40 to 0.56)
      img: logoImgs.unreal
    },
    {
      id: 'higgsfield',
      name: 'HIGGSFIELD',
      targetT: 0.63,      // 3rd: HIGGSFIELD (visible ~0.55 to 0.71)
      img: logoImgs.higgsfield
    },
    {
      id: 'aftereffects',
      name: 'AFTER EFFECTS',
      targetT: 0.78,      // 4th: AFTER EFFECTS (visible ~0.70 to 0.86)
      img: logoImgs.aftereffects
    }
  ];

  // Update Scroll Progress with generous scroll zones
  function updateScroll() {
    scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const rect = voyageSection.getBoundingClientRect();
    const totalDist = voyageSection.offsetHeight - window.innerHeight;
    if (totalDist > 0) {
      const current = -rect.top;
      rawProgress = Math.max(0, Math.min(1, current / totalDist));
    } else {
      rawProgress = 0;
    }

    // Zone 1: Dedicated Title Card Reading Time (0 to 0.12 on desktop, 0.35 on mobile)
    const readingZone = window.innerWidth <= 768 ? 0.35 : 0.12;

    // Zone 2: Illusion starts slowly and accelerates into the deep circles
    if (rawProgress <= readingZone) {
      targetIllusionProgress = 0;
    } else if (rawProgress <= 0.85) {
      const norm = (rawProgress - readingZone) / (0.85 - readingZone);
      targetIllusionProgress = norm * norm * 0.7 + norm * 0.3; // Starts slowly!
    } else {
      targetIllusionProgress = 1.0;
    }

    // Zone 3: "WELCOME TO MY WORKS" Extended Reading Buffer (0.86 to 0.97)
    // ~800px of scrolling space: plenty of time to comfortably read before Works!
    if (endingText) {
      if (rawProgress >= 0.86 && rawProgress <= 0.97) {
        endingText.classList.add('visible');
      } else {
        endingText.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', updateScroll, { passive: true });

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    initTunnelParticles();
  }

  // -------------------------------------------------------------
  // FULL-SCREEN SIMPLE ROUNDS CONFIGURATION
  // Concentric golden circular rings expanding across full screen
  // -------------------------------------------------------------
  const tunnelConfig = {
    ringCount: 32,        // Concentric rounds
    maxDepth: 4200,       // Deep spatial depth
    cameraSpeed: 5200,    // Dive speed along Z
    beadCount: 110        // Floating golden beads & droplets
  };

  // Floating Cyan & Sapphire Beads
  let goldenBeads = [];
  function initTunnelParticles() {
    goldenBeads = [];
    const cornerDist = Math.hypot(width, height) * 0.55;
    for (let i = 0; i < tunnelConfig.beadCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 90 + Math.random() * (cornerDist * 1.35);
      goldenBeads.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        baseZ: Math.random() * tunnelConfig.maxDepth,
        size: 2.2 + Math.random() * 4.2,
        color: Math.random() > 0.45 ? '#00f0ff' : '#0066ff', // Luminous cyan and electric sapphire blue!
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  // -------------------------------------------------------------
  // 3D GLASS CUBE (The Interactive Vessel)
  // -------------------------------------------------------------
  const heroCube = {
    size: 130,
    wallThickness: 22,
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
  // DRAW LOGO PNG WITH WHITE STROKE OUTLINE & NAME BELOW
  // Features:
  // 1. Extended scroll window (~1100px) with sustained peak visibility.
  // 2. Crisp, solid white stroke outline contouring the logo.
  // 3. Name below each logo: BLENDER, UNREAL ENGINE, HIGGSFIELD, AFTER EFFECTS
  // -------------------------------------------------------------
  function drawCleanLogoPNG(item, progress, fov, viewDist, centerX, centerY) {
    const dist = progress - item.targetT;
    const halfWindow = 0.08; // Active visibility window in scroll (~1100px buffer per logo)
    if (Math.abs(dist) > halfWindow) return;

    // Map distance to normalized curve: -1 (deep in tunnel) to 0 (peak) to +1 (passing)
    const normDist = dist / halfWindow;

    // Sustained bell-curve alpha: stays at full 1.0 throughout central viewing zone!
    const depthAlpha = Math.min(1.0, Math.cos(normDist * Math.PI * 0.5) * 1.35);
    const alpha = depthAlpha * Math.min(1, illusionProgress * 3.5);
    if (alpha <= 0.02) return;

    // 3D relative Z distance through the concentric tunnel
    const relZ = 650 - normDist * 850;
    const scale = fov / (viewDist + Math.max(50, relZ));

    // Dynamic responsive size (~200px to 260px at peak on desktop)
    const logoBase = Math.min(width, height) * 0.20;
    const normScale = 1050 / (viewDist + Math.max(50, relZ));
    const logoSize = Math.max(75, Math.min(320, logoBase * normScale));

    // Position in center of circular tunnel with gentle cursor parallax
    const itemX = centerX + (mouseX * 45 * Math.min(1.5, scale));
    const itemY = centerY + (mouseY * 35 * Math.min(1.5, scale));

    ctx.save();
    ctx.translate(itemX, itemY);

    // 1. Soft atmospheric radial light behind the logo
    const glowGrad = ctx.createRadialGradient(0, 0, logoSize * 0.15, 0, 0, logoSize * 0.85);
    glowGrad.addColorStop(0, `rgba(0, 240, 255, ${alpha * 0.32})`);
    glowGrad.addColorStop(0.5, `rgba(0, 102, 255, ${alpha * 0.12})`);
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(0, 0, logoSize * 0.85, 0, Math.PI * 2);
    ctx.fill();

    // 2. Crisp Solid White Stroke Outline Around Logo Contour
    const silhouette = getWhiteSilhouette(item.img);
    const strokeRadius = Math.max(3.0, Math.min(7.0, 5.0 * (logoSize / 220)));
    const numSamples = 24;

    if (silhouette) {
      ctx.globalAlpha = alpha;
      // Soft dark drop-shadow behind the white stroke for high contrast & pop
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = Math.max(8, 16 * (logoSize / 220));

      for (let i = 0; i < numSamples; i++) {
        const angle = (i / numSamples) * Math.PI * 2;
        const ox = Math.cos(angle) * strokeRadius;
        const oy = Math.sin(angle) * strokeRadius;
        ctx.drawImage(silhouette, -logoSize / 2 + ox, -logoSize / 2 + oy, logoSize, logoSize);
      }
      ctx.shadowBlur = 0; // Reset shadow
    }

    // 3. Draw full-color exact uploaded logo PNG on top
    if (item.img && item.img.complete && item.img.naturalWidth > 0) {
      ctx.globalAlpha = alpha;
      ctx.drawImage(item.img, -logoSize / 2, -logoSize / 2, logoSize, logoSize);
      ctx.globalAlpha = 1.0;
    }

    // 4. Name Below Each Logo: BLENDER, UNREAL ENGINE, HIGGSFIELD, AFTER EFFECTS
    const textY = logoSize / 2 + Math.max(26, 38 * (logoSize / 220));
    const fontSize = Math.max(14, Math.round(18 * (logoSize / 220)));
    
    ctx.font = `800 ${fontSize}px "Syne", "Cabinet Grotesk", system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const label = item.name;
    const textMetrics = ctx.measureText(label);
    const pillPadX = Math.max(16, 22 * (logoSize / 220));
    const pillPadY = Math.max(8, 11 * (logoSize / 220));
    const pillW = textMetrics.width + pillPadX * 2;
    const pillH = fontSize + pillPadY * 2;
    const pillRadius = pillH / 2;

    // Dark obsidian glass pill badge
    ctx.fillStyle = `rgba(6, 12, 28, ${alpha * 0.94})`;
    ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.85})`;
    ctx.lineWidth = Math.max(1.5, 2.0 * (logoSize / 220));

    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 12;

    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(-pillW / 2, textY - pillH / 2, pillW, pillH, pillRadius);
    } else {
      ctx.rect(-pillW / 2, textY - pillH / 2, pillW, pillH);
    }
    ctx.fill();
    ctx.stroke();

    // Subtle glowing cyan dot accents on pill ends
    ctx.fillStyle = `rgba(0, 240, 255, ${alpha * 0.95})`;
    ctx.shadowColor = 'rgba(0, 240, 255, 0.7)';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(-pillW / 2 + pillPadX * 0.5, textY, 3, 0, Math.PI * 2);
    ctx.arc(pillW / 2 - pillPadX * 0.5, textY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Crisp pure white title typography
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 4;
    ctx.fillText(label, 0, textY + 1);
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  // -------------------------------------------------------------
  // MAIN RENDER LOOP
  // -------------------------------------------------------------
  function render() {
    ctx.clearRect(0, 0, width, height);

    // Smooth Cursor Lerp
    mouseX += (targetMouseX - mouseX) * 0.08;
    mouseY += (targetMouseY - mouseY) * 0.08;

    // Smooth Illusion Progress Lerp
    illusionProgress += (targetIllusionProgress - illusionProgress) * 0.075;

    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const cornerDist = Math.hypot(width, height) * 0.5;
    const fov = Math.max(width, height) * 0.88;
    const viewDist = 400;

    // Base radius dynamically scaled to sweep beyond screen edges!
    const baseRadius = cornerDist * 1.30;

    // -----------------------------------------------------------
    // 1. CENTRAL CYAN-SAPPHIRE OPTICAL SINGULARITY (Pulsing dark blue core)
    // -----------------------------------------------------------
    const pulse = (Math.sin(Date.now() * 0.0025) + 1) * 0.5;
    const coreIntensity = Math.min(1, 0.25 + illusionProgress * 0.75);
    const centerGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 340);
    centerGrad.addColorStop(0, `rgba(224, 247, 255, ${0.85 * coreIntensity + pulse * 0.15})`);
    centerGrad.addColorStop(0.18, `rgba(0, 240, 255, ${0.70 * coreIntensity + pulse * 0.10})`);
    centerGrad.addColorStop(0.45, `rgba(0, 102, 255, ${0.50 * coreIntensity})`);
    centerGrad.addColorStop(0.75, `rgba(10, 25, 70, ${0.35 * coreIntensity})`);
    centerGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = centerGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 340, 0, Math.PI * 2);
    ctx.fill();

    // -----------------------------------------------------------
    // 2. FULL-SCREEN CONCENTRIC SIMPLE ROUNDS
    // -----------------------------------------------------------
    const cameraZ = illusionProgress * tunnelConfig.cameraSpeed;
    const inIllusion = illusionProgress > 0.01;
    const illusionAlpha = Math.min(1, illusionProgress * 3.5);

    if (inIllusion) {
      for (let i = 0; i < tunnelConfig.ringCount; i++) {
        const initialZ = (i / tunnelConfig.ringCount) * tunnelConfig.maxDepth;
        let relZ = (initialZ - (cameraZ % tunnelConfig.maxDepth) + tunnelConfig.maxDepth) % tunnelConfig.maxDepth;

        if (relZ < 20) continue; // Behind near plane

        const scale = fov / (viewDist + relZ);
        const ringRadius = baseRadius * scale;
        const depthAlpha = Math.min(1, Math.max(0, (tunnelConfig.maxDepth - relZ) / (tunnelConfig.maxDepth * 0.7)));
        const alpha = depthAlpha * illusionAlpha;

        // Subtle organic float offset
        const waveX = Math.sin((i * 0.25) + (illusionProgress * Math.PI * 2.8)) * (35 * scale);
        const waveY = Math.cos((i * 0.2) + (illusionProgress * Math.PI * 2.2)) * (25 * scale);

        // Perspective camera steering with mouse
        const steerX = mouseX * 55 * Math.min(1, 1 / scale);
        const steerY = mouseY * 40 * Math.min(1, 1 / scale);

        const ringX = centerX + waveX + steerX;
        const ringY = centerY + waveY + steerY;

        // Radiant Electric Sapphire into Neon Cyan Gradient for Simple Round Edge
        const strokeGrad = ctx.createLinearGradient(
          ringX - ringRadius, ringY - ringRadius,
          ringX + ringRadius, ringY + ringRadius
        );
        strokeGrad.addColorStop(0, `rgba(230, 250, 255, ${alpha * 0.98})`);
        strokeGrad.addColorStop(0.35, `rgba(0, 220, 255, ${alpha * 0.92})`);
        strokeGrad.addColorStop(0.70, `rgba(0, 102, 255, ${alpha * 0.88})`);
        strokeGrad.addColorStop(1, `rgba(8, 28, 80, ${alpha * 0.70})`);

        // 1. Primary Full-Screen Radiant Round
        ctx.beginPath();
        ctx.arc(ringX, ringY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = strokeGrad;
        ctx.lineWidth = Math.max(2.2, 6.2 * scale);
        ctx.stroke();

        // 2. Stepped Concentric Middle Round (Tiered depth in electric cyan)
        ctx.beginPath();
        ctx.arc(ringX, ringY, ringRadius * 0.88, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 210, 255, ${alpha * 0.75})`;
        ctx.lineWidth = Math.max(1.4, 3.2 * scale);
        ctx.stroke();

        // 3. Inner Precision Hairline Round (Sapphire blue accent)
        if (i % 2 === 0) {
          ctx.beginPath();
          ctx.arc(ringX, ringY, ringRadius * 0.76, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(70, 140, 255, ${alpha * 0.60})`;
          ctx.lineWidth = Math.max(1.0, 1.8 * scale);
          ctx.stroke();
        }
      }

      // ---------------------------------------------------------
      // 3. FLOATING CYAN & SAPPHIRE BEADS (Smooth Spatial Droplets)
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

        // Soft outer halo on close beads
        if (scale > 0.4) {
          ctx.fillStyle = b.color === '#00f0ff'
            ? `rgba(0, 240, 255, ${alpha * 0.28})`
            : `rgba(0, 102, 255, ${alpha * 0.28})`;
          ctx.beginPath();
          ctx.arc(projX, projY, size * 2.3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // ---------------------------------------------------------
      // 4. DRAW EXACT UPLOADED LOGO PNGs (NO TEXT, NO OUTLINES)
      // Sequenced on scroll:
      // Scroll into circles first -> Blender -> Unreal -> Higgsfield -> After Effects
      // ---------------------------------------------------------
      milestoneLogos.forEach(item => {
        drawCleanLogoPNG(item, rawProgress, fov, viewDist, centerX, centerY);
      });
    }

    // -----------------------------------------------------------
    // 5. THE 3D REFRACTIVE GLASS CUBE (Interactive Vessel)
    // Sits below Title Card in Hero, dives deeper on scroll,
    // steered actively by cursor throughout the illusion!
    // -----------------------------------------------------------
    heroCube.rotX += heroCube.speedX + (mouseY * 0.004);
    heroCube.rotY += heroCube.speedY + (mouseX * 0.005);
    heroCube.rotZ += heroCube.speedZ;

    const heroDrop = Math.min(200, height * 0.22);
    const heroCubeX = centerX + (mouseX * 110);
    const heroCubeY = centerY + heroDrop + (mouseY * 80);
    const heroScale = 1.05;

    const illusionCubeX = centerX + (mouseX * 150);
    const illusionCubeY = centerY + (mouseY * 120);
    const illusionScale = 0.95 + Math.sin(illusionProgress * Math.PI) * 0.18;

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
    const sOuter = heroCube.size * overallScale;
    const sInner = (heroCube.size - heroCube.wallThickness) * overallScale;

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

      // Inner (Refractive cavity)
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
        faceGrad.addColorStop(0, 'rgba(0, 240, 255, 0.20)');
        faceGrad.addColorStop(0.5, 'rgba(0, 102, 255, 0.12)');
        faceGrad.addColorStop(1, 'rgba(10, 30, 90, 0.22)');
        ctx.fillStyle = faceGrad;
        ctx.fill();
      } else {
        // Back-facing: Deep midnight navy tint
        ctx.fillStyle = 'rgba(6, 12, 28, 0.50)';
        ctx.fill();
      }
    });

    // 2. Draw Inner Refracted Wireframe Cavity
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.32)';
    ctx.lineWidth = Math.max(1, 1.4 * overallScale);
    cubeEdges.forEach(([i1, i2]) => {
      const p1 = projInner[i1];
      const p2 = projInner[i2];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    });

    // 3. Chromatic Dispersion on Outer Bevel Edges
    // Electric Sapphire Channel (shifted -1.8px)
    ctx.strokeStyle = 'rgba(0, 102, 255, 0.70)';
    ctx.lineWidth = Math.max(1.5, 3.2 * overallScale);
    cubeEdges.forEach(([i1, i2]) => {
      const p1 = projOuter[i1];
      const p2 = projOuter[i2];
      ctx.beginPath();
      ctx.moveTo(p1.x - 1.8, p1.y - 1.8);
      ctx.lineTo(p2.x - 1.8, p2.y - 1.8);
      ctx.stroke();
    });

    // Radiant Neon Cyan Channel (shifted +1.8px)
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.70)';
    ctx.lineWidth = Math.max(1.5, 3.2 * overallScale);
    cubeEdges.forEach(([i1, i2]) => {
      const p1 = projOuter[i1];
      const p2 = projOuter[i2];
      ctx.beginPath();
      ctx.moveTo(p1.x + 1.8, p1.y + 1.8);
      ctx.lineTo(p2.x + 1.8, p2.y + 1.8);
      ctx.stroke();
    });

    // Primary Ice White / Diamond Core Edge
    ctx.strokeStyle = 'rgba(230, 250, 255, 0.98)';
    ctx.lineWidth = Math.max(1.8, 3.8 * overallScale);
    cubeEdges.forEach(([i1, i2]) => {
      const p1 = projOuter[i1];
      const p2 = projOuter[i2];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    });

    // 4. Specular Glint Stars on Outer Corner Vertices
    projOuter.forEach((p, idx) => {
      if (p.z < 0) { // Facing camera
        const glintAlpha = Math.min(1, Math.max(0, -p.z / (180 * overallScale)));
        ctx.fillStyle = `rgba(255, 255, 255, ${glintAlpha * 0.95})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 * overallScale, 0, Math.PI * 2);
        ctx.fill();

        // Cross sparkle on dominant corners
        if (idx === 0 || idx === 1 || idx === 2) {
          ctx.strokeStyle = `rgba(0, 240, 255, ${glintAlpha * 0.85})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(p.x - 10 * overallScale, p.y);
          ctx.lineTo(p.x + 10 * overallScale, p.y);
          ctx.moveTo(p.x, p.y - 10 * overallScale);
          ctx.lineTo(p.x, p.y + 10 * overallScale);
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
