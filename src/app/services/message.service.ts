import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService  extends BaseService<Message>{

  private urlApi = environment.apiUrl+'/messages';


  constructor(protected override http: HttpClient) {
    super(http, environment.apiUrl + '/messages');
  }


  // Tu peux ajouter des méthodes spécifiques à Category si nécessaire
  getUserMessages(userId: number ) {
    return this.http.get<Message[]>(`${this.urlApi}?userId=${userId}`); // Remplace 6 par l'ID de l'utilisateur connecté
  }

}
