export class PairCoinVO {

    public name?: string;
    public id?: string;
    public value?: number;

    public fill(name: any, id: string, value: number) {
      this.id = id;
      this.name = name;
      this.value = value;

    }
}
