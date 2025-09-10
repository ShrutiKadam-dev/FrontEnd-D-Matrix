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

  getAllActionTableEquity(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllActionInstrument`);
  }

  getAllActionTableCommodity(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllActionTableCommodity`);
  }
  
  updateEntity(entityData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateentity`, entityData);
  }

  deleteEntity(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeleteEntityByid`, {
      params: { id: id }
    });
  }

  addUnderlyingTable(data: any) {
    return this.http.post<any>(`${this.apiUrl}/underlying_table`, data);
  }

  insertActionTable(data: any) {
    return this.http.post(`${this.apiUrl}/action_table`, data); 
  }

  insertAifActionTable(data: any) {
    return this.http.post(`${this.apiUrl}/InsertAifData`, data); 
  }

  insertETFActionTable(data: any) {
    return this.http.post(`${this.apiUrl}/insertETFActionTable`, data); 
  }

  insertNavData(data: any) {
    return this.http.post(`${this.apiUrl}/insertNavData`, data); 
  }

  insertDirectEquityActionTable(data: any) {
    return this.http.post(`${this.apiUrl}/InsertdirectData`, data); 
  }
  
  getAllMutualFund(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllMutualFund`);
  }

  getAllETF(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getETFEntity`);
  }

  getAllDirectEquity(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllDirectEquity`);
  }

  getAllDirectEquityCommodities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getDirectEquityCommodities`);
  }

  getAllActionTableOfMutualFund(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getMfByentId`);
  }

  getAllActionTableOfETF(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllActionTableOfETF`);
  }

  getAllActionTableOfDirectEquity(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllActionTableOfDirectEquity`);
  }

  getAllUnderlyingMutualFund(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllUnderlyingMutualFund`);
  }

  getAllEntityHome(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getCountOfAllEntity`);
  }

  getAllCommoditiesHome(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getCountOfAllCommodities`);
  }

  getAllHomeData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllHomeData`);
  }

  getEquityActionTable(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getEquityActionTable`);
  }

  getCommodityActionTable(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getCommodityActionTable`);
  }

  getMutualFundDetailsById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/getMutualFundDataById`, {
      params: { entityid: id }
    });
  }

    getETFDetailsById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/getMutualFundDataById`, {
      params: { entityid: id }
    });
  }

  getDirectEquityDetailsById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/getDirectEquityDetailsById`, {
      params: { entityid: id }
    });
  }

  getMFDetailUnderlyingTable(mfId: string) {
    return this.http.get<any>(`${this.apiUrl}/getUnderlyingById`, {
      params: { entityid: mfId }
    });
  }

    getETFDetailUnderlyingTable(mfId: string) {
    return this.http.get<any>(`${this.apiUrl}/getUnderlyingById`, {
      params: { entityid: mfId }
    });
  }

  getMFDetailActionTable(mfId: string) {
    return this.http.get<any>(`${this.apiUrl}/getActionByentId`, {
      params: { entityid: mfId }
    });
  }

  getETFDetailActionTable(mfId: string) {
    return this.http.get<any>(`${this.apiUrl}/getETFActionTablebyId`, {
      params: { entityid: mfId }
    });
  }

  getDEDetailActionTable(deId: string) {
    return this.http.get<any>(`${this.apiUrl}/getDEDetailActionTable`, {
      params: { entityid: deId }
    });
  }
  
  getCompanyByName(query: string) {
    return this.http.get<any>(`${this.apiUrl}/getCamByid`, {
      params: { company: query }
    });
  }

  getUnderlyingByEntityId(entityId: string) {
    return this.http.get<any>(`${this.apiUrl}/getUnderlyingById`, {
      params: { entityid: entityId }
    });
  }

  clearUnderlyingByEntityId(entityId: string) {
    return this.http.delete(`${this.apiUrl}/clearUnderlyingByEntityId`, {
      params: { entityid: entityId }
    });
  }

  //AIF services
  getAllAifEntities() {
    return this.http.get<any[]>(`${this.apiUrl}/getAifEntity`)
  }

  getAllAifContractNotes() {
    return this.http.get<any[]>(`${this.apiUrl}/getAllAif`)
  }

  getAllAifUnderlyingProperties(mfId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/getAllAifUnderlyingProperties`)
  }
  getAifActionTableById(entityid: string) {
    return this.http.post(`${this.apiUrl}/getAifActionTablebyId`, {entityid}); 
  }
  getUnderlyingTable(entityid: string) {
    return this.http.get<any>(`${this.apiUrl}/getUnderlyingById`, {
      params: { entityid }
    });
  }

  //Get IRR service for mutual fund 
  getIrrById(entityid: string) {
    return this.http.get<any>(`${this.apiUrl}/getActionIRR`, {
      params: { entityid }
    });
  }
  //Get IRR service for Direct Equity 
  getDirectEquityIrrById(entityid: string) {
    return this.http.get<any>(`${this.apiUrl}/getDirectEquityIRR`, {
      params: { entityid }
    });
  }
  //Get IRR service for AIF 
  getAifIrrById(entityid: string) {
    return this.http.get<any>(`${this.apiUrl}/getAifIRR`, {
      params: { entityid }
    });
  }



}
