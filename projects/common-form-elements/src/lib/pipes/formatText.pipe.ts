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

  upperCaseObj = ["igot-health","cbse/ncert","cbse","ncert","cisce","nios","cpd","ut (dnh and dd)", "ict", "nss volunteers", "aas pass (evs)", "craft", "ecce", "evs", "gka", "ict", "tamil(at)", "tamil(bt)","spcc", "nyks","nursing", "nep", "manipuri lairik laisu (meetei mayek)", "looking around (evs)", "kannada(bt)", "ircs"];
  titleCaseObj = ["cbse training","evs part 1","evs part 2","ict in education"];
 
  transform(text: string):string{  
    if(this.upperCaseObj.includes(text.toLowerCase())){
      return text.toUpperCase();
    } else if(this.titleCaseObj.includes(text.toLowerCase())){
      let words = text.split(" ");
      return words[0].toUpperCase() + " " + this.toTitleCase(words[1] + " "+ (words[2] ?? "")) ;
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