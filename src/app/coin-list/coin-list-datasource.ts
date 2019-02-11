import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map, tap } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { CryptoCompareCoin } from '../services/crypto-compare/crypto-compare-coin';
import { CryptoCompareService } from '../services/crypto-compare/crypto-compare.service';
import { Inject } from '@angular/core';

/**
 * Data source for the CoinList view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class CoinListDataSource extends DataSource<CryptoCompareCoin> {
  data: CryptoCompareCoin[] = [];
  constructor(
    private coinService: CryptoCompareService,
    private paginator: MatPaginator,
    private sort: MatSort) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<CryptoCompareCoin[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataObservable = this.coinService.coinlist()
      .pipe(
        tap(data => {
          // Set the data length
          this.data = data;
          // Set the paginator's length
          this.paginator.length = data.length;
         })
      );
    const dataMutations = [
      dataObservable,
      this.paginator.page,
      this.sort.sortChange
    ];

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: CryptoCompareCoin[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: CryptoCompareCoin[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'algorithm': return compare(a.algorithm, b.algorithm, isAsc);
        case 'coinName': return compare(a.coinName, b.coinName, isAsc);
        case 'name': return compare(a.name, b.name, isAsc);
        case 'rank': return compare(+a.sortOrder, +b.sortOrder, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
