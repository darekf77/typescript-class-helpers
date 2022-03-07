//#region @notForNpm
//#region @browser
import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-typescript-class-helpers',
  template: 'hello from typescript-class-helpers'
})
export class TypescriptClassHelpersComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}

@NgModule({
  imports: [],
  exports: [TypescriptClassHelpersComponent],
  declarations: [TypescriptClassHelpersComponent],
  providers: [],
})
export class TypescriptClassHelpersModule { }
//#endregion

//#region @backend
async function start(port: number)  {

}

export default start;

//#endregion

//#endregion