import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoinVO } from '../vo/CoinVO';

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

  constructor(private _route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this._route.params.subscribe(params => {
      this.coin.name = params['coin'];
      });

      console.log(this.coin);
  }

}
