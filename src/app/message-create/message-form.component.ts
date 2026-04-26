import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MessageService } from '../services/message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Message } from '../models/message.model';
import { CategoryService } from '../services/category.service';
import { Groupe } from '../models/category.model';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer.model';

@Component({
  selector: 'app-message-form',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './message-form.component.html',
  styleUrl: './message-form.component.css'
})
export class MessageFormComponent{

  router = inject(Router);
  route = inject(ActivatedRoute);


  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private categoryService = inject(CategoryService);
  private customerService = inject(CustomerService);

  error?: string;
  user? = this.authService.getUser();
  customers$!: Observable<Customer[]>;

  ngOnInit(): void {
     this.fetchGroupes();
     this.fetchClients();
  }

  groupes$!: Observable<Groupe[]>;

  form = {
    title: '',
    typeDestinataire: 'user', // par défaut "Utilisateur simple"
    userId: '',
    groupeId: '',
    dateSend: '',
    content: ''
  };


  submit(formRef: any) {
    // Vérifie que le formulaire est valide
    if (formRef.valid) {
      //console.log('Message envoyé :', this.form);
      const { typeDestinataire, ...rest } = formRef.value;

      if (typeDestinataire === 'user') {
        rest.userId = Number(rest.userId);
        delete rest.groupeId; // Pas de groupe si c'est un message direct
      } else {
        delete rest.userId; // Pas d'utilisateur spécifique si c'est un message de groupe
      }

      const payload = {
        ...rest,
        senderId: 1 //this.user?.id
      };

      console.log("Payload envoyé :", payload);

      // Exemple envoi API
      this.messageService.create(payload).subscribe({
        next: () => {
          //Faire la redirection après la création du message
          this.router.navigate(['/messages']);
        },
        error: err => console.error(err)
      });
    } else {
      formRef.control.markAllAsTouched();
    }
  }

  resetForm() {
    this.form = {
      title: '',
      typeDestinataire: 'user',
      userId: '',
      groupeId: '',
      dateSend: '',
      content: ''
    };
  }

  fetchGroupes() {
    /*const token = this.authService.getToken();

    if (!token) {
      this.error = 'Vous devez être connecté';
      return;
    }*/

    this.groupes$ =  this.categoryService.getAll().pipe( // this.categoryService.getUserCategories().pipe(
      tap((res: any) => console.log(res.data)),
      map((res: any) => res.data),
      catchError(err => {
        this.error = 'Impossible de récupérer vos commandes';
        console.error(err);
        return throwError(() => err);
      })
    );
  }


  fetchClients() {
      if (!this.user || this.user.id === undefined) {
        this.error = 'Vous devez être connecté';
        return;
      }

      this.customers$ =  this.customerService.getUserMessages(this.user?.id).pipe( // this.categoryService.getUserCategories().pipe(
        tap((res: any) => console.log('CUSTOMERS API:', res)),
        map((res: any) => res.data),
        catchError(err => {
          this.error = 'Impossible de récupérer vos commandes';
          console.error(err);
          return throwError(() => err);
        })
      );
  }


}
