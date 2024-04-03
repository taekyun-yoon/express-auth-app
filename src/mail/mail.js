const mailer = require('nodemailer');
const goodbye = require('./goodbye_template');
const welcome = require('./welcome_template');
const { response } = require('express');

const getEmailDate = (to, name, template) => {
    let data = null;

    switch(template) {
        case "welcome":
            data = {
                from: 'express-auth-app <wizen010@gmail.com',
                to,
                subject: `Hello ${name}`,
                html: welcome()
            }
            break;
        
            case "goodbye":
                data = {
                    from: 'express-auth-app <wizen010@gmail.com',
                    to,
                    subject: `Hello ${name}`,
                    html: goodbye()
                }
                break;
            default:
                data;
    }
    return data;
}

const sendMail = (to, name, type) => {
    const transport = mailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'wizen010@gmail.com',
            pass: process.env.EMAIL_PASSWORD
        }
    })
    
    const mail = getEmailDate(to, name, type);

    transport.sendMail(mail, (error, response) => {
        if (error) {
            console.log('error: ', error);
        } else {
            console.log('email sent successfully');
        }

        transport.close();
    })
}

module.exports = sendMail;