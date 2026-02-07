import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user:'akenterprises0307@gmail.com',
    pass: 'zkea lerc zldk dvkt',
  },
})

export async function sendOrderEmail(order, pdfBuffer) {
  if (!order.email) {
    throw new Error('No customer email supplied')
  }

  const mailOptions = {
    from:process.env.SMTP_USER,
    to: order.email,
    subject: `AK Enterprises - Request Copy for Order ${order._id}`,
    text: [
      `Hello ${order.customer_name || 'Customer'},`,
      '',
      'Thank you for your enquiry. Please find the request copy attached with the items you selected.',
      '',
      'We will reach out shortly with the detailed invoice.',
      '',
      'Regards,',
      'AK Enterprises',
    ].join('\n'),
    attachments: [
      {
        filename: `request-copy-${order._id}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  }

  await transporter.sendMail(mailOptions)
}

