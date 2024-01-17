import { Component, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import { HttpClient, HttpParams } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
const URL = 'http://localhost:3001/api/v1/photos'; // URL to your server endpoint
@Component({
  selector: 'app-photo-view-edit-component',
  templateUrl: './photo-view-edit-component.component.html',
  styleUrls: ['./photo-view-edit-component.component.css']
})
export class PhotoViewEditComponentComponent {
  constructor(
    public dialogRef: MatDialogRef<PhotoViewEditComponentComponent>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  editableTitle: string = ''; // Initialize with the current photo title
  editableHashtags: string = ''; // Initialize with current hashtags, separated by commas or spaces
  uploadedPhotoUrl: string = ''; // The URL of the photo to be edited
  currentHashtags: string[] = [];
  isDeleted: boolean = false;
    ngOnInit(){
      const photoUrl = `${URL}/${this.data.photoId}`;
      this.http.get<PhotoItem>(photoUrl).subscribe(item => {
        this.editableTitle = item.title;
        this.currentHashtags = item.hashtags.split(';');
        this.uploadedPhotoUrl = item.filePath;
      })
    }

    confirmChanges() {
      this.editableHashtags = this.parseChipData(this.currentHashtags);
    
      let updateData: any = {};
      if (this.editableTitle && this.editableTitle.trim() !== '') {
        updateData.title = this.editableTitle;
      }
      if (this.editableHashtags && this.editableHashtags.trim() !== '') {
        updateData.hashtags = this.editableHashtags;
      }
    
      const photoUrl = `${URL}/${this.data.photoId}`;
      this.http.patch(photoUrl, updateData).subscribe({
        next: () => {
          console.log('Confirmed changes:', this.editableTitle, this.editableHashtags);
          // Handle successful update here, like closing the dialog or refreshing data
        },
        error: (err) => {
          console.error('Error updating photo:', err);
          // Handle the error, possibly show an error message to the user
        }
      });
    }

  closeDialog() {
    console.log('Closing without changes');
    this.dialogRef.close();
  }

  deletePhoto() {
    // Logic to handle photo deletion
    console.log('Deleting photo');
    const photoUrl = `${URL}/${this.data.photoId}`;
    this.http.delete(photoUrl).subscribe({
      next: () => {
        this.isDeleted = true;
        this.editableTitle = "Successfully deleted"
        this.currentHashtags = [];
        this.uploadedPhotoUrl = 'https://cdn1.iconfinder.com/data/icons/round-web-icons/100/rwi-38-512.png';
      },
      error: (err) => {
        console.error('Error deleting photo:', err);
      }
    }
    );
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

interface PhotoItem {
  id: number;
  title: string;
  uploadDate: string;
  hashtags: string;
  fileName: string;
  filePath: string;
  createdAt: string;
  updatedAt: string;
}