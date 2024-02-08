
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TransposeHtmlPipe } from './transpose-html/transpose-html';
import { SafeHtmlPipe } from './safe-html/safe-html';
import { FormatTextPipe } from './formatText.pipe';

@NgModule({
  declarations: [TransposeHtmlPipe, SafeHtmlPipe,FormatTextPipe],
  imports: [CommonModule],
  exports: [TransposeHtmlPipe, SafeHtmlPipe,FormatTextPipe],
  providers: [DatePipe]
})
export class PipesModule {
}
