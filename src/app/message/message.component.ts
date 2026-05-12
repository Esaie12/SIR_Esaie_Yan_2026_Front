import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';
import $ from 'jquery';
import 'datatables.net';
import { Router, RouterLink } from '@angular/router';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { MessageService } from '../services/message.service';
import { AuthService } from '../services/auth.service';
import { Message } from '../models/message.model';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [RouterLink,CommonModule, DatePipe],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnDestroy{

  private messageService = inject(MessageService);
  private authService = inject(AuthService);

  router = inject(Router);

  now = new Date();
  messages$!: Observable<Message[]>;
  error?: string;
  user? = this.authService.getUser();

  constructor() {
    if (!this.user || this.user.id === undefined) {
      alert('Vous devez être connecté pour accéder au dashboard');

      this.router.navigate(['/login']);
      this.messages$ = new Observable(); // évite crash async
      return;
    }
  }


  ngOnInit(): void {
    console.log('INIT');
    this.fetchMessages();
  }


  initDataTable() {
    setTimeout(() => {
      if (($.fn.DataTable as any).isDataTable('#myTable')) {
        ($('#myTable') as any).DataTable().destroy();
      }

      $('#myTable').DataTable({
        pageLength: 10,
        lengthMenu: [5, 10, 20, 50],
        language: {
          search: "Rechercher:",
          lengthMenu: "Afficher _MENU_ éléments",
          info: "Affichage de _START_ à _END_ sur _TOTAL_ éléments",
          /*paginate: {
            next: "Suivant",
            previous: "Précédent",
            first: '',
            last: ''
          }*/
        }
      });
    }, 0);
  }

  ngOnDestroy(): void {
    if (($.fn.DataTable as any).isDataTable('#myTable')) {
      ($('#myTable') as any).DataTable().destroy();
    }
  }

  fetchMessages() {
    if (!this.user || this.user.id === undefined) {
      this.error = 'Vous devez être connecté';
      return;
    }

    this.messages$ = this.messageService.getUserMessages(this.user.id).pipe(
      tap((res: any) => {
        console.log('MESSAGES API:', res);

        setTimeout(() => {
          this.initDataTable();
        }, 0);

      }),
      map((res: any) =>
        res.data.map((m: any) => ({
          ...m,
          dateSend: new Date(m.dateSend) // ✅ conversion ici
        }))
      ),
      catchError(err => {
        this.error = 'Impossible de récupérer vos commandes';
        console.error(err);
        return throwError(() => err);
      })
    );
    /*
    this.messages$.subscribe(messages => {
      console.log('MESSAGES:', messages);
    });
    */
  }


  deleteMessage(id: number) {

    const confirmDelete = confirm(
      'Voulez-vous vraiment supprimer ce message ?'
    );

    if (!confirmDelete) {
      return;
    }

    this.messageService.delete(id).subscribe({

      next: (res) => {

        console.log('Message supprimé', res);

        // destroy DataTable avant refresh
        if (($.fn.DataTable as any).isDataTable('#myTable')) {
          ($('#myTable') as any).DataTable().destroy();
        }

        // refresh liste
        this.fetchMessages();
      },

      error: (err) => {

        console.error(err);

        alert('Erreur lors de la suppression');
      }

    });

  }

}
