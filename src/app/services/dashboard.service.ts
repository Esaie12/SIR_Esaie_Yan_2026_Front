import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { Customer } from '../models/customer.model';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService<Customer>{

  private urlApi = environment.apiUrl+'/dashboard';


  constructor(protected override http: HttpClient) {
    super(http, environment.apiUrl + '/dashboard');
  }

  // Retourner mes stats
  getMyDashboard(userId: number ) {
    return this.http.get<Customer[]>(`${this.urlApi}/${userId}`);
  }

}
