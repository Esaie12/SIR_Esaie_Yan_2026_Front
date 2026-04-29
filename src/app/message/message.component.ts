import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { catchError, map, throwError } from 'rxjs';
import { MessageService } from '../services/message.service';
import { AuthService } from '../services/auth.service';
import { CustomerService } from '../services/customer.service';
import { CategoryService } from '../services/category.service';
import { Message } from '../models/message.model';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [RouterLink, CommonModule, DatePipe, FormsModule],
  templateUrl: './message.component.html',
})
export class MessageComponent implements OnInit {

  private messageService  = inject(MessageService);
  private authService     = inject(AuthService);
  private customerService = inject(CustomerService);
  private categoryService = inject(CategoryService);
  router                  = inject(Router);

  messages: Message[]  = [];
  filtered: Message[]  = [];
  search    = '';
  pageSize  = 10;
  page      = 1;
  error?:   string;
  user?   = this.authService.getUser();

  // Maps id → nom pour affichage
  clientsMap:  Map<number, string> = new Map();
  groupesMap:  Map<number, string> = new Map();

  messageToDelete?: Message;
  private deleteModal: any;

  constructor() {
    if (!this.user || this.user.id === undefined) {
      alert('Vous devez être connecté');
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.fetchClients();
    this.fetchGroupes();
    this.fetchMessages();
  }

  // Charge les clients de l'utilisateur pour résoudre les noms
  fetchClients() {
    if (!this.user?.id) return;
    this.customerService.getUserMessages(this.user.id).pipe(
      map((res: any) => res.data)
    ).subscribe((clients: any[]) => {
      this.clientsMap = new Map(clients.map(c => [c.id, c.name]));
    });
  }

  // Charge les groupes de l'utilisateur pour résoudre les noms
  fetchGroupes() {
    if (!this.user?.id) return;
    this.categoryService.getUserCategories(this.user.id).pipe(
      map((res: any) => res.data)
    ).subscribe((groupes: any[]) => {
      this.groupesMap = new Map(groupes.map(g => [g.id, g.libelle]));
    });
  }

  fetchMessages() {
    if (!this.user?.id) return;
    this.messageService.getUserMessages(this.user.id).pipe(
      map((res: any) => res.data.map((m: any) => ({ ...m, dateSend: new Date(m.dateSend) }))),
      catchError(err => { this.error = 'Erreur'; return throwError(() => err); })
    ).subscribe(data => { this.messages = data; this.applyFilter(); });
  }

  // Retourne le nom du destinataire (client ou groupe)
  getDestinataire(message: Message): string {
    if (message.userId) {
      return this.clientsMap.get(message.userId) ?? `Client #${message.userId}`;
    }
    if (message.groupeId) {
      return this.groupesMap.get(message.groupeId) ?? `Groupe #${message.groupeId}`;
    }
    return '-';
  }

  applyFilter() {
    const q = this.search.toLowerCase();
    this.filtered = this.messages.filter(m =>
      m.title?.toLowerCase().includes(q)
    );
    this.page = 1;
  }

  get paged() {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  get totalPages() { return Math.ceil(this.filtered.length / this.pageSize); }

  openDeleteModal(event: MouseEvent, message: Message) {
    event.stopPropagation();
    this.messageToDelete = message;
    if (this.deleteModal) this.deleteModal.dispose();
    this.deleteModal = new bootstrap.Modal(document.getElementById('deleteMessageModal'));
    this.deleteModal.show();
  }

  confirmDelete() {
    if (!this.messageToDelete?.id) return;
    this.messageService.delete(this.messageToDelete.id).subscribe({
      next: () => { this.deleteModal?.hide(); this.messageToDelete = undefined; this.fetchMessages(); },
      error: err => console.error(err)
    });
  }
}
