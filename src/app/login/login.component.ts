import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../auth.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: [''],
    password: ['']
  });

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    // Registra los datos del login usando utilizando authService
    this.authService.login(this.loginForm.value).subscribe(
      response => {
        console.log('Login successful', response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('codigo', response.codigo);

      this.router.navigate(['/form']);
      },
      error => {
        console.error('Login failed', error);
        Swal.fire({
          title: 'Error!',
          text: 'Usuario o contraseña no valido!',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    );
  }
}
