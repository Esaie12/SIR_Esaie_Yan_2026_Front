import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink,CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private loginService: AuthService , private router: Router ) {}

  data ={
    userEmail:"",
    userPassword:"",
    userSouvenir:false
  }

  isLoading = false;

  seConnecter() {

    if (!this.data.userEmail || !this.data.userPassword) {
      /*this.toastr.error(
        'Veuillez saisir votre email et votre mot de passe',
        'Champs obligatoires'
      );
      return;*/
    }

    this.isLoading = true;

    this.loginService.login({
      email: this.data.userEmail,
      password: this.data.userPassword
    }).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        alert('Erreur de connexion : ' + (err.error.message || 'Une erreur est survenue'));
        console.error('Erreur connexion', err);
      }
    });
  }


}
