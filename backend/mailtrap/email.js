import { response } from "express";
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

export async function sendWelcomeEmail(email, name){
    const recipients = [
        {
          email: email,
        }
      ];

      const response = await mailClient
      .send({
        from: sender,
        to: recipients,
        template_uuid: "c3f58be9-1365-466a-91e6-ecd382844ae9", //template is derived from mailtrap template api
        template_variables: {
          "name": name,
          "company_info_name": "Auth Company"
        }
      })
      .then(console.log, console.error);
}