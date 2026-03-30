import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserShiftScheduleService {
  private env = environment;
  private apiUrl = this.env.apiUrl;

  constructor(private http: HttpClient) { }

  getAllEmployees(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<any>(`${this.apiUrl}/users/get-all-user`, { headers });
  }
}