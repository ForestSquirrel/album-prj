import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoUploadComponent } from './photo-upload.component';
import { FileUploadModule } from 'ng2-file-upload';
describe('PhotoUploadComponent', () => {
  let component: PhotoUploadComponent;
  let fixture: ComponentFixture<PhotoUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoUploadComponent],
      imports :[FileUploadModule]
      
    });
    fixture = TestBed.createComponent(PhotoUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
