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

  value_exp = 0.004762;
  percent_comp = 0.5;

  base_coins = ['ETH', 'BCH', 'BNB', 'BTC', 'PAX', 'USDC', 'USDT', 'TUSD', 'USD'];

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
      .subscribe(x => coin.baseValues = x);
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

  fnIsGreaterThat(value: number, comp: number) {
    if (comp) {
      // const pr_comp = (comp * this.percent_comp) + comp;
      const pr_comp = (comp * (this.percent_comp / 100)) + comp;
      if (value >= pr_comp) {
        return true;
      } else {
        return false;
      }
    }
  }

  fnCalculate(value_exp: number, value_coin: number, value_pair_conv: number, value_pair: number) {
    const result = (value_exp * value_coin * value_pair_conv) * value_pair;
    return result;
  }

  onProcessAddPricesList(coinPairList: any) {

    console.log('==== onProcessAddPricesList ===', coinPairList);
    if (coinPairList !== undefined && coinPairList.length > 0) {

      this.coin.values = {};
    return coinPairList.map(coin => {
      this.fnGetPriceMulti(coin.currency, coin.pair).subscribe( pairRes => {
        console.log('----- Pair Response',
        '\nCurrency: ', coin.currency,
        '\nPair :', coin.pair,
        '\nPairRes :', pairRes,
        '\n------');

        coin.pair.unshift('USD');


      this.onLoadPrice(this.coin.name, coin.currency).subscribe(res => {
        console.log(this.coin.name, res, this.value_exp * res[coin.currency]);
        this.coin.values[coin.currency] = res[coin.currency];
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

                  this.onLoadPrice(coin.currency, pairName).subscribe(res => {
                    console.log(coin.currency, pairName, res);
                    objItem.conversion = res[pairName];
                    pairItems.push(objItem);
                  });

                });
                coin.values = pairItems;
                console.log(coin);
                console.log(this.coin);

            });

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
