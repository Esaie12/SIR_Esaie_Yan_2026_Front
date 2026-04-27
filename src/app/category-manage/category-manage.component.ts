import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Groupe } from '../models/category.model';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { Customer } from '../models/customer.model';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-category-manage',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './category-manage.component.html',
  styleUrl: './category-manage.component.css'
})
export class CategoryManageComponent {

  router = inject(Router);
  route = inject(ActivatedRoute);



  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);

  connectedUser? = this.authService.getUser();
  error?: string;

  categoryId = Number(this.route.snapshot.paramMap.get('id'));
  groupe$!: Observable<Groupe>;
  groupeData: any = {};


  // ✅ IDs sélectionnés (checkbox)
  selectedUsers: number[] = [];

  // ➕ Tous les utilisateurs disponibles
  usersDisponibles$!: Observable<Customer[]>;
  usersDisponibles: Customer[] = [];

  //Les utilisateurs déjà membres du groupe
  membres$!: Observable<Customer[]>;
  membres: Customer[] = [];


  constructor() {

    if (!this.connectedUser || this.connectedUser.id === undefined) {
      this.error = 'Vous devez être connecté';
      return;
    }

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.categoryId = id;

    this.groupe$ = this.categoryService.getById(id).pipe(
      map((res: any) => {
        this.groupeData = res.data; // ✅ copie locale pour edit
        return res.data;
      }),
      catchError(() => {
        this.router.navigate(['/category']);
        return EMPTY;
      })
    );

    this.usersDisponibles$ = this.categoryService.getClientsWithoutGroup(this.connectedUser.id, this.categoryId).pipe(
      map((res: any) => res.data)
    );

    this.usersDisponibles$.subscribe(data => {
      this.usersDisponibles = data;
    });

    //Recupérer les membres actuels du groupe
    this.membres$ = this.categoryService.getClientsInGroup(this.categoryId).pipe(
      map((res: any) => res.data)
    );

    this.membres$.subscribe(data => {
      this.membres = data;
    });


    console.log("ID de la catégorie :", this.categoryId);
    console.log("Détails de la catégorie :", this.groupe$);
    console.log("Utilisateurs disponibles pour ajout :", this.usersDisponibles$);
    /*
    this.groupe$.subscribe(data => {
      console.log("Détails de la catégorie :", data);
    });
    */

  }

  updateGroup() {

    const payload = {
      libelle: this.groupeData.libelle,
      color: this.groupeData.color
    };

    this.categoryService.update(this.categoryId, payload).subscribe({
      next: () => {
        console.log('Groupe mis à jour',payload);
        // refresh UI
        this.groupe$ = this.categoryService.getById(this.categoryId).pipe(
          map((res: any) => res.data)
        );
      },
      error: err => console.error(err)
    });
  }

  // ❌ Retirer un membre
  removeMembre(membre: Customer) {

    if(membre.id) {
      this.categoryService.removeUserFromGroup(membre.id, this.categoryId)
      .subscribe({
        next: () => {
          console.log(`Membre ${membre.id} retiré`);
           // 👉 ajouter aux disponibles
          this.usersDisponibles.push(membre);

          // 👉 retirer des membres AVANT ajou
            this.membres = this.membres.filter(m => m.id !== membre.id);

        },
        error: (err: any) => console.error(`Erreur pour ${membre.id}`, err)
      });
    }
  }

  // ☑️ Checkbox toggle
  toggleUser(userId: number, event: any) {
    if (event.target.checked) {
      this.selectedUsers.push(userId);
    } else {
      this.selectedUsers = this.selectedUsers.filter(id => id !== userId);
    }
  }

  // ➕ Ajouter les membres sélectionnés
  addMembers() {
    console.log("IDs sélectionnés :", this.selectedUsers);

    this.selectedUsers.forEach(userId => {
      const userToAdd = this.usersDisponibles.find(u => u.id === userId);

      this.categoryService.addUserToGroup(this.categoryId, userId)
      .subscribe({
        next: () => {
          console.log(`User ${userId} ajouté`);

          // 👉 ajouter aux membres AVANT suppression
          if (userToAdd) {
            this.membres.push(userToAdd);
          }

          // 👉 retirer des disponibles
          this.usersDisponibles = this.usersDisponibles.filter(
            user => user.id !== userId
          );
        },
        error: (err: any) => console.error(`Erreur pour ${userId}`, err)
      });
    });
    // reset sélection
    this.selectedUsers = [];
  }

}
