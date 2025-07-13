import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import * as THREE from 'three';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer', { static: true }) containerRef!: ElementRef;
  @ViewChild('particleCanvas', { static: true }) canvasRef!: ElementRef;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private animationFrameId: number = 0;

  private basePositions!: Float32Array;
  private baseColors!: Float32Array;
  private paletteColors!: Float32Array;

  private positionAttribute!: THREE.BufferAttribute;
  private colorAttribute!: THREE.BufferAttribute;

  private observer!: IntersectionObserver;
  private isInViewport: boolean = true;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  private resizeListener = () => {
    const container = this.containerRef.nativeElement;
    const w = container.clientWidth;
    const h = container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(w, h, false);
    const cappedPixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(cappedPixelRatio);
  };

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const container = this.containerRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      100,
      container.clientWidth / container.clientHeight,
      0.1,
      60
    );
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
    });
    //this.renderer.setSize(container.clientWidth, container.clientHeight);

    // render at a higher density of devices with high resolution
    const pixelRatio = window.devicePixelRatio || 1;
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(container.clientWidth, container.clientHeight, false);

    this.observer = new IntersectionObserver(
      ([entry]) => {
        this.isInViewport = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    this.observer.observe(container);

    const loader = new THREE.TextureLoader();
    loader.load('viswaprem-anbarasapandian-n6V7gk-LUfA-unsplash.jpg', (texture) => {
      const imgCanvas = document.createElement('canvas');
      const imgCtx = imgCanvas.getContext('2d')!;
      const imgWidth = 200;
      const imgHeight = 250;
      imgCanvas.width = imgWidth;
      imgCanvas.height = imgHeight;

      imgCtx.drawImage(texture.image, 0, 0, imgWidth, imgHeight);
      const imageData = imgCtx.getImageData(0, 0, imgWidth, imgHeight).data;

      const geometry = new THREE.BufferGeometry();
      const positions: number[] = [];
      const colors: number[] = [];

      const centerX = imgWidth / 2;
      const centerY = imgHeight / 2;

      const maxStep = 4;
      const minStep = 0.05;

      for (let y = 0; y < imgHeight;) {
        const verticalStretch = 0.4;
        const distYNorm = (Math.abs(y - centerY) / centerY) * verticalStretch;

        const stepY = minStep + (maxStep - minStep) * distYNorm;

        for (let x = 0; x < imgWidth;) {
          const distXNorm = Math.abs(x - centerX) / centerX;

          const radiusScale = 1.8;
          let distFromCenter = Math.sqrt(distXNorm * distXNorm + distYNorm * distYNorm) / radiusScale;
          distFromCenter = Math.min(distFromCenter, 1);
          const adjustedDist = Math.pow(distFromCenter, 2.1);

          const stepX = minStep + (maxStep - minStep) * adjustedDist;

          const i = (Math.floor(y) * imgWidth + Math.floor(x)) * 4;
          const alpha = imageData[i + 3];

          if (alpha > 50) {
            const skipProbability = adjustedDist * 3;
            if (Math.random() < skipProbability) {
              x += stepX;
              continue;
            }

            const xpos = (x - centerX) / 40;
            const ypos = -(y - centerY) / 40;
            const zpos = (Math.random() - 0.5) * distXNorm * 150;

            positions.push(xpos, ypos, zpos);
            colors.push(
              imageData[i] / 255,
              imageData[i + 1] / 255,
              imageData[i + 2] / 255
            );
          }

          x += stepX;
        }
        y += stepY;
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      this.positionAttribute = geometry.getAttribute('position') as THREE.BufferAttribute;
      this.colorAttribute = geometry.getAttribute('color') as THREE.BufferAttribute;


      this.basePositions = new Float32Array(positions.length);
      this.baseColors = new Float32Array(colors.length);
      this.paletteColors = new Float32Array(colors.length);

      for (let i = 0; i < positions.length; i++) {
        this.basePositions[i] = positions[i];
      }
      for (let i = 0; i < colors.length; i++) {
        this.baseColors[i] = colors[i];
      }

      const dreamyPalette = [
        [0.6, 0.8, 1.0],
        [0.6, 0.4, 0.8],
        [1.0, 1.0, 1.0],
        [1.0, 1.0, 0.7],
      ];

      for (let i = 0; i < colors.length / 3; i++) {
        const c = dreamyPalette[Math.floor(Math.random() * dreamyPalette.length)];
        this.paletteColors[i * 3] = c[0];
        this.paletteColors[i * 3 + 1] = c[1];
        this.paletteColors[i * 3 + 2] = c[2];
      }

      const material = new THREE.PointsMaterial({
        size: 0.01,
        vertexColors: true,
        transparent: true,
        opacity: 1,
        depthWrite: false,
      });

      const points = new THREE.Points(geometry, material);
      this.scene.add(points);

      const animate = () => {
        this.animationFrameId = requestAnimationFrame(animate);

        if (!this.isInViewport) return;

        points.rotation.y += 0.003;

        const angleRad = points.rotation.y % (2 * Math.PI);
        const deg = THREE.MathUtils.radToDeg(angleRad);

        let swirlProgress = 0;
        if (deg >= 90 && deg < 270) {
          swirlProgress = (deg - 90) / 180;
        } else if (deg >= 270) {
          swirlProgress = 1 - (deg - 270) / 90;
        }

        if (deg < 90) {
          for (let i = 0; i < this.basePositions.length / 3; i++) {
            this.positionAttribute.setXYZ(i,
              this.basePositions[i * 3],
              this.basePositions[i * 3 + 1],
              this.basePositions[i * 3 + 2]
            );
            this.colorAttribute.setXYZ(i,
              this.baseColors[i * 3],
              this.baseColors[i * 3 + 1],
              this.baseColors[i * 3 + 2]
            );
          }
        } else if (deg >= 90 && deg < 270) {
          for (let i = 0; i < this.basePositions.length / 3; i++) {
            const i3 = i * 3;
            const baseX = this.basePositions[i3];
            const baseY = this.basePositions[i3 + 1];
            const baseZ = this.basePositions[i3 + 2];

            const radius = Math.sqrt(baseX * baseX + baseY * baseY);
            const baseAngle = Math.atan2(baseY, baseX);

            const swirlAngle = baseAngle + swirlProgress * 2 * Math.PI + angleRad;
            const swirlRadius = radius * (1 + 1.5 * swirlProgress);

            const posX = swirlRadius * Math.cos(swirlAngle);
            const posY = swirlRadius * Math.sin(swirlAngle);
            const posZ = baseZ + swirlProgress * 0.5 * Math.sin(i + angleRad * 10);

            const baseR = this.baseColors[i3];
            const baseG = this.baseColors[i3 + 1];
            const baseB = this.baseColors[i3 + 2];

            const paletteR = this.paletteColors[i3];
            const paletteG = this.paletteColors[i3 + 1];
            const paletteB = this.paletteColors[i3 + 2];

            const colorR = baseR + (paletteR - baseR) * swirlProgress;
            const colorG = baseG + (paletteG - baseG) * swirlProgress;
            const colorB = baseB + (paletteB - baseB) * swirlProgress;

            this.positionAttribute.setXYZ(i, posX, posY, posZ);
            this.colorAttribute.setXYZ(i, colorR, colorG, colorB);
          }
        } else if (deg >= 270) {
          const reassembleProgress = 1 - (deg - 270) / 90;
          for (let i = 0; i < this.basePositions.length / 3; i++) {
            const i3 = i * 3;
            const baseX = this.basePositions[i3];
            const baseY = this.basePositions[i3 + 1];
            const baseZ = this.basePositions[i3 + 2];

            const radius = Math.sqrt(baseX * baseX + baseY * baseY);
            const baseAngle = Math.atan2(baseY, baseX);

            const swirlAngle = baseAngle + reassembleProgress * 2 * Math.PI + angleRad;
            const swirlRadius = radius * (1 + 1.5 * reassembleProgress);

            const posX = swirlRadius * Math.cos(swirlAngle);
            const posY = swirlRadius * Math.sin(swirlAngle);
            const posZ = baseZ + reassembleProgress * 0.5 * Math.sin(i + angleRad * 10);

            const baseR = this.baseColors[i3];
            const baseG = this.baseColors[i3 + 1];
            const baseB = this.baseColors[i3 + 2];

            const paletteR = this.paletteColors[i3];
            const paletteG = this.paletteColors[i3 + 1];
            const paletteB = this.paletteColors[i3 + 2];

            const colorR = baseR + (paletteR - baseR) * reassembleProgress;
            const colorG = baseG + (paletteG - baseG) * reassembleProgress;
            const colorB = baseB + (paletteB - baseB) * reassembleProgress;

            this.positionAttribute.setXYZ(i, posX, posY, posZ);
            this.colorAttribute.setXYZ(i, colorR, colorG, colorB);
          }
        }

        this.positionAttribute.needsUpdate = true;
        this.colorAttribute.needsUpdate = true;

        this.renderer.render(this.scene, this.camera);
      };
      animate();

      window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(w, h, false);
        const cappedPixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        this.renderer.setPixelRatio(cappedPixelRatio);
      });

      window.addEventListener('resize', this.resizeListener);
    });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      cancelAnimationFrame(this.animationFrameId);
      this.renderer?.dispose();
      this.observer?.disconnect();
      window.removeEventListener('resize', this.resizeListener);
    }
  }
}
