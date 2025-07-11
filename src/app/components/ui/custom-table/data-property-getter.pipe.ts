import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'dataPropertyGetter',
  standalone:true
})
export class DataPropertyGetterPipe implements PipeTransform {

  transform(object: any, keyName: string, ...args: unknown[]): unknown {
    return this.resolveField(object, keyName, '');
  }

  resolveField(model, path, def) {
    path = path || '';
    model = model || {};
    def = typeof def === 'undefined' ? '' : def;
    const parts = path.split('.');
    if (parts.length > 1 && typeof model[parts[0]] === 'object') {
      return this.resolveField(model[parts[0]], parts.splice(1).join('.'), def);
    } else {
      return model[parts[0]] || def;
    }
    // if (parts.length > 1 && typeof model[parts[0]] === 'object') {
    //   for (let i=0; i< parts.length; i++) {
    //     return this.resolveField(model[parts[i]], parts.splice(1).join('.'), def);
    //   }
    // } else {
    //   return model[parts[0]] || def;
    // }
  }
}
