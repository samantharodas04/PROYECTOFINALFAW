import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private apiUrl = 'http://localhost:3000'; // Cambia la URL según tu backend

  constructor(private http: HttpClient) {}

  createTarea(tarea: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post(`${this.apiUrl}/tarea`, tarea, httpOptions); // Añade httpOptions aquí
  }

  getTarea(param: string): Observable<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get<any[]>(`${this.apiUrl}/list/${param}`);
  }

  deleteTarea(id: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.delete(`${this.apiUrl}/deleteTask/${id}`); // Añade httpOptions aquí
  }


}
