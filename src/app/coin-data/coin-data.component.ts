import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoinVO } from '../vo/CoinVO';
import { CryptoCompareService } from '../services/crypto-compare/crypto-compare.service';
import { LazyLoadEvent } from 'primeng/api';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable, of, concat, combineLatest, forkJoin, zip, timer, range, observable  } from 'rxjs';
import { flatMap, mergeMap, switchAll, delay, merge, switchMap, map, scan, filter, concatMap, finalize } from 'rxjs/operators';
import { PairCoinVO } from '../vo/PairCoinVO';


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

  value_exp = 0.076;

  base_coins = ['USD', 'BNB', 'BTC', 'ETH', 'USDC', 'USDT', 'PAX', 'TUSD'];

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
  }

  fnGetPriceMulti(coin: any, base: any) {
    console.log('onGetPriceMulti', coin, base);
    return this.ccService.getPriceMultiExchange(coin, base);

  }

  onLoadPrice(coin: string, base: string) {
    return this.ccService.getPrice(coin, base);
  }

  onLoadPriceExchange(coin: string, base: any[]) {
    console.log('--- onLoadPriceExchange --- ', coin, base);
    return this.ccService.getPriceExchange(coin, base);
  }

  fnListRemovedElement(list: any, nameElement) {
    const blist = list;
      blist.splice(blist.indexOf(nameElement), 1);
      return blist;
  }

  fnGetBaseCurrency(baseCoins: any) {
      return this.onLoadPriceExchange(this.coin.name,
        this.fnListRemovedElement(this.base_coins, this.coin.name));
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
    console.log('=== fnGetBaseChangesList ===');
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

  fnGetKeys(array: any) {
    return Object.keys(array);
  }

  onProcessAddPricesList(coinPairList: any) {
    console.log('==== onProcessAddPricesList ===', coinPairList);
    if (coinPairList !== undefined && coinPairList.length > 0) {

    return coinPairList.map(coin => {
      this.fnGetPriceMulti(coin.currency, coin.pair).subscribe( pairRes => {
        console.log('----- Pair Response',
        '\nCurrency: ', coin.currency,
        '\nPair :', coin.pair,
        '\nPairRes :', pairRes,
        '\n------');

        coin.pair.unshift('USD');

        this.fnGetPriceMulti(coin.currency, coin.pair).subscribe(response => {
          coin.value = response[coin.currency];
          //console.log('---- Data Base ', response);
        });

        const pairItems = new Array();

        const pairList = Object.keys(pairRes[coin.currency]);

        // console.log('--- PairList *---', pairList);
        const pData = of(pairList).pipe(
          concatMap(pairCoin => <Observable<any>> this.fnGetPriceMulti(pairCoin, [this.base_coins])));

          const pDataAll = of(pairList).pipe(
            mergeMap(pairCoin => <Observable<any>> this.fnGetPriceMulti(pairCoin, [this.base_coins])));

            pDataAll.subscribe(pairs => {
              //  console.log(pairs);
                pairList.forEach(pairName =>  {
                  const objItem = new PairCoinVO();

                  delete pairs[pairName][pairName];

                  const dataPairs = Object.keys(pairs[pairName])
                   .map(kdata => {
                    return { [kdata] : pairs[pairName][kdata]};
                  });


                  objItem.fill(pairName, null, pairs[pairName]);
                  pairItems.push(objItem);
                });
                coin.values = pairItems;
                console.log(coin);
            });

        // pData.subscribe(item => {
        //   // item.sub
        //   // const objItem = new PairCoinVO();
        //   // objItem.fill(item, null, pairRes[coin.currency]);
        //   console.log('pData: From', coin.currency, ' To:', item);

        //   pairList.forEach(pairName =>  {
        //     const objItem = new PairCoinVO();
        //     objItem.fill(pairName, null, item[pairName]);
        //     console.log('-- pairList Values', objItem);
        //   });

        // });




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
  onGetSubPair() {

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
