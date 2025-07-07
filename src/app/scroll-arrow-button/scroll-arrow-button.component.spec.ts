import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollArrowButtonComponent } from './scroll-arrow-button.component';

describe('ScrollArrowButtonComponent', () => {
  let component: ScrollArrowButtonComponent;
  let fixture: ComponentFixture<ScrollArrowButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollArrowButtonComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ScrollArrowButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
