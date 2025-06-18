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

import * as THREE from 'three';

@Component({
  selector: 'app-about',
  standalone: true,
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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const container = this.containerRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      70,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);

    const loader = new THREE.TextureLoader();
    loader.load('me.png', (texture) => {
      // hidden canvas to sample image pixels
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

      const maxStep = 4;  // sparse step size at edges
      const minStep = 1;  // dense step size at center

      for (let y = 0; y < imgHeight;) {
        // normalize distance from center vertically
        const distYNorm = Math.abs(y - centerY) / centerY;

        const stepY = minStep + (maxStep - minStep) * distYNorm;

        for (let x = 0; x < imgWidth;) {
          // normalize distance from center horizontally
          const distXNorm = Math.abs(x - centerX) / centerX;

          const distFromCenter = Math.sqrt(distXNorm * distXNorm + distYNorm * distYNorm);

          const stepX = minStep + (maxStep - minStep) * distFromCenter;

          const i = (Math.floor(y) * imgWidth + Math.floor(x)) * 4;
          const alpha = imageData[i + 3];

          if (alpha > 50) {
            // convert pixel coords to normalized coords centered around zero
            const xpos = (x - centerX) / 40;
            const ypos = -(y - centerY) / 40;

            // z spread same as before — scales with distFromCenter but randomized
            const zpos = (Math.random() - 0.5) * distFromCenter * 1.4;

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

      const material = new THREE.PointsMaterial({
        size: 0.03,       // particle size — adjust
        vertexColors: true,
        transparent: true,
        opacity: 1,
        depthWrite: false,
      });

      const points = new THREE.Points(geometry, material);
      this.scene.add(points);

      const animate = () => {
        this.animationFrameId = requestAnimationFrame(animate);
        points.rotation.y += 0.002;  // slow spin revealing 3D structure
        this.renderer.render(this.scene, this.camera);
      };
      animate();
    });

  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      cancelAnimationFrame(this.animationFrameId);
      this.renderer?.dispose();
    }
  }
}
