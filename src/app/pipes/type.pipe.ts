import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'type',
  standalone: true
})
export class TypePipe implements PipeTransform {

  transform(value: number): string {
    if(value == 1) return 'ALTA'
    else if(value == 2) return 'MEDIA'
    else return 'BAJA'
  }

}
