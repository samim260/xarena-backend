const VerificationMail = (username, otp) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Earena Verification Code</title>
    <!-- Use inline styles and table layouts for maximum email client compatibility -->
    <style>
        /* Global Reset/Base Styles */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
        /* Link styling for better readability */
        .link-text { color: #1e3a8a !important; text-decoration: none !important; font-weight: 600; }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: Arial, sans-serif;">

    <!-- Outer Table (Used to center content and set max-width) -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #f4f7f6;">
        <tr>
            <td align="center" style="padding: 20px 0;">

                <!-- Email Content Container Table -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header Section (Earena Logo/Name) -->
                    <tr>
                        <td align="center" style="padding: 30px 20px 10px 20px;">
                            <h1 style="color: #1e3a8a; font-size: 28px; margin: 0; font-weight: bold;">Earena</h1>
                            <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">Your Gateway to Competitive Gaming</p>
                        </td>
                    </tr>
                    
                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 20px;">
                            <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 0;">
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 30px 40px 10px 40px; color: #374151;">
                            
                            <!-- Greeting -->
                            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                                Hello <strong style="color: #1e3a8a;">${username}</strong>,
                            </p>

                            <!-- Main Message -->
                            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                                Thank you for registering with Earena! Please use the **One-Time Code (OTP)** below to complete your registration on the website or in the app:
                            </p>

                            <!-- OTP Code Display Section -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
                                <tr>
                                    <td align="center" style="padding: 20px; background-color: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 8px;">
                                        <p style="font-size: 16px; color: #6b7280; margin: 0 0 10px 0; font-weight: 500;">
                                            Your One-Time Code
                                        </p>
                                        <!-- The code itself is large and distinct -->
                                        <p style="font-size: 32px; font-weight: bold; color: #1e3a8a; letter-spacing: 5px; margin: 0;">
                                            ${otp}
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Expiration Notice -->
                            <p style="font-size: 14px; line-height: 1.6; color: #6b7280; text-align: center; margin-top: 30px;">
                                This code will expire in <strong style="color: #ef4444;">5 minutes</strong> for security purposes. Please use it quickly.
                            </p>
                            
                            <!-- Closing -->
                            <p style="font-size: 16px; line-height: 1.6; margin-top: 40px;">
                                Best regards,<br>The Earena Team
                            </p>

                        </td>
                    </tr>
                    
                    <!-- Footer Section -->
                    <tr>
                        <td align="center" style="padding: 20px 40px 30px 40px; background-color: #f9fafb; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
                            <p style="font-size: 12px; color: #9ca3af; margin: 0; line-height: 1.5;">
                                This is an automated email. Please do not reply.<br>
                                &copy; 2024 Earena. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
                <!-- End Email Content Container Table -->

            </td>
        </tr>
    </table>
    <!-- End Outer Table -->

</body>
</html>

`
}


module.exports = { VerificationMail }