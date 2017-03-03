/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PeService } from './pe.service';

describe('PeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PeService]
    });
  });

  it('should ...', inject([PeService], (service: PeService) => {
    expect(service).toBeTruthy();
  }));
});
