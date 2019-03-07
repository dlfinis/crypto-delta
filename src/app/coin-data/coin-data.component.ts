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
  totalRecords = 0;


  constructor(private _route: ActivatedRoute, private ccService: CryptoCompareService) {
   }

  ngOnInit() {
    this.sub = this._route.params.subscribe(params => {
      this.coin.name = params['coin'];
      });

      // console.log(this.coin);

      this.displayedColumns = ['currency', 'pair', 'value'];
      this.loading = true;

      this.onLoadPrice(this.coin.name, 'USD').subscribe(res => {
        this.coin.usd = res.USD;
      });

      this.onLoadPrice(this.coin.name, 'BTC').subscribe(res => {
        this.coin.btc = res.BTC;
      });
      console.log(this.coin);

  }

  fnGetPrice(coin: string, base: string) {
    return this.ccService.getPrice(coin, base).subscribe(res => {
      console.log(res);
      return res[base];
    });
    // return value;
  }

  onGetPriceMulti(coin: any, base: any) {
    return this.ccService.getPriceMultiExchange(coin, base);
  }

  onLoadPrice(coin: string, base: string) {

    return this.ccService.getPrice(coin, base);
    // return value;
  }

  onLoadPriceExchange(coin: string, base: any[]) {
    return this.ccService.getPriceExchange(coin, base);
    // return value;
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
      // this.dataPair = response;
      // console.log(response);

      this.totalRecords = response.length;
      this.dataPair = response.slice(event.first, (event.first + event.rows));

      this.dataPair.map(x => {
        // this.onLoadPrice(x.currency, 'USD').subscribe(res => {
        //   console.log('DT', x.currency, '-', res);
        //   x.usd = res.USD;
        //   // console.log('DT', x);
        // });

        // x.pair.splice( x.pair.indexOf(this.coin.name), 1 );
        // this.onGetPriceMulti(x.currency, ['USD', this.coin.name ]).subscribe( res => {
        this.onGetPriceMulti(x.currency, x.pair).subscribe( res => {
          console.log('Pair Response', x.currency, res, x.pair);
          // x.dpair = [];
          // const pdata = {name: '', value: []};
          // x.pair.map( p => {
          //   for (const pr of Object.keys(res)) {
          //     console.log(pr);
          //     // p = pr;
          //     // pdata.name = pr;
          //     // pdata.value = res[pr];
          //     // x.dpair.push(pdata);
          //   }
          // });
          x.dpair = res[x.currency];
          console.log('Pair', x);
        });
        this.onLoadPriceExchange( x.currency, Array.from(['USD', this.coin.name ])).subscribe(res => {
          console.log('DT', x.currency, '-', res);
          x.usd = res.USD;
          x.nvcoin = res[this.coin.name];
        });


      });

      this.loading = false;
      // console.log(this.dataPair);
    });

    // const tmp =  this.dataPair.map(x => {
    //   this.onLoadPrice(x.currency).subscribe(res => {
    //     console.log('DT', x.currency, '-', res);
    //     x.usd = res.USD;
    //   });
    // });

    // this.dataPair = [...tmp];
  }
}
