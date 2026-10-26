/**
 * CHERIAN JAMES - CORE APPLICATION SCRIPT
 * Showreel theater, work filter, project lightbox modal,
 * audio FX synthesizer, email copy, and contact form handler
 */

document.addEventListener('DOMContentLoaded', () => {
  initShowreelTheater();
  initWorkFilter();
  initVideoHoverPreviews();
  initCaseStudyModal();
  initAudioEngine();
  initContactActions();
  initMobileNav();
});

/* ==========================================================================
   1. SHOWREEL THEATER CONTROLLER
   ========================================================================== */
function initShowreelTheater() {
  const theaterVideo = document.getElementById('theaterVideo');
  const playPauseBtn = document.getElementById('theaterPlayPause');
  const muteBtn = document.getElementById('theaterMute');
  const fullscreenBtn = document.getElementById('theaterFullscreen');
  const progressBar = document.querySelector('.video-timeline-progress');
  const timelineBar = document.querySelector('.video-timeline-bar');
  const reelChips = document.querySelectorAll('.reel-chip');
  const videoFrame = document.querySelector('.video-frame-container');

  if (!theaterVideo) return;

  // Play / Pause toggle
  function togglePlay() {
    if (theaterVideo.paused) {
      theaterVideo.play();
      if (videoFrame) videoFrame.classList.remove('paused');
      if (playPauseBtn) playPauseBtn.innerHTML = getIconSvg('pause');
    } else {
      theaterVideo.pause();
      if (videoFrame) videoFrame.classList.add('paused');
      if (playPauseBtn) playPauseBtn.innerHTML = getIconSvg('play');
    }
  }

  if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);
  if (videoFrame) {
    videoFrame.addEventListener('click', (e) => {
      // Don't trigger if clicked on controls
      if (!e.target.closest('.video-custom-controls')) {
        togglePlay();
      }
    });
  }

  // Update progress bar
  theaterVideo.addEventListener('timeupdate', () => {
    if (theaterVideo.duration && progressBar) {
      const pct = (theaterVideo.currentTime / theaterVideo.duration) * 100;
      progressBar.style.width = `${pct}%`;
    }
  });

  // Timeline seeking
  if (timelineBar) {
    timelineBar.addEventListener('click', (e) => {
      const rect = timelineBar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      if (theaterVideo.duration) {
        theaterVideo.currentTime = pos * theaterVideo.duration;
      }
    });
  }

  // Mute / Unmute
  if (muteBtn) {
    muteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      theaterVideo.muted = !theaterVideo.muted;
      muteBtn.innerHTML = theaterVideo.muted ? getIconSvg('volume-x') : getIconSvg('volume-2');
    });
  }

  // Fullscreen
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (theaterVideo.requestFullscreen) {
        theaterVideo.requestFullscreen();
      } else if (theaterVideo.webkitRequestFullscreen) {
        theaterVideo.webkitRequestFullscreen();
      }
    });
  }

  // Switcher Chips
  reelChips.forEach(chip => {
    chip.addEventListener('click', () => {
      reelChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const videoSrc = chip.getAttribute('data-video');
      if (videoSrc && theaterVideo.getAttribute('src') !== videoSrc) {
        theaterVideo.src = videoSrc;
        theaterVideo.load();
        theaterVideo.play().catch(() => {});
        if (playPauseBtn) playPauseBtn.innerHTML = getIconSvg('pause');
        if (window.playSfx) window.playSfx('switch');
      }
    });
  });

  // -------------------------------------------------------------
  // Automatic Pause on Section Change / Scroll Away
  // -------------------------------------------------------------
  const showreelSection = document.getElementById('showreel');
  if (showreelSection && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // If the showreel section is no longer active in view (< 15% visible), pause automatically
        if (!entry.isIntersecting && entry.intersectionRatio < 0.15) {
          if (!theaterVideo.paused) {
            theaterVideo.pause();
            if (videoFrame) videoFrame.classList.add('paused');
            if (playPauseBtn) playPauseBtn.innerHTML = getIconSvg('play');
          }
        }
      });
    }, { threshold: [0, 0.15, 0.5] });
    sectionObserver.observe(showreelSection);
  }

  // Auto-pause when clicking any navigation link targeting a different section
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', () => {
      const targetHash = anchor.getAttribute('href');
      if (targetHash && targetHash !== '#showreel' && !theaterVideo.paused) {
        theaterVideo.pause();
        if (videoFrame) videoFrame.classList.add('paused');
        if (playPauseBtn) playPauseBtn.innerHTML = getIconSvg('play');
      }
    });
  });

  // Auto-pause when user switches or minimizes the browser tab
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !theaterVideo.paused) {
      theaterVideo.pause();
      if (videoFrame) videoFrame.classList.add('paused');
      if (playPauseBtn) playPauseBtn.innerHTML = getIconSvg('play');
    }
  });
}

/* ==========================================================================
   2. PORTFOLIO FILTER SYSTEM
   ========================================================================== */
function initWorkFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      if (window.playSfx) window.playSfx('click');

      workCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        const matches = filter === 'all' || categories.split(' ').includes(filter);

        if (matches) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   3. VIDEO PREVIEWS ON HOVER
   ========================================================================== */
function initVideoHoverPreviews() {
  const videoCards = document.querySelectorAll('.work-card video');

  videoCards.forEach(video => {
    const parentCard = video.closest('.work-card');
    if (!parentCard) return;

    parentCard.addEventListener('mouseenter', () => {
      video.muted = true;
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    });

    parentCard.addEventListener('mouseleave', () => {
      video.pause();
    });
  });
}

/* ==========================================================================
   4. CASE STUDY MODAL & LIGHTBOX
   ========================================================================== */
const projectsData = {
  'keerthi-nirmal-plane': {
    title: "Keerthi Nirmal Commercial Plane CGI",
    client: "Keerthi Nirmal",
    category: "3D & CGI / Unreal Engine",
    year: "2024",
    role: "Lead 3D CGI & Unreal Engine Artist",
    tools: ["Unreal Engine 5", "Lumen GI", "Niagara VFX", "Volumetric Atmosphere", "DaVinci Resolve"],
    video: "assets/videos/Keerthi Nirmal plane CGI video final out.mp4",
    poster: "assets/images/thumbnails/thumb_keerthi_plane.jpg",
    overview: "A flagship cinematic 3D commercial animation created for Keerthi Nirmal. Built entirely inside Unreal Engine 5, featuring a commercial passenger airliner soaring through photorealistic atmospheric cloudscapes with real-time Lumen global illumination, cinematic camera motion, and aerodynamic flight physics.",
    highlights: [
      "Engineered real-time volumetric cloud systems and sunlight scatter in Unreal Engine 5",
      "High-precision commercial airliner hard-surface 3D modeling and authentic livery mapping",
      "Dynamic camera tracking with realistic lens distortion, motion blur, and depth of field",
      "Multi-angle cinematic sequences rendered in real-time with Unreal Sequencer"
    ]
  },
  'jordy-sports-ai': {
    title: "Jordy Sports AI App Motion Commercial",
    client: "Jordy Sports AI",
    category: "Motion Graphics / Video Editing",
    year: "2024",
    role: "Motion Graphics Designer & Animator",
    tools: ["After Effects", "Kinetic Typography", "Mobile UI Motion", "Audio Sync"],
    video: "assets/videos/Jordy Video Out Final.mp4",
    poster: "assets/images/thumbnails/thumb_jordy_sports.jpg",
    overview: "A high-energy, sleek commercial advertisement crafted entirely in Adobe After Effects for the Jordy Sports AI mobile app. The spot blends rapid kinetic typographic reveals, animated mobile UI interfaces, dynamic sports performance overlays, and punchy sound-synchronized motion cuts.",
    highlights: [
      "100% created and animated in Adobe After Effects with custom motion easing curves",
      "Dynamic kinetic typography synchronized tightly to upbeat commercial music beats",
      "Seamless mobile UI vector interactions and sports analytics telemetry graphics",
      "High-impact visual pacing designed specifically for mobile and social acquisition ads"
    ]
  },
  'drdo-tactical': {
    title: "DRDO Aeroshow 2025 Tactical Simulation (Selected Cuts)",
    client: "Government DRDO Aeroshow 2025 • Bengaluru",
    category: "3D & CGI / Tactical Simulation",
    year: "2025",
    role: "3D Artist & Simulation Specialist (Team Project)",
    tools: ["Unreal Engine", "Blender", "Defense Simulation", "Hard-Surface CGI"],
    video: "assets/videos/Drdo_Aeroshow cuts.mp4",
    poster: "assets/images/thumbnails/thumb_drdo_tactical.jpg",
    overview: "A curated reel of cut shots highlighting Cherian's direct contributions to the high-stakes tactical defense simulation produced for the official Government DRDO Aeroshow 2025 held at Bengaluru. Executed collaboratively within a specialized production team, these shots demonstrate defense vehicle modeling, real-time environment construction, cinematic lighting, and tactical visual dynamics in Unreal Engine and Blender.",
    highlights: [
      "Official defense simulation sequence developed for the Government DRDO Aeroshow 2025 in Bengaluru",
      "Selected personal cut shots showcasing key contributions executed within a collaborative team pipeline",
      "High-precision 3D hard-surface defense models and tactical asset choreography created in Blender",
      "Real-time visual sequencing, atmospheric depth, and cinematic lighting passes rendered in Unreal Engine"
    ]
  },
  'keerthi-nirmal-fifa': {
    title: "Keerthi Nirmal FIFA Campaign Motion Commercial",
    client: "Keerthi Nirmal",
    category: "Motion Graphics / Video Editing",
    year: "2024",
    role: "Motion Graphics Designer & Animator",
    tools: ["After Effects", "Motion Graphics", "Kinetic Typography", "Audio Sync"],
    video: "assets/videos/Keerthi Nirmal Fifa final video v2.mp4",
    poster: "assets/images/thumbnails/thumb_keerthi_fifa.jpg",
    overview: "A vibrant, fast-paced commercial motion graphics spot created entirely in Adobe After Effects for Keerthi Nirmal's FIFA promotional campaign. Incorporates explosive football action visuals, branded typography, high-octane camera zooms, and tight audio beat synchronization.",
    highlights: [
      "100% designed and animated in Adobe After Effects using custom graph editor easing curves",
      "Dynamic kinetic typography integrated seamlessly with brand graphic elements",
      "Fast-paced visual cuts and transitions synchronized with high-energy stadium audio cues",
      "Broadcast and social media multi-format delivery tailored for the FIFA campaign season"
    ]
  },
  'trinse-detergent-ai': {
    title: "Trinse Detergent Powder Generative AI Ad",
    client: "Trinse Detergent",
    category: "AI Videos / Commercial Ad",
    year: "2024",
    role: "AI Video Creator & Prompt Architect",
    tools: ["Generative AI", "AI Video Pipelines", "Prompt Engineering", "Commercial Editing"],
    video: "assets/videos/Trinse video1 correction.mp4",
    poster: "assets/images/thumbnails/thumb_trinse_detergent.jpg",
    overview: "A vibrant, high-impact commercial advertisement created with cutting-edge generative AI video pipelines for Trinse Detergent Powder. Highlights dynamic fabric cleanliness transformations, foam particle action, pristine freshness aesthetics, and modern broadcast pacing.",
    highlights: [
      "End-to-end generative AI video production tailored for fast-moving consumer goods (FMCG) branding",
      "Dynamic prompt engineering controlling fluid bubble dynamics and fabric fiber cleanliness reveals",
      "Photorealistic commercial lighting, vibrant saturation balance, and crisp product framing",
      "Sound-synchronized motion pacing and commercial color grading in post-production"
    ]
  },
  'nextel-studios-logo': {
    title: "Nextel Studios Cinematic 3D Logo Animation",
    client: "Nextel Studios",
    category: "3D & CGI / Motion Graphics",
    year: "2024",
    role: "Lead 3D Artist & Motion Designer",
    tools: ["Blender", "After Effects", "Hard-Surface Modeling", "Particle FX", "Sound Design"],
    video: "assets/videos/Nextel studios logo animation.mp4",
    poster: "assets/images/nextel_studios.jpg",
    overview: "A punchy, cinematic 3D brand sting and logo animation created for Nextel Studios. Features precision hard-surface metal shaders, micro-scratch displacement textures, incandescent ember particle simulations, and dramatic anamorphic camera pans resolving into the studio identity.",
    highlights: [
      "Precision hard-surface 3D modeling and brushed metal material shading",
      "Dynamic volumetric particle sparks and ember dissipation simulation",
      "Cinematic shallow depth-of-field lens choreography and lighting sweeps",
      "Punchy bass-drop sound FX synchronization and broadcast master grade"
    ]
  },
  'milou-dress-commercial': {
    title: "Milou Dress Collection Generative AI Commercial",
    client: "Milou",
    category: "AI Videos / Fashion Commercial",
    year: "2024",
    role: "AI Video Creator & Prompt Architect",
    tools: ["Generative AI", "Neural Synthesis", "Prompt Engineering", "Color Grading"],
    video: "assets/videos/Milou ad video v2.mp4",
    poster: "assets/images/thumbnails/thumb_milou_dress.jpg",
    overview: "A sophisticated high-fashion commercial spot created for Milou's dress collection using advanced generative AI neural synthesis. Showcases realistic apparel drape, fluid movement, runway lighting, and luxury brand aesthetic.",
    highlights: [
      "Photorealistic generative AI fashion video synthesis tailored for luxury apparel",
      "Dynamic fabric motion, cloth drape realism, and runway choreography prompt engineering",
      "High-contrast editorial lighting and cinematic camera sweeps",
      "Seamless temporal consistency and commercial post-production color grading"
    ]
  },
  'swarnam-oil-food': {
    title: "Swarnam Oil Appetizing Food Commercial",
    client: "Swarnam Oil",
    category: "Motion Graphics / Video Editing",
    year: "2024",
    role: "Lead Motion Designer & Video Editor",
    tools: ["After Effects", "Premiere Pro", "Kinetic Typography", "Visual FX", "Sound Design"],
    video: "assets/videos/Swarnam Oil food video.mp4",
    poster: "assets/images/swarnam_oil.jpg",
    overview: "A sizzling, high-tempo culinary broadcast commercial created for Swarnam Coconut Oil's 75th-year quality celebration. Features dynamic slow-motion flying fried chicken bites, kinetic comic-style typography, rich steam/sizzle sound effects, and clean heritage branding.",
    highlights: [
      "Dynamic food choreography and slow-motion product dynamics compositing",
      "Punchy kinetic typography ('OOOH! YUM!') with energetic comic-style pop animations",
      "Sizzling audio design, frying SFX layering, and tight rhythm synchronization",
      "75th-anniversary golden crest branding animation and broadcast color finishing"
    ]
  },
  'milou-fifa-kickoff': {
    title: "Milou FIFA Kick-Off AI Commercial",
    client: "Milou",
    category: "AI Videos / Video Editing",
    year: "2024",
    role: "AI Video Creator & Prompt Architect",
    tools: ["Generative AI", "Higgsfield AI", "Kling", "Prompt Engineering", "After Effects", "Color Grading"],
    video: "assets/videos/Milou Fifa Kick off video V3.mp4",
    poster: "assets/images/thumbnails/thumb_milou_fifa.jpg",
    overview: "A high-octane generative AI sports commercial created for Milou's FIFA kick-off campaign. Blends dynamic stadium atmosphere, football athlete choreography, neural video synthesis, and intense matchday lighting.",
    highlights: [
      "Advanced generative AI sports video synthesis with high temporal consistency and motion fluidity",
      "Dynamic athletic motion choreography and stadium crowd atmosphere prompt engineering",
      "Cinematic sports camera tracking, stadium floodlight flare aesthetics, and motion blur",
      "Full audio-video post-production, sound synchronization, and broadcast color grading"
    ]
  },
  'milou-mothers-day': {
    title: "Milou Mother's Day Generative AI Video",
    client: "Milou",
    category: "AI Videos / Generative Commercials",
    year: "2024",
    role: "AI Video Creator & Prompt Architect",
    tools: ["Higgsfield AI", "Kling 3.0", "Prompt Engineering", "Color Grading"],
    video: "assets/videos/Milou Mother's day video v4.mp4",
    poster: "assets/images/thumbnails/thumb_milou_mothers_day.jpg",
    overview: "A deeply moving generative AI commercial produced for Milou's Mother's Day campaign. Leveraged cutting-edge neural video synthesis combining Higgsfield AI with Kling 3.0 to generate nuanced facial expressions, cinematic natural lighting, and emotionally authentic visual storytelling.",
    highlights: [
      "Advanced generative AI video direction using Higgsfield AI and Kling 3.0",
      "Nuanced prompt architecture for consistent character performance and high emotional resonance",
      "Cinematic camera choreography and naturalistic depth of field across shots",
      "Post-production color timing and pacing optimized for emotional brand impact"
    ]
  },
  'keerthi-nirmal-bee-jaggery': {
    title: "Keerthi Nirmal Bee Jaggery AI & Motion Commercial",
    client: "Keerthi Nirmal",
    category: "AI Videos / Motion Graphics",
    year: "2024",
    role: "AI Video Creator & Motion Designer",
    tools: ["Generative AI", "After Effects", "Premiere Pro", "Motion Design", "Color Grading"],
    video: "assets/videos/Keerthi Nirmal Bee jaggery slide2 final.mp4",
    poster: "assets/images/thumbnails/thumb_keerthi_bee_jaggery.jpg",
    overview: "A vibrant, appetizing brand commercial created for Keerthi Nirmal's Bee Jaggery campaign. Seamlessly harmonizes generative AI imagery, fluid golden honey/jaggery aesthetics, dynamic kinetic typographic layouts, and energetic motion graphics pacing.",
    highlights: [
      "Generative AI imagery and fluid organic asset creation tailored for Keerthi Nirmal brand identity",
      "Dynamic 2D/3D kinetic typography and brand slide choreography in Adobe After Effects",
      "Warm golden color timing, honey viscosity aesthetics, and natural product spotlighting",
      "Broadcast-ready sound synchronization and commercial video pacing"
    ]
  },
  'keerthi-nirmal-led-wall': {
    title: "Keerthi Nirmal Angamaly Expo LED Wall Experience",
    client: "Keerthi Nirmal",
    category: "Motion Graphics / Video Editing",
    year: "2024",
    role: "Lead Motion Designer & Video Editor",
    tools: ["After Effects", "Premiere Pro", "Kinetic Typography", "Motion Graphics", "Large-Format Display"],
    video: "assets/videos/Keerthi Nirmal angamaly expo LED wall video edited OUT.mp4",
    poster: "assets/images/thumbnails/thumb_keerthi_led_wall.jpg",
    overview: "A custom ultra-wide panoramic motion graphics showcase engineered specifically for Keerthi Nirmal's flagship exhibition booth at the Angamaly Expo. Designed for large-format curved LED screens, combining cinematic product choreography, high-visibility kinetic typography, and immersive brand storytelling.",
    highlights: [
      "Custom ultra-wide 1800x720 aspect ratio tailored for panoramic expo LED wall architectures",
      "Dynamic multi-product showcase motion design with high-impact kinetic typography",
      "Optimized contrast, scale, and color calibration for bright exhibition hall environments",
      "Synchronized rhythm and pacing for continuous high-visibility looping presentation"
    ]
  },
  'keerthi-nirmal-comic': {
    title: "Keerthi Nirmal Comic Book AI Animation Commercial",
    client: "Keerthi Nirmal",
    category: "AI Videos / Motion Graphics",
    year: "2024",
    role: "AI Video Creator & Motion Animator",
    tools: ["Generative AI", "After Effects", "Comic Art Synthesis", "Motion Graphics", "Sound Design"],
    video: "assets/videos/Keerthi Nirmal Comic animation video final out v3.mp4",
    poster: "assets/images/thumbnails/thumb_keerthi_comic.jpg",
    overview: "A stylized comic-strip narrative commercial crafted for Keerthi Nirmal, fusing AI-generated comic illustration styling with kinetic motion graphics, graphic novel panel transitions, speech bubble animations, and dynamic sound effects.",
    highlights: [
      "Stylized generative AI comic art synthesis maintaining tight visual consistency across panels",
      "Graphic novel panel layout choreography and kinetic 2.5D camera parallax in After Effects",
      "Integrated comic SFX typography, halftones, action lines, and energetic character expressions",
      "Full commercial audio mix, voice sync, and high-impact sound design"
    ]
  },
  'sleepsync-festive-sale': {
    title: "Sleepsync Festive Sale Motion Graphics Ad",
    client: "Sleepsync Mattress",
    category: "Motion Graphics / Video Editing",
    year: "2024",
    role: "Lead Motion Designer & Video Editor",
    tools: ["After Effects", "Premiere Pro", "Kinetic Typography", "Motion Design", "Color Grading"],
    video: "assets/videos/Sleepsync motion graphic sale ad.mp4",
    poster: "assets/images/sleepsync_ad.jpg",
    overview: "A vibrant, celebratory promotional campaign crafted for Sleepsync Mattress's Grand Festive Upgrade sale. Features energetic kinetic 2D typography, festive discount reveals ('UP TO 50% OFF'), crisp color grading, and broadcast-ready audio rhythm synchronization.",
    highlights: [
      "Dynamic celebratory kinetic typography and graphic discount badge animations in After Effects",
      "Warm festive visual pacing and lifestyle product presentation for South Indian festive campaign",
      "High-contrast text hierarchy engineered for mobile social media advertising and broadcast",
      "Seamless audio beat sync and commercial voiceover integration"
    ]
  },
  'woodon-interior-ai': {
    title: "Woodon Luxury Interior Architectural AI Commercial",
    client: "Woodon Decor (Taika MFC)",
    category: "AI Videos / Architectural Commercial",
    year: "2024",
    role: "AI Video Creator & Prompt Architect",
    tools: ["Generative AI", "Neural Synthesis", "Prompt Engineering", "Architectural CGI", "Color Grading"],
    video: "assets/videos/Woodon AI video.mp4",
    poster: "assets/images/thumbnails/thumb_woodon_decor.jpg",
    overview: "A sophisticated architectural interior commercial created for Woodon Decor in collaboration with Taika MFC. Crafted using cutting-edge generative AI video synthesis, showcasing photorealistic residential living spaces, customized built-in cabinetry, warm cove LED illumination, and dynamic laminate woodgrain finishes (including Burma Teak and Sonoma Oak).",
    highlights: [
      "Photorealistic generative AI architectural video synthesis with accurate material ray tracing and soft shadows",
      "Dynamic prompt engineering capturing warm interior ambiance, custom cabinetry, and premium woodgrain textures",
      "Smooth camera dollies and interior pans highlighting spatial depth and designer styling",
      "High-definition commercial color grading and post-production pacing tailored for luxury interior branding"
    ]
  },
  'loco-balls': {
    title: "Loco Balls 3D Confectionery Ad",
    client: "Moresel's",
    category: "3D & CGI / Video Editing",
    year: "2023",
    role: "Lead 3D Artist, Simulation & Lighting",
    tools: ["Blender (Cycles)", "After Effects", "Photoshop"],
    video: "assets/videos/loco_balls_3d.mp4",
    poster: "assets/images/loco_balls.jpg",
    overview: "A vibrant, appetizing 3D commercial campaign crafted for Moresel's Loco Balls chocolate snacks. Showcases physics-based confectionery simulation, realistic chocolate stream dynamics, soft candy collisions, and cinematic product packaging rendering.",
    highlights: [
      "Custom procedural chocolate liquid physics & splash simulation in Blender",
      "Studio 3-point lighting setup with high specular highlights on foil wrapper",
      "Dynamic typography and fluid packaging camera reveals",
      "Composited and color-graded in Adobe After Effects"
    ]
  },
  'seematti-festive': {
    title: "Seematti Luxury Brand Commercial",
    client: "Seematti Kerala",
    category: "Motion Graphics / Video Editing",
    year: "2024",
    role: "Video Team Lead (BBP India, Kochi)",
    tools: ["After Effects", "Premiere Pro", "DaVinci Resolve"],
    video: "assets/videos/seematti_commercial.mp4",
    poster: "assets/images/jallikattu_poster.jpg",
    overview: "High-energy commercial broadcast campaign produced at BBP India for Seematti, Kerala's leading luxury silk and fashion brand. Directed the motion design pipeline, sound synchronization, and festive visual pacing.",
    highlights: [
      "Led end-to-end video post-production and motion graphics direction",
      "Seamless typographic transitions synced to rhythmic musical beats",
      "Vibrant high-contrast color grading celebrating festival palette",
      "Multi-channel broadcast delivery (TVC, Instagram Reels, In-store LED walls)"
    ]
  },
  'weber-assembly': {
    title: "Weber Grill 3D Exploded Assembly",
    client: "Weber BBQ",
    category: "3D & CGI / Exploded Assembly",
    year: "2024",
    role: "3D Modeler & Exploded Animator",
    tools: ["Blender", "Cycles Engine", "After Effects"],
    video: "assets/videos/weber_assembly.mp4",
    poster: "assets/images/weber_grill_render.png",
    overview: "Technical 3D exploded view and DIY assembly animation highlighting the internal engineering and user-friendly assembly mechanism of the Weber Grill line.",
    highlights: [
      "Precision CAD-to-Blender retopology and hard-surface mesh optimization",
      "Photorealistic PBR materials for porcelain enamel, stainless steel & chrome grates",
      "Keyframed exploded assembly choreography demonstrating step-by-step DIY latching",
      "Clean studio background with soft floor contact shadows"
    ]
  },
  'seematti-sale-motion': {
    title: "Seematti Big Bigger Biggest Sale Motion Commercial",
    client: "Seematti Crafted",
    category: "Motion Graphics / Video Editing",
    year: "2024",
    role: "Lead Motion Designer & Video Editor (BBP India)",
    tools: ["After Effects", "Premiere Pro", "Kinetic Typography", "Motion Graphics", "Color Grading"],
    video: "assets/videos/Seematti sale motion graphic video.mp4",
    poster: "assets/images/thumbnails/thumb_seematti_sale.jpg",
    overview: "A vibrant, celebratory broadcast promotional campaign crafted for Seematti Crafted's flagship annual sale event. Features explosive 3D kinetic typography, animated sunburst lighting rays, rhythmic fashion model reveals, and synchronized high-energy commercial music pacing.",
    highlights: [
      "Dynamic 3D kinetic typographic reveals ('BIG BIGGER BIGGEST SALE', 'UP TO 90% OFF') crafted in After Effects",
      "Fast-paced model sequence synchronization celebrating Seematti's silk saree and apparel collections",
      "High-contrast golden yellow and crimson commercial broadcast color palette",
      "Broadcast and social media multi-channel delivery optimized for maximum retail conversion"
    ]
  },
  'couplesquad-app-promo': {
    title: "Couple Squad App Commercial Motion Spot",
    client: "Couple Squad Dating & Matrimony",
    category: "Motion Graphics / Video Editing",
    year: "2024",
    role: "Lead Motion Designer & Animator",
    tools: ["After Effects", "Kinetic Typography", "Mobile UI Animation", "Sound Design", "Color Grading"],
    video: "assets/videos/Couplesquad App Promo.mp4",
    poster: "assets/images/thumbnails/thumb_couplesquad.jpg",
    overview: "A vibrant, fast-paced commercial motion graphic promo crafted entirely in Adobe After Effects for the Couple Squad mobile app. Features 3D floating graphic elements, sleek smartphone UI interactions, kinetic typography, and synchronized sound design demonstrating the platform's Datrimony® experience.",
    highlights: [
      "100% animated in Adobe After Effects with custom ease-curves and kinetic typography",
      "Dynamic 3D smartphone screen reveals and mobile UI interaction workflows",
      "Vibrant brand color palette with floating geometric spheres and spiral flourishes",
      "Commercial broadcast and social media multi-format optimization"
    ]
  },
  'ai-tools-pipeline': {
    title: "Generative AI Video Pipelines & Workflows",
    client: "Research & Commercial Lab",
    category: "Video Editing / AI Workflows",
    year: "2024 - 2026",
    role: "AI Video Creator & Prompt Architect",
    tools: ["Runway Gen-3", "Midjourney v6", "ComfyUI", "Topaz Video AI"],
    video: "assets/videos/ai_tools_video.mp4",
    poster: "assets/images/thumbnails/thumb_ai_tools_pipeline.jpg",
    overview: "Pioneering commercial workflows combining generative neural video synthesis with traditional 3D CGI and motion design. Uses ComfyUI latent diffusion and Runway Gen-3 to achieve cinematic transformations.",
    highlights: [
      "Integrated AI video pipelines for rapid commercial concept ideation",
      "Multi-prompt camera choreography and temporal consistency control",
      "Topaz Video AI 4K neural upscaling and frame interpolation for artifact-free broadcast",
      "Blending 3D geometry depth maps with neural texture synthesis"
    ]
  },
  'scifi-corridor': {
    title: "Cyberpunk Mech Corridor (Sci-Fi Tunnel)",
    client: "Personal Concept Study",
    category: "3D & CGI / Environment",
    year: "2023",
    role: "Concept Artist & Environment Lighting Lead",
    tools: ["Blender (Cycles / EEVEE)", "Photoshop"],
    image: "assets/images/scifi_tunnel.png",
    wireframe: "assets/images/cherian_wireframe.png",
    overview: "A sci-fi corridor environment study exploring atmospheric neon volumetric lighting, modular futuristic wall panels, and an imposing armored mech silhouette standing at the terminus.",
    highlights: [
      "Modular kitbash corridor architecture with clean quad wireframe topology",
      "Volumetric god rays and dynamic neon emission shaders in Cycles",
      "High-frequency displacement on sci-fi wall panel details",
      "Dramatic silhouette contrast and color temperature separation (Cyan vs Crimson)"
    ]
  },
  'energy-cloud': {
    title: "Energy Cloud Nitro Coffee 3D Packaging",
    client: "Energy Cloud Beverage Co.",
    category: "3D & CGI / Packaging",
    year: "2023",
    role: "3D Visualizer & Character Concept Artist",
    tools: ["Blender", "Photoshop", "Illustrator"],
    image: "assets/images/energy_cloud_cans.jpg",
    overview: "A trio of stylized beverage cans for Energy Cloud Nitro Black Coffee. Features custom illustrated mythological bearded mascot graphics, brushed metallic anodized can finishes, and moody atmospheric steam mist.",
    highlights: [
      "Custom vector character label art mapped seamlessly to cylindrical aluminum cans",
      "Realistic condensation droplets and matte metallic sheen shader",
      "Tri-color product grouping with complementary studio backlight gradients",
      "Rendered with Blender Cycles at print-ready 4K resolution"
    ]
  },
  'jbl-go-motion': {
    title: "JBL GO Portable Speaker Motion Spot",
    client: "Product Motion Study",
    category: "Motion Graphics / Video Editing",
    year: "2023",
    role: "Motion Graphics Artist",
    tools: ["After Effects", "Cinema 4D", "Illustrator"],
    video: "assets/videos/jbl_go_motion.mp4",
    overview: "Kinetic motion design spot demonstrating the compact acoustic power, vibrant styling, and outdoor portability of the iconic JBL GO Bluetooth speaker.",
    highlights: [
      "Fast-paced kinetic typography synced to audio frequency waves",
      "3D product rotations and dynamic isometric perspective shifts",
      "Modern graphic overlays, vector accents, and energetic color palette"
    ]
  },
  'bluestone-jewellery': {
    title: "BlueStone Fine Jewellery 3D Spotlight",
    client: "BlueStone",
    category: "3D & CGI / Motion Graphics",
    year: "2023",
    role: "Motion & 3D Artist",
    tools: ["After Effects", "Element 3D", "Blender"],
    video: "assets/videos/bluestone_jewellery.mp4",
    overview: "Luxury commercial spot showcasing sparkling diamond jewelry pendants, caustic refractive light passes, and elegant cinematic camera glides.",
    highlights: [
      "Dispersion and caustic reflection passes mimicking genuine diamond refractions",
      "Gold specular sheen and smooth floating particle bokeh",
      "Sophisticated typography and luxury brand presentation"
    ]
  },
  'aircraft-3d': {
    title: "Aero Dynamics 3D Flight Simulation",
    client: "Aerospace Showcase",
    category: "3D & CGI / Simulation",
    year: "2023",
    role: "3D Animator & Modeler",
    tools: ["Blender", "Unreal Engine"],
    video: "assets/videos/aircraft_3d.mp4",
    poster: "assets/images/thumbnails/thumb_aircraft_3d.jpg",
    overview: "Cinematic aerospace flight sequence featuring a high-maneuverability fighter jet banking through atmospheric cloud formations with realistic physics.",
    highlights: [
      "High-speed banking camera rig with realistic inertial motion blur",
      "Aerodynamic condensation trails and jet afterburner volumetric lighting",
      "Detailed fuselage paneling and realistic cockpit canopy glass reflections"
    ]
  },
  'vr-spatial': {
    title: "VR Interactive Environments & CT Simulation",
    client: "XR Horizon Pvt Ltd",
    category: "3D & VR / Spatial Simulation",
    year: "2023",
    role: "3D VR Artist (Internship)",
    tools: ["Unity 3D", "Blender", "Oculus SDK"],
    image: "assets/images/vr_thumbnail.png",
    overview: "Immersive virtual reality spatial environments including real-time interactive medical CT scanner simulations and underwater biodomes optimized for 90 FPS VR performance.",
    highlights: [
      "Optimized low-draw-call 3D assets adhering to strict VR performance budgets",
      "Baked PBR lighting for believable ambient occlusion in mobile VR headsets",
      "Interactive 3D medical equipment assembly and spatial ergonomics"
    ]
  },
  'pottery-studio': {
    title: "Nairec Pottery & Glassware Studio Render",
    client: "Nairec Ceramic Studio",
    category: "3D & CGI / Material Study",
    year: "2023",
    role: "3D Material & Lighting Lead",
    tools: ["Blender", "Cycles Engine"],
    image: "assets/images/pottery_set.png",
    overview: "A sophisticated study in photorealistic material shaders, exploring the contrasting physical properties of glazed porcelain, satin ceramics, and mirror-finished metallic vessels.",
    highlights: [
      "Subsurface scattering (SSS) simulation in porcelain tableware",
      "Fresnel reflection curves on specular chrome jar surfaces",
      "Subtle micro-surface roughness variations and ambient studio floor reflections"
    ]
  }
};

