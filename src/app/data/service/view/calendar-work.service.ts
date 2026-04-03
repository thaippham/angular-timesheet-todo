import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalendarWorkService {

  private env = environment;
  private apiUrl = this.env.apiUrl;

  constructor(private http: HttpClient) {}

  getSchedulesByRange(fromDate: number, toDate: number, userId?: string | number): Observable<any[]> {

    const token = localStorage.getItem('token');
    const tokenTichHop = localStorage.getItem('tokenTichHop');
    let headers = new HttpHeaders();
    if (token && tokenTichHop) {
      headers = headers.set('Authorization', `Bearer ${token}`);
      headers = headers.set('x-tichhop-token', tokenTichHop);      
    } else {
      return new Observable<any[]>(subscriber => {
        subscriber.error('Token not found');
      });
    }
    let params = new HttpParams()
      .set('month', fromDate)
      .set('year', toDate);

    if (userId) {
      params = params.set('accountId', userId.toString());
    }

    return this.http.get<any[]>(`${this.apiUrl}/calendar-work/get-work-list`, { params, headers });
  }

}
