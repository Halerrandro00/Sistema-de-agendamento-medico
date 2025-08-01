const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Envia um e-mail usando um template EJS.
 * @param {object} options - As opções do e-mail.
 * @param {string} options.to - E-mail do destinatário.
 * @param {string} options.subject - Assunto do e-mail.
 * @param {string} options.template - Nome do arquivo de template (sem .ejs).
 * @param {object} options.context - Dados a serem injetados no template.
 */
const sendEmail = async ({ to, subject, template, context }) => {
  const templatePath = path.join(__dirname, '..', 'templates', 'emails', `${template}.ejs`);
  
  try {
    const html = await ejs.renderFile(templatePath, context);
    await transporter.sendMail({ from: `"Clínica Médica" <${process.env.EMAIL_USER}>`, to, subject, html });
    console.log(`[EMAIL NOTIFICATION] E-mail enviado com sucesso para ${to}`);
  } catch (error) {
    console.error(`[EMAIL NOTIFICATION] Erro ao enviar e-mail para ${to}:`, error);
  }
};

module.exports = { sendEmail };