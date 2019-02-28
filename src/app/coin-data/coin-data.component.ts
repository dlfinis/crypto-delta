import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoinVO } from '../vo/CoinVO';
import { CryptoCompareService } from '../services/crypto-compare/crypto-compare.service';
import { LazyLoadEvent } from 'primeng/api';
@Component({
  selector: 'app-coin-data',
  templateUrl: './coin-data.component.html',
  styleUrls: ['./coin-data.component.scss'],
  providers: [CryptoCompareService]
})

export class CoinDataComponent implements OnInit {
  // @Input() coin: string;

  coin = new CoinVO;
  id: string;
  sub;
  bnb_coins;

  dataPair: any;
  dataChange: any;
  dataExchange: any;

  displayedColumns: string[];
  cvalue = 0.0;
  loading: boolean;

  constructor(private _route: ActivatedRoute, private ccService: CryptoCompareService) {
   }

  ngOnInit() {
    this.sub = this._route.params.subscribe(params => {
      this.coin.name = params['coin'];

      });

      console.log(this.coin);
      // this.onLoadCoins();

      this.displayedColumns = ['currency', 'pair', 'value'];
      this.onLoadPrice('BTC');
      this.loading = true;
  }

  onLoadPrice(coin: string) {
    return this.ccService.getPrice(coin).subscribe(x => {
      console.log(x);
      return x;
    });
  }
  onLoadCoins(event: LazyLoadEvent) {
    this.loading = true;
    // this.ccService.getCoinsByExchange().then(x => {
    //   console.log(x);
    // });
    // this.ccService.getChangeCurrencyList(this.coin).then(response => {
    //   console.log(response);
    // });

    this.ccService.getPairList(this.coin).subscribe(response => {
      this.dataPair = response;
      // this.dataPair = response.slice(event.first, (event.first + event.rows));
      console.log(this.dataPair);
      this.loading = false;
    });
  }
}
