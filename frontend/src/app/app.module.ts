import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import {SocketIoModule} from "ngx-socket-io";
import { LoginComponent } from './login/login.component';
import { MainDeskComponent } from './main-desk/main-desk.component';
import { RegisterComponent } from './register/register.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MyserviceService} from './myservice.service';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    MainDeskComponent,
    RegisterComponent,
    UserDashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SocketIoModule.forRoot({
      url: '/'
    })
  ],
  providers: [ MyserviceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
