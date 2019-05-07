import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoinVO } from '../vo/CoinVO';
import { CryptoCompareService } from '../services/crypto-compare/crypto-compare.service';
import { LazyLoadEvent } from 'primeng/api';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable, of, concat, combineLatest, forkJoin, zip, timer, range, observable  } from 'rxjs';
import { flatMap, mergeMap, switchAll, delay, merge, switchMap, map, scan, filter, concatMap, finalize } from 'rxjs/operators';


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

  fnGetPriceMulti(coin: any, base: any) {
    console.log('onGetPriceMulti', coin, base);
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

  // fnGetChange(coin: any): Observable<any> {
  fnGetChange(coin: any) {

    const s1 = of('a', 'b', 'c', 'd');

    const s2 = of('x', 'y', 'z', '1', '2', '3');

    const observable = zip(
      of(1, 2, 3, 4).pipe(delay(100)),
      of('a', 'b', 'c', 'd'),
    );

      s1.pipe(st1 => {
        return s2.pipe(map(st2 => st2 + '' + st1));
      }).subscribe(x => {
        console.log(x);
      });

    observable.subscribe(
      value => console.log(value),
      err => {},
      () => console.log('This is how it ends!'),
    );


    const source$ = range(0, 10);

// source$.pipe(
//   filter(x => x % 2 === 0),
//   map(x => x + 1),
//   scan((acc, x) => acc + x, 0)
// )
// .subscribe(x => console.log(x))


    // s1.pipe(switchMap(c => timer(0, 30).pipe(map(v => v)))).subscribe(
    //   value => console.log(value),
    //   err => {},
    //   () => console.log('This is how it ends! switch'),
    // );



    // result$.subscribe(console.log);

      // const list = this.ccService.getChangeCurrencyList(coin);

      // series1$

  }

  fnGetBaseChanges(): Observable<any> {

  return Observable.create((observer) => {
    try {
      this.ccService.getChangeCurrencyList(this.coin).subscribe(response => {
        console.log('fnGetBaseChanges =>', response.length);
        this.fnGetBaseCurrency(response).subscribe(responseB => {
          observer.next(responseB);
        });
        observer.complete();
      });
    } catch (error) {
      observer.error(error);
    }
  });
  }

  fnGetBaseChangesList(coin: CoinVO): any {
    console.log('fnGetBaseChangesList');
    return this.ccService.getChangeCurrencyList(this.coin).pipe(
      concatMap(x => <Observable<any>> this.fnGetBaseCurrency(x)))
      .subscribe(x => coin.values = x);
  }

  fnGetPairChangesList(coin: CoinVO, event: LazyLoadEvent): any {
    console.log('fnGetPairChangesList');
    return  this.ccService.getPairList(this.coin).pipe(
    finalize(() => console.log('Sequence complete')))
    .subscribe(response => {
        this.onPagination(response, event);
        this.onProcessAddPricesList(this.dataPair);

        this.loading = false;
    });
 }


  onProcessAddPricesList(coinPairList: any) {
    console.log('onProcessAddPricesList');
    if (coinPairList !== undefined && coinPairList.length > 0) {

    return coinPairList.map(x => {
      this.fnGetPriceMulti(x.currency, x.pair).subscribe( pairRes => {
        console.log('Pair Response', x.currency, x.pair, pairRes);

        const pairItem = new Array();
        //console.log(pairRes);
        //console.log(pairRes[x.currency]);

        pairRes[x.currency].map(x => {
          console.log(x);
        });
        // for (const pr of (Object.keys(pairRes[x.currency]))) {
        //   pairItem.push(pr);
        // }
        // console.log(pairItem);

        // x.dpair = new Array();
        // pairItem.map(pitem => {

        //   this.fnGetPriceMulti(pitem, [this.base_coins]).subscribe( subPairRes => {
        //     x.dpair.push({item: {name: pitem , value: pairRes[x.currency][pitem] }, value: subPairRes[pitem]});
        //     return subPairRes[pitem];
        //     });

        // });

        // console.log(x.dpair);

      });
    });
  }
  }

  onPagination(dataList: any, event: LazyLoadEvent) {

    if (dataList.length > 0) {
      this.totalRecords = dataList.length;
      this.dataPair = dataList.slice(event.first, (event.first + event.rows));
    } else {
      this.totalRecords = this.coin.values.length;
      this.dataPair = this.coin.values.slice(event.first, (event.first + event.rows));
    }

  }
  onGetSubPair(){

  }
  onLoadCoins(event: LazyLoadEvent) {
    console.log('onLoadCoins');
    this.loading = true;
      console.log('Coin:', this.coin);

      const execData = concat(
        this.fnGetBaseChangesList(this.coin),
        this.fnGetPairChangesList(this.coin, event)
      );


  }
}
