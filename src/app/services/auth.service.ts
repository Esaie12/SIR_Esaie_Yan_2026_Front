
import { Injectable } from '@angular/core';
//import { Category } from '../models/categories.model';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environment/environment';
import { InscriptionEntreprise, InscriptionPhysique, InscriptionRequest, LoginRequest, LoginResponse } from '../models/user.model';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl+'/accounts';
  //private apiUrl = 'http://127.0.0.1:8000/api/auth'; // Remplace par ton URL API

  constructor(private http: HttpClient) {}

  /**
   * Connexion
   */
  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(res => {
       // console.log('Réponse de connexion', res);
        // Sauvegarde du token dans localStorage
        localStorage.setItem('authToken', res.token);
        localStorage.setItem('user', JSON.stringify(res?.data));
        localStorage.setItem('userId', res?.data?.id);
      })
    );
  }

  /**
   * Inscription
   */
  register(data: InscriptionEntreprise | InscriptionPhysique): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, data).pipe(
      tap(res => {
        console.log('Réponse d\'inscription', res);
        // Sauvegarde du token dans localStorage
        //localStorage.setItem('authToken', res.token);
       // localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  /**
   * Déconnexion
   */
  logout() {
    localStorage.removeItem('user');
  }


  /**
   * Vérifie si l'utilisateur est connecté
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  /**
   * Récupère le token courant
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUser(): InscriptionPhysique | InscriptionEntreprise | null | any {
    const userString = localStorage.getItem('user');
    if (!userString) return null;

    try {
      return JSON.parse(userString) as InscriptionPhysique | InscriptionEntreprise;
    } catch (e) {
      console.error('Impossible de parser l’utilisateur depuis localStorage', e);
      return null;
    }
  }

}
