import {
  Component, OnInit, AfterViewInit, ElementRef,
  ViewChild, Renderer2, Inject, PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-creative-coding',
  imports: [],
  templateUrl: './creative-coding.component.html',
  styleUrl: './creative-coding.component.css'
})
export class CreativeCodingComponent implements OnInit, AfterViewInit {
  @ViewChild('threeJsCanvas', { static: false }) threeJsCanvas!: ElementRef;

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private sphere!: THREE.Mesh;
  private particles!: THREE.Points;
  private radius = 500; // set radius to adjust sphere size
  private isBrowser: boolean;
  private windowWidth: number;
  private windowHeight: number;

  constructor(
    private renderer2: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId); // check for browser environment

    if (this.isBrowser) {
      this.windowWidth = window.innerWidth; // get window dimensions in the browser
      this.windowHeight = window.innerHeight;
    } else {
      // default values for non-browser environments (SSR)
      this.windowWidth = 800;
      this.windowHeight = 600;
    }

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.windowWidth / this.windowHeight, 0.1, 1000);
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return; // only run in browser

    this.setupScene();
    this.createParticles();
    this.animate();

    // listen for window resizing
    if (this.isBrowser) {
      window.addEventListener('resize', this.resizeCanvas.bind(this));
    }
  }

  private setupScene(): void {
    if (!this.isBrowser) return;

    this.scene.background = new THREE.Color(0x1e293b); // set background color


    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.windowWidth, this.windowHeight); // use dynamic window size
    this.threeJsCanvas.nativeElement.appendChild(this.renderer.domElement);

    this.camera.position.z = 700; // distance to the camera

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

  private createParticles(): void {
    if (!this.isBrowser) return;

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 900; // set number of particles

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
      size: 1,
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

    // rotate the sphere
    this.sphere.rotation.y += 0.0005;

    // rotate particles with the sphere
    this.particles.rotation.x += 0.0005;
    this.particles.rotation.y += 0.0005;

    this.renderer.render(this.scene, this.camera);
  }

  // update when resizing canvas
  private resizeCanvas(): void {
    this.windowWidth = window.innerWidth; // window dimensions
    this.windowHeight = window.innerHeight;

    this.camera.aspect = this.windowWidth / this.windowHeight; // camera aspect ratio

    this.camera.updateProjectionMatrix(); // camera projection matrix

    this.renderer.setSize(this.windowWidth, this.windowHeight); // renderer size
  }
}