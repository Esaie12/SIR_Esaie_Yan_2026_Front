import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Groupe } from '../models/category.model';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { CategoryService } from '../services/category.service';
import { AuthService } from '../services/auth.service';
import { faker } from '@faker-js/faker';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {

  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);

  router = inject(Router);

  constructor() {
    if (!this.user || this.user.id === undefined) {
      alert('Vous devez être connecté pour accéder au dashboard');

      this.router.navigate(['/login']);
      this.groupes$ = new Observable(); // évite crash async
      return;
    }
  }

  groupes$!: Observable<Groupe[]>;
  error?: string;
  user? = this.authService.getUser();


  ngOnInit(): void {
   // console.log('User connecté :', this.user);
    this.fetchGroupes();
  }



  onSubmit(form: any) {
    if(form.valid) {

      const payload = {
        ...form.value,
        userId: this.user?.id
      };

      console.log("Payload envoyé :", payload);

      // Exemple envoi API
      this.categoryService.create(payload).subscribe({
        next: () => {
          this.fetchGroupes();
          form.reset();
        },
        error: err => console.error(err)
      });
    }
  }

  //getUserCategories
  fetchGroupes() {
    if (!this.user || this.user.id === undefined) {
        this.error = 'Vous devez être connecté';
        return;
      }

    this.groupes$ =  this.categoryService.getUserCategories(this.user?.id).pipe( // this.categoryService.getUserCategories().pipe(
      tap((res: any) => console.log(res.data)),
      map((res: any) => res.data),
      catchError(err => {
        this.error = 'Impossible de récupérer vos commandes';
        console.error(err);
        return throwError(() => err);
      })
    );
  }


  groupeData: any = {};

  generateFakeGroupe() {
    this.groupeData = {
      libelle: faker.commerce.department() + ' ' + faker.number.int(1000),
      color: faker.color.rgb()
    };

    console.log('Groupe généré :', this.groupeData);
  }


  deleteGroupe(id: number) {

  const confirmDelete = confirm(
    'Voulez-vous vraiment supprimer ce groupe ?'
  );

  if (!confirmDelete) {
    return;
  }

  this.categoryService.delete(id).subscribe({

    next: (res) => {

      console.log('Groupe supprimé', res);

      // refresh liste
      this.fetchGroupes();
    },

    error: (err) => {

      console.error(err);

      alert('Erreur lors de la suppression');
    }

  });

}

}
