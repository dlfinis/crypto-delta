import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoinVO } from '../vo/CoinVO';
import { CryptoCompareService } from '../services/crypto-compare/crypto-compare.service';
import { LazyLoadEvent } from 'primeng/api';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-coin-data',
  templateUrl: './coin-data.component.html',
  styleUrls: ['./coin-data.component.scss'],
  providers: [CryptoCompareService],
  animations: [
    trigger('rowExpansionTrigger', [
        state('void', style({
            transform: 'translateX(-10%)',
            opacity: 0
        })),
        state('active', style({
            transform: 'translateX(0)',
            opacity: 1
        })),
        transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
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

  value_exp = 0;

  base_coins = ['USD', 'BNB', 'ETH', 'USDC', 'USDT', 'PAX', 'TUSD'];

  constructor(private _route: ActivatedRoute, private ccService: CryptoCompareService) {
   }

  ngOnInit() {
    this.sub = this._route.params.subscribe(params => {
      this.coin.name = params['coin'];
      });

      // console.log(this.coin);

      this.displayedColumns = ['currency', 'pair', 'value'];
      this.loading = true;



      // this.onLoadPrice(this.coin.name, 'BTC').subscribe(res => {
      //   this.coin.btc = res.BTC;
      // });

      // this.onLoadPrice(this.coin.name, 'BNB').subscribe(res => {
      //   this.coin.bnb = res.BNB;
      // });

      // this.onLoadPrice(this.coin.name, 'USDC').subscribe(res => {
      //   this.coin.usdc = res.USDC;
      // });

      // this.onLoadPrice(this.coin.name, 'USDT').subscribe(res => {
      //   this.coin.usdt = res.USDT;
      // });

      // console.log(this.coin);

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

  fnGetBaseCurrency(baseCoins: any) {
      return this.onLoadPriceExchange(this.coin.name, baseCoins || this.base_coins);
  }

  fnGetChange(coin: any): Observable<any> {

    return Observable.create(function(observer) {
      this.ccService.getChangeCurrencyList(coin).then(response => {
      console.log('fnGetBaseCurrency', response);

      return this.fnGetBaseCurrency(response).subscribe(responseB => {
        coin['values'] = responseB;
        this.onLoadPrice(coin.name, 'USD').subscribe(res => {
          console.log(res);
          coin['values']['USD'] =  res.USD;
          observer.next(coin);
        });

      });

    });
  });
  }



  onLoadCoins(event: LazyLoadEvent) {
    console.log('onLoadCoins');
    this.loading = true;
    // this.ccService.getCoinsByExchange('Binance').then(x => {
      //   console.log(x);
      // });
      console.log('Coin:', this.coin);

      const f1 = this.fnGetChange(this.coin).subscribe(res => {
        return res;
      });
      // const cnt = this.fnCoin();
      // console.log(cnt);

    // this.ccService.getChangeCurrencyList(this.coin).then(response => {
    //   console.log('fnGetBaseCurrency', response);
    //   this.fnGetBaseCurrency(response).subscribe(responseB => {
    //     // console.log(responseB);
    //     this.coin['values'] = responseB;
    //     // Object.keys(responseB).map(rB => {
    //     //   this.coin['values'] = responseB[rB];
    //     // });
    //     this.onLoadPrice(this.coin.name, 'USD').subscribe(res => {
    //       console.log(res);
    //       this.coin['values']['USD'] =  res.USD;
    //     });

    //   });

    //   console.log('Fill Coin Base', this.coin);
    // });

    // console.log('getPairList');
    // // this.ccService.getPairList(this.coin).subscribe(response => {
    // //   // this.dataPair = response;
    // //   console.log('getPairList', response);
    // //   this.totalRecords = response.length;
    // //   this.dataPair = response.slice(event.first, (event.first + event.rows));


    // // });

    // this.ccService.getPairList(this.coin).subscribe(response => {
    //   // this.dataPair = response;
    //   console.log(response);

    //   if (response.length > 0) {
    //     this.totalRecords = response.length;
    //     this.dataPair = response.slice(event.first, (event.first + event.rows));
    //   } else {
    //     this.totalRecords = this.coin.values.length;
    //     this.dataPair = this.coin.values.slice(event.first, (event.first + event.rows));
    //   }

    //   this.dataPair.map(x => {
    //     // this.onLoadPrice(x.currency, 'USD').subscribe(res => {
    //     //   console.log('DT', x.currency, '-', res);
    //     //   x.usd = res.USD;
    //     //   // console.log('DT', x);
    //     // });

    //     // x.pair.splice( x.pair.indexOf(this.coin.name), 1 );
    //     // this.onGetPriceMulti(x.currency, ['USD', this.coin.name ]).subscribe( res => {
    //     this.onGetPriceMulti(x.currency, x.pair).subscribe( pairRes => {
    //       console.log('Pair Response', x.currency, pairRes, x.pair);

    //       // x.dpair = [];
    //       // const pdata = {name: '', value: []};
    //       // x.pair.map( p => {
    //       //   for (const pr of Object.keys(res)) {
    //       //     console.log(pr);
    //       //     // p = pr;
    //       //     // pdata.name = pr;
    //       //     // pdata.value = res[pr];
    //       //     // x.dpair.push(pdata);
    //       //   }
    //       // });

    //       const pairItem = new Array();

    //       for (const pr of (Object.keys(pairRes[x.currency]))) {
    //         pairItem.push(pr);
    //       }

    //       x.dpair = new Array();
    //       pairItem.map(pitem => {
    //         // console.log(pitem);
    //         this.onGetPriceMulti(pitem, [this.base_coins]).subscribe( subPairRes => {
    //           x.dpair.push({item: {name: pitem , value: pairRes[x.currency][pitem] }, value: subPairRes[pitem]});
    //           return subPairRes[pitem];
    //           });
    //       });

    //       //  for (const pr of (Object.keys(res[x.currency]))) {
    //       //   alfa = this.onGetPriceMulti(pr, ['USD,BTC,BNB,ETH']).subscribe( pres => {
    //       //     return pres;
    //       //   });
    //       // }
    //       // const dtp = res[x.currency].map(xres => {
    //       //   console.log(xres);
    //       // });


    //     });
    //     this.onLoadPriceExchange( x.currency, Array.from(['USD', this.coin.name ])).subscribe(res => {
    //       console.log('DT', x.currency, '-', res);
    //       x.usd = res.USD;
    //       x.nvcoin = res[this.coin.name];
    //     });


    //     console.log(x);

    //   });

    //   this.loading = false;
    // });

    // const tmp =  this.dataPair.map(x => {
    //   this.onLoadPrice(x.currency).subscribe(res => {
    //     console.log('DT', x.currency, '-', res);
    //     x.usd = res.USD;
    //   });
    // });

    // this.dataPair = [...tmp];
  }
}
