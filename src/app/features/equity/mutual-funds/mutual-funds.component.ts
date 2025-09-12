import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { Table, TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { FeaturesService } from '../../features.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    ChartModule,
    TagModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    CalendarModule,
    InputTextModule,
    DropdownModule,
    CommonModule,
    MessagesModule,
    MessageModule,
    TableModule,
    InputTextModule,
    AutoCompleteModule,
    CarouselModule,
    CardModule,
    FormsModule
  ],
  templateUrl: './mutual-funds.component.html',
  styleUrls: ['./mutual-funds.component.scss']
})
export class MutualFundsComponent implements OnInit {
  selectedMfName: any = null;
  filteredMfNames: any[] = [];
  allMfs: any[] = [];
  displayMfs: any[] = [];
  actionTableList: any[] = [];
  irrResult: number | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  underlyingTableList: any[] = [];
  actionCounts: any = {};
  chartData: any;
  chartOptions: any;

  @ViewChild('dt') dt!: Table;
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
    this.getAllMutualFunds();
    this.getAllActionTable();
    this.getMFUnderlyingTable()
    this.fetchIrr()
  }

  fetchIrr(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.featuresService.getIrrMF().subscribe({
      next: (response) => {
        this.irrResult = response?.annualized_irr_percent ?? null;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching IRR:', err);
        this.errorMessage = 'Failed to fetch IRR';
        this.isLoading = false;
      }
    });
  }

  goToMfDetails(mf: any) {
    this.router.navigate(['/features/equity/mutual-fund-details', mf.entityid]);
  }

  getAllMutualFunds() {
    this.featuresService.getAllMutualFund().subscribe({
      next: (res: any) => {
        this.allMfs = res?.data || [];
        this.allMfs.forEach(mf => {
          mf.color = this.getColor(mf.subcategory);
        });

        this.displayMfs = [...this.allMfs]; // for carousel
      },
      error: () => console.error('Failed to load Mutual Funds')
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

getMFUnderlyingTable() {
  this.featuresService.getMFUnderlyingTable().subscribe({
    next: (res: any) => {
      if (!res?.data?.length) return;

      this.underlyingTableList = res.data;

      // Build actionCounts from backend response
      const largeCap = res.data.find((x: any) => x.tag === 'large cap');
      const midCap   = res.data.find((x: any) => x.tag === 'mid cap');
      const smallCap = res.data.find((x: any) => x.tag === 'small cap');

      this.actionCounts = {
        lcap_percent: largeCap?.tag_percent || 0,
        mcap_percent: midCap?.tag_percent || 0,
        scap_percent: smallCap?.tag_percent || 0,
        lcap_count: largeCap?.tag_count || 0,
        mcap_count: midCap?.tag_count || 0,
        scap_count: smallCap?.tag_count || 0,
        total_count: res.data[0]?.total_mf_count || 0
      };

      // Chart Labels & Values
      const labels = ['Large Cap', 'Mid Cap', 'Small Cap'];
      const values = [
        this.actionCounts.lcap_percent,
        this.actionCounts.mcap_percent,
        this.actionCounts.scap_percent
      ];

      // Chart Data
      this.chartData = {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
            hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D']
          }
        ]
      };

      // Chart Options
      this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (context: any) => `${context.label}: ${context.raw.toFixed(1)}%`
            }
          }
        }
      };
    },
    error: (err) =>
      this.messageService.add({
        severity: 'error',
        summary: 'Failed',
        detail: err.error?.message || 'Failed to load Mutual Fund chart'
      })
  });
}


  scrollToMf(mf: any) {
    if (mf) {
      this.displayMfs = [mf]; // show only selected MF card in search mode
    }
  }

  searchMfs(event: any) {
    const query = event.query?.toLowerCase() || '';
    this.filteredMfNames = this.allMfs.filter(mf =>
      mf.nickname?.toLowerCase().includes(query)
    );
  }

  clearSearch() {
    this.selectedMfName = null;
    this.displayMfs = [...this.allMfs]; // restore carousel items
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


