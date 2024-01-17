import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlbumPageComponent } from './album-page/album-page.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatChipsModule} from '@angular/material/chips';
import { FileUploadModule} from 'ng2-file-upload';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import {MatPaginatorModule} from '@angular/material/paginator';
import {DragDropModule} from '@angular/cdk/drag-drop';

import {
  GalleryModule,
  GalleryItem,
  ImageItem,
  ImageSize,
  ThumbnailsPosition,
  Gallery,
} from 'ng-gallery';
import { LightboxModule, Lightbox } from 'ng-gallery/lightbox';

import 'hammerjs';
import { PhotosPageComponent } from './photos-page/photos-page.component';
import { PhotoUploadComponent } from './photo-upload/photo-upload.component';
import { PhotoViewEditComponentComponent } from './photo-view-edit-component/photo-view-edit-component.component';
import { AlbumCreateComponent } from './album-create/album-create.component';
import { AlbumViewEditPageComponent } from './album-view-edit-page/album-view-edit-page.component';
@NgModule({
  declarations: [
    AppComponent,
    AlbumPageComponent,
    PhotosPageComponent,
    PhotoUploadComponent,
    PhotoViewEditComponentComponent,
    AlbumCreateComponent,
    AlbumViewEditPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    DragDropModule, 
    MatDialogModule,
    MatFormFieldModule,
    MatStepperModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatChipsModule,
    GalleryModule,
    LightboxModule,
    FormsModule,
    FileUploadModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
