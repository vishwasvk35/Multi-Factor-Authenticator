// const { MailtrapClient } = require("mailtrap");
import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN;

export const mailClient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Vishwas Kulkarni",
};

const recipients = [
  {
    email: "vishwasvk35@gmail.com",
  }
];

// mailClient
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     html: "<h1>Congrats for sending test email with Mailtrap!</h1>",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);