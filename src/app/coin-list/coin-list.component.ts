import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { CoinListDataSource } from './coin-list-datasource';
import { CryptoCompareService } from '../services/crypto-compare/crypto-compare.service';

@Component({
  selector: 'app-coin-list',
  templateUrl: './coin-list.component.html',
  styleUrls: ['./coin-list.component.scss'],
})
export class CoinListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: CoinListDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['rank', 'logo', 'name', 'coinName', 'algorithm'];

  constructor(
    private coinService: CryptoCompareService,
  ) {}
  ngOnInit() {
    this.coinService.getCoinList();
    this.dataSource = new CoinListDataSource(this.coinService, this.paginator, this.sort);
  }
}
