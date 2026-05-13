import { Injectable } from '@angular/core';
import {Groupe } from '../models/category.model';
import { BaseService } from './base-service';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService  extends BaseService<Groupe>{

  private urlApi = environment.apiUrl+'/groupes';


  constructor(protected override http: HttpClient) {
    super(http, environment.apiUrl + '/groupes');
  }


  // Tu peux ajouter des méthodes spécifiques à Category si nécessaire
  getUserCategories(userId: number) {
    //console.log('Récupération des catégories pour l\'utilisateur ID :', userId);
    return this.http.get<Groupe[]>(`${this.urlApi}/by-user/${userId}`);
  }

  //Recuperer tous les clients qui sont dans un groupe
  getClientsInGroup(groupeId: number) {
    return this.http.get<Groupe[]>(`${this.urlApi}/${groupeId}/clients`);
  }

  //Retirer un client d'un groupe
  removeUserFromGroup(clientId: number,groupeId: number) {
    return this.http.delete(`${this.urlApi}/${groupeId}/clients/${clientId}`);
  }

  //Recuperer tous les clients qui sont pas dans un groupe
  getClientsWithoutGroup(userId: number, groupeId: number) {
    return this.http.get<Groupe[]>(`${this.urlApi}/${groupeId}/clients/not-in/user/${userId}`);
  }

  //Ajouter un client à un groupe
  addUserToGroup(groupeId: number, clientId: number) {
    return this.http.post(`${environment.apiUrl}/clients/${clientId}/groupes/${groupeId}`, {});
  }
}
