import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ColorPickerModule } from "ngx-color-picker";

import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { RestrictedInputDirective } from './directives/restricted-input.directive';

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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
