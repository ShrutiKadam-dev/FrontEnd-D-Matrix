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

  //Create 

  getAllEntities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllentity`);
  }

  createEntity(data: CreateEntity): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/entity_table`, data);
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
    return this.http.post(`${this.apiUrl}/insertAifActionData`, data);
  }

  insertETFActionTable(data: any) {
    return this.http.post(`${this.apiUrl}/insertETFActionTable`, data);
  }

  insertaifnavData(data: any) {
    return this.http.post(`${this.apiUrl}/insertNavData`, data);
  }

  insertmfnavData(data: any) {
    return this.http.post(`${this.apiUrl}/insertMutualFundNavData`, data);
  }

  insertDirectEquityActionTable(data: any) {
    return this.http.post(`${this.apiUrl}/InsertdirectData`, data);
  }

  insertDirectEquityCommodityActionTable(data: any) {
    return this.http.post(`${this.apiUrl}/InsertCommoditiesDirect`, data);
  }

  insertPmsAmcAction(data: any) {
    return this.http.post(`${this.apiUrl}/insertPmsAmcAction`, data);
  }

  insertPmsClientAction(data: any) {
    return this.http.post(`${this.apiUrl}/insertPmsClientAction`, data);
  }

  uploadAutomation(formData: FormData) {
    return this.http.post(`${this.apiUrl}/uploadAutomationData`, formData);
  }

  //Mutual Fund
  getAllMutualFund(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllMutualFund`);
  }

  getAllPMSEquity(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllPMSEquity`);
  }

  getAllMutualFundDetailsNav(ISIN: string) {
    return this.http.get<any>(`${this.apiUrl}/getMutualFundbyIsinId`, {
      params: { isin: ISIN }
    });
  }

  getAllActionTableEquity(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllActionInstrument`);
  }

  getAllActionTableCommodity(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllActionTableCommodity`);
  }

  getAllETF(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getETFEntity`);
  }

  getAllETFFixedIncome(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllFixIncomeETF`);
  }

  getAllETFEquity(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllETFEquity`);
  }
  getAllDirectEquity(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllDirectEquity`);
  }

  getAllDirectEquityCommodities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllDirectEquityCommodities`);
  }

  getAllActionTableOfMutualFund(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllActionTableOfMFEquity`);
  }

  getAllActionTableOfETF(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllActionTableOfETF`);
  }

  getAllActionTableOFETFFixedIncome(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllActionTableOfFixIncomeETF`);
  }

  getAllActionTableOfETFEquity(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllActionTableOfETFEquity`);
  }

  getAllActionTableOfDirectEquity(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllActionTableOfDirectEquity`);
  }

  getAllActionOfDirectEquityCommodity(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllActionOfDirectEquityCommodity`);
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

  getEntityById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/getEntityById`, {
      params: { entityid: id }
    });
  }

  updateMFDetailActionTableRow(rowId: string, payload: any) {
    return this.http.put<any>(`${this.apiUrl}/updateMFDetailActionTableRow`, payload, {
      params: { id: rowId }
    });
  }

  updateAIFDetailActionTableRow(rowId: string, payload: any) {
    return this.http.post<any>(`${this.apiUrl}/updateAIFDetailActionTableRow`, payload, {
      params: { aif_id: rowId }
    });
  }

  deleteMFDetailActionTableRow(Id: string) {
    return this.http.delete<any>(`${this.apiUrl}/deleteMFDetailActionTableRow`, {
      params: { id: Id }
    });
  }

  deleteAIFDetailActionTableRow(aif_id: string) {
    return this.http.delete<any>(`${this.apiUrl}/deleteAIFDetailActionTableRow`, {
      params: { aif_id: aif_id }
    });
  }

  getETFDetailsById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/getETFDetailsById`, {
      params: { entityid: id }
    });
  }

  getDirectEquityCommodityDetailsById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/getDEDetailCommoditiesEntityById`, {
      params: { entityid: id }
    });
  }

  getMFDetailUnderlyingTable(mfId: string) {
    return this.http.get<any>(`${this.apiUrl}/getUnderlyingById`, {
      params: { entityid: mfId }
    });
  }

  getallMfEquityUnderlyingCount(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getallMfEquityUnderlyingCount`);
  }
  
  getEquityMCAPCount(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getEquityUnderlyingCount`);
  }

  getallMfEquitySectorCount(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getallMFEquitySectorCount`);
  }

  getAllAIFEquityUnderlyingCount(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllAIFEquityUnderlyingCount`);
  }

  getAllAIFFixedIncomeUnderlyingCount(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllAIFFixedIncomeUnderlyingCount`);
  }

  getAllAIFEquitySectorCount(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllAIFEquitySectorCount`);
  }
  
  getAllAIFFixedIncomeSectorCount(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllAIFFixedIncomeSectorCount`);
  }

  getallMfDetailsEquitySectorCount(mfId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getallMFDetailsEquitySectorCount`, {
      params: { entityid: mfId }
    });
  }

  getAIFDetailsEquitySectorCount(mfId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAIFDetailsEquitySectorCount`, {
      params: { entityid: mfId }
    });
  }

  getAIFDetailsFixedIncomeSectorCount(mfId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAIFDetailsFixedIncomeSectorCount`, {
      params: { entityid: mfId }
    });
  }

  getallMfDetailsEquityMCAPCount(mfId: string) {
    return this.http.get<any>(`${this.apiUrl}/getallMFDetailsEquityMCAPCount`, {
      params: { entityid: mfId }
    });
  }

  getAIFDetailsEquityMCAPCount(mfId: string) {
    return this.http.get<any>(`${this.apiUrl}/getAIFDetailsEquityMCAPCount`, {
      params: { entityid: mfId }
    });
  }

  getAIFDetailsFixedIncomeMCAPCount(mfId: string) {
    return this.http.get<any>(`${this.apiUrl}/getAIFDetailsFixedIncomeMCAPCount`, {
      params: { entityid: mfId }
    });
  }

  getPMSEquityAMCActionTable(mfId: string) {
    return this.http.get<any>(`${this.apiUrl}/getPmsAmcActionById`, {
      params: { entityid: mfId }
    });
  }

  getFixIncomeEquityDetailUnderlyingTable(mfId: string) {
    return this.http.get<any>(`${this.apiUrl}/getFixIncomeEquityDetailUnderlyingTable`, {
      params: { entityid: mfId }
    });
  }

  getETFEquityDetailUnderlyingTable(mfId: string) {
    return this.http.get<any>(`${this.apiUrl}/getETFEquityDetailUnderlyingTable`, {
      params: { entityid: mfId }
    });
  }

  getMFDetailActionTable(mfId: string) {
    return this.http.get<any>(`${this.apiUrl}/getActionByentId`, {
      params: { entityid: mfId }
    });
  }

  getBenchmarksByCategory(category: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getBenchmarksByCategory`, {
      params: { category: category }
    });
  }

  getETFDetailFixedIncomeActionTable(mfId: string) {
    return this.http.get<any>(`${this.apiUrl}/getFixIncomeETFDetailActionTable`, {
      params: { entityid: mfId }
    });
  }

  getPMSEquityClientActionTable(mfId: string) {
    return this.http.get<any>(`${this.apiUrl}/getPmsClientActionById`, {
      params: { entityid: mfId }
    });
  }

  getETFCommodityDetailActionTable(mfId: string) {
    return this.http.get<any>(`${this.apiUrl}/getETFActionTablebyId`, {
      params: { entityid: mfId }
    });
  }

  getETFEquityDetailActionTable(mfId: string) {
    return this.http.get<any>(`${this.apiUrl}/getETFEquityDetailActionTable`, {
      params: { entityid: mfId }
    });
  }

  getDEDetailActionTable(deId: string) {
    return this.http.get<any>(`${this.apiUrl}/getDEDetailActionTable`, {
      params: { entityid: deId }
    });
  }

  getDECommodityDetailActionTable(deId: string) {
    return this.http.get<any>(`${this.apiUrl}/getDEDetailCommoditiesActionTable`, {
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

  getAllAifFixedIncomeEntities() {
    return this.http.get<any[]>(`${this.apiUrl}/getAllAIFFixedIncomeEntities`)
  }

  getAllAifContractNotes() {
    return this.http.get<any[]>(`${this.apiUrl}/getAllAif`)
  }

  getAllAifFixedIncomeActionTable() {
    return this.http.get<any[]>(`${this.apiUrl}/getAllAIFFixedIncomeActionTable`)
  }

  getAllAifUnderlyingProperties(mfId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/getAllAifUnderlyingProperties`)
  }

  getAifActionTableById(entityid: string) {
    return this.http.post(`${this.apiUrl}/getAifActionTablebyId`, { entityid });
  }

  getUnderlyingTable(entityid: string) {
    return this.http.get<any>(`${this.apiUrl}/getUnderlyingById`, {
      params: { entityid }
    });
  }

  getAifDetailsFixedIncomeUnderlyingTable(entityid: string) {
    return this.http.get<any>(`${this.apiUrl}/getAifDetailsFixedIncomeUnderlyingTable`, {
      params: { entityid }
    });
  }

  //Get IRR service for mutual fund 
  getIrrById(entityid: string) {
    return this.http.get<any>(`${this.apiUrl}/getActionIRR`, {
      params: { entityid }
    });
  }

  getIrrMF() {
    return this.http.get<any>(`${this.apiUrl}/getALLMutualFundActionTableIRR`)
  }

  getAllMFEquityTotalValue() {
    return this.http.get<any>(`${this.apiUrl}/getAllMFEquitytotalValue`)
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
