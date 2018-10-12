
// 发送邮件
exports.sendMail = async (params) => {
    let {
        to,
        content = 'content' + Date.now(),
        subject = 'Test Message' + Date.now(),
        attachments,
    } = params;
    const nodemailer = require('nodemailer');
    let transporter = nodemailer.createTransport({
        service: '163',
        auth: {
            user: 'zengxiaoping1988@163.com', // generated ethereal user
            pass: 'z123456' // generated ethereal password, 163邮箱授权码
        }
    });

    let mailOptions = {
        from: 'zengxiaoping1988@163.com', // sender address
        to, // list of receivers
        subject, // Subject line
        //text: 'Hello world22', // plain text body
        html: content, // html body
        attachments, // 附件
    };

    // transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //         return console.log(error);
    //     }
    //     console.log('Message sent: %s', info.messageId);
    //     // Preview only available when sending through an Ethereal account
    //     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    //     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    //     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    // });

    let info = await transporter.sendMail(mailOptions);

    console.log('Message sent successfully!');
    // console.log(nodemailer.getTestMessageUrl(info));

    // only needed when using pooled connections
    transporter.close();

    return info ? info.messageId : 0;
};
