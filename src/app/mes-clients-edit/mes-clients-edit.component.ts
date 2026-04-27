import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mes-clients-edit',
  standalone:true,
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './mes-clients-edit.component.html',
  styleUrl: './mes-clients-edit.component.css'
})
export class MesClientsEditComponent {

  private customerService = inject(CustomerService);
  private authService = inject(AuthService);

  router = inject(Router);
  route = inject(ActivatedRoute);

  user? = this.authService.getUser();
  error?: string;

  clientId?: number;
  clientData: any = {};

  ngOnInit() {
    this.clientId = Number(this.route.snapshot.paramMap.get('id'));

    console.log('ID récupéré depuis l’URL :', this.clientId);

    if (this.clientId) {
      this.customerService.getById(this.clientId).subscribe({
        next: (res: any) => {
          console.log('Données du client reçues :', res);
          this.clientData = res.data;
        },
        error: (err) => {
          console.error('Erreur lors du chargement du client :', err);
        }
      });
    } else {
      console.warn('Aucun ID trouvé dans l’URL');
    }
  }

  onSubmit(form: any) {

    if (!this.user || this.user.id === undefined) {
      this.error = 'Vous devez être connecté';
      return;
    }

    if (form.valid && this.clientId) {

      const payload = {
        ...this.clientData,
        userId: this.user.id
      };

      this.customerService.update(this.clientId, payload).subscribe({
        next: () => {
          this.router.navigate(['/clients']);
        }
      });
    }
  }

}
