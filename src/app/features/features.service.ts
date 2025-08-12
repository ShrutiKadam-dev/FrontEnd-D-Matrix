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
  private apiUrl = 'https://dmatrix-backend.onrender.com'; // backend URL

  createEntity(data: CreateEntity): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/entity_table`, data);
  }

  getAllEntities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllentity`);
  }
  
  updateEntity(entityData: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/updateentity`, entityData);
}
  addUnderlyingTable(data: any) {
   return this.http.post<any>(`${this.apiUrl}/underlying_table`, data);
}

insertActionTable(data: any) {
  return this.http.post(`${this.apiUrl}/action_table`, data); // replace URL with actual insert API
}

}
