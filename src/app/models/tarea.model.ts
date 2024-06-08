export interface Tarea {
  id?: string;
  nombre: string;
  type: number;
  descripcion: string;
  fechaCreacion: Date;
  usuario: string;
  status: string;
}
