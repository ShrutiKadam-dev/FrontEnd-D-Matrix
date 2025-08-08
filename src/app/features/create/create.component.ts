import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create',
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TableModule,
    CommonModule
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
 displayModal: boolean = false;
  entityForm: FormGroup;
  entityList: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.entityForm = this.fb.group({
      scripName: ['', Validators.required],
      scripCode: ['', Validators.required],
      nickName: [''],
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
    });
  }
categoryOptions = [
  { label: 'Equity', value: 'Equity' },
  { label: 'Debt', value: 'Debt' },
  { label: 'Hybrid', value: 'Hybrid' }
];

subCategoryOptions = [
  { label: 'Small Cap', value: 'Small Cap' },
  { label: 'Large Cap', value: 'Large Cap' },
  { label: 'Balanced', value: 'Balanced' }
];
  showModal() {
    this.displayModal = true;
  }

addEntity() {
  const formData = this.entityForm.value;

  const newEntity = {
    ...formData,
    id: 'ID' + Math.floor(Math.random() * 10000), // or use backend-generated ID
    benchmark: 'mutule123' // hardcoded for now
  };

  this.entityList.push(newEntity);

  // Send to backend
  this.http.post('http://localhost:3000/api/entities', newEntity).subscribe({
    next: () => console.log("Entity added"),
    error: (err: any) => console.error("Error", err)
  });

  this.entityForm.reset();
  this.displayModal = false;
}
}
