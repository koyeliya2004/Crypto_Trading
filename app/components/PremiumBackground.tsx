"use client";

import React, { useEffect, useRef } from "react";

// Enhanced PremiumBackground for Crypto Trading Dashboard
// Features:
// 1) Deep layered gradient background
// 2) Floating crypto icons (BTC, ETH, etc.)
// 3) Network connection lines
// 4) Animated candlestick charts
// 5) Hexagon grid pattern
// 6) Glowing particles with depth
// 7) Dynamic price chart lines

interface CryptoIcon {
  x: number;
  y: number;
  symbol: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  vx: number;
  vy: number;
  alpha: number;
  pulsePhase: number;
}

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  depth: number;
  hue: number;
}

interface Connection {
  from: number;
  to: number;
  alpha: number;
}

export default function PremiumBackground(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let width = 0;
    let height = 0;
    let dpr = Math.max(1, window.devicePixelRatio || 1);

    // Crypto icons floating
    let cryptoIcons: CryptoIcon[] = [];
    const cryptoSymbols = ['₿', 'Ξ', '◈', '⬡', '◊', '●'];
    
    // Enhanced particles with depth
    let particles: Particle[] = [];
    const maxParticles = 120;
    let connections: Connection[] = [];

    // Graph strokes
    let graphOffset = 0;
    const candlesticks: { x: number; w: number; h: number; dir: number; alpha: number }[] = [];

    function resize() {
      dpr = Math.max(1, window.devicePixelRatio || 1);
      const c = canvasRef.current;
      if (!c) return;
      width = Math.max(800, window.innerWidth);
      height = Math.max(600, window.innerHeight);
      c.width = Math.floor(width * dpr);
      c.height = Math.floor(height * dpr);
      c.style.width = width + "px";
      c.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Create floating crypto icons
      cryptoIcons = [];
      const iconCount = Math.min(8, Math.floor(width / 200));
      for (let i = 0; i < iconCount; i++) {
        cryptoIcons.push({
          x: Math.random() * width,
          y: Math.random() * height,
          symbol: cryptoSymbols[i % cryptoSymbols.length],
          size: 20 + Math.random() * 30,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.002,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          alpha: 0.08 + Math.random() * 0.12,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }

      // Recreate particles with depth
      particles = [];
      const count = Math.min(maxParticles, Math.floor((width * height) / 80000));
      for (let i = 0; i < count; i++) {
        const depth = Math.random();
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.5 + Math.random() * (2 + depth * 2),
          vx: (Math.random() - 0.5) * (0.2 + depth * 0.3),
          vy: (Math.random() - 0.5) * (0.2 + depth * 0.3),
          alpha: 0.1 + Math.random() * 0.3,
          depth: depth,
          hue: 20 + Math.random() * 40, // Orange to gold hues
        });
      }

      // Candlesticks
      candlesticks.length = 0;
      const cols = Math.floor(width / 20);
      for (let i = 0; i < cols; i++) {
        const w = 6 + (i % 3);
        const h = 8 + Math.random() * (height * 0.35);
        const dir = Math.random() > 0.5 ? 1 : -1;
        candlesticks.push({ x: i * 20 + (width * 0.1), w, h, dir, alpha: 0.04 + Math.random() * 0.08 });
      }
    }

    // Enhanced base with multiple gradient layers
    function drawBase() {
      // Deep space-like background
      const g1 = ctx.createLinearGradient(0, 0, 0, height);
      g1.addColorStop(0, "#050508");
      g1.addColorStop(0.3, "#0a0a0f");
      g1.addColorStop(0.6, "#12100e");
      g1.addColorStop(1, "#0f0805");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      // Radial accent from top-left (subtle blue)
      const accentTop = ctx.createRadialGradient(width * 0.2, height * 0.2, 0, width * 0.2, height * 0.2, Math.max(width, height) * 0.6);
      accentTop.addColorStop(0, "rgba(30,50,80,0.08)");
      accentTop.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = accentTop;
      ctx.fillRect(0, 0, width, height);

      // Main warm glow from bottom (golden crypto theme)
      const glow = ctx.createRadialGradient(width / 2, height * 0.9, 20, width / 2, height * 0.9, Math.max(width, height) * 1.2);
      glow.addColorStop(0, "rgba(255,170,70,0.15)");
      glow.addColorStop(0.2, "rgba(255,140,50,0.08)");
      glow.addColorStop(0.5, "rgba(200,100,30,0.03)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      // Accent glow from right (amber)
      const glowRight = ctx.createRadialGradient(width * 0.85, height * 0.5, 20, width * 0.85, height * 0.5, Math.max(width, height) * 0.7);
      glowRight.addColorStop(0, "rgba(255,180,100,0.06)");
      glowRight.addColorStop(0.5, "rgba(220,130,60,0.02)");
      glowRight.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glowRight;
      ctx.fillRect(0, 0, width, height);

      // Strong vignette for depth
      const vignette = ctx.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.15, width / 2, height / 2, Math.max(width, height) * 0.8);
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(0.7, "rgba(0,0,0,0.3)");
      vignette.addColorStop(1, "rgba(0,0,0,0.6)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
    }

    // Draw hexagonal grid pattern
    function drawHexGrid(time: number) {
      ctx.save();
      ctx.strokeStyle = `rgba(255,160,80,${0.03 + 0.01 * Math.sin(time / 2000)})`;
      ctx.lineWidth = 0.5;
      
      const hexSize = 40;
      const hexHeight = hexSize * Math.sqrt(3);
      
      for (let row = -1; row < height / hexHeight + 1; row++) {
        for (let col = -1; col < width / (hexSize * 1.5) + 2; col++) {
          const x = col * hexSize * 1.5 + (row % 2) * hexSize * 0.75;
          const y = row * hexHeight * 0.5;
          
          if (x > -hexSize && x < width + hexSize && y > -hexSize && y < height + hexSize) {
            // Only draw some hexagons for performance
            if (Math.random() > 0.7) {
              drawHexagon(x, y, hexSize * (0.8 + Math.sin((x + y + time / 1000) * 0.01) * 0.2));
            }
          }
        }
      }
      ctx.restore();
    }

    function drawHexagon(x: number, y: number, size: number) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = x + size * Math.cos(angle);
        const hy = y + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Draw crypto icons with glow
    function drawCryptoIcons(time: number) {
      ctx.save();
      for (const icon of cryptoIcons) {
        ctx.save();
        ctx.translate(icon.x, icon.y);
        ctx.rotate(icon.rotation);
        
        // Pulsing glow effect
        const pulse = Math.sin(time / 800 + icon.pulsePhase) * 0.5 + 0.5;
        const glowSize = icon.size * (1.5 + pulse * 0.5);
        
        // Outer glow
        const iconGlow = ctx.createRadialGradient(0, 0, icon.size * 0.3, 0, 0, glowSize);
        iconGlow.addColorStop(0, `rgba(255,180,100,${icon.alpha * 0.4})`);
        iconGlow.addColorStop(0.5, `rgba(255,140,60,${icon.alpha * 0.2})`);
        iconGlow.addColorStop(1, "rgba(255,100,30,0)");
        ctx.fillStyle = iconGlow;
        ctx.beginPath();
        ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Icon symbol
        ctx.fillStyle = `rgba(255,200,150,${icon.alpha + pulse * 0.1})`;
        ctx.font = `${icon.size}px Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(icon.symbol, 0, 0);
        
        // Inner highlight
        ctx.fillStyle = `rgba(255,255,220,${icon.alpha * 0.3 + pulse * 0.1})`;
        ctx.font = `${icon.size * 0.8}px Arial, sans-serif`;
        ctx.fillText(icon.symbol, 0, -icon.size * 0.1);
        
        ctx.restore();
      }
      ctx.restore();
    }

    // Update crypto icons position
    function updateCryptoIcons() {
      for (const icon of cryptoIcons) {
        icon.x += icon.vx;
        icon.y += icon.vy;
        icon.rotation += icon.rotationSpeed;
        
        // Wrap around
        if (icon.x < -100) icon.x = width + 100;
        if (icon.x > width + 100) icon.x = -100;
        if (icon.y < -100) icon.y = height + 100;
        if (icon.y > height + 100) icon.y = -100;
      }
    }

    // Draw network connections between particles
    function drawConnections() {
      ctx.save();
      connections = [];
      const maxDistance = 150;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const alpha = (1 - distance / maxDistance) * 0.15;
            connections.push({ from: i, to: j, alpha });
          }
        }
      }
      
      for (const conn of connections) {
        const p1 = particles[conn.from];
        const p2 = particles[conn.to];
        
        const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        gradient.addColorStop(0, `rgba(255,${150 + p1.hue},80,${conn.alpha * p1.depth})`);
        gradient.addColorStop(1, `rgba(255,${150 + p2.hue},80,${conn.alpha * p2.depth})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Draw enhanced glow rings
    function drawGlowRing(time: number) {
      const cx = width / 2;
      const cy = height * 0.95;
      const baseR = Math.min(width, height) * 0.12;

      ctx.save();
      // Multiple concentric glowing rings
      for (let i = 0; i < 3; i++) {
        const offset = i * 0.4;
        const radius = baseR * (1 + offset);
        const pulse = Math.sin(time / (1000 + i * 200)) * 0.5 + 0.5;
        
        // Ring glow
        const ringGlow = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 1.3);
        ringGlow.addColorStop(0, `rgba(255,${180 - i * 20},${100 - i * 20},${0.08 * (1 - offset) + pulse * 0.03})`);
        ringGlow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = ringGlow;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 1.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Ring stroke
        ctx.strokeStyle = `rgba(255,${180 - i * 30},90,${0.15 * (1 - offset) + pulse * 0.05})`;
        ctx.lineWidth = 2 - i * 0.5;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Draw enhanced candlestick bars with glow
    function drawCandlesticks() {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      
      for (let i = 0; i < candlesticks.length; i++) {
        const c = candlesticks[i];
        const x = c.x - (graphOffset % 20);
        if (x < -50 || x > width + 50) continue;
        
        const baseY = height * 0.5;
        const top = baseY - c.h * 0.5 + Math.sin((i + graphOffset / 60) * 0.5) * 25;
        const bottom = top + c.h * 0.65;
        
        const isGreen = c.dir > 0;
        const color = isGreen ? '60,255,120' : '255,100,80';
        
        // Glow effect
        ctx.fillStyle = `rgba(${color},${c.alpha * 0.3})`;
        ctx.fillRect(x - 2, top - 2, c.w + 4, bottom - top + 4);
        
        // Main body
        ctx.fillStyle = `rgba(${color},${c.alpha})`;
        ctx.fillRect(x, top, c.w, bottom - top);
        
        // Wick with glow
        ctx.strokeStyle = `rgba(${color},${c.alpha * 0.8})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + c.w / 2, top - 8);
        ctx.lineTo(x + c.w / 2, bottom + 8);
        ctx.stroke();
        
        // Highlight
        ctx.fillStyle = `rgba(255,255,255,${c.alpha * 0.2})`;
        ctx.fillRect(x, top, c.w, (bottom - top) * 0.3);
      }
      ctx.restore();
    }

    // Draw multiple animated price chart lines
    function drawGraphs(time: number) {
      ctx.save();
      
      // Grid lines
      ctx.strokeStyle = 'rgba(255,160,80,0.03)';
      ctx.lineWidth = 0.5;
      const gridSpacing = 50;
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
      // Main price line with glow
      const steps = Math.max(8, Math.floor(width / 100));
      
      // Multiple chart lines for depth
      const lines = [
        { offset: 0, color: 'rgba(255,180,100,', thickness: 2.5, glow: 0.15 },
        { offset: 50, color: 'rgba(100,200,255,', thickness: 1.8, glow: 0.12 },
        { offset: -30, color: 'rgba(180,100,255,', thickness: 1.5, glow: 0.1 },
      ];
      
      for (const line of lines) {
        // Glow layer
        ctx.strokeStyle = line.color + line.glow + ')';
        ctx.lineWidth = line.thickness + 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const x = t * width;
          const y = height * 0.6 - 
                    Math.sin((t * 5 + time / 1200 + line.offset / 100) * 1.3) * (height * 0.15) - 
                    t * (height * 0.25) + 
                    line.offset;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Main line
        ctx.strokeStyle = line.color + '0.35)';
        ctx.lineWidth = line.thickness;
        ctx.beginPath();
        
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const x = t * width;
          const y = height * 0.6 - 
                    Math.sin((t * 5 + time / 1200 + line.offset / 100) * 1.3) * (height * 0.15) - 
                    t * (height * 0.25) + 
                    line.offset;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      
      ctx.restore();
    }

    // Enhanced particles update with depth
    function updateParticles() {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const speed = 0.5 + p.depth * 0.5;
        p.x += p.vx * speed + (Math.cos((i + graphOffset / 150) * 0.4) * 0.1);
        p.y += p.vy * speed + (Math.sin((i + graphOffset / 120) * 0.3) * 0.1);
        
        // Wrap around edges
        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;
        if (p.y < -30) p.y = height + 30;
        if (p.y > height + 30) p.y = -30;
      }
    }

    // Draw enhanced particles with depth and glow
    function drawParticles(time: number) {
      ctx.save();
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const pulse = Math.sin(time / 500 + i) * 0.3 + 0.7;
        
        // Glow effect based on depth
        const glowSize = p.r * (2 + p.depth * 2);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
        gradient.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${p.alpha * p.depth * pulse})`);
        gradient.addColorStop(0.5, `hsla(${p.hue}, 100%, 60%, ${p.alpha * p.depth * 0.3})`);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Core particle
        ctx.fillStyle = `hsla(${p.hue}, 100%, 80%, ${p.alpha + pulse * 0.2})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Main animation loop with all layers
    function render(time: number) {
      if (!ctx) return;
      graphOffset += 0.5;
      
      // Layer 1: Base background with gradients
      drawBase();
      
      // Layer 2: Hexagonal grid (subtle)
      drawHexGrid(time);
      
      // Layer 3: Network connections between particles
      drawConnections();
      
      // Layer 4: Candlestick charts
      drawCandlesticks();
      
      // Layer 5: Price chart lines
      drawGraphs(time);
      
      // Layer 6: Bottom glow rings
      drawGlowRing(time);
      
      // Layer 7: Particles with depth
      updateParticles();
      drawParticles(time);
      
      // Layer 8: Floating crypto icons on top
      updateCryptoIcons();
      drawCryptoIcons(time);

      rafRef.current = requestAnimationFrame(render);
    }

    // initialize and start
    resize();
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Render a full-bleed canvas positioned behind UI
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        display: "block",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

