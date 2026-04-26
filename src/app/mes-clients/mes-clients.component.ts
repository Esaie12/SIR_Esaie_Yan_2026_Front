
import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import $ from 'jquery';
import 'datatables.net';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { AuthService } from '../services/auth.service';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Customer } from '../models/customer.model';

@Component({
  selector: 'app-mes-clients',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './mes-clients.component.html',
  //styleUrl: './mes-clients.component.css'
})
export class MesClientsComponent implements OnInit{ // implements AfterViewInit, OnDestroy

  private customerService = inject(CustomerService);
  private authService = inject(AuthService);
  user? = this.authService.getUser();

  customers$!: Observable<Customer[]>;
  error?: string;


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


  ngOnInit(): void {
    this.fetchClients();
  }

  fetchClients() {

      if (!this.user || this.user.id === undefined) {

        this.error = 'Vous devez être connecté';
        return;
      }

      this.customers$ =  this.customerService.getUserMessages(this.user?.id).pipe( // this.categoryService.getUserCategories().pipe(
        tap((res: any) => {
          console.log('CUSTOMERS API:', res);

          setTimeout(() => {
            this.initDataTable();
          }, 0);

        }),
        map((res: any) => res.data),
        catchError(err => {
          this.error = 'Impossible de récupérer vos commandes';
          console.error(err);
          return throwError(() => err);
        })
      );
  }




}
