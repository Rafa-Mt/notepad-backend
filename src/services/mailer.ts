import dotenv from 'dotenv'
import { Mail } from '../types';
import { Resend } from 'resend';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMessage = async (content: Mail) => {
    if (!content.html) {
        throw new Error("Message has no body")
    }
    const maildir = process.env.MAIL_DIR as string; 
    const {to, subject, html} = content; 
    await resend.emails.send({
        from: maildir,
        to, subject, html,
    });
}

// * Test Message
// sendMessage({
//     to: 'andrese.g.v.13579@gmail.com',
//     subject:  "test message",
//     html: `<div style="width: 100%; background-color: blue
//     "><b>Bold messagge</b></div>`
// })

