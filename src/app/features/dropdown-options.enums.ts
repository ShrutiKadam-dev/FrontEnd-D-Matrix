export interface DropdownOption {
  label: string;
  value: string;
}

export const CATEGORY_OPTIONS: DropdownOption[] = [
  { label: 'Equity', value: 'Equity' },
  { label: 'Fixed Income', value: 'Fixed_Income' },
  { label: 'Commodities', value: 'Commodities' },
];

export const ORDER_TYPE_OPTIONS: DropdownOption[] = [
  { label: 'Purchase', value: 'Purchase' },
  { label: 'Sell', value: 'Sell' },
];

export const PMS_ORDER_TYPE_OPTIONS: DropdownOption[] = [
  { label: 'Subscription', value: 'Subscription' },
  { label: 'Redemption', value: 'Redemption' },
];

export const MODE_OPTIONS: DropdownOption[] = [
  { label: 'Demat', value: 'Demat' },
];

export const ALL_SUBCATEGORY_OPTIONS: Record<string, DropdownOption[]> = {
  Equity: [
    { label: 'Direct Equity', value: 'Direct Equity' },
    { label: 'Mutual Fund', value: 'Mutual Fund' },
    { label: 'AIF', value: 'Alternative Investment Funds' },
    { label: 'ETF', value: 'ETF' },
    { label: 'Direct PE', value: 'Direct PE' },
    { label: 'PMS', value: 'PMS' },
  ],
  Fixed_Income: [
    { label: 'Direct Debt', value: 'Direct Debt' },
    { label: 'PMS', value: 'PMS' },
    { label: 'Direct Equity', value: 'Direct Equity' },
    { label: 'REIT', value: 'REIT' },
    { label: 'INVIT', value: 'INVIT' },
    { label: 'ETF', value: 'ETF' },
    { label: 'Mutual Fund', value: 'Mutual Fund' },
    { label: 'AIF', value: 'Alternative Investment Funds' },
    { label: 'Debentures', value: 'Debentures' },
  ],
  Commodities: [
    { label: 'ETF', value: 'ETF' },
    { label: 'Direct Equity', value: 'Direct Equity' },
    { label: 'Physical', value: 'Physical' },
    { label: 'AIF', value: 'Alternative Investment Funds' },
    { label: 'PMS', value: 'PMS' },
  ],
};
