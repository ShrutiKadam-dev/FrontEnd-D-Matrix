import { Component } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-aif',
  imports: [CarouselModule, CardModule, AutoCompleteModule],
  templateUrl: './aif.component.html',
  styleUrl: './aif.component.scss'
})
export class AifComponent {

    aifList = [
    { name: 'AIF One', value: '₹1,00,000', entityId: 'ENT-001' },
    { name: 'AIF Two', value: '₹2,50,000', entityId: 'ENT-002' },
    { name: 'AIF Three', value: '₹3,75,000', entityId: 'ENT-003' },
    { name: 'AIF Four', value: '₹4,50,000', entityId: 'ENT-004' },
    { name: 'AIF Five', value: '₹5,00,000', entityId: 'ENT-005' }
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

}
