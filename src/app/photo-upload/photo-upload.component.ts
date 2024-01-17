import { Component } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import { HttpClient } from "@angular/common/http";
import { MatDialogRef } from '@angular/material/dialog';

const URL = 'http://localhost:3001/api/v1/photos'; // URL to your server endpoint

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.css'],
})
export class PhotoUploadComponent {
  constructor(
    public dialogRef: MatDialogRef<PhotoUploadComponent>,
    private http: HttpClient,
  ) { }

  selectedFile: File | null = null; // Now holds a single File object
  // Additional form data
  photoTitle = '';
  photoHashtags = '';
  photoUploaded = false;
  uploadComplete = false;
  uploadedPhotoUrl = ''; // URL of the uploaded photo
  hashChips: string[] = [];

  visible = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  hashtags = ['ExampleHashtag'];

  ngOnInit() {
    this.photoTitle = '';
    this.photoHashtags = '';
    this.photoUploaded = false;
    this.uploadComplete = false;
    this.uploadedPhotoUrl = ''
    this.hashChips = [];
  };
  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.photoUploaded = true;
    }
  }

  upload() {
    if (!this.selectedFile) {
      // Handle the case where no file is selected
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
    formData.append('title', this.photoTitle);
    formData.append('hashtags', this.hashtags.join(';'));

    this.http.post(URL, formData).subscribe({
      next: (data: any) => {
        this.photoTitle = data.data.title;
        this.uploadedPhotoUrl = data.data.filePath;
        this.photoHashtags = data.data.hashtags;
        this.hashChips = this.parseChipData(this.photoHashtags);
        this.uploadComplete = true;
      }
    }
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our hashtag
    if (value) {
      this.hashtags.push(value);
      console.log(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(hashtag: string): void {
    const index = this.hashtags.indexOf(hashtag);

    if (index >= 0) {
      this.hashtags.splice(index, 1);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
  parseChipData(dataString: string): string[] {
    return dataString.split(';'); // Split by ';' delimiter
  }

}

