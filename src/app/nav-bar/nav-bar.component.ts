import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'nav-bar',
  imports: [RouterLink, RouterLinkActive, CommonModule, RouterLinkActive],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  router = inject(Router);

  logout() {
    localStorage.removeItem('user');
    //localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

}
