import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreativeCodingComponent } from './creative-coding.component';

describe('CreativeCodingComponent', () => {
  let component: CreativeCodingComponent;
  let fixture: ComponentFixture<CreativeCodingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreativeCodingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreativeCodingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
