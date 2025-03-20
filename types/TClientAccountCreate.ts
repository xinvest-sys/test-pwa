import { TClientAccount } from "./TClientAccount";

export type TClientAccountCreate = Omit<TClientAccount, 'id' | 'currencyCode' |'isActive'>;
