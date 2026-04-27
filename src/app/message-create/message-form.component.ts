import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MessageService } from '../services/message.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Message } from '../models/message.model';
import { CategoryService } from '../services/category.service';
import { Groupe } from '../models/category.model';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer.model';
import { faker } from '@faker-js/faker';

@Component({
  selector: 'app-message-form',
  standalone: true,
  imports: [CommonModule,FormsModule, RouterLink],
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

  customersList: Customer[] = [];
  groupesList: Groupe[] = [];

  ngOnInit(): void {
    this.fetchGroupes();
    this.fetchClients();

    setTimeout(() => {
      this.generateFakeMessage();
    }, 500); // attendre que les listes soient chargées
  }

  groupes$!: Observable<Groupe[]>;

  form = {
    title: '',
    typeDestinataire: 'user', // par défaut "Utilisateur simple"
    userId: null as number | null,
    groupeId: null as number | null,
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
        senderId: this.user?.id
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
      userId: null as number | null,
      groupeId: null as number | null,
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
      tap((res: any) => {
        this.groupesList = res.data; // ✅ stock local
        console.log('GROUPES:', this.groupesList);
      }),
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
        tap((res: any) => {
          this.customersList = res.data; // ✅ stock local
          console.log('CUSTOMERS:', this.customersList);
        }),
        map((res: any) => res.data),
        catchError(err => {
          this.error = 'Impossible de récupérer vos commandes';
          console.error(err);
          return throwError(() => err);
        })
      );
  }


  generateFakeMessage() {

    // Vérif sécurité (IMPORTANT)
    if ((!this.customersList || this.customersList.length === 0) &&
        (!this.groupesList || this.groupesList.length === 0)) {
      console.error('Aucun utilisateur ou groupe disponible');
      return;
    }

   const title = faker.company.catchPhrase();

    const content = `
    Bonjour,

    ${faker.lorem.sentences(2)}

    Nous vous remercions pour votre confiance.

    Cordialement,
    ${faker.person.fullName()}
    `;

    // Date future
    const now = new Date();
    now.setMinutes(now.getMinutes() + Math.floor(Math.random() * 60));
    const formattedDate = now.toISOString().slice(0, 16);

    // TYPE ALEATOIRE
    const isUser = Math.random() > 0.5;

    // CAS USER
    if (isUser && this.customersList.length > 0) {

      const randomUser = this.customersList[
        Math.floor(Math.random() * this.customersList.length)
      ];

      if (!randomUser) {
        console.error('Aucun utilisateur trouvé');
        return;
      }

      this.form = {
        title,
        typeDestinataire: 'user',
        userId: randomUser?.id ?? null,
        groupeId: null,
        dateSend: formattedDate,
        content
      };

    }

    // CAS GROUPE
    else if (this.groupesList.length > 0) {

      const randomGroup = this.groupesList[
        Math.floor(Math.random() * this.groupesList.length)
      ];

      if (!randomGroup) {
        console.error('Aucun groupe trouvé');
        return;
      }

      this.form = {
        title,
        typeDestinataire: 'group',
        userId: null,
        groupeId: randomGroup?.id ?? null,
        dateSend: formattedDate,
        content
      };
    }

    else {
      console.error('Aucune donnée valide pour générer un message');
      return;
    }

    console.log('Message fake généré :', this.form);
  }

}
