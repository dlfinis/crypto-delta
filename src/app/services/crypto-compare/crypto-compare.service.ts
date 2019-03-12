// declare var require: any;

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CryptoCompareCoin } from './crypto-compare-coin';
import { CryptoCompareResponse } from './crypto-compare-response';
import { map, filter } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import * as cc from 'cryptocompare';
import { CoinVO } from 'src/app/vo/CoinVO';



@Injectable({
  providedIn: 'root'
})
export class CryptoCompareService {

  apiKey = 'csvD7jjmJaMCF6YQTqoszfx0ttK8MaytggUPpKcCdqCu9Q26fgsJdGzhAlFy25wp';
  secretKey = '0Y39GrxdKBGauMAsRaovu6KNxxc2TwgxFc9gtkPJD607HNd1om2oA86X55ZTade1';
  bnb: any;

  cc_apiKey = 'beeb038811986b65e5979dab7e855c5bdc7d8ce9dafa891c181ebefe88065150';
  dataList: any;
  dataExchangeList: any;
  dataCoinsExchange: any = [];

  exchange: any;
  constructor(private httpClient: HttpClient) {
     cc.setApiKey(cc);
     this.exchange = 'Binance';
  }

  getPrice(coin: String, base: String): Observable<any>  {
    console.log('getPrice:', coin, ' to ', base);
    const data = from(cc.price(coin, base));
    return data.pipe( map(x => x));
  }

  getPriceExchange(coin: String, base: any[]): Observable<any>  {
    console.log('getPrice:', coin, ' to ', base, 'from', this.exchange);
    const data = from(cc.price(coin, base, Array.from(this.exchange)));
    return data.pipe( map(x => x));
  }

  getPriceMultiExchange(coin: any[], base: any[]): Observable<any>  {
    // console.log('getMultiPrice:', coin, ' to ', base, 'from', this.exchange);
    const data = from(cc.priceMulti(coin, base, Array.from(this.exchange)));
    return data.pipe( map(x => x));
  }

  getChangeCurrencyList(coin: CoinVO) {
    console.log('getChangeCurrencyList');
    console.log(this.dataExchangeList.length);
    return this.getCoinsByExchange(this.exchange).then( response => {
      return response[coin.name];
    });
  }

  getPairList(coin: CoinVO): Observable<any> {
    return from(this.getCoinsByExchange(this.exchange)).pipe( map(response => {
      const dataPair = Array.from(Object.keys(response), k => {
        return { currency: k , pair : response[k] };
      } );
      const list = dataPair.filter( pcoin => {
          return pcoin.pair.includes(coin.name);
      });
      return list;
    }));
  }

 scoinlist(): Observable<any> {
    const data = from(cc.coinList());

    return data.pipe(map(x => this.convertKeysToKebabCase(x)),
      filter(
            (x: CryptoCompareResponse) => x.response.toLowerCase() === 'success'),
          map(x =>
            Object.values(x.data)
              .filter(y => y.sortOrder <= 4000)
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map(y => {
                y.imageUrl = x.baseImageUrl + y.imageUrl;
                return y;
              })
          )
        );

      }

  coinlist(): Observable<CryptoCompareCoin[]> {
    return this.httpClient
      .get('https://min-api.cryptocompare.com/data/all/coinlist')
      .pipe(
        map(x => this.convertKeysToKebabCase(x)),
        filter(
          (x: CryptoCompareResponse) => x.response.toLowerCase() === 'success'),
        map(x =>
          Object.values(x.data)
            .filter(y => y.sortOrder <= 100)
            // sort list
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map(y => {
              y.imageUrl = x.baseImageUrl + y.imageUrl;
              return y;
            })
        )
      );
  }

  private convertKeysToKebabCase(obj) {
    const output = {};
    for (const i in obj) {
      if (Object.prototype.toString.apply(obj[i]) === '[object Object]') {
        output[
          i.substr(0, 1).toLowerCase() + i.substr(1)
        ] = this.convertKeysToKebabCase(obj[i]);
      } else if (Object.prototype.toString.apply(obj[i]) === '[object Array]') {
        output[i.substr(0, 1).toLowerCase() + i.substr(1)] = [];
        output[i.substr(0, 1).toLowerCase() + i.substr(1)].push(
          this.convertKeysToKebabCase(obj[i][0])
        );
      } else {
        output[i.substr(0, 1).toLowerCase() + i.substr(1)] = obj[i];
      }
    }
    // console.log(output);
    return output;
  }

  getCoinsByExchange(exchange: string) {

    // console.log(Object.keys(this.dataExchangeList));
    // if (Object.keys(this.dataExchangeList).length > 1) {
    //   return this.dataExchangeList;
    // }

    return this.dataExchangeList = cc.exchangeList().then( exc => {
      console.log('Get Data from:' + exchange);
      const data = Object.keys(exc)
      .filter(key => exchange === key)
      .reduce((obj, key) => {
        const rObj = { };
        rObj[key] = exc[key];
        return rObj;
      }, {});
      // console.log(data);
      this.dataCoinsExchange = data[exchange];
      return data[exchange];
    });

  }

}