function initCaseStudyModal() {
  const modalOverlay = document.getElementById('caseStudyModal');
  const closeBtn = document.querySelector('.modal-close-btn');
  const modalMediaBox = document.querySelector('.modal-media-wrapper');
  const modalTitle = document.getElementById('modalTitle');
  const modalClient = document.getElementById('modalClient');
  const modalRole = document.getElementById('modalRole');
  const modalYear = document.getElementById('modalYear');
  const modalTools = document.getElementById('modalTools');
  const modalOverview = document.getElementById('modalOverview');
  const modalHighlights = document.getElementById('modalHighlights');

  if (!modalOverlay) return;

  function openModal(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    if (window.playSfx) window.playSfx('open');

    // Populate media
    if (data.video) {
      modalMediaBox.innerHTML = `
        <video controls autoplay class="modal-video-player" poster="${data.poster || ''}">
          <source src="${data.video}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      `;
    } else if (data.image) {
      modalMediaBox.innerHTML = `
        <img src="${data.image}" alt="${data.title}" class="modal-image-view">
      `;
    }

    // Populate details
    modalTitle.textContent = data.title;
    modalClient.textContent = data.client;
    modalRole.textContent = data.role;
    modalYear.textContent = data.year;
    modalOverview.textContent = data.overview;

    modalTools.innerHTML = data.tools.map(tool => `<span class="tool-chip">${tool}</span>`).join('');
    modalHighlights.innerHTML = data.highlights ? data.highlights.map(h => `<li>${h}</li>`).join('') : '';

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    // Pause any playing modal video
    const video = modalMediaBox.querySelector('video');
    if (video) video.pause();
    setTimeout(() => {
      modalMediaBox.innerHTML = '';
    }, 300);
  }

  // Bind clicks on work cards
  document.querySelectorAll('.work-card[data-project-id]').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't trigger if clicked on an external link
      if (e.target.closest('a')) return;
      const pid = card.getAttribute('data-project-id');
      openModal(pid);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. WEB AUDIO API SYNTHESIZER
   ========================================================================== */
function initAudioEngine() {
  let audioCtx = null;
  let isSoundEnabled = false;
  const toggleBtn = document.getElementById('soundToggleBtn');

  function initCtx() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  window.playSfx = function (type) {
    if (!isSoundEnabled || !audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'click') {
        // Subtle crisp UI click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(350, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'switch') {
        // High-tech subtle chime
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(1040, now + 0.08);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'open') {
        // Low futuristic whoosh
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.12);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (e) {}
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      initCtx();
      isSoundEnabled = !isSoundEnabled;
      toggleBtn.classList.toggle('sound-active', isSoundEnabled);
      toggleBtn.innerHTML = isSoundEnabled ? getIconSvg('volume-2') : getIconSvg('volume-x');
      showToast(isSoundEnabled ? 'Audio Feedback Enabled 🔊' : 'Audio Muted 🔇');
      if (isSoundEnabled) window.playSfx('switch');
    });
  }
}

