import { Component, OnInit,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { Tarea } from '../models/tarea.model';
import { TareaService } from '../services/tarea.service';
import { TypePipe } from '../pipes/type.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule,ToolbarComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];
  ordenar = "asd";
  isAscending: boolean = true; // Estado de la ordenación
  constructor(private tareaService: TareaService) {}


  ngOnInit(): void {
    this.listar("", "", this.ordenar);
  }


  onButtonClick(param: number): void {
    console.log('Button clicked!', param)
    Swal.fire({
      title: "¿ Desea dar por terminada la tarea?",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
    }).then((result) => {

      if (result.isConfirmed) {
        this.tareaService.deleteTarea(param).subscribe(
          response => {console.log('Task Saved successfuly', response)
            Swal.fire({
              title: "Eliminado!",
              text: "Se eliminó correctamente.",
              icon: "success"
            });
            this.listar("", "", this.ordenar);
          },
          error => {
            console.error('Registration failed', error);
            alert('Registration failed: ' + error.message); // Mostrar mensaje de error al usuario
          }
        );
      }
    });


  }

  listar(title: string, priority: string, order: string){
    const userCode = localStorage.getItem("codigo") || '';
    //Llama al método getTarea del TareaService pasando el código del usuario y se suscribe al observable que devuelve.
    this.tareaService.getTarea(userCode).subscribe(
      //Recibe los datos (tareas) y los asigna a la propiedad tasks
      (data) => {
        this.tasks = data;
        // Si el title no es una cadena vacía, filtra las tareas para incluir solo aquellas cuyo título contenga el texto del filtro, sin importar mayúsculas o minúsculas.
        if (title != "") {
          this.tasks = data.filter(item => item.title.toLowerCase().includes(title));
        }
        //Si la priority no es una cadena vacía y no es "TODAS", filtra las tareas para incluir solo aquellas cuya prioridad coincida con el filtro.
        if (priority != "" && priority != "TODAS") {
          this.tasks = data.filter(item => item.priority.toUpperCase().includes(priority));
        }
        //Si order no es una cadena vacía, ordena las tareas por la fecha (date):
        //Compara las fechas de dos tareas.
        //Ajusta el valor de comparison según si la fecha de a es mayor, menor o igual a la fecha de b.
        //Devuelve el valor de comparison o su negativo dependiendo del valor de isAscending.
        if (order != "") {
          this.tasks = data.sort((a, b) => {
            const nameA = a.date;
            const nameB = b.date;
            let comparison = 0;
          if (nameA > nameB) {
            comparison = 1;
          } else if (nameA < nameB) {
            comparison = -1;
          }
          return this.isAscending ? comparison : comparison * -1;
              });
            }
            //Invierte el valor de isAscending para cambiar el orden en la próxima llamada a listar.
            this.isAscending = !this.isAscending;
      },
      (error) => {
        //Maneja los errores que puedan ocurrir al obtener las tareas, registrándolos en la consola.
        console.error('Failed to fetch tasks', error);
      }
    );
  }

  //Maneja el cambio en el campo de filtro de texto.
  //Obtiene el valor del filtro, lo recorta y lo convierte a minúsculas.
  //Registra el valor en la consola.
  //Llama al método listar pasando el valor del filtro y cadenas vacías para prioridad y orden.
  onFilterChange(event: any): void {
    const filterValue = event.target.value.trim().toLowerCase();
    console.log('Texto de filtrado cambiado:', filterValue);
    this.listar(filterValue,"","");


  }

  //Maneja el cambio en el campo de filtro de selección.
  //Obtiene el valor del filtro.
  //Registra el valor en la consola.
  //Llama al método listar pasando el valor del filtro de selección y cadenas vacías para el título y el orden.
  onFilterSelect(event: any): void {
    const filterValue = event.target.value;
    console.log('Texto de seleccionado cambiado:', filterValue);
    this.listar("",filterValue,"");

  }

  //Cambia el estado de ordenar y vuelve a listar las tareas en el nuevo orden.
  //Alterna el valor de ordenar entre "asd" y "des".
  //Llama al método listar con cadenas vacías para título y prioridad, y el nuevo valor de ordenar.

  onOrderClick(): void {
    if (this.ordenar== "asd") {
      this.ordenar="des";

    }

    if (this.ordenar== "des") {
      this.ordenar="asd";

    }
    this.listar("", "", this.ordenar);
  }

  //Devuelve el color correspondiente a la prioridad de una tarea.
  //Define un objeto priorityColors que mapea prioridades a colores.
  //Devuelve el color correspondiente a la prioridad dada o una cadena vacía si no se encuentra.

  getPriorityColor(priority: string): string {
    const priorityColors: { [key: string]: string } = {
      ALTA: '#FF0000', // Rojo para alta
      MEDIA: '#d9ff00d4', // Naranja para media
      BAJA: '#008000', // Verde para baja
    };

    return priorityColors[priority] || ''; // Devuelve el color correspondiente o cadena vacía si no se encuentra
  }

}
