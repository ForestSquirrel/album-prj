import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumCreateComponent } from './album-create.component';

describe('AlbumCreateComponent', () => {
  let component: AlbumCreateComponent;
  let fixture: ComponentFixture<AlbumCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlbumCreateComponent]
    });
    fixture = TestBed.createComponent(AlbumCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
