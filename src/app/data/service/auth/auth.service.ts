import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private env = environment;
  private apiUrl = this.env.apiUrl;
  private apiUrlTichHop = this.env.apiUrlTichHop;

  constructor(
    private http: HttpClient,
  ) { }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials);
  }
}