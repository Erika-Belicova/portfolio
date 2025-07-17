import { TestBed } from '@angular/core/testing';

import { WakeService } from './wake.service';

describe('WakeService', () => {
  let service: WakeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WakeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
