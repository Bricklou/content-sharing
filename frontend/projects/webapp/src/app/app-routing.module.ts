import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '@app/pages/home/home.component';
import { SignInComponent } from '@app/pages/login/sign-in.component';
import { OauthCallbackComponent } from '@app/pages/oauth-callback/oauth-callback.component';
import { RegisterAccountComponent } from '@app/pages/register/account/register-account.component';
import { WidgetsComponent } from '@app/pages/widgets/widgets.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home',
  },
  {
    path: 'sign-in',
    title: 'Sign In',
    component: SignInComponent,
    data: {
      hideNavbar: true,
    },
  },
  {
    path: 'register',
    title: 'Register',
    data: {
      hideNavbar: true,
    },
    children: [
      {
        path: '',
        component: RegisterAccountComponent,
      },
    ],
  },
  {
    path: 'oauth2',
    title: 'Login callback',
    component: OauthCallbackComponent,
    data: {
      hideNavbar: true,
    },
  },
  {
    path: 'widgets',
    title: 'Widgets',
    component: WidgetsComponent,
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
