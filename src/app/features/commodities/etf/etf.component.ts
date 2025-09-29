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
import { Location } from '@angular/common';

@Component({
  selector: 'app-etf',
  imports: [
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
  templateUrl: './etf.component.html',
  styleUrl: './etf.component.scss'
})
export class EtfComponent implements OnInit{
  selectedETFName: any = null;
  filteredETFNames: any[] = [];
  allETFs: any[] = [];
  displayETFs: any[] = [];
  actionTableList: any[] = [];

  @ViewChild('etf') etf!: Table;
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
    this.getAllETF();
    this.getAllActionTable();
  }

  goBack(){
    this.location.back();
  }

  goToETFDetails(etf: any) {
    this.router.navigate(['/features/commodities/etf-details', etf.entityid]);
  }

  getAllETF() {
    this.featuresService.getAllETF().subscribe({
      next: (res: any) => {
        this.allETFs = res?.data || [];
        this.allETFs.forEach(etf => {
        etf.color = this.getColor(etf.subcategory);
      });
   
        this.displayETFs = [...this.allETFs]; // for carousel
      },
      error: () => console.error('Failed to load EFT')
    });
  }

  getAllActionTable() {
    this.featuresService.getAllActionTableOfETF().subscribe({
      next: (data: any) => {
        this.actionTableList = Array.isArray(data.data) ? data.data : [];
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: error.error?.message || 'Failed to load Action table'
        });
      }
    });
  }


  scrollToETF(etf: any) {
    if (etf) {
      this.displayETFs = [etf]; // show only selected etf card in search mode
    }
  }

  searchETFs(event: any) {
    const query = event.query?.toLowerCase() || '';
    this.filteredETFNames = this.allETFs.filter(etf =>
      etf.nickname?.toLowerCase().includes(query)
    );
  }

  clearSearch() {
    this.selectedETFName = null;
    this.displayETFs = [...this.allETFs]; // restore carousel items
  }

  getColor(nickname?: string) {
    const predefinedColors: { [key: string]: string } = {
      'etf1': '#FFD580',
      'etf2': '#FFB3B3',
      'etf3': '#B3E5FF'
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
    if (input && this.etf) {
      this.etf.filter(input.value, 'global', 'contains');
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


