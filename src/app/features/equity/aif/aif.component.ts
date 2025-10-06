
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
import { MessageService } from 'primeng/api';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-aif',
  standalone: true,
  imports: [ 
    InputTextModule,
    TagModule,
    TooltipModule,
     FormsModule, 
     AutoCompleteModule, 
     CarouselModule, 
     TableModule,
     CardModule,
     CommonModule,
     ChartModule
    ],
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

  underlyingTableList: any[] = [];
  sectorTableList: any[] = [];

  actionCounts: any = {};
  sectorCounts: any = {};

  mcapChartData: any;
  mcapChartOptions: any;
  sectorChartData: any;
  sectorChartOptions: any;

  @ViewChild('dt') dt!: Table;

  ngOnInit() {
    this.getAllAifEntities();
    this.getAllAifContractNotes();
    this.getAllMfEquitySectorCount();
    this.getallMfEquityUnderlyingCount();
  }
  
  private featuresService = inject(FeaturesService);
  private messageService = inject(MessageService);

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
  
  getallMfEquityUnderlyingCount() {
    this.featuresService.getAllAIFEquityUnderlyingCount().subscribe({
      next: (res: any) => {
        if (!res?.data?.length) {
          this.underlyingTableList = [];
          this.mcapChartData = null;
          return;
        }

        this.underlyingTableList = res.data;
        this.underlyingTableList.forEach((s, i) => {
          const hue = (i * 360) / this.underlyingTableList.length; // spread across 360°
          s.color = `hsl(${hue}, 70%, 50%)`;
        });

        const totalCount = res.data[0]?.total_tag_count || 0;

        // Dynamic actionCounts
        this.actionCounts = { total_count: totalCount };
        res.data.forEach((tagData: { tag: string; tag_count: number; overall_tag_percent: number }) => {
          const key = tagData.tag.toLowerCase().replace(/\s+/g, '_');
          this.actionCounts[`${key}_percent`] = tagData.overall_tag_percent || 0;
          this.actionCounts[`${key}_count`] = tagData.tag_count || 0;
        });

        // Dynamic chart colors
 
        this.mcapChartData = {
          labels: res.data.map((d: { tag: string }) => d.tag),
          datasets: [{
            data: res.data.map((d: { overall_tag_percent: number }) => d.overall_tag_percent),
            backgroundColor: this.underlyingTableList.map(s => s.color),
            hoverBackgroundColor: this.underlyingTableList.map(s => s.color)
          }]
        };

        this.mcapChartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: (context: any) => `${context.label}: ${context.raw?.toFixed(1) || 0}%`
              }
            }
          }
        };
      },
      error: (err) => this.messageService.add({
        severity: 'error',
        summary: 'Failed',
        detail: err.error?.message || 'Failed to load Mutual Fund chart'
      })
    });
  }

  getAllMfEquitySectorCount() {
    this.featuresService.getAllAIFEquitySectorCount().subscribe({
      next: (res: any) => {
        if (!res?.data?.length) {
          this.sectorTableList = [];
          this.sectorChartData = null;
          return;
        }

        this.sectorTableList = res.data;
        this.sectorTableList.forEach((s, i) => {
          const hue = (i * 360) / this.sectorTableList.length;
          s.color = `hsl(${hue}, 70%, 50%)`;
        });
        const totalCount = res.data[0]?.overall_tag_count || 0;
        this.sectorCounts = { total_count: totalCount };

        this.sectorChartData = {
          labels: this.sectorTableList.map(s => s.sector),
          datasets: [{
            data: this.sectorTableList.map(s => s.overall_tag_percent),
            backgroundColor: this.sectorTableList.map(s => s.color),
            hoverBackgroundColor: this.sectorTableList.map(s => s.color)
          }]
        };

        this.sectorChartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context: any) => `${context.label}: ${context.raw?.toFixed(1) || 0}%`
              }
            }
          }
        };
      },
      error: (err) => this.messageService.add({
        severity: 'error',
        summary: 'Failed',
        detail: err.error?.message || 'Failed to load Mutual Fund chart'
      })
    });
  }


}
