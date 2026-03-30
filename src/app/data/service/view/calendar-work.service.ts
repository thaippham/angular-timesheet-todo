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

  getSchedulesByRange(fromDate: string, toDate: string, userId?: string | number): Observable<any[]> {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let params = new HttpParams()
      .set('from-date', fromDate)
      .set('to-date', toDate);

    if (userId) {
      params = params.set('userId', userId.toString());
    }

    return this.http.get<any[]>(`${this.apiUrl}/calendar-work/range`, { params, headers });
  }

}
