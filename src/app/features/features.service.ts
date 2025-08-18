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

  deleteEntity(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeleteEntityByid`, {
      params: { id : id }
    });
  }

  addUnderlyingTable(data: any) {
    return this.http.post<any>(`${this.apiUrl}/underlying_table`, data);
  }

  insertActionTable(data: any) {
    return this.http.post(`${this.apiUrl}/action_table`, data); // replace URL with actual insert API
  }

  getAllMutualFund(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllMutualFund`);
  }

  getAllActionTableOfMutualFund(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getMfByentId`);
  }

  getAllUnderlyingMutualFund(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllUnderlyingMutualFund`);
  }

  getMutualFundDetailsById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/getMutualFundDataById`, {
      params: { entityid: id }
    });
  }

getMFDetailUnderlyingTable(mfId: string) {
  return this.http.get<any>(`${this.apiUrl}/getUnderlyingById`, {
    params: { entityid: mfId }
  });
}
getAllAifEntities(mfId: string) {
  return this.http.get<any[]>(`${this.apiUrl}/getAllAifEntities`) 
}

getAllAifContractNotes(mfId: string) {
  return this.http.get<any[]>(`${this.apiUrl}/getAllAifContractNotes`) 
}

getAllAifUnderlyingProperties(mfId: string) {
  return this.http.get<any[]>(`${this.apiUrl}/getAllAifUnderlyingProperties`) 
}


getMFDetailActionTable(mfId: string) {
    return this.http.get<any>(`${this.apiUrl}/getActionByentId`, {
      params: { entityid: mfId }
    });
  }




}
