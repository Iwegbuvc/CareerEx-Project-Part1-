const nodemailer = require("nodemailer")

const sendUserEmail = async ({email, subject, htmlMessage})=>{

 try {
       // Details of the account to use
    const mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    })



    //  const htmlContent = `
    // <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px 0;">
    //   <tr>
    //     <td align="center">
    //       <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    //         <tr>
    //           <td align="center" style="padding-bottom: 30px;">
    //             <h2 style="margin: 0; color: #333333;">Reset Your Password</h2>
    //           </td>
    //         </tr>
    //         <tr>
    //           <td style="color: #555555; font-size: 16px; line-height: 1.5;">
    //             <p>Hello,</p>
    //             <p>We received a request to reset your password. Click the button below to set a new password. This link will expire in 15 minutes.</p>
    //             <p>If you did not request a password reset, you can safely ignore this email.</p>
    //           </td>
    //         </tr>
    //         <tr>
    //           <td align="center" style="padding: 30px 0;">
    //             <a href="${resetLink}" style="background-color: #007BFF; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    //           </td>
    //         </tr>
    //         <tr>
    //           <td style="color: #999999; font-size: 14px; text-align: center;">
    //             <p>If the button above doesn't work, copy and paste this URL into your browser:</p>
    //             <p style="word-break: break-all;"><a href="${resetLink}" style="color: #007BFF;">${resetLink}</a></p>
    //           </td>
    //         </tr>
    //         <tr>
    //           <td style="padding-top: 30px; color: #999999; font-size: 12px; text-align: center;">
    //             <p>© 2025 YourAppName. All rights reserved.</p>
    //           </td>
    //         </tr>
    //       </table>
    //     </td>
    //   </tr>
    // </table>
    // `;


    // Details to send 
    
    const detailsToSend = {
        from: `"Devsyners Africa" <${process.env.EMAIL}> `,
        to: "iwegbuvc@gmail.com",
        subject: subject,
        html: htmlMessage
      }

    const result = await mailTransporter.sendMail(detailsToSend)
    console.log("Email sent:", result.response);

 } catch (error) {
    console.log("Email sending error:", error)
 }
}

console.log("Email data received:", { email, subject, htmlMessage });


module.exports = sendUserEmail