import { TestBed } from '@angular/core/testing';

import { CryptoCompareService } from './crypto-compare.service';

describe('CryptoCompareService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CryptoCompareService = TestBed.get(CryptoCompareService);
    expect(service).toBeTruthy();
  });
});
