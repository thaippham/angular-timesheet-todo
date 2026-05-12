import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShiftScheduleService {
  private env = environment;
  private apiUrl = this.env.apiUrl;

  constructor(private http: HttpClient) { }

  getSchedules(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/schedule/get-shift-schedule`);
  }
  addSchedule(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/schedule/add-shift-schedule`, data);
  }
}