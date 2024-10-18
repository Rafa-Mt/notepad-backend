import dotenv from 'dotenv'
import { createTransport, TransportOptions } from 'nodemailer';
import { Mail } from '../types';

dotenv.config();

console.log({
    user: process.env.MAIL_DIR,
    pass: process.env.MAIL_PASS
})
const transporter = createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT as unknown as number,
    secure: true,
    auth: {
        user: process.env.MAIL_DIR,
        pass: process.env.MAIL_PASS
    }
});

export const sendMessage = async (content: Mail) => {
    if (!content.html && content.text) {
        throw new Error("Message has no body")
    }
    const {to, subject, text, html} = content; 
    await transporter.sendMail({
        from: process.env.MAIL_DIR,
        to, subject, text, html,
    });
}

// * Test Message
// sendMessage({
//     to: 'andrese.g.v.13579@gmail.com',
//     subject:  "test message",
//     html: `<div style="width: 100%; background-color: blue
//     "><b>Bold messagge</b></div>`
// })