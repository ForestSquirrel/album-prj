import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { PhotoViewEditComponentComponent } from '../photo-view-edit-component/photo-view-edit-component.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDragPreview,
  CdkDrag,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import {
  GalleryModule,
  GalleryItem,
  ImageItem,
  ImageSize,
  ThumbnailsPosition,
  Gallery,
  GalleryRef
} from 'ng-gallery';
import { LightboxModule, Lightbox } from 'ng-gallery/lightbox';

const URL = 'http://localhost:3001/api/v1/albums'; // URL to your server endpoint
const URL_TO_PHOTOS_API = 'http://localhost:3001/api/v1/photos';

@Component({
  selector: 'app-album-view-edit-page',
  templateUrl: './album-view-edit-page.component.html',
  styleUrls: ['./album-view-edit-page.component.css']
})
export class AlbumViewEditPageComponent implements OnInit {
  albumId!: number; // The exclamation mark is a non-null assertion operator
  album!: any; // Here you might want to define a more specific type

  availablePhotos: Photo[] = []; // This will store all available photos
  albumPhotos: Photo[] = []; // This will store photos already in the album
  items: GalleryItem[] = [];
  lightboxRef: GalleryRef = this.gallery.ref('lightbox');
  galleryRef: GalleryRef = this.gallery.ref('test');
  isPhotos: boolean = false;
  isRelevant: boolean = false;
  photoDbIds: number[] = [];
  curGIdx: number | undefined;

  currentHashtags: string[] = [];
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  editableTitle: string = ''; // Initialize with the current photo title


  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private http: HttpClient,
    public gallery: Gallery,
    public lightbox: Lightbox
  ) { }

  ngOnInit(): void {
    this.albumId = +this.route.snapshot.params['id']; // Convert string 'id' to a number
    this.loadAlbumDetails();
  }

  loadAlbumDetails() {
    this.http.get<AlbumDetails>(`${URL}/${this.albumId}`).subscribe(data => {
      this.album = data;
      this.albumPhotos = data.Photos; // Assuming 'photos' is an array of photo objects
      this.currentHashtags = data.hashtags.split(';');
      this.editableTitle = data.title;
      console.log("Load album details", this.albumPhotos);
      console.log("Load page", this.albumPhotos);
      this.items = this.albumPhotos.map(
        item => new ImageItem({ src: item.filePath, thumb: item.filePath })
      );
      this.lightboxRef.load(this.items);
      this.galleryRef.state.subscribe(state => {
        console.log('Current index:', state.currIndex);
        this.curGIdx = state.currIndex;
        if (state.currIndex !== undefined) {
          this.isRelevant = true;
        } else {
          this.isRelevant = false;
        }
      });
      this.loadAvailablePhotos(); // Now load available photos after album photos are set
    });
  }

  loadAvailablePhotos() {
    this.http.get<Photo[]>(URL_TO_PHOTOS_API).subscribe(data => {
      // Filter out photos that are already in the album
      const albumPhotoIds = new Set(this.albumPhotos.map(photo => photo.id));
      this.photoDbIds = Array.from(albumPhotoIds);
      this.availablePhotos = data.filter(photo => !albumPhotoIds.has(photo.id));
    });
  }

  drop(event: CdkDragDrop<Photo[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      // After moving items, you might want to save the changes to the server
    }
  }
  saveAlbumPhotos() {
    const photoIds = this.albumPhotos.map(photo => photo.id);
    this.http.patch(`${URL}/${this.albumId}`, { photoIds: photoIds })
      .subscribe({
        next: () => console.log('Album photos updated successfully'),
        error: (err) => console.error('Error updating album photos:', err)
      });
  }
  addPhotos() {
    if (this.isPhotos) {
      this.saveAlbumPhotos();
      this.items = this.albumPhotos.map(
        item => new ImageItem({ src: item.filePath, thumb: item.filePath })
      );
      this.lightboxRef.load(this.items);
      this.isPhotos = !this.isPhotos;
    } else {
      this.isPhotos = !this.isPhotos;
    }
  }

  onItemClick(event: any): void {
    const dbId = this.photoDbIds[event];
    console.log("Clicked on image", event, " dbId = ", dbId);
    const dialogRef = this.dialog.open(PhotoViewEditComponentComponent, {
      data: { photoId: dbId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.loadAlbumDetails();
    });
  }
  // Add methods for edit, add photos, etc.
  onThumbSet() {
    if (this.curGIdx !== undefined) {
      this.http.patch(`${URL}/${this.albumId}`, { thumbPath: this.albumPhotos[this.curGIdx].filePath })
        .subscribe({
          next: () => console.log('Album thumb updated successfully'),
          error: (err) => console.error('Error updating album thumb:', err)
        });
    }
  }
  onMetaSet() {
    this.http.patch(`${URL}/${this.albumId}`, { title: this.editableTitle, hashtags: this.currentHashtags.join(';') })
      .subscribe({
        next: () => console.log('Album updated successfully'),
        error: (err) => console.error('Error updating album:', err)
      });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our hashtag
    if (value) {
      this.currentHashtags.push(value);
      console.log(value);
    }
    // Clear the input value
    event.chipInput!.clear();
    console.log(this.parseChipData(this.currentHashtags));
  }

  remove(hashtag: string): void {
    const index = this.currentHashtags.indexOf(hashtag);
    if (index >= 0) {
      this.currentHashtags.splice(index, 1);
      console.log(this.parseChipData(this.currentHashtags));
    }
  }
  parseChipData(dataString: string[]): string {
    return dataString.join(';'); // Split by ';' delimiter
  }
}

interface Photo {
  id: number;
  title: string;
  uploadDate: string;
  hashtags: string;
  fileName: string;
  filePath: string;
  createdAt: string;
  updatedAt: string;
}

interface AlbumDetails {
  id: number;
  title: string;
  hashtags: string;
  thumbPath: string;
  createdAt: string;
  updatedAt: string;
  Photos: Photo[]; // Assuming this is how your album details come from the API
  // ... other album properties
}