import { Routes } from '@angular/router';
import { ConnectLayoutComponent } from './layout/connect-layout.component';
import { AppComponent } from './app.component';
import { CategoryComponent } from './category/category.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MessageComponent } from './message/message.component';
import { MesClientsComponent } from './mes-clients/mes-clients.component';
import { MesClientsCreateComponent } from './mes-clients-create/mes-clients-create.component';
import { CategoryManageComponent } from './category-manage/category-manage.component';
import { MessageFormComponent } from './message-create/message-form.component';
import { LoginComponent } from './auth-login/login.component';
import { RegisterComponent } from './auth-register/register.component';

export const routes: Routes = [
  {
    path: '',
    component: ConnectLayoutComponent,
    children:[
      { path: '', component: DashboardComponent },
      {path: 'dashboard', component: DashboardComponent },
      { path: 'category', component: CategoryComponent },
      { path: 'category/:id/manage', component: CategoryManageComponent },
      //Les messages
      { path: 'messages', component: MessageComponent },
      {path: 'messages-create', component: MessageFormComponent },

      //Mes clients
      {path: 'clients', component: MesClientsComponent },
      {path: 'clients-create', component: MesClientsCreateComponent }
    ]
  },

  {path:'login', component: LoginComponent },
  {path:'register', component: RegisterComponent }
];
