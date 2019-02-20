import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoinVO } from '../vo/CoinVO';
import { CryptoCompareService } from '../services/crypto-compare/crypto-compare.service';

@Component({
  selector: 'app-coin-data',
  templateUrl: './coin-data.component.html',
  styleUrls: ['./coin-data.component.scss']
})

export class CoinDataComponent implements OnInit {
  // @Input() coin: string;

  coin = new CoinVO();
  id: string;
  sub;
  bnb_coins;

  exchange: string = 'Binance';
  dataPair: any;

  constructor(private _route: ActivatedRoute, private ccService: CryptoCompareService) { }

  ngOnInit() {
    this.sub = this._route.params.subscribe(params => {
      this.coin.name = params['coin'];

      });

      console.log(this.coin);
      this.onLoadCoins();
  }

  onLoadCoins() {
    this.ccService.getCoinsByExchange(this.exchange).then( response => {
      // console.log(response);
      this.dataPair = Array.from(Object.keys(response), k => {

        return { currency: k , pair : response[k] };
      } );
      // console.log(Object.keys(response));
      // console.log(this.dataPair);

      // for (let key in this.dataPair) {
      //   console.log(key);
      // }
      // console.log(Object.getOwnPropertyNames(this.dataPair));
      // this.dataPair.forEach(element => {
      //   // console.log(element);

      // });
    //  this.dataPair.map(pcoin => {
    //     // console.log(pcoin);
    //     // console.log(pcoin.includes(coinName));
    //   });
      // this.ccService.getCoinsMarketPair(this.coin.name, this.dataPair).then(pair => {
      //   console.log(pair);
      // });
      const list = this.dataPair.filter( pcoin => {
          return pcoin.pair.includes(this.coin.name);
      });
      console.log(list);
    });
    // console.log(this.dataPair);
  }
}
