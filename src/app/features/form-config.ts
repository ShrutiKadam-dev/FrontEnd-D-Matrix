import { FormBuilder, Validators, FormGroup } from '@angular/forms';

export class FormConfig {
  constructor(private fb: FormBuilder) { }

  // ---------- Entity form ----------
  entityForm(): FormGroup {
    return this.fb.group({
      scripname: ['', Validators.required],
      scripcode: ['', Validators.required],
      nickname: [''],
      benchmark_name: [''],
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
      isin: ['', Validators.required],
      aifCategory: [{ value: '', disabled: true }],  
      aifClass: [{ value: '', disabled: true }]      
    });
  }

  // ---------- NAV ----------
  navFormAIF(): FormGroup {
    return this.fb.group({
      entityid: ['', Validators.required],
      pre_tax_nav: ['', Validators.required],
      post_tax_nav: ['', Validators.required],
      nav_date: ['', Validators.required],
    });
  }

  navFormMF(): FormGroup {
    return this.fb.group({
      entityid: ['', Validators.required],
      nav_date: ['', Validators.required],
      nav: ['', Validators.required],
    });
  }


  automationForm(): FormGroup {
    return this.fb.group({
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
      file: [null, Validators.required],
    });
  }

  // ---------- AIF Action ----------
  aifActionTableForm(): FormGroup {
    return this.fb.group({
      trans_date: ['', Validators.required],
      trans_type: ['', Validators.required],
      contribution_amount: ['', Validators.required],
      setup_expense: [''],
      stamp_duty: [''],
      price: [''],
      post_tax_nav: [''],
      num_units: ['', Validators.required],
      balance_units: [''],
      strategy_name: [''],
      amc_name: [''],
      entityid: ['', Validators.required],
    });
  }

  // ---------- MF Action ----------
  mfActionTableForm(): FormGroup {
    return this.fb.group({
      scrip_code: ['', Validators.required],
      mode: ['', Validators.required],
      order_type: ['', Validators.required],
      order_date: [new Date(), Validators.required],
      sett_no: ['', Validators.required],
      scrip_name: ['', Validators.required],
      isin: ['', Validators.required],
      order_number: ['', Validators.required],
      folio_number: ['', Validators.required],
      nav: ['', Validators.required],
      stt: ['', Validators.required],
      unit: ['', Validators.required],
      redeem_amount: ['', Validators.required],
      purchase_amount: ['', Validators.required],
      purchase_value: [{ value: '', disabled: true }, Validators.required],
      cgst: ['', Validators.required],
      sgst: ['', Validators.required],
      ugst: ['', Validators.required],
      igst: ['', Validators.required],
      stamp_duty: ['', Validators.required],
      cess_value: ['', Validators.required],
      net_amount: ['', Validators.required],
      entityid: ['', Validators.required],
    });
  }

  // ---------- Direct Equity Action ----------
  directEquityActionTableForm(): FormGroup {
    return this.fb.group({
      contract_note_number: ['', Validators.required],
      trade_date: ['', Validators.required],
      client_code: ['', Validators.required],
      client_name: ['', Validators.required],
      order_number: ['', Validators.required],
      order_time: [
        '',
        [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)],
      ],
      trade_number: ['', Validators.required],
      description: [''],
      order_type: ['', Validators.required],
      qty: ['', Validators.required],
      trade_price: ['', Validators.required],
      brokerage_per_unit: ['', Validators.required],
      net_rate_per_unit: ['', Validators.required],
      gst: [''],
      stt: [''],
      security_transaction_tax: [''],
      exchange_transaction_charges: [''],
      sebi_turnover_fees: [''],
      stamp_duty: [''],
      ipft: [''],
      net_total: [{ value: '', disabled: true }, Validators.required],
      net_amount_receivable: ['', Validators.required],
      entityid: ['', Validators.required],
    });
  }

  // ---------- ETF Action ----------
  etfActionTableForm(): FormGroup {
    return this.fb.group({
      order_number: ['', Validators.required],
      order_time: [
        '',
        [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)],
      ],
      trade_number: ['', Validators.required],
      trade_time: [
        '',
        [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)],
      ],
      trade_date: ['', Validators.required],
      security_description: ['', Validators.required],
      order_type: ['', Validators.required],
      quantity: ['', Validators.required],
      gross_rate: ['', Validators.required],
      trade_price_per_unit: ['', Validators.required],
      brokerage_per_unit: ['', Validators.required],
      net_rate_per_unit: ['', Validators.required],
      closing_rate: ['', Validators.required],
      gst: ['', Validators.required],
      stt: ['', Validators.required],
      net_total_before_levies: ['', Validators.required],
      remarks: ['', Validators.required],
      entityid: ['', Validators.required],
    });
  }

  pmsClientActionForm(): FormGroup {
    return this.fb.group({
      trade_date: ['', Validators.required],
      pms_order_type: ['', Validators.required],
      price: [''],
      cheque: ['', Validators.required],
      entityid: ['', Validators.required],
    })
  }

  pmsAmcForm(): FormGroup {
    return this.fb.group({
      scrip_name: ['', Validators.required],
      scrip_code: ['', Validators.required],
      order_type: [null, Validators.required],
      quantity: ['', Validators.required],
      trade_price: ['', Validators.required],
      net_amount: ['', Validators.required],
      entityid: ['', Validators.required],
    })
  }

}
