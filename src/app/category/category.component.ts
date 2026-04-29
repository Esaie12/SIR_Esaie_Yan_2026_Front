import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Groupe } from '../models/category.model';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { CategoryService } from '../services/category.service';
import { AuthService } from '../services/auth.service';
import { faker } from '@faker-js/faker';

declare var bootstrap: any;

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {

  private categoryService = inject(CategoryService);
  private authService     = inject(AuthService);
  router                  = inject(Router);

  groupes$!: Observable<Groupe[]>;
  error?:    string;
  user?    = this.authService.getUser();

  groupeToDelete?: Groupe;
  private deleteModal: any;

  constructor() {
    if (!this.user || this.user.id === undefined) {
      alert('Vous devez être connecté pour accéder au dashboard');
      this.router.navigate(['/login']);
      this.groupes$ = new Observable();
      return;
    }
  }

  ngOnInit(): void {
    this.fetchGroupes();
  }

  // Charge la liste des groupes de l'utilisateur connecté
  fetchGroupes() {
    if (!this.user || this.user.id === undefined) {
      this.error = 'Vous devez être connecté';
      return;
    }

    this.groupes$ = this.categoryService.getUserCategories(this.user.id).pipe(
      tap((res: any) => console.log(res.data)),
      map((res: any) => res.data),
      catchError(err => {
        this.error = 'Impossible de récupérer vos groupes';
        console.error(err);
        return throwError(() => err);
      })
    );
  }

  // Ouvre la modale de confirmation
  openDeleteModal(groupe: Groupe) {
    this.groupeToDelete = groupe;
    this.deleteModal = new bootstrap.Modal(document.getElementById('deleteGroupeModal'));
    this.deleteModal.show();
  }

  // Confirme la suppression — déplace le focus avant de fermer pour éviter aria-hidden
  confirmDelete() {
    if (!this.groupeToDelete?.id) return;

    // Déplace le focus sur le body pour éviter le bug aria-hidden Bootstrap
    (document.activeElement as HTMLElement)?.blur();

    this.categoryService.delete(this.groupeToDelete.id).subscribe({
      next: () => {
        this.deleteModal?.hide();
        this.groupeToDelete = undefined;
        this.fetchGroupes();
      },
      error: err => console.error('Erreur suppression groupe', err)
    });
  }

  onSubmit(form: any) {
    if (form.valid) {
      const payload = { ...form.value, userId: this.user?.id };
      this.categoryService.create(payload).subscribe({
        next: () => { this.fetchGroupes(); form.reset(); },
        error: err => console.error(err)
      });
    }
  }

  groupeData: any = {};

  generateFakeGroupe() {
    this.groupeData = {
      libelle: faker.commerce.department() + ' ' + faker.number.int(1000),
      color: faker.color.rgb()
    };
  }
}
