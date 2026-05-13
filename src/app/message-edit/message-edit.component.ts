import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from '../services/message.service';
import { CategoryService } from '../services/category.service';
import { CustomerService } from '../services/customer.service';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})
export class MessageEditComponent {

  private messageService  = inject(MessageService);
  private categoryService = inject(CategoryService);
  private customerService = inject(CustomerService);
  private authService     = inject(AuthService);
  private route           = inject(ActivatedRoute);
  private router          = inject(Router);

  messageId = Number(this.route.snapshot.paramMap.get('id'));
  user?     = this.authService.getUser();
  error?:   string;

  form = {
    title:            '',
    typeDestinataire: 'user',
    userId:           null as number | null,
    groupeId:         null as number | null,
    dateSend:         '',
    content:          ''
  };

  customersList: any[] = [];
  groupesList:   any[] = [];

  ngOnInit() {
    this.loadMessage();
    this.fetchClients();
    this.fetchGroupes();
  }

  loadMessage() {
    this.messageService.getById(this.messageId).pipe(
      map((res: any) => res.data)
    ).subscribe(msg => {
      this.form = {
        title:            msg.title,
        typeDestinataire: msg.userId ? 'user' : 'group',
        userId:           msg.userId   ?? null,
        groupeId:         msg.groupeId ?? null,
        dateSend:         msg.dateSend?.slice(0, 16) ?? '',
        content:          msg.content
      };
    });
  }

  submit() {
    if (!this.user || this.user.id === undefined) {
      this.router.navigate(['/login']);
      return;
    }

    const payload = {
      senderId: this.user.id,
      title:    this.form.title,
      userId:   this.form.typeDestinataire === 'user'  ? this.form.userId   ?? null : null,
      groupeId: this.form.typeDestinataire === 'group' ? this.form.groupeId ?? null : null,
      dateSend: this.form.dateSend,
      content:  this.form.content
    };

    this.messageService.update(this.messageId, payload).subscribe({
      next:  () => this.router.navigate(['/messages']),
      error: err => { console.error(err); this.error = 'Erreur lors de la mise à jour.'; }
    });
  }

  fetchGroupes() {
    this.categoryService.getUserCategories(this.user?.id).pipe(
      map((res: any) => res.data)
    ).subscribe(data => this.groupesList = data);
  }

  fetchClients() {
    if (!this.user?.id) return;
    this.customerService.getUserMessages(this.user.id).pipe(
      map((res: any) => res.data)
    ).subscribe(data => this.customersList = data);
  }
}
