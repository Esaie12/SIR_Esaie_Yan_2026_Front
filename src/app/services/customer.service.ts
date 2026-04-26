import { Injectable } from '@angular/core';
import { Customer } from '../models/customer.model';
import { environment } from '../../environment/environment';
import { BaseService } from './base-service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerService  extends BaseService<Customer>{

  private urlApi = environment.apiUrl+'/clients';


  constructor(protected override http: HttpClient) {
    super(http, environment.apiUrl + '/clients');
  }


  getUserMessages(userId: number) {
    return this.http.get<Customer[]>(`${this.urlApi}/by-user/${userId}`);
  }

}

