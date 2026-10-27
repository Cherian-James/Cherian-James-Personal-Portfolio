/**
 * CHERIAN JAMES - FULL-SCREEN ILLUSION TUNNEL & PIPELINE LOGOS (OPTIMIZED FOR MOBILE & DESKTOP)
 * 
 * 1. Title Card Zone: Clean, unhurried reading space on top with pulsing singularity core.
 * 2. Full-Screen Concentric Rings Tunnel: Camera dives deep into golden/cyan circular portal rounds.
 * 3. Exact Uploaded Logo PNGs (Clean PNGs, no text, no synthetic outlines):
 *    - 1st: Blender PNG
 *    - 2nd: Unreal Engine PNG
 *    - 3rd: Higgsfield AI PNG
 *    - 4th: After Effects PNG
 * 4. Climax: "WELCOME TO MY WORKS" reveals smoothly, leading into the Selected Works section.
 * 5. Responsive: Optimized runways, touch tilt gestures, and mobile DPR scaling for 60 FPS.
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
