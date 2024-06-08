// task-form.component.ts
import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { TareaService } from '../services/tarea.service';
import { format } from 'date-fns';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule,ToolbarComponent

  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})

export class TaskFormComponent implements OnInit{
  taskForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    priority: ['ALTA',Validators.required],
    description: ['',Validators.required],
    date: [new Date().toLocaleString()],
    user: [''],
    status: ['ACTIVA']



  });


  constructor(private fb: FormBuilder, private tareaService: TareaService) {}
  ngOnInit(): void {

    const userCode = localStorage.getItem("codigo") || '';
    this.taskForm.patchValue({ user: userCode });
  }
  onSubmit(): void {
    if (this.taskForm.valid) {
      console.log('Form Data: ', this.taskForm.value);

      // Guardar la tarea utilizando tareaService
      this.tareaService.createTarea(this.taskForm.value).subscribe(
        response => {
          console.log('Task Saved successfully', response);

          // Mostrar mensaje de confirmación
          Swal.fire({
            title: 'Tarea guardada exitosamente',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            // Redirigir al formulario para ingresar otra tarea
            this.taskForm.reset(); // Limpia el formulario
          });
        },
        error => {
          console.error('Registration failed', error);
          alert('Registration failed: ' + error.message);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }

  formatDateTime(date: string): string {
    return format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
  }
}
