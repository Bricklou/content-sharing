import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonComponent } from './components/base/button/button.component';
import { icons, LucideAngularModule } from 'lucide-angular';
import { LoadingBarIndicatorComponent } from './components/partials/loading-bar-indicator/loading-bar-indicator.component';
import { NavBarComponent } from '@app/components/partials/navbar/navbar.component';
import { InputComponent } from './components/forms/input/input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { TranslocoRootModule } from './transloco-root.module';
import { CsrfInterceptor } from './interceptors/csrf.interceptor';
import { AlertComponent } from './components/base/alert/alert.component';
import { discord, github, NgxSimpleIconsModule } from 'ngx-simple-icons';
import { OauthCallbackComponent } from './pages/oauth-callback/oauth-callback.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    NavBarComponent,
    LoadingBarIndicatorComponent,
    InputComponent,
    LoginComponent,
    HomeComponent,
    AlertComponent,
    OauthCallbackComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({ cookieName: 'csrftoken', headerName: 'X-CSRFToken' }),
    LucideAngularModule.pick(icons),
    NgxSimpleIconsModule.pick({ discord, github }),
    FormsModule,
    TranslocoRootModule,
    ReactiveFormsModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: CsrfInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}
