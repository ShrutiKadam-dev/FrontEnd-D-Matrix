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


@Component({
  selector: 'app-home',
  standalone: true,
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
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  selectedInstrumentName: any = null;
  filteredInstrumentNames: any[] = [];
  allInstruments: any[] = [];
  displayInstruments: any[] = [];

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
  }

  goToInstrumentDetails(de: any) {
    if (!de) return;

    switch (de.instrument?.toLowerCase()) {
      case 'equity':
        this.router.navigate(['/features/equity']);
        break;

      case 'fixed income':
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
