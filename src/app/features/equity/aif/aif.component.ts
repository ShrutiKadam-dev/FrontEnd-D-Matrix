
import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CarouselModule } from 'primeng/carousel';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aif',
  standalone: true,
  imports: [ InputTextModule, FormsModule, AutoCompleteModule, CarouselModule, TableModule ],
  templateUrl: './aif.component.html',
  styleUrls: ['./aif.component.scss']
})



export class AifComponent {

  constructor(private router: Router) {}

   actionTableList = [
    { id: 1, scrip_name: 'ABC Ltd', unit: 100, order_date: '2025-08-10', order_type: 'Buy', purchase_amount: 5000 },
    { id: 2, scrip_name: 'XYZ Corp', unit: 50, order_date: '2025-08-11', order_type: 'Sell', purchase_amount: 2500 },
    { id: 3, scrip_name: 'LMN Pvt', unit: 200, order_date: '2025-08-12', order_type: 'Buy', purchase_amount: 10000 },
    { id: 4, scrip_name: 'QRS Inc', unit: 75, order_date: '2025-08-13', order_type: 'Sell', purchase_amount: 3750 },
    { id: 5, scrip_name: 'TUV Group', unit: 120, order_date: '2025-08-14', order_type: 'Buy', purchase_amount: 6000 }
  ];

    aifList = [
    {id:1, name: 'AIF One', value: '₹1,00,000', entityId: 'ENT-001' },
    {id:2, name: 'AIF Two', value: '₹2,50,000', entityId: 'ENT-002' },
    {id:3, name: 'AIF Three', value: '₹3,75,000', entityId: 'ENT-003' },
    {id:4, name: 'AIF Four', value: '₹4,50,000', entityId: 'ENT-004' },
    {id:5, name: 'AIF Five', value: '₹5,00,000', entityId: 'ENT-005' }
  ];

    responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];  

   goToAif(item: any) {
    // Navigate to /aif/:id
    console.log(item);
    
    this.router.navigate(['/features/equity/sub-aif', item.id]);
  }


  

}
