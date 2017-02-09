/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AddressServiceService } from './address-service.service';

describe('AddressServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddressServiceService]
    });
  });

  it('should ...', inject([AddressServiceService], (service: AddressServiceService) => {
    expect(service).toBeTruthy();
  }));
});
