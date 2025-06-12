import {
  Component, OnInit, AfterViewInit, ElementRef,
  ViewChild, Renderer2, Inject, PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MouseTrailDirective } from '../directives/mouse-trail.directive';
import * as THREE from 'three';

@Component({
  selector: 'app-home',
  imports: [MouseTrailDirective],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  sectionStars = [
    { id: 'about', position: new THREE.Vector3(150, 50, 0), mesh: null as THREE.Mesh | null },
    { id: 'experience', position: new THREE.Vector3(-200, -80, -50), mesh: null as THREE.Mesh | null },
    { id: 'skills', position: new THREE.Vector3(250, 100, -100), mesh: null as THREE.Mesh | null },
    { id: 'projects', position: new THREE.Vector3(-100, 200, 50), mesh: null as THREE.Mesh | null },
    { id: 'contact', position: new THREE.Vector3(0, -150, 100), mesh: null as THREE.Mesh | null }
  ];

  targetCameraPosition = new THREE.Vector3();
  currentTargetStar: THREE.Vector3 | null = null;

  @ViewChild('threeJsCanvas', { static: false }) threeJsCanvas!: ElementRef;

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private sphere!: THREE.Mesh;
  private particles!: THREE.Points;
  private radius = 150;
  private isBrowser: boolean;
  private windowWidth: number;
  private windowHeight: number;

  constructor(
    private renderer2: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    } else {
      this.windowWidth = 800;
      this.windowHeight = 600;
    }

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.windowWidth / this.windowHeight, 0.1, 1000);
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.setupScene();
    this.createParticles();
    this.animate();

    if (this.isBrowser) {
      window.addEventListener('resize', this.resizeCanvas.bind(this));
    }

    window.addEventListener('scroll', () => {
      const activeId = this.getActiveSection();
      const star = this.sectionStars.find(s => s.id === activeId);
      if (star) {
        this.currentTargetStar = star.position.clone();
        // camera moves outside the globe towards star + offset
        this.targetCameraPosition = star.position.clone().add(new THREE.Vector3(0, 0, 200));
      }
    });

    const initialStar = this.sectionStars[0];
    this.currentTargetStar = initialStar.position.clone();
    this.targetCameraPosition = initialStar.position.clone().add(new THREE.Vector3(0, 0, 200));

    // initially place camera inside the globe
    this.camera.position.set(0, 0, 20);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  private setupScene(): void {
    if (!this.isBrowser) return;

    this.scene.background = new THREE.Color(0x1e293b);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.windowWidth, this.windowHeight);
    this.threeJsCanvas.nativeElement.appendChild(this.renderer.domElement);

    // camera position will be overridden on load inside globe
    this.camera.position.z = 400;
    const geometry = new THREE.SphereGeometry(this.radius, 30, 30);
    const material = new THREE.MeshBasicMaterial({
      color: 0x0077ff,
      wireframe: false,
      transparent: true,
      opacity: 0 // invisible globe surface, only particles visible
    });

    this.sphere = new THREE.Mesh(geometry, material);
    this.scene.add(this.sphere);
  }

  private createParticles(): void {
    if (!this.isBrowser) return;

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 900;

    const positions = [];
    const starfieldRadius = 500; // bigger radius than globe, for background stars

    for (let i = 0; i < particleCount; i++) {
      const angle1 = Math.random() * Math.PI * 2;
      const angle2 = Math.random() * Math.PI * 2;

      // Use bigger radius for background stars
      const x = starfieldRadius * Math.cos(angle1) * Math.sin(angle2);
      const y = starfieldRadius * Math.sin(angle1) * Math.sin(angle2);
      const z = starfieldRadius * Math.cos(angle2);

      positions.push(x, y, z);
    }

    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xd1d5db,
      size: 1,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false
    });

    this.particles = new THREE.Points(particleGeometry, particleMaterial);
    this.scene.add(this.particles);

    // create stars at section positions, keep reference in sectionStars
    this.sectionStars.forEach(star => {
      const starGeometry = new THREE.SphereGeometry(8, 16, 16);
      const starMaterial = new THREE.MeshBasicMaterial({ color: 0x44ccff });
      const starMesh = new THREE.Mesh(starGeometry, starMaterial);

      starMesh.position.copy(star.position);
      this.scene.add(starMesh);

      star.mesh = starMesh;
    });
  }

  private animate(): void {
    if (!this.isBrowser) return;

    requestAnimationFrame(() => this.animate());

    // globe spins independently all the time
    this.sphere.rotation.y += 0.001;
    this.particles.rotation.x += 0.0002;
    this.particles.rotation.y += 0.0002;

    if (this.currentTargetStar) {
      // smoothly move camera toward target star position + offset
      this.camera.position.lerp(this.targetCameraPosition, 0.05);
      this.camera.lookAt(this.currentTargetStar);
    }

    // highlight active star by scaling it up
    this.sectionStars.forEach(star => {
      if (star.mesh) {
        const isActive = star.position.equals(this.currentTargetStar || new THREE.Vector3());
        star.mesh.scale.set(isActive ? 1.5 : 1, isActive ? 1.5 : 1, isActive ? 1.5 : 1);
      }
    });

    this.renderer.render(this.scene, this.camera);
  }

  private resizeCanvas(): void {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.camera.aspect = this.windowWidth / this.windowHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.windowWidth, this.windowHeight);
  }

  getActiveSection(): string {
    const scrollY = window.scrollY;
    const screenHeight = window.innerHeight;

    if (scrollY < screenHeight * 1) return 'about';
    if (scrollY < screenHeight * 2) return 'experience';
    if (scrollY < screenHeight * 3) return 'skills';
    if (scrollY < screenHeight * 4) return 'projects';
    return 'contact';
  }
}
