/**
 * CHERIAN JAMES - INTERACTIVE 3D HERO CANVAS (GLASS CUBE EDITION)
 * Inspired by Reference: cube animation.mp4
 * High-performance 3D Refractive Glass Cube with Chromatic Dispersion & Specular Facets
 * Positioned right behind the user's top profile / name section
 */

(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, dpr;
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  let scrollY = 0, scrollSpeed = 0, lastScrollY = 0;
  let animationFrameId;

  // 3D Glass Cube Settings
  const cubeConfig = {
    size: 140,            // Base half-size of the glass cube
    wallThickness: 24,    // Internal refractive depth
    rotX: 0.35,
    rotY: 0.45,
    rotZ: 0.15,
    speedX: 0.0035,
    speedY: 0.0055,
    speedZ: 0.002,
    particleCount: 50
  };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    initAmbientParticles();
  }

  // 3D Point class
  class Point3D {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.projX = 0;
      this.projY = 0;
      this.scale = 1;
    }

    rotateX(angle) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const y = this.y * cos - this.z * sin;
      const z = this.y * sin + this.z * cos;
      this.y = y;
      this.z = z;
    }

    rotateY(angle) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x = this.x * cos + this.z * sin;
      const z = -this.x * sin + this.z * cos;
      this.x = x;
      this.z = z;
    }

    rotateZ(angle) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x = this.x * cos - this.y * sin;
      const y = this.x * sin + this.y * cos;
      this.x = x;
      this.y = y;
    }

    project(fov, viewDist, cx, cy) {
      const dist = viewDist + this.z;
      this.scale = fov / (dist > 1 ? dist : 1);
      this.projX = this.x * this.scale + cx;
      this.projY = this.y * this.scale + cy;
    }
  }

  // Build Cube Vertices (Outer + Inner Refractive Core)
  function createCubeVertices(halfSize) {
    const s = halfSize;
    return [
      new Point3D(-s, -s, -s), // 0: Top-Left-Front
      new Point3D( s, -s, -s), // 1: Top-Right-Front
      new Point3D( s,  s, -s), // 2: Bottom-Right-Front
      new Point3D(-s,  s, -s), // 3: Bottom-Left-Front
      new Point3D(-s, -s,  s), // 4: Top-Left-Back
      new Point3D( s, -s,  s), // 5: Top-Right-Back
      new Point3D( s,  s,  s), // 6: Bottom-Right-Back
      new Point3D(-s,  s,  s)  // 7: Bottom-Left-Back
    ];
  }

  const cubeEdges = [
    [0, 1], [1, 2], [2, 3], [3, 0], // Front face
    [4, 5], [5, 6], [6, 7], [7, 4], // Back face
    [0, 4], [1, 5], [2, 6], [3, 7]  // Connecting struts
  ];

  const cubeFaces = [
    [0, 1, 2, 3], // Front
    [5, 4, 7, 6], // Back
    [4, 0, 3, 7], // Left
    [1, 5, 6, 2], // Right
    [4, 5, 1, 0], // Top
    [3, 2, 6, 7]  // Bottom
  ];

  // Ambient Golden Particles
  let ambientParticles = [];
  function initAmbientParticles() {
    ambientParticles = [];
    for (let i = 0; i < cubeConfig.particleCount; i++) {
      ambientParticles.push({
        x: (Math.random() - 0.5) * width * 1.2,
        y: (Math.random() - 0.5) * height * 1.2,
        z: (Math.random() - 0.5) * 600,
        size: 1.2 + Math.random() * 2.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        alpha: 0.2 + Math.random() * 0.6,
        color: Math.random() > 0.45 ? '#00f0ff' : '#0066ff'
      });
    }
  }

  // Mouse & Scroll tracking
  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX - width / 2) * 0.0012;
    targetMouseY = (e.clientY - height / 2) * 0.0012;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      targetMouseX = (e.touches[0].clientX - width / 2) * 0.0012;
      targetMouseY = (e.touches[0].clientY - height / 2) * 0.0012;
    }
  }, { passive: true });

  window.addEventListener('scroll', () => {
    const curY = window.pageYOffset || document.documentElement.scrollTop;
    scrollSpeed = (curY - lastScrollY) * 0.0006;
    lastScrollY = curY;
    scrollY = curY;
  }, { passive: true });

  // Main Render Loop
  function render() {
    ctx.clearRect(0, 0, width, height);

    // Smooth inertia
    mouseX += (targetMouseX - mouseX) * 0.06;
    mouseY += (targetMouseY - mouseY) * 0.06;

    // Anchor cube directly behind the hero profile section
    // On wide screens, position behind the profile card / hero center
    const centerX = width > 992 ? width * 0.38 : width * 0.5;
    const centerY = height > 700 ? 280 : height * 0.42;
    const fov = 450;
    const viewDist = 520;

    // Update cube rotations with gentle tumble + mouse tilt + scroll momentum
    cubeConfig.rotX += cubeConfig.speedX + mouseY * 0.04 + scrollSpeed * 0.08;
    cubeConfig.rotY += cubeConfig.speedY + mouseX * 0.04;
    cubeConfig.rotZ += cubeConfig.speedZ;
    scrollSpeed *= 0.92;

    // 1. Render Outer & Inner Cube Vertices
    const outerVerts = createCubeVertices(cubeConfig.size);
    const innerVerts = createCubeVertices(cubeConfig.size - cubeConfig.wallThickness);

    function transformPoints(pts) {
      return pts.map(p => {
        const pt = new Point3D(p.x, p.y, p.z);
        pt.rotateX(cubeConfig.rotX);
        pt.rotateY(cubeConfig.rotY);
        pt.rotateZ(cubeConfig.rotZ);
        pt.project(fov, viewDist, centerX, centerY);
        return pt;
      });
    }

    const projOuter = transformPoints(outerVerts);
    const projInner = transformPoints(innerVerts);

    // Calculate Face normals / depths to sort back-to-front (Painter's Algorithm)
    const sortedFaces = cubeFaces.map((face, index) => {
      const avgZ = (projOuter[face[0]].z + projOuter[face[1]].z + projOuter[face[2]].z + projOuter[face[3]].z) / 4;
      return { face, avgZ, index };
    }).sort((a, b) => b.avgZ - a.avgZ);

    // 2. Draw Translucent Glass Faces (Back-to-Front)
    sortedFaces.forEach(item => {
      const face = item.face;
      const p0 = projOuter[face[0]];
      const p1 = projOuter[face[1]];
      const p2 = projOuter[face[2]];
      const p3 = projOuter[face[3]];

      // Cross product for back-face culling check or intensity
      const v1x = p1.projX - p0.projX;
      const v1y = p1.projY - p0.projY;
      const v2x = p2.projX - p0.projX;
      const v2y = p2.projY - p0.projY;
      const normalZ = v1x * v2y - v1y * v2x;

      const isFacingFront = normalZ > 0;
      const baseAlpha = isFacingFront ? 0.16 : 0.07;

      // Specular Glass Sheen Gradient reflecting Cyan & Sapphire
      const grad = ctx.createLinearGradient(p0.projX, p0.projY, p2.projX, p2.projY);
      if (isFacingFront) {
        grad.addColorStop(0, `rgba(0, 240, 255, ${baseAlpha * 1.5})`);
        grad.addColorStop(0.5, `rgba(0, 102, 255, ${baseAlpha * 1.3})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${baseAlpha * 0.8})`);
      } else {
        grad.addColorStop(0, `rgba(56, 189, 248, ${baseAlpha})`);
        grad.addColorStop(1, `rgba(10, 18, 48, ${baseAlpha * 0.5})`);
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(p0.projX, p0.projY);
      ctx.lineTo(p1.projX, p1.projY);
      ctx.lineTo(p2.projX, p2.projY);
      ctx.lineTo(p3.projX, p3.projY);
      ctx.closePath();
      ctx.fill();
    });

    // 3. Draw Inner Refractive Bevels (simulating thick glass refraction)
    ctx.lineWidth = 1.0;
    cubeEdges.forEach(([i, j]) => {
      const p1 = projInner[i];
      const p2 = projInner[j];
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.28)';
      ctx.beginPath();
      ctx.moveTo(p1.projX, p1.projY);
      ctx.lineTo(p2.projX, p2.projY);
      ctx.stroke();

      // Connecting struts between inner and outer corners
      const outerP1 = projOuter[i];
      ctx.strokeStyle = 'rgba(0, 102, 255, 0.2)';
      ctx.beginPath();
      ctx.moveTo(p1.projX, p1.projY);
      ctx.lineTo(outerP1.projX, outerP1.projY);
      ctx.stroke();
    });

    // 4. Draw Outer Prismatic Chromatic Dispersion Edges (Cyan, Sapphire, Ice White)
    cubeEdges.forEach(([i, j]) => {
      const p1 = projOuter[i];
      const p2 = projOuter[j];

      // Primary Cyan Glass Bevel Edge
      ctx.lineWidth = 2.0;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.75)';
      ctx.beginPath();
      ctx.moveTo(p1.projX, p1.projY);
      ctx.lineTo(p2.projX, p2.projY);
      ctx.stroke();

      // Chromatic aberration electric sapphire offset line
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(0, 102, 255, 0.55)';
      ctx.beginPath();
      ctx.moveTo(p1.projX - 1.5, p1.projY - 1.0);
      ctx.lineTo(p2.projX - 1.5, p2.projY - 1.0);
      ctx.stroke();

      // Chromatic aberration sky blue offset line
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.beginPath();
      ctx.moveTo(p1.projX + 1.5, p1.projY + 1.0);
      ctx.lineTo(p2.projX + 1.5, p2.projY + 1.0);
      ctx.stroke();
    });

    // 5. Specular Glint Stars on Outer Corner Vertices
    projOuter.forEach((p, idx) => {
      if (p.z < 0) { // Facing camera
        const glintAlpha = Math.min(1, Math.max(0, -p.z / 180));
        ctx.fillStyle = `rgba(255, 255, 255, ${glintAlpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, 3.5 * p.scale, 0, Math.PI * 2);
        ctx.fill();

        // Cross sparkle on dominant corners
        if (idx === 0 || idx === 1 || idx === 2) {
          ctx.strokeStyle = `rgba(0, 240, 255, ${glintAlpha * 0.6})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(p.projX - 8, p.projY);
          ctx.lineTo(p.projX + 8, p.projY);
          ctx.moveTo(p.projX, p.projY - 8);
          ctx.lineTo(p.projX, p.projY + 8);
          ctx.stroke();
        }
      }
    });

    // 6. Draw Orbiting Cyan & Sapphire Dust Particles
    ambientParticles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < -width / 2) p.x = width / 2;
      if (p.x > width / 2) p.x = -width / 2;
      if (p.y < -height / 2) p.y = height / 2;
      if (p.y > height / 2) p.y = -height / 2;

      const pt = new Point3D(p.x, p.y, p.z);
      pt.rotateX(cubeConfig.rotX * 0.3);
      pt.rotateY(cubeConfig.rotY * 0.3);
      pt.project(fov, viewDist, centerX, centerY);

      ctx.fillStyle = p.color === '#00f0ff'
        ? `rgba(0, 240, 255, ${p.alpha})`
        : `rgba(0, 102, 255, ${p.alpha * 0.85})`;

      ctx.beginPath();
      ctx.arc(pt.projX, pt.projY, p.size * pt.scale, 0, Math.PI * 2);
      ctx.fill();
    });

    animationFrameId = requestAnimationFrame(render);
  }

  window.addEventListener('resize', resize);
  resize();
  render();

  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(animationFrameId);
  });
})();
