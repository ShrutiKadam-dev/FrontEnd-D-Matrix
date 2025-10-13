import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { FeaturesService } from '../../features.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Table } from 'primeng/table';


@Component({
  selector: 'app-pms',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  providers: [MessageService],
  templateUrl: './pms.component.html',
  styleUrl: './pms.component.scss'
})
export class PMSComponent implements OnInit {
  selectedPMSName: any = null;
  filteredPMSNames: any[] = [];
  allPMSs: any[] = [];
  displayPMSs: any[] = [];
  actionTableList: any[] = [];

  @ViewChild('dt') dt!: Table;
  constructor(private router: Router, private location: Location) { }

  private featuresService = inject(FeaturesService);
  private messageService = inject(MessageService);

  // Carousel responsive breakpoints
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

  ngOnInit() {
    this.getAllPMSEquity();
    this.getAllActionTable();
  }

  goBack(){
    this.location.back();
  }
  
  goToPMSDetails(pms: any) {
    this.router.navigate(['/features/equity/pms', pms.entityid]);
  }

  getAllPMSEquity() {
    this.featuresService.getAllPMSEquity().subscribe({
      next: (res: any) => {
        this.allPMSs = res?.data || [];
        this.allPMSs.forEach(pms => {
        pms.color = this.getColor(pms.subcategory);
      });
   
        this.displayPMSs = [...this.allPMSs]; // for carousel
      },
      error: () => console.error('Failed to load PMS Equity')
    });
  }

  getAllActionTable() {
    this.featuresService.getAllActionTableOfMutualFund().subscribe({
      next: (data: any) => {
        this.actionTableList = Array.isArray(data.data) ? data.data : [];
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: error.error?.message || 'Failed to load entities'
        });
      }
    });
  }


  scrollToPMS(pms: any) {
    if (pms) {
      this.displayPMSs = [pms]; // show only selected MF card in search mode
    }
  }

  searchPMSs(event: any) {
    const query = event.query?.toLowerCase() || '';
    this.filteredPMSNames = this.allPMSs.filter(pms =>
      pms.nickname?.toLowerCase().includes(query)
    );
  }

  clearSearch() {
    this.selectedPMSName = null;
    this.displayPMSs = [...this.allPMSs]; // restore carousel items
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

  onGlobalFilter(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (input && this.dt) {
      this.dt.filter(input.value, 'global', 'contains');
    }
  }

  
getSeverity(orderType: string) {
  switch (orderType?.trim()?.toUpperCase()) {
    case 'PURCHASE':
      return 'success';
    case 'SELL':
      return 'danger';
    default:
      return 'info';
  }
}

}


