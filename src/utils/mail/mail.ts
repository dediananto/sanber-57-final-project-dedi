import ejs from "ejs";
import nodemailer from "nodemailer";
import path from "path";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    requireTLS: true,
});

const send = async (to: string | string[], subject: string, html: string) => {
    const mailOptions = {
        from: process.env.MAIL_USERNAME,
        to,
        subject,
        html,
    };
    const result = await transporter.sendMail(mailOptions);
    return result;
};

const render = async (html: string, data: any) => {
    const content = await ejs.renderFile(path.join(__dirname, `templates/${html}`), data);
    return content as string;
};

export default { send, render }