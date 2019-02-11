import { Component } from '@angular/core';
import { map, switchMap, merge, tap, filter } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { CryptoCompareService } from '../services/crypto-compare/crypto-compare.service';
import { CryptoCompareCoin } from '../services/crypto-compare/crypto-compare-coin';

interface CoinCard {
  coin: CryptoCompareCoin;
  cols?: number;
  rows?: number;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.coinService.coinlist()
    .pipe(
      map(x => x.map( y => ({ coin: y, cols: 1, rows: 1}))),
      switchMap( (coins) => this.breakpointObserver.observe(Breakpoints.Handset)
        .pipe(
          map(({ matches }) => {
            if (!matches) {
              coins[0].cols = 2;
            } else {
              coins[0].cols = 1;

            }
            return coins;
          }),
      ),
      ),
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private coinService: CryptoCompareService,
    ) {
    }
}
