import { Pipe, PipeTransform } from '@angular/core';

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
    if (text.startsWith("state") || text.startsWith("State") || text.startsWith("ut") || text.startsWith("UT")) {
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
    else {
      return this.toTitleCase(text);
    }
  }

}
