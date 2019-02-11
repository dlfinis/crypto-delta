import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinDataComponent } from './coin-data.component';

describe('CoinDataComponent', () => {
  let component: CoinDataComponent;
  let fixture: ComponentFixture<CoinDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoinDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
