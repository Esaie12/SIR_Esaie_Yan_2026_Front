import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { AuthService } from '../services/auth.service';
import { catchError, map, throwError } from 'rxjs';
import { Customer } from '../models/customer.model';

declare var bootstrap: any;

@Component({
  selector: 'app-mes-clients',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './mes-clients.component.html',
})
export class MesClientsComponent implements OnInit {

  private customerService = inject(CustomerService);
  private authService     = inject(AuthService);

  user?      = this.authService.getUser();
  customers: Customer[] = [];
  filtered:  Customer[] = [];
  search    = '';
  pageSize  = 10;
  page      = 1;
  error?:   string;

  clientToDelete?: Customer;
  private deleteModal: any;

  ngOnInit(): void { this.fetchClients(); }

  fetchClients() {
    if (!this.user?.id) { this.error = 'Vous devez être connecté'; return; }

    this.customerService.getUserMessages(this.user.id).pipe(
      map((res: any) => res.data),
      catchError(err => { this.error = 'Erreur'; return throwError(() => err); })
    ).subscribe(data => { this.customers = data; this.applyFilter(); });
  }

  applyFilter() {
    const q = this.search.toLowerCase();
    this.filtered = this.customers.filter(c =>
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.country?.toLowerCase().includes(q)
    );
    this.page = 1;
  }

  get paged() {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  get totalPages() { return Math.ceil(this.filtered.length / this.pageSize); }

  openDeleteModal(event: MouseEvent, customer: Customer) {
    event.stopPropagation();
    this.clientToDelete = customer;
    if (this.deleteModal) this.deleteModal.dispose();
    this.deleteModal = new bootstrap.Modal(document.getElementById('deleteClientModal'));
    this.deleteModal.show();
  }

  confirmDelete() {
    if (!this.clientToDelete?.id) return;
    this.customerService.delete(this.clientToDelete.id).subscribe({
      next: () => { this.deleteModal?.hide(); this.clientToDelete = undefined; this.fetchClients(); },
      error: err => console.error(err)
    });
  }
}
