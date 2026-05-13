import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private loginService: AuthService, private router: Router) {}

  data = {
    userEmail: '',
    userPassword: '',
    userSouvenir: false
  };

  isLoading   = false;
  loginSuccess = false;

  seConnecter() {
    if (!this.data.userEmail || !this.data.userPassword) return;

    this.isLoading = true;

    this.loginService.login({
      email:    this.data.userEmail,
      password: this.data.userPassword
    }).pipe(
      finalize(() => { this.isLoading = false; })
    ).subscribe({
      next: () => {
        this.loginSuccess = true;
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (err) => {
        alert('Erreur de connexion : ' + (err.error?.message || 'Une erreur est survenue'));
        console.error('Erreur connexion', err);
      }
    });
  }

  loginRandomAccount() {
    let accounts = JSON.parse(localStorage.getItem('fake_accounts') || '[]');

    if (!accounts.length) {
      const newAccount = {
        email:    `test${Math.floor(Math.random() * 10000)}@demo.com`,
        password: '12345678'
      };
      accounts.push(newAccount);
      localStorage.setItem('fake_accounts', JSON.stringify(accounts));
    }

    const random = accounts[Math.floor(Math.random() * accounts.length)];
    this.data.userEmail    = random.email;
    this.data.userPassword = random.password;
  }
}
