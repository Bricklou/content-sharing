import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ButtonComponent} from './components/base/button/button.component';
import {icons, LucideAngularModule} from "lucide-angular";
import {
  LoadingBarIndicatorComponent
} from './components/partials/loading-bar-indicator/loading-bar-indicator.component';
import {NavBarComponent} from "@app/components/partials/navbar/navbar.component";
import {InputComponent} from './components/forms/input/input.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [AppComponent, ButtonComponent, NavBarComponent, LoadingBarIndicatorComponent, InputComponent],
  imports: [BrowserModule, AppRoutingModule,

    LucideAngularModule.pick(icons), FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
