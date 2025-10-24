declare module 'nodemailer' {
  export interface SendMailOptions {
    from?: string;
    to?: string | string[];
    subject?: string;
    text?: string;
    html?: string;
    replyTo?: string;
    [key: string]: unknown;
  }

  export interface Transporter {
    sendMail(mail: SendMailOptions): Promise<unknown>;
  }

  export function createTransport(options: unknown): Transporter;

  const _default: {
    createTransport: typeof createTransport;
  };
  export default _default;
}
