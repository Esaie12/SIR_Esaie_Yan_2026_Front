import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { finalize, first, last } from 'rxjs';

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
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert('Erreur d\'inscription : ' + (err.error || 'Une erreur est survenue'));
        console.error('Erreur inscription', err);
      }
    });

  }

}
