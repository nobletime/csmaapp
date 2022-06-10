const nodemailer = require('nodemailer');

async function send365Email(from, to, subject, html, text, pass, files) {
  try {
    const transportOptions = {
      host: 'smtp.office365.com',
      port: '587',
      auth: { user: from, pass: pass },
      secureConnection: true,
      tls: { ciphers: 'SSLv3' }
    };

    const mailTransport = nodemailer.createTransport(transportOptions);

    if (files == null) {
      await mailTransport.sendMail({
        from,
        to,
        replyTo: from,
        subject,
        html
      });
    } else {
      let attachments = [];
      files.forEach(f => {
        attachments.push({
          filename: f.filename,
          path: f.path,
          contentType: 'application/pdf'
        });
      })

      await mailTransport.sendMail({
        from,
        to,
        replyTo: from,
        subject,
        html,
        // text,
        attachments: attachments
      });

    }

  } catch (err) {
    console.error(`send365Email: An error occurred:`, err);
  }
}


async function sendGmail(to, subject, html, attachments) {

const from = "The Vin Report Support <autocheckreportvehicle@gmail.com>";
  try {
    const transportOptions = {
        service: 'gmail',
        auth: {
          user: 'autocheckreportvehicle',
          pass: '#Autocheck5000'
        }
    };

    const mailTransport = nodemailer.createTransport(transportOptions);

    if (attachments == null) {
      await mailTransport.sendMail({
        from,
        to,
        replyTo: from,
        subject,
        html
      });
    } else {

      await mailTransport.sendMail({
        from,
        to,
        replyTo: from,
        subject,
        html,
        // text,
        attachments: attachments
      });

    }

  } catch (err) {
    console.error(`sendGmail: An error occurred:`, err);
  }
}

module.exports.send365Email = send365Email
module.exports.sendGmail = sendGmail