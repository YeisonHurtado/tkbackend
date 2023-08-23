import nodemailer from 'nodemailer'
import config from '../config'

export const mail = {
    user: config.EMAIL,
    password: config.EMAIL_PASSWORD
}

//Creamos el objeto de transporte
export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: mail.user,
        pass: mail.password
    }
});