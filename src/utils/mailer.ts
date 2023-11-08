import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/smtp-pool';

class Mailer {
    private transport: () => Transporter<SentMessageInfo>;
    private mailOptions: MailOptions;
    private from: 'K12' | 'K18';

    constructor(from: 'K12' | 'K18', mailOptions: MailOptions) {
        this.from = from;
        this.transport = (): Transporter<SentMessageInfo> => {
            return nodemailer.createTransport({
                service: 'Gmail', // Sử dụng dịch vụ Gmail
                auth: {
                    user: this.from === 'K12' ? process.env.MAIL_K12 : process.env.MAIL_K18, // Địa chỉ email của bạn
                    pass: this.from === 'K12' ? process.env.PASS_K12 : process.env.PASS_K18, // Mật khẩu email của bạn
                },
            });
        }
        this.mailOptions = {
            ...mailOptions,
            from: this.from === 'K12' ? process.env.MAIL_K12 : process.env.MAIL_K18
        };
        // example
        // const mailOptions = {
        //     from: 'your_email@gmail.com', // Địa chỉ email gửi
        //     to: 'recipient@example.com', // Địa chỉ email người nhận
        //     subject: 'Test Email', // Chủ đề email
        //     text: 'Hello, this is a test email!', // Nội dung email
        // };
    }
    // gửi mail
    public send() {
        return this.transport().sendMail(this.mailOptions);
    }
}

export default Mailer;