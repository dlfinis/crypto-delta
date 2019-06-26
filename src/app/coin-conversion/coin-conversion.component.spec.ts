import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinConversionComponent } from './coin-conversion.component';

describe('CoinConversionComponent', () => {
  let component: CoinConversionComponent;
  let fixture: ComponentFixture<CoinConversionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoinConversionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
