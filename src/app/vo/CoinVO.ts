export class CoinVO {

    public name?: string;
    public id?: string;
    public url?: string;
    public imageUrl?: string;
    public symbol?: string;
    public trading?: boolean;
    public sortOrder?: number;

    public fill(name: any, id: string, url: string, image, symbol: string, sortOrder: string, trading: boolean) {
      this.id = id;
      this.imageUrl = image;
      this.url = url;
      this.trading = trading;
      this.sortOrder = parseInt(sortOrder, 10);
      this.symbol = symbol;

    }

}
