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
    }
    else {
      return text.toUpperCase();
    }
  }

}
