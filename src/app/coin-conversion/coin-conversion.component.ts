import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CryptoCompareService } from '../services/crypto-compare/crypto-compare.service';
import { CoinVO } from '../vo/CoinVO';

@Component({
  selector: 'app-coin-conversion',
  templateUrl: './coin-conversion.component.html',
  styleUrls: ['./coin-conversion.component.scss'],
  providers: [CryptoCompareService]
})
export class CoinConversionComponent implements OnInit {

  coin = new CoinVO;
  constructor(private _route: ActivatedRoute, private ccService: CryptoCompareService) { }

  ngOnInit() {
   this._route.params.subscribe(params => {
      this.coin.name = params['coin'];
  });
  }

}
