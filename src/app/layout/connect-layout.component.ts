import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-connect-layout',
  imports: [RouterOutlet, NavBarComponent],
  template: `
  <body >
    <nav-bar></nav-bar>

    <main class="container-fluid">
      <router-outlet></router-outlet>
    </main>

    <!-- 🔷 FOOTER -->
    <!--footer class="bg-dark text-white text-center mt-5 p-2">
      © 2026 - MyDashboard
    </footer-->

  </body>
  `,
  //styleUrl: './connect-layout.component.css'
})
export class ConnectLayoutComponent {

}

