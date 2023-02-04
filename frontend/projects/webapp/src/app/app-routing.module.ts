import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '@app/pages/home/home.component';
import { LoginComponent } from '@app/pages/login/login.component';
import { OauthCallbackComponent } from '@app/pages/oauth-callback/oauth-callback.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home',
  },
  {
    path: 'login',
    title: 'Login',
    component: LoginComponent,
    data: {
      hideNavbar: true,
    },
  },
  {
    path: 'oauth2',
    title: 'Login callback',
    component: OauthCallbackComponent,
    data: {
      hideNavbar: true,
    },
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
