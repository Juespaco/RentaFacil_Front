import { Component } from '@angular/core';
import { LoginUser } from '../../models/login';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../models/auth';
import { Role } from '../../models/role';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JwtService } from '../../services/jwt.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
authResponse: Auth;
  userForm: LoginUser= new LoginUser();
  modulesUser: string;
  roles: Role[] = [];
  isValidCredentials: boolean = true;
  constructor(
    private AuthService: AuthService,
    private router: Router,
    private jwtService: JwtService
  ) {}

  login(){
    this.AuthService.Login(this.userForm).subscribe(
      (response) => {
        if(response.token){
          this.authResponse = response;
          localStorage.setItem('access_token', this.authResponse.token.toString());
          this.modulesUser = this.jwtService.getClaim(this.authResponse.token.toString(), 'modules');
          const modulesJSON =JSON.parse(this.modulesUser);
          if (modulesJSON != null) {
            this.router.navigate(['/booking']);
            this.roles = modulesJSON as Role[];
            this.jwtService.setRoles(this.roles);
          }else{
            localStorage.removeItem('access_token');
            this.router.navigate(['/login']);
          }
        }else{
          this.isValidCredentials = false;
        }
        
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          text: 'Credenciales inválidas',
          showConfirmButton: true,
          confirmButtonColor: '#06100D',
        });
      }
    );
  }
}
