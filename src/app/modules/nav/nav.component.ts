import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  userName: string = 'Khách'; 

  menuItems = [
    { label: 'Lịch làm', route: '' }, 
    { label: 'Danh sách giờ làm', route: 'employee-calendar' }
  ];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userName = user.name;
    }
  }

  logout(): void {
    localStorage.removeItem('tokenTichHop');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']); 
  }

}
