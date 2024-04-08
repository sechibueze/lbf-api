import { CourierClient } from '@trycourier/courier';
import { appConfig } from '../constants/app.constant';

const courier = new CourierClient({
  authorizationToken: appConfig.COURIER_AUTH_TOKEN,
});
export const NOTIFICATION_FILTER = {
  ACCOUNT_NEW: 'Account.new',
  RETAILER_CREATED: 'Retailer.created',
  WHOLESALER_CREATED: 'Wholesaler.created',
  ACCOUNT_VERIFIED: 'Account.verified',
};
interface EmailOptions {
  subject: string;
  name: string;
  [data: string]: string;
}
export class Notifier {
  channel = '';
  service = 'courier';
  template = appConfig.COURIER_TEMPLATE_ID;
  constructor(channel: string = 'email') {
    this.channel = channel;
  }
  private async send(to: string, template: string = this.template, _data) {
    const _message = {
      message: {
        to: this.channel === 'email' ? { email: to } : { phone_number: to },
        template: template,
        data: {
          name: to,
          appName: appConfig.APP_ID,
          ..._data,
        },
      },
    };
    return await courier.send(_message);
  }
  async sendEmail(recipient: string, _options: EmailOptions) {
    const { name, subject, ...rest } = _options;
    const templateData = {
      name: name || recipient,
      subject: subject || `${appConfig.APP_ID}`,
      ...rest,
    };

    return await this.send(recipient, this.template, templateData);
  }
  async sendAccountEmail(recipientEmail: string, _options: EmailOptions) {
    const { name, subject, ...rest } = _options;
    const template = this.template;
    const templateData = {
      name: name || recipientEmail,
      subject: subject || `${appConfig.APP_ID}`,
      ...rest,
    };

    return await this.send(recipientEmail, template, templateData);
  }
  //   async sendAccountConfirmation(recipientEmail: string, _options) {
  //     const {
  //       name,
  //       action,
  //       cta,
  //       cta_label,
  //       subject,
  //       id: userRef,
  //       token: confirmToken,
  //     } = _options;

  //     const template = appConfig.COURIER_ACCOUNT_TEMPLATE;
  //     const templateData = {
  //       name: name || 'Leader',
  //       appName: appConfig.APP_ID,
  //       cta:
  //         cta ||
  //         `${appConfig.FRONTEND_URL}/auth/verify?token=${confirmToken}&id=${userRef}`,
  //       action,
  //       cta_label: cta_label || 'Confirm your account',
  //       subject: subject || `${appConfig.APP_ID} - Account Confirmation`,
  //     };

  //     return await this.send(recipientEmail, template, templateData);
  //   }
  //   async sendPasswordResetEmail(toEmail: string, _data) {
  //     const { name, id: userId, token: resetToken, action } = _data || {};
  //     const cta = resetToken
  //       ? `${appConfig.FRONTEND_URL}/auth/reset-password?token=${resetToken}&id=${userId}`
  //       : '';
  //     const template = appConfig.COURIER_ACCOUNT_TEMPLATE;
  //     const templateData = {
  //       name: name || toEmail,
  //       appName: appConfig.APP_ID,
  //       cta,
  //       action,
  //     };

  //     return await this.send(toEmail, template, templateData);
  //   }
}
