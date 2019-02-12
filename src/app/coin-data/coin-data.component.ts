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
      this.dataPair = response;
      console.log(this.dataPair);
      Object.keys(this.dataPair.values()).map(pcoin => {
        console.log(pcoin);
        // console.log(pcoin.includes(coinName));
      });
      // this.ccService.getCoinsMarketPair(this.coin.name, this.dataPair).then(pair => {
      //   console.log(pair);
      // });
    });
    // console.log(this.dataPair);
  }
}
