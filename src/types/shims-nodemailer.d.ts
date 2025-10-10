declare module 'nodemailer' {
  export interface SendMailOptions {
    from?: string;
    to?: string | string[];
    subject?: string;
    text?: string;
    html?: string;
    replyTo?: string;
    [key: string]: any;
  }

  export interface Transporter {
    sendMail(mail: SendMailOptions): Promise<any>;
  }

  export function createTransport(options: any): Transporter;

  const _default: {
    createTransport: typeof createTransport;
  };
  export default _default;
}

