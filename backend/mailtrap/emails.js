import { response } from "express";
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        });

        console.log("Email sent successfully");
        
    } catch (error) {
        console.error(`Error sending verification ${error}`);
        throw new Error("Error sending verification: ", error);
    }

}


export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "219474cf-9cab-4c27-9365-23de53f09282",
            template_variables: {
              "company_info_name": "MailTrap Sample",
              "name": name}
        });

        console.log("Welcome email sent successfully: ", response);
        
    } catch (error) {
        console.log("Error sending welcome email: ", error);
        throw new Error(`Error sending welcome email: ${error}`);

    }

}

export const sendPasswordResetEmail = async (email, resetUrl) => {
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
            category: "Password Reset",
        });

        console.log("Password reset email sent successfully: ", response);
        
    } catch (error) {
        console.log("Error sending reset password email: ", error);
        throw new Error(`Error sending reset password email: ${error}`);
    }
}

export const sendResetSuccessEmail = async (email) =>{
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset password success",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Reset Success"
        });

        console.log("Emamil sent successfully: ", response);
        
    } catch (error) {
        console.log("Error sending email: ", error);
        throw new Error(`Error sending email: ${error}`);
        
    }
}