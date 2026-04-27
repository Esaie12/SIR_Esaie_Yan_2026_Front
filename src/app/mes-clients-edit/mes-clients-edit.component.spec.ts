import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesClientsEditComponent } from './mes-clients-edit.component';

describe('MesClientsEditComponent', () => {
  let component: MesClientsEditComponent;
  let fixture: ComponentFixture<MesClientsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesClientsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesClientsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
