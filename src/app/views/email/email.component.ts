import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-email",
  templateUrl: "./email.component.html",
  styleUrls: ["./email.component.css"],
  standalone: false,
})
export class EmailComponent implements OnInit {
  readonly userEmail = "kyle.marcus.esp.ramos@gmail.com";

  inbox: {
    subject: string;
    body: string;
    from: string;
    cc?: string;
    htmlBody?: string;
    attachments: { filename: string; content?: any }[];
  }[] = [];
  selectedEmail: any = null;

  emailForm = {
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    body: "",
    attachments: [] as File[],
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  // Fetch Latest Email from Backend
  fetchInbox() {
    this.http.get<any>("http://localhost:3000/emails/latest").subscribe(
      (email) => {
        this.inbox.unshift({
          subject: email.subject,
          body: email.textBody || email.htmlBody,
          from: email.from,
          cc: email.cc,
          htmlBody: email.htmlBody,
          attachments: email.attachments || [],
        });
        alert("Inbox refreshed with the latest email!");
      },
      (error) => {
        console.error("Error fetching emails:", error);
        alert("Failed to refresh inbox. Please try again.");
      }
    );
  }

  // Select Email to View Full Details
  selectEmail(index: number) {
    this.selectedEmail = this.inbox[index];
  }

  // Download Attachment
  downloadAttachment(attachment: any) {
    const blob = new Blob([attachment.content], {
      type: "application/octet-stream",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = attachment.filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Handle File Selection for Attachments
  onFileSelect(event: any) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.emailForm.attachments.push(files[i]);
    }
  }

  // Remove Attachment
  removeAttachment(index: number) {
    this.emailForm.attachments.splice(index, 1);
  }

  // Send Email
  sendEmail() {
    const formData = new FormData();
    formData.append("to", this.emailForm.to);
    formData.append("cc", this.emailForm.cc || "");
    formData.append("bcc", this.emailForm.bcc || "");
    formData.append("subject", this.emailForm.subject);
    formData.append("body", this.emailForm.body);

    // Add attachments
    for (const file of this.emailForm.attachments) {
      formData.append("attachments", file);
    }

    this.http
      .post("https://asg-backend-dwi1.onrender.com/emails/send", formData)
      .subscribe(
        () => {
          alert("Email sent successfully!");
          this.emailForm = {
            to: "",
            cc: "",
            bcc: "",
            subject: "",
            body: "",
            attachments: [],
          };
        },
        (error) => {
          console.error("Error sending email:", error);
          alert("Failed to send email.");
        }
      );
  }
}
