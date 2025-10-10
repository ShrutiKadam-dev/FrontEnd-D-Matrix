import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { Table, TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { FeaturesService } from '../features.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { TooltipModule } from 'primeng/tooltip';
import { Location } from '@angular/common';

@Component({
  selector: 'app-equity',
  imports: [
    ButtonModule,
    TagModule,
    CalendarModule,
    TooltipModule,
    ChartModule,
    CommonModule,
    MessagesModule,
    AutoCompleteModule,
    MessageModule,
    TableModule,
    InputTextModule,
    CarouselModule,
    CardModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './equity.component.html',
  styleUrl: './equity.component.scss'
})
export class EquityComponent implements OnInit {
  selectedEquityName: any = null;
  filteredENames: any[] = [];
  allEs: any[] = [];
  displayEs: any[] = [];

  MFActionTableList: any[] = [];
  directEquityTableList:any[] = [];
  aifTableList:any[] = [];

        underlyingTableList: any[] = [];

  totalActionTableCount = 0;

    mcapChartData: any;
  mcapChartOptions: any;

    actionCounts: any = {};



  @ViewChild('dt') dt!: Table;
  constructor(private router: Router,private location: Location) { }


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
    this.getAllEntityHome();
    this.getEquityMCAPCount();
    this.getAllActionTableEquity() 
  }

  getEquityMCAPCount() {
    this.featuresService.getallMfEquityUnderlyingCount().subscribe({
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

  goBack(){
    this.location.back();
  }
  

  goToEquityDetails(e: any) {
    if (!e) return;

    switch (e.subcategory?.toLowerCase()) {
      case 'mutual fund':
        this.router.navigate(['/features/equity/mutual-funds']);
        break;

      case 'etf':
        this.router.navigate(['/features/equity/etf']);
        break;
        
      case 'direct equity':
        this.router.navigate(['/features/equity/direct-equity']);
        break;

      case 'alternative investment funds':
        this.router.navigate(['/features/equity/aif']);
        break;

      case 'pms':
        this.router.navigate(['/features/equity/PMS']);
        break;

      default:
        console.warn('Unknown subcategory, staying on page', e.subcategory);
        break;
    }

  }

  getAllEntityHome() {
    this.featuresService.getAllEntityHome().subscribe({
      next: (res: any) => {
        this.allEs = res?.data || [];
        // Assign colors once
        this.allEs.forEach(e => {
          e.color = this.getColor(e.subcategory);
        });
        this.displayEs = [...this.allEs]; // for carousel
      },
      error: () => console.error('Failed to load Mutual Funds')
    });
  }

  getAllActionTableEquity() {
  this.featuresService.getAllActionTableEquity().subscribe({
    next: (res: any) => {
      if (res && res.data) {
        const MFData = (res.data.action_data || []).map((item: any) => ({
          scrip_name: item.scrip_name,
          order_type: item.order_type,
          unit: item.unit || '-',
          order_date: item.order_date || '-',
          purchase_amount: item.purchase_amount || '-',
          source: 'Action'
        }));

        const aifData = (res.data.aif_data || []).map((item: any) => ({
          scrip_name: item.amc_name,
          order_type: 'AIF Contribution',
          unit: '-',
          order_date: '-',
          purchase_amount: item.contribution_amount,
          source: 'AIF'
        }));

        const equityData = (res.data.direct_equity_data || []).map((item: any) => ({
          scrip_name: 'Direct Equity',
          order_type: item.order_type,
          unit: '-',
          order_date: '-',
          purchase_amount: item.trade_price,
          source: 'Equity'
        }));

this.MFActionTableList = res.data.action_data;
this.aifTableList = res.data.aif_data;
this.directEquityTableList = res.data.direct_equity_data;
      }
    },
    error: (error) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Failed',
        detail: error.error?.message || 'Update failed'
      });
    }
  });
  }


  onGlobalFilter(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (input && this.dt) {
      this.dt.filter(input.value, 'global', 'contains');
    }
  }

  scrollToDE(e: any) {
    if (e) {
      this.displayEs = [e]; // show only selected DE card in search mode
    }
  }

  searchDEs(event: any) {
    const query = event.query?.toLowerCase() || '';
    this.filteredENames = this.allEs.filter(e =>
      e.nickname?.toLowerCase().includes(query)
    );
  }

  clearSearch() {
    this.selectedEquityName = null;
    this.displayEs = [...this.allEs]; // restore carousel items
  }

  getColor(subcategory?: string) {
    const predefinedColors: { [key: string]: string } = {
      'DE1': '#FFD580',
      'DE2': '#FFB3B3',
      'DE3': '#B3E5FF'
    };

    if (subcategory && predefinedColors[subcategory]) {
      return predefinedColors[subcategory];
    }

    // Generate random pastel color
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 85%)`;
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