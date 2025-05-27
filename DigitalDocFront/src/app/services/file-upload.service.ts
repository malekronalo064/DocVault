import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private uploadUrl = 'https://localhost:7001/api/Document/upload';

  constructor(private http: HttpClient) { }

  uploadFile(fileName: string, folder: string, file: File, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const formData = new FormData();
    formData.append('fileName', fileName);
    formData.append('folder', folder || '');
    formData.append('file', file,)

    return this.http.post(this.uploadUrl, formData, { headers });
  }
}
