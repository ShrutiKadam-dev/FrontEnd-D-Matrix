import { Component } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-aif',
  imports: [CarouselModule, CardModule],
  templateUrl: './aif.component.html',
  styleUrl: './aif.component.scss'
})
export class AifComponent {

}
