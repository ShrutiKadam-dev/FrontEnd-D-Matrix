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
@Component({
  selector: 'app-direct-equity',
  imports: [    
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
  templateUrl: './direct-equity.component.html',
  styleUrl: './direct-equity.component.scss'
})
export class DirectDebtComponent implements OnInit {
  selectedDirectEquityName: any = null;
  filteredDENames: any[] = [];
  allDEs: any[] = [];
  displayDEs: any[] = [];
  actionTableList: any[] = [];

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
    this.getAllDirectEquity();
    this.getAllActionTable();
  }

  goToDirectEquityDetails(de: any) {
    this.router.navigate(['/features/fixed-income/direct-equity-details', de.entityid]);
  }

  getAllDirectEquity() {
    this.featuresService.getAllDirectEquity().subscribe({
      next: (res: any) => {
        this.allDEs = res?.data || [];
        this.allDEs.forEach(de => {
        de.color = this.getColor(de.subcategory);
      });
   
        this.displayDEs = [...this.allDEs]; // for carousel
      },
      error: () => console.error('Failed to load Mutual Funds')
    });
  }

  getAllActionTable() {
    this.featuresService.getAllActionTableOfDirectEquity().subscribe({
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


  scrollToDE(de: any) {
    if (de) {
      this.displayDEs = [de]; // show only selected DE card in search mode
    }
  }

  searchDEs(event: any) {
    const query = event.query?.toLowerCase() || '';
    this.filteredDENames = this.allDEs.filter(de =>
      de.nickname?.toLowerCase().includes(query)
    );
  }

  clearSearch() {
    this.selectedDirectEquityName = null;
    this.displayDEs = [...this.allDEs]; // restore carousel items
  }

  getColor(nickname?: string) {
    const predefinedColors: { [key: string]: string } = {
      'DE1': '#FFD580',
      'DE2': '#FFB3B3',
      'DE3': '#B3E5FF'
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
}
