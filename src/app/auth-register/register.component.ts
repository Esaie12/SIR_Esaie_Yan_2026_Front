import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { finalize, first, last } from 'rxjs';
import { faker } from '@faker-js/faker';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink,CommonModule,FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private registerService: AuthService , private router: Router ) {}


  categorieChoisie: 'physique' | 'entreprise' | null = null;

  formPhysique = {
    nom: '',
    dateNaissance: '',
    telephone: '',
    email: '',
    password: ''
  };

  formEntreprise = {
    nom: '',
    email: '',
    telephone: '',
    localisation: '',
    siret: '',
    password: ''
  };

  choisirCategorie(categorie: 'physique' | 'entreprise') {
    this.categorieChoisie = categorie;
  }

  submitForm() {
    let data: any;

    if (this.categorieChoisie === 'physique') {
     // console.log('Personne physique:', this.formPhysique);
      data ={
        email:this.formPhysique.email,
        password:this.formPhysique.password,
        firstname:this.formPhysique.nom,
        lastname:this.formPhysique.nom,
        type:"PHYSIQUE",
        sexe:"M",
        birthday:this.formPhysique.dateNaissance,
      }
    } else if (this.categorieChoisie === 'entreprise') {
     // console.log('Entreprise:', this.formEntreprise);
      data ={
        email:this.formEntreprise.email,
        password:this.formEntreprise.password,
        firstname:this.formEntreprise.nom,
        lastname:this.formEntreprise.nom,
        type:"MORAL",
        companyName:this.formEntreprise.nom,
        //telephone:this.formEntreprise.telephone,
      }
    }
    console.log(data);

    this.registerService.register(data).pipe(
          finalize(() => {

           // this.isLoading = false;
          })
        )
    .subscribe({
      next: () => {

        // 🔥 Sauvegarde pour mode démo
        const fakeAccounts = JSON.parse(localStorage.getItem('fake_accounts') || '[]');

        fakeAccounts.push({
          email: data.email,
          password: data.password,
          type: data.type
        });

        localStorage.setItem('fake_accounts', JSON.stringify(fakeAccounts));

        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert('Erreur d\'inscription : ' + (err.error || 'Une erreur est survenue'));
        console.error('Erreur inscription', err);
      }
    });

  }


  generateFakeRegister() {

    const isPhysique = Math.random() > 0.5;

    this.categorieChoisie = isPhysique ? 'physique' : 'entreprise';

    const password = '12345678';

    if (isPhysique) {

      this.formPhysique = {
        nom: faker.person.fullName(),
        dateNaissance: faker.date.birthdate().toISOString().split('T')[0],
        telephone: faker.phone.number(),
        email: faker.internet.email(),
        password
      };

    } else {

      this.formEntreprise = {
        nom: faker.company.name(),
        email: faker.internet.email(),
        telephone: faker.phone.number(),
        localisation: faker.location.city(),
        siret: faker.number.int({ min: 10000000000000, max: 99999999999999 }).toString(),
        password
      };

    }

    console.log('Inscription fake générée ✔️');
  }

  clearFakeAccounts() {

    const confirmDelete = confirm('Voulez-vous vraiment supprimer tous les comptes de démonstration ?');

    if (confirmDelete) {
      localStorage.removeItem('fake_accounts');

      console.log('Mémoire des comptes fake supprimée ✔️');

      alert('Tous les comptes de démonstration ont été supprimés.');
    }

  }

}
