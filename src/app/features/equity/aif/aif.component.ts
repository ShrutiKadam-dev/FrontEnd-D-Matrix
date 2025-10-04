
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
import { TooltipModule } from 'primeng/tooltip';
import { Location } from '@angular/common';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-aif',
  standalone: true,
  imports: [ InputTextModule,
    TagModule,TooltipModule, FormsModule, AutoCompleteModule, CarouselModule, TableModule,CardModule ,CommonModule],
  templateUrl: './aif.component.html',
  styleUrls: ['./aif.component.scss']
})

export class AifComponent {

  constructor(private router: Router, private location: Location) {}
  
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

  goBack(){
    this.location.back();
  }

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
      
      error: () => console.error('Failed to load AIF')
    }); 
    
  }

  getAllAifContractNotes(){
      this.featuresService.getAllAifContractNotes().subscribe({
        next:(res:any ) => {
          this.allAifContractNotes = res?.data || [];          
        },
        error: () => console.error('Failed to load AIF')
      })
  }

  onGlobalFilter(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (input && this.dt) {
      this.dt.filter(input.value, 'global', 'contains');
    }
  }

    getSeverity(orderType: string) {
    switch (orderType?.trim()?.toUpperCase()) {
      case 'SUBSCRIPTION': return 'success';
      case 'REDEMPTION': return 'danger';
      default: return 'info';
    }
  }
  

}
