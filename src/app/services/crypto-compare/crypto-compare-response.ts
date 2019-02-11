import { CryptoCompareCoin } from './crypto-compare-coin';
import { KeyValue } from '@angular/common';

export interface CryptoCompareResponse {
  baseImageUrl: string;
  baseLinkUrl: string;
  data: {[key: string]: CryptoCompareCoin};
  hasWarning: boolean;
  message: string;
  rateLimit: any;
  response: string;
  type: number;
}
