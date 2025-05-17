import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { JwtService } from '../../services/jwt.service';
import { Role } from '../../models/role';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{
  navbarCollapsed: boolean = true;
  dropdownActive: boolean = false;
  roles: Role[] = new Array<Role>();
  logged: boolean = false;
  constructor(
    private jwtService: JwtService,
    private router: Router
    ) {}

  ngOnInit(): void {
    var token = localStorage.getItem('access_token')?.toString();
    var modulesUser = token? this.jwtService.getClaim(token, 'modules'): null;
    const modulesJSON =JSON.parse(modulesUser);
    if (modulesJSON) {
      this.roles = modulesJSON as Role[];
      this.logged = true;
    }
    this.jwtService.roles.subscribe(response =>{
      this.roles = response;
      this.logged = true;
    });
  }
  ValidateRole(roleName: string): boolean {
    
    var role = this.roles.find(x => x.Name == roleName);
    if(role){
      return true;
    }else{
      return false;
    }
  }
  logout(){
    localStorage.removeItem('access_token');
    this.logged = false;
    this.roles = new Array<Role>();
    this.router.navigate(['/login']);
  }
}
