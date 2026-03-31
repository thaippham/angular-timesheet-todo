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
  private apiUrlTichHop = this.env.apiUrlTichHop;

  constructor(private http: HttpClient) {}

  getSchedulesByRange(fromDate: number, toDate: number, userId?: string | number): Observable<any[]> {

    const token = localStorage.getItem('tokenTichHop');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let params = new HttpParams()
      .set('month', fromDate)
      .set('year', toDate);

    if (userId) {
      params = params.set('accountId', userId.toString());
    }

    return this.http.get<any[]>(`${this.apiUrlTichHop}/employee/get-work-list`, { params, headers });
  }

}
