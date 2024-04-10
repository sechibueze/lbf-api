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
  PASSWORD_RESET_TOKEN: 'PasswordReset.token',
  PASSWORD_RESET_COMPLETE: 'PasswordReset.complete',
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
}
