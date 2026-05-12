import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private env = environment;
  private apiUrl = this.env.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials);
  }
  refreshToken(refreshTokenStr: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/refresh`, { refreshToken: refreshTokenStr });
  }
  logout() {
    const currentUrl = this.router.url;
    this.http.post(`${this.apiUrl}/auth/logout`, {}).subscribe({
      next: () => this.clearStorageAndNavigate(currentUrl),
      error: () => this.clearStorageAndNavigate(currentUrl)
    });
  }

  private clearStorageAndNavigate(returnUrl: string) {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('tokenTichHop');
    localStorage.removeItem('user');
    
    if (returnUrl && !returnUrl.includes('/login')) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: returnUrl } });
    } else {
      this.router.navigate(['/login']);
    }
  }
}