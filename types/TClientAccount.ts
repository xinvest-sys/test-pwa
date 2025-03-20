export type TClientAccount = {
  id: string;
  platform: "IG" | "IBKR";
  platformAccountId: string;
  country: "AU" | "SG";
  currencyCode: "SGD" | "AUD" | "USD";
  isDemo: boolean;
  apiKey: string;
  userName: string;
  password: string;
  isActive: boolean;
};