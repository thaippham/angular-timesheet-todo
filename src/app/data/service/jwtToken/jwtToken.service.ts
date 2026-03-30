import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtTokenService {

  constructor() { }
  decodeToken(token: string): any {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload); 
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Lỗi giải mã token:', error);
    return null;
  }
}
}
