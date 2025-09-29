import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-fixed-income',
  imports: [],
  templateUrl: './fixed-income.component.html',
  styleUrl: './fixed-income.component.scss'
})
export class FixedIncomeComponent {

  constructor(private location: Location) {}

  goBack(){
    this.location.back();
  }
}
