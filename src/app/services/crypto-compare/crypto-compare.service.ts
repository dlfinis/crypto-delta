// declare var require: any;

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CryptoCompareCoin } from './crypto-compare-coin';
import { CryptoCompareResponse } from './crypto-compare-response';
import { map, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as cc from 'cryptocompare';

@Injectable({
  providedIn: 'root'
})
export class CryptoCompareService {

  apiKey = 'csvD7jjmJaMCF6YQTqoszfx0ttK8MaytggUPpKcCdqCu9Q26fgsJdGzhAlFy25wp';
  secretKey = '0Y39GrxdKBGauMAsRaovu6KNxxc2TwgxFc9gtkPJD607HNd1om2oA86X55ZTade1';
  bnb: any;

  cc_apiKey = 'beeb038811986b65e5979dab7e855c5bdc7d8ce9dafa891c181ebefe88065150';
  constructor(private httpClient: HttpClient) {
     cc.setApiKey(cc);
  }


  getCoinList() {
   cc.coinList().then(coin => {
     console.log('Get coins', coin);
   });
  }

  coinlist(): Observable<CryptoCompareCoin[]> {
    return this.httpClient
      .get('https://min-api.cryptocompare.com/data/all/coinlist')
      .pipe(
        map(x => this.convertKeysToKebabCase(x)),
        filter(
          (x: CryptoCompareResponse) => x.response.toLowerCase() === 'success'
        ),
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
    return output;
  }
}
