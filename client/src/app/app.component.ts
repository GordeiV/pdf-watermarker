import {Component} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  apiUrl = environment.apiUrl || 'http://localhost:3000';
  selectedFile: File | null = null;

  errorMessage: string = '';
  errorCode: number = -1;

  constructor(private http: HttpClient) {
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(f: NgForm) {
    const formData = new FormData();
    formData.append('pdfFile', this.selectedFile || '');
    formData.append('watermarkText', f.value.watermark);

    this.http
      .post(`${this.apiUrl}api/pdf/watermark`, formData, {
        observe: 'response',
        responseType: 'blob'
      })
      .subscribe({
        next: (response: any) => {
          const filename = response.headers.get('Content-Disposition')?.match(/filename="(.+)"/)?.[1] || '';
          const blob: Blob = response.body as Blob;
          const downloadURL = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadURL;
          link.download = filename || 'modified.pdf';
          link.click();

          this.errorMessage = '';
          this.errorCode = -1;
        },
        error: (error: HttpErrorResponse) => {
          this.errorCode = error.status;
          error.error.text().then((errorText: any) => {
            this.errorMessage = JSON.parse(errorText);
          })
        }
      });
  }
}
