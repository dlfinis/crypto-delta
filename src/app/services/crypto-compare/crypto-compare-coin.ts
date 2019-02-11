export interface CryptoCompareCoin {
    id: number;
    url: string;
    imageUrl: string;
    name: string;
    symbol: string;
    coinName: string;
    fullName: string;
    algorithm: string;
    proofType: string;
    fullyPremined: string;
    totalCoinSupply: string;
    builtOn: string;
    smartContractAddress: string;
    preMinedValue: string;
    totalCoinsFreeFloat: string;
    sortOrder: number;
    sponsored?: boolean;
    isTrading?: boolean;
}
