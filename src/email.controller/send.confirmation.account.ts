import { decode } from 'punycode'
import config from '../config'
import * as configEmail from './config.email'
import jwt from 'jsonwebtoken'

export const sendEmail = async (email: string, html: any) => {
    try {
        await configEmail.transporter.sendMail({
            from: `Teknonimous <${configEmail.mail.user}>`,
            to: email,
            subject: "Account confirmation",
            html
        })
    } catch (error) {
        console.log("Algo salio mal al enviar correo electronico", error)
    }
}

export const getTemplateHTML = (name: string, lastname: string, token: string) => {
    return `
    <html>

    <head>
        <style type="text/css">
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
    
            .content_email {
                padding: 10px;
                position: relative;
                display: flex;
                flex-flow: column nowrap;
                justify-content: center;
                align-items: center;
                background-color: rgb(9, 9, 9);
                color: #FFF;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
    
            header {
                width: 90%;
                display: flex;
                flex-flow: column nowrap;
                justify-content: center;
                align-items: center;
                font-size: 30px;
                padding: 20px;
            }
    
            hr {
                margin-top: 10px;
                width: 100%;
            }
    
    
            .info_email {
                width: 90%;
                padding: 20px;
                display: flex;
                flex-flow: column nowrap;
                justify-content: center;
            }
    
            h2 {
                margin: 10px 0;
            }
    
            span {
                margin-top: 10px;
            }
    
            .content_email a {
                color: #38b52c;
                text-decoration: none;
            }
    
            footer {
                position: absolute;
                top: 100%;
                width: 100%;
                background-color: #fff;
                color: #000;
                padding: 30px;
            }
        </style>
    </head>
    
    <body>
        <div class="content_email">
            <header>
                <strong>TEKNONIMOUS</strong>
                <hr>
            </header>
            <div class="info_email">
                <h2>HELLO, ${name} ${lastname}</h2>
                <p>HEMOS RECIBIDO TU SOLICITUD DE REGISTRO. SOLO ESTÁS A UN PASO DE PODER USAR TU CUENTA.</p>
                <span>Da clic en <a href="http://localhost:3000/accountconfirm/${token}">confirmar</a> para activar tu cuenta</span>
                <span>Sino realizaste la solicitud de registro omite este mensaje.</span>
            </div>
    
            <footer>
                <p>TEKNONIMOUS &copy; todos los derechos resevados.</p>
            </footer>
        </div>
    </body>
    
    </html>
    `
}

export const getToken = (data: any) => {
    const token = jwt.sign(
        data,
        config.API_KEY,
        { expiresIn: config.TOKEN_EXPIRES_IN },
    );
    return token
}

export const getDataToken = (token: string) => {
    const decode = jwt.verify(token, config.API_KEY, (err, decoded) => {
        if (err) {
            console.log("Error al verificar el token.")
        } else {
            return decoded
        }
    })

    return decode
}