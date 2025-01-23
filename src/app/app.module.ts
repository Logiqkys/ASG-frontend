import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app.routing.module";
import { CommonModule } from "@angular/common"; // Import CommonModule

// Components
import { AppComponent } from "./app.component";
import { LoginComponent } from "./views/login/login.component";
import { EmailComponent } from "./views/email/email.component";
import { SmsComponent } from "./views/sms/sms.component";
import { VoiceComponent } from "./views/voice/voice.component";
import { ChatComponent } from "./views/chat/chat.component";

import { HeaderComponent } from "./shared/header/header.component";
import { FooterComponent } from "./shared/footer/footer.component";

@NgModule({
  declarations: [
    AppComponent, // Root component
    LoginComponent, // Login page
    EmailComponent, // Email page
    SmsComponent, // SMS page
    VoiceComponent, // Voice page
    ChatComponent, //Chat page
    HeaderComponent, // Shared header
    FooterComponent, // Shared footer
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
