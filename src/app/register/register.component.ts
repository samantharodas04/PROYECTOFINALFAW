import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../auth.service';
import { MatRadioModule } from '@angular/material/radio';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, MatRadioModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    password: ['', Validators.required],
    birthdate: ['', Validators.required],
    gender: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private authService: AuthService,private router: Router) { }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Form Data: ', this.registerForm.value);

      // Registra al usando utilizando authService
      this.authService.register(this.registerForm.value).subscribe(
        response => {
          console.log('Registration successful', response);

          // Mostrar mensaje de confirmación
          Swal.fire({
            title: 'Registro exitoso',
            text: '¡Bienvenido! Tu cuenta ha sido creada.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            // Redirigir al formulario para ingresar otra tarea
            this.registerForm.reset(); // Limpia el formulario
          });
        },
        error => {
          console.error('Registration failed', error);
        Swal.fire({
          title: 'Error!',
          text: 'Correo ya existe.',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }


}
