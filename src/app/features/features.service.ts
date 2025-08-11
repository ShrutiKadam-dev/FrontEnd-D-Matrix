import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CreateEntity {
  scripname: string;
  scripcode: string;
  nickname?: string;
  benchmark?: string;
  category: string;
  subcategory: string;
}

@Injectable({
  providedIn: 'root'
})
export class FeaturesService {
  private http = inject(HttpClient);
  private apiUrl = 'https://dmatrix-backend.onrender.com'; // Replace with your actual API URL

  createEntity(data: CreateEntity): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/entity_table`, data);
  }

  getAllEntities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllentity`); // <-- Adjust endpoint
  }
}
