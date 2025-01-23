import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./views/login/login.component";
import { EmailComponent } from "./views/email/email.component";
import { SmsComponent } from "./views/sms/sms.component";
import { VoiceComponent } from "./views/voice/voice.component";
import { ChatComponent } from "./views/chat/chat.component";

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "email", component: EmailComponent },
  { path: "sms", component: SmsComponent },
  { path: "voice", component: VoiceComponent },
  { path: "chat", component: ChatComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
