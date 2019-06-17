export class PairCoinVO {

    public name?: string;
    public id?: string;
    public value?: Array<any>;

    public fill(name: any, id: string, value: Array<any>) {
      this.id = id;
      this.name = name;
      this.value = value;

    }
}
