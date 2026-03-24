import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AccountDTO {
  email: string;
  password: string;
  firstname?: string;
  lastname?: string;
}

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  mode = signal<'login' | 'register'>('login');
  isLoading = signal(false);
  showPwd = signal(false);
  error = signal('');

  dots = Array(25).fill(0);

  loginData: AccountDTO = { email: '', password: '' };
  registerData: AccountDTO = { email: '', password: '', firstname: '', lastname: '' };

  switchMode(m: 'login' | 'register') {
    this.mode.set(m);
    this.error.set('');
  }

  togglePwd() {
    this.showPwd.set(!this.showPwd());
  }

  onLogin() {
    this.error.set('');
    if (!this.loginData.email || !this.loginData.password) {
      this.error.set('Veuillez remplir tous les champs.');
      return;
    }
    this.isLoading.set(true);
    // TODO: appel AuthService.login(this.loginData)
    setTimeout(() => this.isLoading.set(false), 1500);
  }

  onRegister() {
    this.error.set('');
    const f = this.registerData;
    if (!f.firstname || !f.lastname || !f.email || !f.password) {
      this.error.set('Veuillez remplir tous les champs.');
      return;
    }
    if (f.password.length < 8) {
      this.error.set('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    this.isLoading.set(true);
    // TODO: appel AuthService.register(this.registerData)
    setTimeout(() => this.isLoading.set(false), 1500);
  }
}
