import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Groupe } from '../models/category.model';
import { map } from 'rxjs';
import { Customer } from '../models/customer.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-category-manage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-manage.component.html',
  styleUrl: './category-manage.component.css'
})
export class CategoryManageComponent {

  router         = inject(Router);
  route          = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);
  private authService     = inject(AuthService);

  connectedUser? = this.authService.getUser();
  error?: string;

  categoryId = Number(this.route.snapshot.paramMap.get('id'));

  groupe?: Groupe;
  groupeData: any = { libelle: '', color: '#000000' };
  isLoading = true;

  selectedUsers: number[] = [];
  usersDisponibles: Customer[] = [];
  membres: Customer[] = [];

  constructor() {
    if (!this.connectedUser || this.connectedUser.id === undefined) {
      this.error = 'Vous devez être connecté';
      return;
    }

    this.loadGroupe();
    this.refreshMembres();
    this.refreshDisponibles();
  }

  // ─── Charge le groupe une seule fois et remplit le formulaire ────────────
  loadGroupe() {
    this.isLoading = true;
    this.categoryService.getById(this.categoryId)
      .pipe(map((res: any) => res.data))
      .subscribe({
        next: (g: Groupe) => {
          this.groupe = g;
          this.groupeData = { libelle: g.libelle, color: g.color };
          this.isLoading = false;
        },
        error: (err) => {
          this.router.navigate(['/category']);
        }
      });
  }

  // ─── Recharge les membres actuels du groupe ──────────────────────────────
  refreshMembres() {
    this.categoryService.getClientsInGroup(this.categoryId)
      .pipe(map((res: any) => res.data))
      .subscribe(data => this.membres = data);
  }

  // ─── Recharge les clients disponibles (pas encore dans le groupe) ────────
  refreshDisponibles() {
    this.categoryService.getClientsWithoutGroup(this.connectedUser!.id, this.categoryId)
      .pipe(map((res: any) => res.data))
      .subscribe(data => this.usersDisponibles = data);
  }

  // ─── Met à jour le libellé et la couleur du groupe ───────────────────────
  updateGroup() {
    const payload = {
      libelle: this.groupeData.libelle,
      color:   this.groupeData.color,
      userId:  this.connectedUser?.id
    };

    this.categoryService.update(this.categoryId, payload).subscribe({
      next: (response) => {

        // Recharge le groupe pour mettre à jour le titre et la couleur
        this.loadGroupe();
      },
      error: err => {
        console.error('[BACKEND] Erreur lors de l\'update du groupe !');
        console.error('[BACKEND] Détails complets de l\'erreur :', err);
      }
    });
  }

  // ─── Retire un membre du groupe et le remet dans les disponibles ─────────
  removeMembre(membre: Customer) {
    if (!membre.id) return;

    this.categoryService.removeUserFromGroup(membre.id, this.categoryId).subscribe({
      next: () => {
        this.membres = this.membres.filter(m => m.id !== membre.id);
        this.usersDisponibles.push(membre);
      },
      error: (err: any) => console.error('Erreur retrait membre', err)
    });
  }

  // ─── Coche / décoche un utilisateur dans la liste des disponibles ────────
  toggleUser(userId: number, event: any) {
    if (event.target.checked) {
      this.selectedUsers.push(userId);
    } else {
      this.selectedUsers = this.selectedUsers.filter(id => id !== userId);
    }
  }

  // ─── Ajoute tous les membres sélectionnés au groupe ─────────────────────
  addMembers() {
    const toAdd = [...this.selectedUsers];
    this.selectedUsers = [];

    toAdd.forEach(userId => {
      const userToAdd = this.usersDisponibles.find(u => u.id === userId);

      this.categoryService.addUserToGroup(this.categoryId, userId).subscribe({
        next: () => {
          if (userToAdd) this.membres.push(userToAdd);
          this.usersDisponibles = this.usersDisponibles.filter(u => u.id !== userId);
        },
        error: (err: any) => console.error(`Erreur ajout user ${userId}`, err)
      });
    });
  }
}
