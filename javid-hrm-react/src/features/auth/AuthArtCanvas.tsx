import { useEffect, useRef } from 'react';

const PI = Math.PI;
const HALF_PI = PI / 2;
const BRANCH_SPREAD = PI / 12;
const MAX_DEPTH = 30;
const BRANCH_LENGTH = 6;

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function AuthArtCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let animationFrame = 0;
    let branches: Array<() => void> = [];
    let nextBranches: Array<() => void> = [];
    let idle = false;
    let lastTick = performance.now();

    const viewport = () => ({ width: window.innerWidth, height: window.innerHeight });

    const resize = () => {
      const { width, height } = viewport();
      const dpi = window.devicePixelRatio || 1;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = Math.floor(width * dpi);
      canvas.height = Math.floor(height * dpi);
      ctx.setTransform(dpi, 0, 0, dpi, 0, 0);
    };

    const strokeColor = () => {
      const isDark = document.documentElement.classList.contains('dark');
      return isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(15, 23, 42, 0.06)';
    };

    const drawBranch = (
      x: number,
      y: number,
      angle: number,
      state: { value: number } = { value: 0 },
    ) => {
      const length = Math.random() * BRANCH_LENGTH;
      state.value += 1;
      const endX = x + length * Math.cos(angle);
      const endY = y + length * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      const { width, height } = viewport();
      if (endX < -100 || endX > width + 100 || endY < -100 || endY > height + 100) {
        return;
      }

      const probability = state.value <= MAX_DEPTH ? 0.8 : 0.5;
      const leftAngle = angle + Math.random() * BRANCH_SPREAD;
      const rightAngle = angle - Math.random() * BRANCH_SPREAD;

      if (Math.random() < probability) {
        nextBranches.push(() => drawBranch(endX, endY, leftAngle, state));
      }
      if (Math.random() < probability) {
        nextBranches.push(() => drawBranch(endX, endY, rightAngle, state));
      }
    };

    const seed = () => {
      const { width, height } = viewport();
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;
      ctx.strokeStyle = strokeColor();
      branches = [];
      nextBranches = [
        () => drawBranch(randomBetween(0.1, 0.9) * width, -5, HALF_PI),
        () => drawBranch(randomBetween(0.1, 0.9) * width, height + 5, -HALF_PI),
        () => drawBranch(-5, randomBetween(0.1, 0.9) * height, 0),
        () => drawBranch(width + 5, randomBetween(0.1, 0.9) * height, PI),
      ];
      if (width < 500) {
        nextBranches = nextBranches.slice(0, 2);
      }
      idle = false;
    };

    const tick = () => {
      const now = performance.now();
      if (now - lastTick >= 25) {
        branches = nextBranches;
        nextBranches = [];
        lastTick = now;

        if (branches.length) {
          branches.forEach((branch) => {
            if (Math.random() < 0.5) {
              nextBranches.push(branch);
            } else {
              branch();
            }
          });
        } else {
          idle = true;
        }
      }

      if (idle) {
        seed();
      }

      animationFrame = window.requestAnimationFrame(tick);
    };

    const onResize = () => {
      resize();
      seed();
    };

    resize();
    seed();
    animationFrame = window.requestAnimationFrame(tick);
    window.addEventListener('resize', onResize);

    const observer = new MutationObserver(() => {
      ctx.strokeStyle = strokeColor();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 print:hidden" aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  );
}
