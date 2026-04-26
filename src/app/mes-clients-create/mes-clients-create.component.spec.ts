import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesClientsCreateComponent } from './mes-clients-create.component';

describe('MesClientsCreateComponent', () => {
  let component: MesClientsCreateComponent;
  let fixture: ComponentFixture<MesClientsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesClientsCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesClientsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
