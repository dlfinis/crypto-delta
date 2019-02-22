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

  coin = new CoinVO;
  id: string;
  sub;
  bnb_coins;

  dataPair: any;
  dataChange: any;

  constructor(private _route: ActivatedRoute, private ccService: CryptoCompareService) {
   }

  ngOnInit() {
    this.sub = this._route.params.subscribe(params => {
      this.coin.name = params['coin'];

      });

      console.log(this.coin);
      this.onLoadCoins();
  }

  onLoadCoins() {
    this.ccService.getCoinsByExchange().then(x => {
      console.log(x);
    });
    this.ccService.getChangeCurrencyList(this.coin).then(response => {
      console.log(response);
    });

    this.ccService.getPairList(this.coin).then(response => {
      console.log(response);
    });
  }
}
