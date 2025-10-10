// Angular Core Imports
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG Imports
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { ChartModule } from 'primeng/chart';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SpeedDialModule } from 'primeng/speeddial';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { DatePickerModule } from 'primeng/datepicker';

// Export a single reusable constant
export const SHARED_IMPORTS = [
  // Angular Core
  CommonModule,
  FormsModule,
  ReactiveFormsModule,

  // PrimeNG UI Modules
  AutoCompleteModule,
  ButtonModule,
  CalendarModule,
  CardModule,
  CarouselModule,
  ChartModule,
  ConfirmDialogModule,
  DialogModule,
  DropdownModule,
  FileUploadModule,
  InputMaskModule,
  InputNumberModule,
  InputTextModule,
  MessagesModule,
  MessageModule,
  ProgressSpinnerModule,
  SpeedDialModule,
  TableModule,
  TagModule,
  ToastModule,
  TooltipModule,
  DatePickerModule
];
