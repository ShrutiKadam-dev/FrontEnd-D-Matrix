
import { Component, inject, ViewChild } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CarouselModule } from 'primeng/carousel';
import { Table, TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { FeaturesService } from '../../features.service';

@Component({
  selector: 'app-aif',
  standalone: true,
  imports: [ InputTextModule, FormsModule, AutoCompleteModule, CarouselModule, TableModule,CardModule ,CommonModule],
  templateUrl: './aif.component.html',
  styleUrls: ['./aif.component.scss']
})



export class AifComponent {

  constructor(private router: Router) {}

 

  
  selectedAifName: any = null;
  filteredAifNames: any[] = [];
  allAifs: any[] = [];
  displayAifs: any[] = [];
  allAifContractNotes: any[] = [];

  @ViewChild('dt') dt!: Table;

  ngOnInit() {
    this.getAllAifEntities();
    this.getAllAifContractNotes()
  }
  
  private featuresService = inject(FeaturesService);

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
    this.router.navigate(['/features/equity/sub-aif', item.entityid]);
  }

  searchAifs(event: any) {
    const query = event.query?.toLowerCase() || '';
    this.filteredAifNames = this.allAifs.filter(mf =>
      mf.nickname?.toLowerCase().includes(query)
    );
  }

    scrollToAif(mf: any) {
    if (mf) {
      this.displayAifs = [mf]; // show only selected MF card in search mode
    }
  }

  clearSearch() {
    this.selectedAifName = null;
    this.displayAifs = [...this.allAifs]; // restore carousel items
  }
 
   getColor(nickname?: string) {
    const predefinedColors: { [key: string]: string } = {
      'MF1': '#FFD580',
      'MF2': '#FFB3B3',
      'MF3': '#B3E5FF'
    };

    if (nickname && predefinedColors[nickname]) {
      return predefinedColors[nickname];
    }

    // Generate random pastel color
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 85%)`;
  }

  getAllAifEntities() {
    this.featuresService.getAllAifEntities().subscribe({
      next: (res: any) => {
        this.allAifs = res?.data || [];
        this.allAifs.forEach(de => {
        de.color = this.getColor(de.subcategory);
      });
   
        this.displayAifs = this.allAifs
        console.log(this.displayAifs)
      },
      
      error: () => console.error('Failed to load Mutual Funds')
    }); 
    
  }

  getAllAifContractNotes(){

      this.featuresService.getAllAifContractNotes().subscribe({
        next:(res:any ) => {
          this.allAifContractNotes = res?.data || [];
          console.log(this.allAifContractNotes);
          
          
        },
        error: () => console.error('Failed to load Mutual Funds')
      })
  }

  onGlobalFilter(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (input && this.dt) {
      this.dt.filter(input.value, 'global', 'contains');
    }
  }


  

}
