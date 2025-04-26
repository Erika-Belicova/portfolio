import { Component, ViewChildren, QueryList, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'; 
import { environment } from '../../environments/environment';
import { format } from 'date-fns-tz';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  showSuccess = false;
  showError = false;
  isSending = false;
  submitted = false;

  private successTimeout: number | null = null;
  private errorTimeout: number | null = null;

  @ViewChildren('notification') notificationRefs!: QueryList<ElementRef>;

  @ViewChild('contactFormElement') contactFormElement!: ElementRef<HTMLFormElement>;

  scrollToNotification() {
    // wait for DOM update (because of *ngIf)
    setTimeout(() => {
      const el = this.notificationRefs.first;
      if (el) {
        el.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100); // delay to allow for smooth scrolling
  }

  resetSubmitted() {
    if (this.submitted) {
      this.submitted = false;
    }
  }  

  sendEmail(contactForm: NgForm) {
    this.submitted = true;

    if (contactForm.invalid) {
      setTimeout(() => {
        // blur, so focus does not stay on the submit button
        (document.activeElement as HTMLElement)?.blur();
      }, 0);
      return;
    }

    // honeypot check against spam
    const honeypotValue = contactForm.value.phone;
    if (honeypotValue) {
      return; // spam detected - do not send
    }

    this.showSuccess = false;
    this.showError = false;
    this.isSending = true;

    if (this.successTimeout !== null) {
      clearTimeout(this.successTimeout);
    }
    if (this.errorTimeout !== null) {
      clearTimeout(this.errorTimeout);
    }

    // create a timestamp in Paris timezone
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss zzz', { timeZone: 'Europe/Paris' });

    // create a hidden input for the timestamp
    const timestampInput = document.createElement('input');
    timestampInput.type = 'hidden';
    timestampInput.name = 'timestamp';
    timestampInput.value = timestamp;

    // append the hidden timestamp input
    this.contactFormElement.nativeElement.appendChild(timestampInput);

    emailjs
      .sendForm(
        environment.emailServiceId,
        environment.emailTemplateId,
        this.contactFormElement.nativeElement,
        environment.emailPublicKey
      )
      .then(
        () => {
          this.showSuccess = true;
          this.isSending = false;
          contactForm.resetForm();
          this.submitted = false;
          this.scrollToNotification();
          // hide the success message after 5 seconds
          setTimeout(() => {
            this.showSuccess = false;
          }, 5000);
        },
        (error) => {
          this.showError = true;
          this.isSending = false;
          this.scrollToNotification();
          // hide the error message after 5 seconds
          setTimeout(() => {
            this.showError = false;
          }, 5000);
        }
      )
      .finally(() => {
        // remove the timestamp input after sending
        this.contactFormElement.nativeElement.removeChild(timestampInput);
      });
  }
}
