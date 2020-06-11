import nodemailer from 'nodemailer';

export const sendGridActivationMailSend = async  (toEmail) => {
    console.log('coming inside sendGridActivationMailSend')
    let transporter = nodemailer.createTransport({ 
        service: 'Sendgrid', 
        auth: { 
            user: 'rahul_propstory', 
            pass: 'Rahul@123' 
        } 
    });
    const subject = "Propstory Expense Email Activation"
    const body = "Hi,<br/> Your account has been activated. Now you can view your expense on propstory on <a href='http://expenses.propstory.com/users/login'>expense.propstory</a>"

    let mailOptions = { 
        from: 'Ashish Mahajan <ashish.mahajan@propstory.com>', 
        to: toEmail, 
        subject: subject,
        html: body,
    };
    console.log(mailOptions)
    return transporter.sendMail(mailOptions, (err,info) => {
        console.log(err, info)
    })
}