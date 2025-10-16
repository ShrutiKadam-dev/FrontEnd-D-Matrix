import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { FeaturesService } from '../features.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  providers: [MessageService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  selectedInstrumentName: any = null;
  filteredInstrumentNames: any[] = [];
  allInstruments: any[] = [];
  displayInstruments: any[] = [];


  totalCountList: any[] = [];
  mcapChartData: any;
  mcapChartOptions: any;

  actionCounts: any = {};

  constructor(private router: Router) { }

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
    this.getAllHomeData();
    this.getAllInstrumentCountChart();
  }

getAllInstrumentCountChart() {
  this.featuresService.getAllInstrumentCountChart().subscribe({
    next: (res: any) => {
      const data = res?.data || [];

      if (!data.length) {
        this.totalCountList = [];
        this.mcapChartData = null;
        return;
      }

      // Assign color dynamically
      this.totalCountList = data.map((item:any, i:any) => {
        const hue = (i * 360) / data.length;
        return { ...item, color: `hsl(${hue}, 70%, 50%)` };
      });

      // Calculate total instruments
      const totalCount = data[0]?.all_instruments_total_count || 0;
      this.actionCounts = { total_count: totalCount };

      // Build dynamic actionCounts (optional use in HTML)
      data.forEach((item:any) => {
        const key = item.instrument.toLowerCase().replace(/\s+/g, '_');
        this.actionCounts[`${key}_count`] = item.instrument_total_count || 0;
        this.actionCounts[`${key}_percent`] = item.percentage || 0;
      });

      // Prepare chart data
      this.mcapChartData = {
        labels: data.map((d: any) => d.instrument.replace(/_/g, ' ')),
        datasets: [
          {
            data: data.map((d: any) => d.percentage),
            backgroundColor: this.totalCountList.map((s) => s.color),
            hoverBackgroundColor: this.totalCountList.map((s) => s.color),
          },
        ],
      };

      // Chart options
      this.mcapChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (context: any) =>
                `${context.label}: ${context.raw?.toFixed(1) || 0}%`,
            },
          },
        },
      };
    },
    error: (err) =>
      this.messageService.add({
        severity: 'error',
        summary: 'Failed',
        detail:
          err.error?.message || 'Failed to load Instrument Tag Allocation chart',
      }),
  });
}


  goToInstrumentDetails(de: any) {
    if (!de) return;

    switch (de.instrument?.toLowerCase()) {
      case 'equity':
        this.router.navigate(['/features/equity']);
        break;

      case 'fixed_income':
        this.router.navigate(['/features/fixed-income']);
        break;

      case 'commodities':
        this.router.navigate(['/features/commodities']);
        break;

      default:
        console.warn('Unknown instrument, staying on page', de.instrument);
        break;
    }
  }

  getAllHomeData() {
    this.featuresService.getAllHomeData().subscribe({
      next: (res: any) => {
        this.allInstruments = res?.data || [];
        this.allInstruments.forEach(IS => {
      IS.color = this.getColor(IS.subcategory);
      });
   
        this.displayInstruments = [...this.allInstruments]; // for carousel
      },
      error: () => console.error('Failed to load Mutual Funds')
    });
  }

  scrollToDE(de: any) {
    if (de) {
      this.displayInstruments = [de]; // show only selected DE card in search mode
    }
  }

  searchDEs(event: any) {
    const query = event.query?.toLowerCase() || '';
    this.filteredInstrumentNames = this.allInstruments.filter(de =>
      de.nickname?.toLowerCase().includes(query)
    );
  }

  clearSearch() {
    this.selectedInstrumentName = null;
    this.displayInstruments = [...this.allInstruments]; // restore carousel items
  }

  getColor(instrument?: string) {
    const predefinedColors: { [key: string]: string } = {
      'DE1': '#FFD580',
      'DE2': '#FFB3B3',
      'DE3': '#B3E5FF'
    };

    if (instrument && predefinedColors[instrument]) {
      return predefinedColors[instrument];
    }

    // Generate random pastel color
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 85%)`;
  }


}
