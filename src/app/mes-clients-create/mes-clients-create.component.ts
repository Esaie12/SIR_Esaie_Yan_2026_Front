import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CustomerService } from '../services/customer.service';
import { faker } from '@faker-js/faker';

@Component({
  selector: 'app-mes-clients-create',
  imports: [RouterLink,FormsModule, CommonModule],
  templateUrl: './mes-clients-create.component.html',
  styleUrl: './mes-clients-create.component.css'
})
export class MesClientsCreateComponent {

  private customerService = inject(CustomerService);
  private authService = inject(AuthService);

  router = inject(Router);
  route = inject(ActivatedRoute);
  user? = this.authService.getUser();
  error?: string;

  clientData: any = {};

  ngOnInit() {
    //this.generateFakeClient();
  }

  onSubmit(form: any) {

    if (!this.user || this.user.id === undefined) {
      this.error = 'Vous devez être connecté';
      return;
    }

  //  console.log("Données du formulaire :", form.value);
    if(form.valid) {

      const payload = {
        ...form.value,
        userId: this.user?.id
      };
      //console.log("Payload envoyé :", payload);
      this.customerService.create(payload).subscribe({
        next: res => {
          this.router.navigate(['/clients']);
        }
      });
    }


  }

  generateFakeClient() {
    this.clientData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      localisation: faker.location.city(),
      country: faker.location.country(),
      sexe: Math.random() > 0.5 ? 'male' : 'female'
    };
  }

}
