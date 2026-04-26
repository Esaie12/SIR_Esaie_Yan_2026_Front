import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectLayoutComponent } from './connect-layout.component';

describe('ConnectLayoutComponent', () => {
  let component: ConnectLayoutComponent;
  let fixture: ComponentFixture<ConnectLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
