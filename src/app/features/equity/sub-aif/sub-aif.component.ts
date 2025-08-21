import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CarouselModule } from 'primeng/carousel';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { FeaturesService } from '../../features.service';


@Component({
  selector: 'app-sub-aif',
  imports: [ InputTextModule, FormsModule, AutoCompleteModule, CarouselModule, TableModule],
  templateUrl: './sub-aif.component.html',
  styleUrl: './sub-aif.component.scss'
})
export class SubAifComponent {

  aifId!: string;
  contractNote :any[]= [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.aifId = this.route.snapshot.paramMap.get('id')!; 
    this.getAllAifContractNotes()
    console.log('Param ID:', this.aifId);

  }


  private featuresService = inject(FeaturesService);  

  getAllAifContractNotes(){
    this.featuresService.getAllAifContractNotes().subscribe({
      next:(res:any ) => {
        const allNotes = res?.data || [];
        this.contractNote = allNotes.filter(
        (note: any) => note.entityid === this.aifId
      );

        console.log(this.contractNote);
        
         
      },
       error: () => console.error('Failed to load Mutual Funds')
    })
  }


underlyingTableList = [
    { id: 1, scripCode:'abc121', mCap:"mcap", weightage:12, scrip_name: 'ABC Ltd', unit: 100, purchase_amount: 5000 },
    { id: 2, scripCode:'abc122', mCap:"scap", weightage:14, scrip_name: 'XYZ Corp', unit: 50, purchase_amount: 2500 },
    { id: 3, scripCode:'abc123', mCap:"lcap", weightage:11, scrip_name: 'LMN Pvt', unit: 200, purchase_amount: 10000 },
    { id: 4, scripCode:'abc124', mCap:"scap", weightage:7, scrip_name: 'QRS Inc', unit: 75, purchase_amount: 3750 },
    { id: 5, scripCode:'abc125', mCap:"lcap", weightage:4, scrip_name: 'TUV Group', unit: 120, purchase_amount: 6000 }
  ];

  actionTableList = [
    { id: 1, scrip_name: 'ABC Ltd', unit: 100, order_date: '2025-08-10', order_type: 'Buy', purchase_amount: 5000 },
    { id: 2, scrip_name: 'XYZ Corp', unit: 50, order_date: '2025-08-11', order_type: 'Sell', purchase_amount: 2500 },
    { id: 3, scrip_name: 'LMN Pvt', unit: 200, order_date: '2025-08-12', order_type: 'Buy', purchase_amount: 10000 },
    { id: 4, scrip_name: 'QRS Inc', unit: 75, order_date: '2025-08-13', order_type: 'Sell', purchase_amount: 3750 },
    { id: 5, scrip_name: 'TUV Group', unit: 120, order_date: '2025-08-14', order_type: 'Buy', purchase_amount: 6000 }
  ];



}
