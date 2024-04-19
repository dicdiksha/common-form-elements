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

  upperCaseObj = ["igot-health","cbse/ncert","cbse","ncert","cisce","nios","cpd","ut (dnh and dd)", "ict", "nss volunteers", "aas pass (evs)", "craft", "ecce", "evs", "gka", "ict", "tamil (at)", "tamil (bt)","spcc", "nyks","nursing", "nep", "manipuri lairek laisu (meetei mayek)", "looking around (evs)", "kannada (bt)", "ircs"]

  transform(text: string):string{   
    if(this.upperCaseObj.includes(text)){
      return text.toUpperCase();
    } else if(text.toLowerCase() ==='cbse training'){
      return 'CBSE Training'
    } else if( text.startsWith("ut") || text.startsWith("UT")){
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