import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class BaseService<T> {

  constructor(
    protected http: HttpClient,
    protected apiUrl: string
  ) {}

  // Récupère tous les éléments
  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.apiUrl);
  }

  // Récupère un élément par ID
  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`);
  }

  // Supprimer un élément
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Ajouter un élément
  create(item: T): Observable<T> {
    return this.http.post<T>(this.apiUrl, item);
  }

  // Mettre à jour un élément
  update(id: number, item: T): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${id}`, item);
  }
}
