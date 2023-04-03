const sgMail = require('@sendgrid/mail');

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/no-unsafe-call */

export interface MailContent {
  subject: string;
  content: string;
}

export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env['SENDGRID_API_KEY'] || '');
  }

  public async send(data: MailContent, receivers: Array<string>): Promise<any> {
    const mailOptions = {
      from: 'Husmate <app@ovenue.com>',
      to: receivers,
      subject: data.subject,
      html: data.content,
    };
    // return await this.transporter.sendMail(mailOptions);
    return await sgMail.send(mailOptions);
  }
}
