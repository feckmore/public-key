import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ColorPickerModule } from "ngx-color-picker";

import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { RestrictedInputDirective } from './directives/restricted-input.directive';

// import * as ColorMix from "../../node_modules/colormix/dist/colormix";

@NgModule({
  declarations: [
    AppComponent,
    RestrictedInputDirective
  ],
  imports: [
    FormsModule,
    BrowserModule,
    NgbModule.forRoot(),
    ColorPickerModule
    // ColorMix
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
