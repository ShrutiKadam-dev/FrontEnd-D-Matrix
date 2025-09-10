export interface ActionTableField {
    key: string;
    label: string;
}

export const MF_ACTION_TABLE_FIELDS: ActionTableField[] = [
    { key: 'scrip_code', label: 'Scrip Code' },
    { key: 'mode', label: 'Mode' },
    { key: 'order_type', label: 'Order Type' },
    { key: 'order_date', label: 'Order Date' },
    { key: 'sett_no', label: 'Settelement no' },
    { key: 'scrip_name', label: 'Scrip Name' },
    { key: 'isin', label: 'ISIN' },
    { key: 'order_number', label: 'Order Number' },
    { key: 'folio_number', label: 'Folio Number' },
    { key: 'nav', label: 'NAV' },
    { key: 'stt', label: 'STT' },
    { key: 'unit', label: 'Unit' },
    { key: 'redeem_amount', label: 'Redeem Amount' },
    { key: 'purchase_amount', label: 'Purchase Amount' },
    { key: 'purchase_value', label: 'Purchase Value' },
    { key: 'cgst', label: 'CGST' },
    { key: 'sgst', label: 'SGST' },
    { key: 'ugst', label: 'UGST' },
    { key: 'igst', label: 'IGST' },
    { key: 'stamp_duty', label: 'Stamp Duty' },
    { key: 'cess_value', label: 'Cess Value' },
    { key: 'net_amount', label: 'Net Amount' },
]

export const DIRECT_EQUITY_ACTION_TABLE_FIELDS: ActionTableField[] = [
    { key: 'contract_note_number', label: 'Contract Note Number' },
    { key: 'trade_date', label: 'Trade Date' },
    { key: 'client_code', label: 'Client Code' },
    { key: 'client_name', label: 'Client Name' },
    { key: 'order_number', label: 'Order Number' },
    { key: 'order_time', label: 'Order Time' },
    { key: 'trade_number', label: 'Trade Number' },
    { key: 'description', label: 'Description' },
    { key: 'order_type', label: 'Order Type' },
    { key: 'qty', label: 'Quantity' },
    { key: 'trade_price', label: 'Trade Price' },
    { key: 'brokerage_per_unit', label: 'Brokerage / Unit' },
    { key: 'net_rate_per_unit', label: 'Net Rate / Unit' },
    { key: 'gst', label: 'GST' },
    { key: 'stt', label: 'STT' },
    { key: 'security_transaction_tax', label: 'Security Transaction Tax' },
    { key: 'exchange_transaction_charges', label: 'Exchange Transaction Charges' },
    { key: 'sebi_turnover_fees', label: 'SEBI Turnover Fees' },
    { key: 'stamp_duty', label: 'Stamp Duty' },
    { key: 'ipft', label: 'IPFT' },
    { key: 'net_total', label: 'Net Total' },
    { key: 'net_amount_receivable', label: 'Net Amount Receivable' }
]

export const ETF_ACTION_TABLE_FIELDS: ActionTableField[] = [
    { key: 'order_number', label: 'Order Number' },
    { key: 'order_time', label: 'Order Time' },
    { key: 'trade_number', label: 'Trade Number' },
    { key: 'trade_time', label: 'Trade Time' },
    { key: 'trade_date', label: 'Trade Date' },
    { key: 'security_description', label: 'Security / Contract Description' },
    { key: 'order_type', label: 'Order Type' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'gross_rate', label: 'Gross Rate / Trade price per unit' },
    { key: 'trade_price_per_unit', label: 'Trade price per unit' },
    { key: 'brokerage_per_unit', label: 'Brokerage per unit' },
    { key: 'net_rate_per_unit', label: 'Net rate per unit' },
    { key: 'closing_rate', label: 'Closing rate per unit (only for derivatives)' },
    { key: 'gst', label: 'GST' },
    { key: 'stt', label: 'STT' },
    { key: 'net_total_before_levies', label: 'Net Total before levies' },
    { key: 'remarks', label: 'Remarks' },
];

export const AIF_ACTION_TABLE_FIELDS: ActionTableField[] = [
    { key: 'trans_date', label: 'Transaction Date' },
    { key: 'trans_type', label: 'Transaction Type' },
    { key: 'contribution_amount', label: 'Contribution Amount' },
    { key: 'setup_expense', label: 'Setup Expense' },
    { key: 'stamp_duty', label: 'Stamp Duty' },
    { key: 'amount_invested', label: 'Amount Invested' },
    { key: 'post_tax_nav', label: 'Post-Tax Allotment/ Redemption NAV' },
    { key: 'num_units', label: 'Number of Units' },
    { key: 'balance_units', label: 'Balance Units' },
    { key: 'strategy_name', label: 'Strategy Name' },
    { key: 'amc_name', label: 'AMC Name' },
];

export const PMS_CLIENT_ACTION_TABLE_FIELDS: ActionTableField[] = [
    { key: 'trade_date', label: 'Trade Date' },
    { key: 'trade_price', label: 'Trade Price' },
    { key: 'cheque', label: 'Cheque' },
    { key: 'order_type', label: 'Order Type' },
]

export const PMS_AMC_ACTION_TABLE_FIELDS: ActionTableField[] = [
    { key: 'security_description', label: 'Security / Contract Description' },
    { key: 'order_type', label: 'Order Type' },
    { key: 'qty', label: 'Quantity' },
    { key: 'trade_price', label: 'Trade Price' },
    { key: 'net_total', label: 'Net Total' },
]