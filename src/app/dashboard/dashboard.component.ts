import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { faker } from '@faker-js/faker';
import { MessageService } from '../services/message.service';
import { CategoryService } from '../services/category.service';
import { CustomerService } from '../services/customer.service';

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
 private customerService = inject(CustomerService);
private categoryService = inject(CategoryService);
private messageService = inject(MessageService);
private authService = inject(AuthService);


 nombreClients = 0;
 nombreGroupes = 0;
 nombreMessagesEnvoyes = 0;
 nombreNotifications = 0;

  stats$: Observable<any>;

  user? = this.authService.getUser();

  customersList: any[] = [];
  groupesList: any[] = [];


  constructor() {

    if (!this.user || this.user.id === undefined) {
      alert('Vous devez être connecté pour accéder au dashboard');

      this.router.navigate(['/login']);
      this.stats$ = new Observable(); // évite crash async
      return;
    }

    console.log('Utilisateur connecté :', this.user);

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

  generateDemoData() {

    const clientRequests = [];

    // 🔥 1. CLIENTS
    for (let i = 0; i < this.randomFrom([4, 6, 8]); i++) {

      const client = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        localisation: faker.location.city(),
        country: faker.location.country(),
        sexe: Math.random() > 0.5 ? 'male' : 'female',
        userId: this.user?.id
      };

      clientRequests.push(this.customerService.create(client));
    }

    forkJoin(clientRequests).pipe(

      // 🔥 2. GROUPES + récupération clients
      switchMap((clientsRes: any[]) => {

        const clientIds = clientsRes.map(r => r.data.id);

        const groupRequests = [];

        for (let i = 0; i < this.randomFrom([2, 3, 5]); i++) {

          const groupe = {
            libelle: faker.commerce.department(),
            color: faker.color.rgb(),
            userId: this.user?.id
          };

          groupRequests.push(this.categoryService.create(groupe));
        }

        return forkJoin(groupRequests).pipe(
          map((groupsRes: any[]) => ({
            clientIds,
            groupIds: groupsRes.map(r => r.data.id)
          }))
        );
      }),

      // 🔥 3. MESSAGES
      switchMap(({ clientIds, groupIds }) => {

        const messageRequests = [];

        for (let i = 0; i < this.randomFrom([4, 6, 8]); i++) {

          const isUser = Math.random() > 0.5;

          const message = {
            title: faker.company.catchPhrase(),
            content: faker.lorem.paragraph(),
            dateSend: new Date().toISOString().slice(0, 16),
            senderId: this.user?.id,
            userId: isUser ? this.randomFrom(clientIds) : null,
            groupeId: !isUser ? this.randomFrom(groupIds) : null
          };

          messageRequests.push(this.messageService.create(message));
        }

        return forkJoin(messageRequests).pipe(
          map(() => ({ clientIds, groupIds }))
        );
      }),

      // 🔥 4. AJOUT ALÉATOIRE DES CLIENTS DANS LES GROUPES
      switchMap(({ clientIds, groupIds }) => {

        const membershipRequests: any[] = [];

        groupIds.forEach(groupId => {

          const nbMembers = this.randomFrom([1, 2, 3]);

          const shuffledClients = [...clientIds].sort(() => Math.random() - 0.5);

          const selectedClients = shuffledClients.slice(0, nbMembers);

          selectedClients.forEach(clientId => {
            membershipRequests.push(
              this.categoryService.addUserToGroup(groupId, clientId)
            );
          });
        });

        return forkJoin(membershipRequests.length ? membershipRequests : [of(null)]);
      })

    ).subscribe({
      next: () => {
        alert('🎉 Données de démonstration générées avec succès !');
        window.location.reload();
      },
      error: (err) => {
        console.error('❌ Erreur génération data:', err);
        alert('Erreur lors de la génération des données');
      }
    });
  }


  getRandomGroupId(groups: number[]) {
    return groups[Math.floor(Math.random() * groups.length)];
  }

  getRandomClientId() {
    const clients = this.customersList || [];
    if (!clients.length) return null;

    return clients[Math.floor(Math.random() * clients.length)]?.id ?? null;
  }

  fetchClients() {
    this.customerService.getAll().subscribe({
      next: (res: any) => {
        this.customersList = res.data;
      }
    });
  }

  fetchGroupes() {
    this.categoryService.getAll().subscribe({
      next: (res: any) => {
        this.groupesList = res.data;
      }
    });
  }

  randomFrom(array: number[]) {
    return array[Math.floor(Math.random() * array.length)];
  }

}
