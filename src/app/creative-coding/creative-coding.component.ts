import {
  Component, OnInit, AfterViewInit, Input, ElementRef,
  ViewChild, Renderer2, Inject, PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-creative-coding',
  standalone: true,
  imports: [],
  templateUrl: './creative-coding.component.html',
  styleUrl: './creative-coding.component.css'
})
export class CreativeCodingComponent implements OnInit, AfterViewInit {
  @ViewChild('threeJsCanvas', { static: false }) threeJsCanvas!: ElementRef;
  @Input() offsetTop = 0; // navbar height

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private sphere!: THREE.Mesh;
  private particles!: THREE.Points;
  private radius = 500; // set radius to adjust sphere size
  private isBrowser: boolean;
  private windowWidth: number;
  private windowHeight: number;
  private targetCameraZ!: number;

  constructor(
    private renderer2: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId); // check for browser environment

    if (this.isBrowser) {
      this.windowWidth = window.innerWidth; // get window dimensions in the browser
      this.windowHeight = window.innerHeight - this.offsetTop; // offset for navbar
      // console.log(this.windowWidth + ' x ' + this.windowHeight); // check window size
    } else {
      // default values for non-browser environments (SSR)
      this.windowWidth = 800;
      this.windowHeight = 600;
    }

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.windowWidth / this.windowHeight, 0.1, 1000);
    this.targetCameraZ = this.camera.position.z;
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return; // only run in browser

    const isPortrait = this.windowHeight > this.windowWidth;
    const isLandscape = !isPortrait;

    const isMobilePortrait = this.windowWidth < 640 && isPortrait;
    const isMobileLandscape = this.windowHeight < 640 && isLandscape;
    const isTablet = this.windowWidth >= 640 && this.windowWidth < 1024 && !isMobileLandscape;
    const isLarge = !isPortrait && ((this.windowWidth >= 1024 && this.windowWidth < 1440) || this.windowHeight < 900);

    let radius: number;
    let cameraZ: number;
    let particleCount: number;
    let particleSize: number;

    if (isMobileLandscape) {
      radius = 400;
      cameraZ = 700;
      particleCount = 800;
      particleSize = 3.5;
    } else if (isMobilePortrait) {
      radius = 350;
      cameraZ = 700;
      particleCount = 900;
      particleSize = 2;
    } else if (isTablet) {
      radius = 380;
      cameraZ = 700;
      particleCount = 800;
      particleSize = 1.7;
    } else if (isLarge) {
      radius = 450;
      cameraZ = 700;
      particleCount = 800;
      particleSize = 1.5;
    } else {
      radius = 500;
      cameraZ = 700;
      particleCount = 900;
      particleSize = 1; // 1 default size
    }

    const baseSizes = this.getBaseSizes();

    this.radius = baseSizes.radius;
    this.camera.position.z = -200; // start zoomed out (far)
    this.targetCameraZ = baseSizes.cameraZ; // target base zoom

    this.setupScene();
    this.createParticles(particleCount, particleSize);
    this.animate();

    // listen for window resizing
    if (this.isBrowser) {
      // window.addEventListener('resize', this.resizeCanvas.bind(this));
      this.setupResizeListeners();
    }
  }

  private setupScene(): void {
    if (!this.isBrowser) return;

    this.scene.background = new THREE.Color(0x1e293b); // set background color

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.setSize(this.windowWidth, this.windowHeight); // use dynamic window size
    this.threeJsCanvas.nativeElement.appendChild(this.renderer.domElement);

    // use already set camera Z position and radius
    this.camera.aspect = this.windowWidth / this.windowHeight;
    this.camera.updateProjectionMatrix();

    // create rotating sphere
    const geometry = new THREE.SphereGeometry(this.radius, 30, 30);
    const material = new THREE.MeshBasicMaterial({
      color: 0x0077ff,
      wireframe: false,
      transparent: true,
      opacity: 0
    });

    this.sphere = new THREE.Mesh(geometry, material);
    this.scene.add(this.sphere);
  }

  private createParticles(particleCount: number = 900, particleSize: number = 1): void {
    if (!this.isBrowser) return;

    const particleGeometry = new THREE.BufferGeometry();
    //const particleCount = 900; // set number of particles

    const positions = [];
    for (let i = 0; i < particleCount; i++) {
      const angle1 = Math.random() * Math.PI * 2;
      const angle2 = Math.random() * Math.PI * 2;

      const x = this.radius * Math.cos(angle1) * Math.sin(angle2);
      const y = this.radius * Math.sin(angle1) * Math.sin(angle2);
      const z = this.radius * Math.cos(angle2);

      positions.push(x, y, z);
    }

    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xd1d5db,
      size: particleSize, // 1 for large desktop
      sizeAttenuation: true, // particles scale naturally with distance from the camera
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false, // ensure that particles do not overlap or get hidden 
      depthTest: false // prevent depth testing, particles are always visible
    });

    this.particles = new THREE.Points(particleGeometry, particleMaterial);
    this.scene.add(this.particles);
  }

  private animate(): void {
    if (!this.isBrowser) return;

    requestAnimationFrame(() => this.animate());

    // smoothly interpolate camera zoom
    this.camera.position.z += (this.targetCameraZ - this.camera.position.z) * 0.05;

    this.sphere.rotation.y += 0.0005;
    this.particles.rotation.x += 0.0005;
    this.particles.rotation.y += 0.0005;

    this.renderer.render(this.scene, this.camera);
  }

  // update when resizing canvas - currently not needed
  // private resizeCanvas(): void {
  //   this.windowWidth = window.innerWidth;
  //   this.windowHeight = window.innerHeight - this.offsetTop; // offset for navbar

  //   this.camera.aspect = this.windowWidth / this.windowHeight;
  //   this.camera.updateProjectionMatrix();

  //   this.renderer.setSize(this.windowWidth, this.windowHeight);
  //   const maxPixelRatio = 2;
  //   this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPixelRatio));
  // }

  private lastWindowHeight = 0;
  private lastWindowWidth = 0;

  private setupResizeListeners(): void {
    if (!this.isBrowser) return;

    // on orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.handleResize(), 300); // delay ensures stable dimensions
    });

    // on real resize
    window.addEventListener('resize', () => {
      const newHeight = window.innerHeight;
      const newWidth = window.innerWidth;

      const heightChange = Math.abs(newHeight - this.lastWindowHeight);
      const widthChange = Math.abs(newWidth - this.lastWindowWidth);

      const isMobileOrTablet = newWidth < 1380;

      let shouldResize = false;

      if (isMobileOrTablet) {
        // only trigger if there's significant change
        shouldResize = heightChange > 150 || widthChange > 20;
      } else {
        // on desktop, allow resize
        shouldResize = heightChange >= 10 || widthChange >= 1;
      }

      if (shouldResize) {
        this.handleResize();
      }
    });

    // save initial sizes
    this.lastWindowHeight = window.innerHeight;
    this.lastWindowWidth = window.innerWidth;
  }

  private handleResize(): void {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight - this.offsetTop;

    this.lastWindowHeight = newHeight;
    this.lastWindowWidth = newWidth;

    this.windowWidth = newWidth;
    this.windowHeight = newHeight;

    // update camera aspect ratio for new size
    this.camera.aspect = newWidth / newHeight;
    this.camera.updateProjectionMatrix();

    // get base sizes for viewport width
    const { radius, cameraZ, particleCount, particleSize } = this.getBaseSizes();

    const isLandscape = newWidth > newHeight;
    const isPortrait = this.windowHeight > this.windowWidth;
    const isMobile = newWidth < 640;
    const isTablet = newWidth >= 640 && newWidth < 1024;
    const isLarge = !isPortrait && ((this.windowWidth >= 1024 && this.windowWidth < 1440) || this.windowHeight < 900);

    // decide zoom factor based on device and orientation
    let zoomFactor = 1; // default no zoom

    if (isMobile && isLandscape) {
      zoomFactor = 0.75; // for mobile landscape (bigger zoom)
    } else if (isTablet && isLandscape) {
      zoomFactor = 0.85; // for tablet landscape (smaller zoom)
    } else if (isLarge && isLandscape) {
      zoomFactor = 0.95;
    } else {
      zoomFactor = 1; // no zoom on desktop
    }

    // calculate target camera distance based on zoom factor
    const targetZ = cameraZ * zoomFactor;

    // update target zoom smoothly in animation loop
    this.targetCameraZ = targetZ;

    // update radius if needed
    if (this.radius !== radius) {
      this.radius = radius;

      this.scene.remove(this.sphere);
      const geometry = new THREE.SphereGeometry(this.radius, 30, 30);
      const material = new THREE.MeshBasicMaterial({
        color: 0x0077ff,
        wireframe: false,
        transparent: true,
        opacity: 0
      });
      this.sphere = new THREE.Mesh(geometry, material);
      this.scene.add(this.sphere);
    }

    // rebuild particles with updated particleCount and size if needed
    this.scene.remove(this.particles);
    this.createParticles(particleCount, particleSize);

    this.renderer.setSize(newWidth, newHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  }

  private getBaseSizes() {
    const isPortrait = this.windowHeight > this.windowWidth;
    const isLandscape = !isPortrait;

    const isMobilePortrait = this.windowWidth < 640 && isPortrait;
    const isMobileLandscape = this.windowHeight < 640 && isLandscape;
    const isTablet = this.windowWidth >= 640 && this.windowWidth < 1024 && !isMobileLandscape;
    const isLarge = !isPortrait && ((this.windowWidth >= 1024 && this.windowWidth < 1440) || this.windowHeight < 900);

    // the values that differ from the ones in ngAfterViewInit() are deliberate
    if (isMobileLandscape) {
      return {
        radius: 400,
        cameraZ: 700,
        particleCount: 800, // 850
        particleSize: 2.5 // 3 is too much with the zoom
      };
    } else if (isMobilePortrait) {
      return {
        radius: 350,
        cameraZ: 700,
        particleCount: 900,
        particleSize: 2
      };
    } else if (isTablet || isPortrait) {
      return {
        radius: 380,
        cameraZ: 700,
        particleCount: 800,
        particleSize: 1.5
      };
    } else if (isLarge) {
      return {
        radius: 450,
        cameraZ: 700,
        particleCount: 800,
        particleSize: 1.5
      };
    } else {
      return {
        radius: 500,
        cameraZ: 700,
        particleCount: 900,
        particleSize: 1
      };
    }
  }

}