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
import { ChartModule } from 'primeng/chart';
import { Location } from '@angular/common';

@Component({
  selector: 'app-commodities',
  imports: [
    ButtonModule,
    CalendarModule,
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
  templateUrl: './commodities.component.html',
  styleUrl: './commodities.component.scss'
})
export class CommoditiesComponent implements OnInit {
  selectedCommoditiesName: any = null;
  filteredCommodityNames: any[] = [];
  allCommoditys: any[] = [];
  displayCDs: any[] = [];
  actionTableList: any[] = [];
  equityTableList: any[] = [];
  aifTableList: any[] = [];
  chartData: any;
  chartOptions: any;
  actionCounts: any = null;

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
    this.getAllCommoditiesHome();
    this.loadCommodityChart();
    this.getAllActionTableCommodity()
  }

  goBack(){
    this.location.back();
  }

  loadCommodityChart() {
    this.featuresService.getCommodityActionTable().subscribe({
      next: (res: any) => {
        if (!res?.data?.length) return;

        this.actionCounts = res.data[0];  // store counts + percents

        const labels = ['ETF'];
        const values = [
          Number(this.actionCounts.action_percent),
          // Number(this.actionCounts.aif_percent),
          // Number(this.actionCounts.equity_percent)
        ];

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

        this.chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true, // HIDE default legend
              position: 'bottom',
            },
            tooltip: {
              callbacks: {
                label: (context: any) => `${context.label}: ${context.raw}%`
              }
            }
          }
        };

      },
      error: (err) => console.error('Chart API error:', err)
    });
  }

  goToDirectEquityDetails(de: any) {
    if (!de) return;

    switch (de.subcategory?.toLowerCase()) {
      case 'etf':
        this.router.navigate(['/features/commodities/etf']);
        break;

      case 'direct equity':
        this.router.navigate(['/features/commodities/direct-equity']);
        break;

      case 'alternative investment funds':
        this.router.navigate(['/features/equity/aif']);
        break;

      default:
        console.warn('Unknown subcategory, staying on page', de.subcategory);
        break;
    }
  }

  getAllCommoditiesHome() {
    this.featuresService.getAllCommoditiesHome().subscribe({
      next: (res: any) => {
        this.allCommoditys = res?.data || [];
        this.allCommoditys.forEach(de => {
          de.color = this.getColor(de.subcategory);
        });
        this.displayCDs = [...this.allCommoditys]; // for carousel
      },
      error: () => console.error('Failed to load Mutual Funds')
    });
  }

  getAllActionTableCommodity() {
    this.featuresService.getAllActionTableCommodity().subscribe({
      next: (res: any) => {
        if (res && res.data) {
          // const actionData = (res.data.action_data || []).map((item: any) => ({
          //   scrip_name: item.scrip_name,
          //   order_type: item.order_type,
          //   unit: item.unit || '-',
          //   order_date: item.order_date || '-',
          //   purchase_amount: item.purchase_amount || '-',
          //   source: 'Action'
          // }));

          // const aifData = (res.data.aif_data || []).map((item: any) => ({
          //   scrip_name: item.amc_name,
          //   order_type: 'AIF Contribution',
          //   unit: '-',
          //   order_date: '-',
          //   purchase_amount: item.contribution_amount,
          //   source: 'AIF'
          // }));

          const equityData = (res.data.direct_equity_data || []).map((item: any) => ({
            scrip_name: 'Direct Equity',
            order_type: item.order_type,
            unit: '-',
            order_date: '-',
            purchase_amount: item.trade_price,
            source: 'Equity'
          }));

          // this.actionTableList = res.data.action_data;
          // this.aifTableList = res.data.aif_data;
          this.equityTableList = res.data.direct_equity_data;
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

  scrollToDE(de: any) {
    if (de) {
      this.displayCDs = [de]; // show only selected DE card in search mode
    }
  }

  searchDEs(event: any) {
    const query = event.query?.toLowerCase() || '';
    this.filteredCommodityNames = this.allCommoditys.filter(de =>
      de.nickname?.toLowerCase().includes(query)
    );
  }

  clearSearch() {
    this.selectedCommoditiesName = null;
    this.displayCDs = [...this.allCommoditys]; // restore carousel items
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

}
