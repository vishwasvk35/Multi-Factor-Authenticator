import { mailClient, sender } from "./mailtrapConfig.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./TEMPLATE/verification.js";

export async function sendVerificationEmail(email, verificationToken) {
    console.log(email);
    console.log(verificationToken);
    const recipients = [{ email }];

    try {
        const response = await mailClient.send({
            from: sender,
            to: recipients,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationToken}", verificationToken),
            category: "verification",
        });

        console.log(response);
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error(`Error sending verification email: ${error.message}`);
    }
}
