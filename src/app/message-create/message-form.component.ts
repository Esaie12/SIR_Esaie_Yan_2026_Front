import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../services/message.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CategoryService } from '../services/category.service';
import { Groupe } from '../models/category.model';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer.model';
import { faker } from '@faker-js/faker';

@Component({
  selector: 'app-message-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './message-form.component.html',
  styleUrl: './message-form.component.css'
})
export class MessageFormComponent {

  router = inject(Router);
  route  = inject(ActivatedRoute);

  private messageService  = inject(MessageService);
  private authService     = inject(AuthService);
  private categoryService = inject(CategoryService);
  private customerService = inject(CustomerService);

  error?: string;
  user? = this.authService.getUser();

  customers$!: Observable<Customer[]>;
  groupes$!:   Observable<Groupe[]>;

  customersList: Customer[] = [];
  groupesList:   Groupe[]   = [];

  form = {
    title:            '',
    typeDestinataire: 'user',
    userId:           null as number | null,
    groupeId:         null as number | null,
    dateSend:         this.getCurrentDatetime(),
    content:          ''
  };

  ngOnInit(): void {
    this.fetchGroupes();
    this.fetchClients();
  }

  // Retourne la date/heure locale au format HH:mm (pas UTC)
  private getCurrentDatetime(): string {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  submit(formRef: any) {
    if (formRef.valid) {
      const payload: any = {
        title:    this.form.title,
        dateSend: this.form.dateSend,
        content:  this.form.content,
        senderId: this.user?.id
      };

      if (this.form.typeDestinataire === 'user') {
        payload.userId = Number(this.form.userId);
      } else {
        payload.groupeId = Number(this.form.groupeId);
      }

      this.messageService.create(payload).subscribe({
        next: () => this.router.navigate(['/messages']),
        error: err => console.error(err)
      });
    } else {
      formRef.control.markAllAsTouched();
    }
  }

  resetForm() {
    this.form = {
      title:            '',
      typeDestinataire: 'user',
      userId:           null,
      groupeId:         null,
      dateSend:         this.getCurrentDatetime(),
      content:          ''
    };
  }

  fetchGroupes() {
    this.groupes$ = this.categoryService.getUserCategories(this.user?.id).pipe(
      tap((res: any) => { this.groupesList = res.data; }),
      map((res: any) => res.data),
      catchError(err => { return throwError(() => err); })
    );
  }

  fetchClients() {
    if (!this.user || this.user.id === undefined) return;

    this.customers$ = this.customerService.getUserMessages(this.user.id).pipe(
      tap((res: any) => { this.customersList = res.data; }),
      map((res: any) => res.data),
      catchError(err => { return throwError(() => err); })
    );
  }

  generateFakeMessage() {
    if (this.customersList.length === 0 && this.groupesList.length === 0) {
      console.warn('Aucune donnée disponible');
      return;
    }

    const title   = faker.company.catchPhrase();
    const content = `Bonjour,\n\n${faker.lorem.sentences(2)}\n\nCordialement,\n${faker.person.fullName()}`;
    const isUser  = Math.random() > 0.5;

    if (isUser && this.customersList.length > 0) {
      const u = this.customersList[Math.floor(Math.random() * this.customersList.length)];
      this.form = { title, typeDestinataire: 'user', userId: u?.id ?? null, groupeId: null, dateSend: this.getCurrentDatetime(), content };
    } else if (this.groupesList.length > 0) {
      const g = this.groupesList[Math.floor(Math.random() * this.groupesList.length)];
      this.form = { title, typeDestinataire: 'group', userId: null, groupeId: g?.id ?? null, dateSend: this.getCurrentDatetime(), content };
    }
  }
}
