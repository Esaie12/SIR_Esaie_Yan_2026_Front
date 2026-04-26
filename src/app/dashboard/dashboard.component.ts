import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { map, Observable, tap } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
 standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

 router = inject(Router);
 private dashboardService = inject(DashboardService);

 nombreClients = 0;
 nombreGroupes = 0;
 nombreMessagesEnvoyes = 0;
 nombreNotifications = 0;

  stats$: Observable<any>;


  private authService = inject(AuthService);
  user? = this.authService.getUser();


  constructor() {

    if (!this.user || this.user.id === undefined) {
      alert('Vous devez être connecté pour accéder au dashboard');

      this.router.navigate(['/login']);
      this.stats$ = new Observable(); // évite crash async
      return;
    }

    this.stats$ = this.dashboardService.getMyDashboard(this.user.id).pipe(
      tap(res => console.log('API RESPONSE:', res)),
      map((res: any) => res.data),
      tap(data => {
       // console.log('DASHBOARD DATA:', data);
        this.nombreClients = data.nombreClients;
        this.nombreGroupes = data.nombreGroupes;
        this.nombreMessagesEnvoyes = data.nombreMessagesEnvoyes;
        this.nombreNotifications = 0;
      })
    );
  }

}