/* ==========================================================================
   6. CONTACT ACTIONS & EMAIL COPY
   ========================================================================== */
function initContactActions() {
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const contactForm = document.getElementById('contactInquiryForm');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'cherianjames5@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('✓ Email copied to clipboard: cherianjames5@gmail.com');
        if (window.playSfx) window.playSfx('switch');
      }).catch(() => {
        showToast('Email: cherianjames5@gmail.com');
      });
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('[name="name"]').value;
      const email = contactForm.querySelector('[name="email"]').value;
      const message = contactForm.querySelector('[name="message"]').value;
      const subject = contactForm.querySelector('[name="subject"]').value;

      // Compose mailto as instant direct trigger
      const mailtoLink = `mailto:cherianjames5@gmail.com?subject=${encodeURIComponent(subject + ' - ' + name)}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message)}`;
      window.location.href = mailtoLink;

      showToast('Opening your email client to send message to Cherian James...');
      contactForm.reset();
    });
  }
}

/* ==========================================================================
   7. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const mobileBtn = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileNavDrawer');

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileDrawer.classList.toggle('open');
      const isOpen = mobileDrawer.classList.contains('open');
      mobileBtn.innerHTML = isOpen ? getIconSvg('x') : getIconSvg('menu');
    });

    mobileDrawer.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileBtn.innerHTML = getIconSvg('menu');
      });
    });

    // Tap outside to close drawer on mobile
    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('open') && !mobileDrawer.contains(e.target) && !mobileBtn.contains(e.target)) {
        mobileDrawer.classList.remove('open');
        mobileBtn.innerHTML = getIconSvg('menu');
      }
    });
  }
}

/* ==========================================================================
   HELPERS & TOAST
   ========================================================================== */
function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function getIconSvg(name) {
  const icons = {
    'play': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',
    'pause': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>',
    'volume-2': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>',
    'volume-x': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>',
    'menu': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',
    'x': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
  };
  return icons[name] || '';
}
