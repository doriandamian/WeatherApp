import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { WeatherDashboardComponent } from './weather-dashboard/weather-dashboard.component';
import { AuthGuard } from './services/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { NoAuthGuard } from './services/no_auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [NoAuthGuard] },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: WeatherDashboardComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];