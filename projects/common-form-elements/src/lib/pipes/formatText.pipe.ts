import { Pipe, PipeTransform } from '@angular/core';
import { concat } from 'rxjs';

@Pipe({
  name: 'formatText'
})
export class FormatTextPipe implements PipeTransform {
  toTitleCase(str) {
    return str.toLowerCase().replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  }

  transform(text: string): string {
    if (text.startsWith("state") || text.startsWith("State")) {
      return text.split(' ').map(this.toTitleCase).join(' ');
    } else if (text.toLowerCase() == 'igot-health' ) {
      return 'IGOT-Health';
    } else if (text.toLowerCase() == 'cbse/ncert' ) {
      return 'CBSE/NCERT ';
    } else if (text.toLowerCase() == 'cisce' ) {
      return 'CISCE ';
    } else if (text.toLowerCase() == 'nios' ) {
      return 'NIOS ';
    }
    else if(text.toLowerCase() == 'cpd'){
      return 'CPD'
    }
    else if(text.toLowerCase() == 'ncert'){
      return 'NCERT'
    } else if(text.toLowerCase() == 'cbse'){
      return 'CBSE'
    }
    else if(text.toLowerCase() == 'cbse training'){
      return 'CBSE Training '
    }
    else if(text.toLowerCase() == 'ut (dnh and dd)'){
      return 'UT (DNH And DD) '
    }
    else if( text.startsWith("ut") || text.startsWith("UT")){
      let text1 = text.split(' ')
      let firstPart = text1.shift()
      let secondPart = text1.join(' ')
      return (firstPart.toUpperCase()+(' ').concat(this.toTitleCase(secondPart)))
    }
    else {
      return this.toTitleCase(text);
    }
  }

}
