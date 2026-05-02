import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ejs from "ejs";
import path from "path";
import fs from "fs";

dotenv.config();

const mailPort = Number(process.env.EMAIL_PORT || 587);
const useSecure = mailPort === 465;

const transorter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: mailPort,
    service: process.env.EMAIL_SERVICE,
    secure: useSecure,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transorter.verify((error) => {
    if (error) {
        console.error("SMTP verify failed:", error);
        return;
    }
    console.log("SMTP server is ready to send messages.");
});


const renderEmailTemplate = async (templateName: string, data: Record<string , any>) :Promise<string> => {
    const templateFile = `${templateName}.ejs`;
    const candidatePaths = [
        path.join(__dirname, "..", "email-templates", templateFile),
        path.join(process.cwd(), "apps", "auth-service", "src", "utils", "email-templates", templateFile),
        path.join(process.cwd(), "apps", "auth-service", "email-templates", templateFile)
    ];
    const templatePath = candidatePaths.find((candidate) => fs.existsSync(candidate));

    if (!templatePath) {
        throw new Error(`Email template not found. Tried: ${candidatePaths.join(", ")}`);
    }

    console.log(`Rendering email template from: ${templatePath}`);
    return await ejs.renderFile(templatePath, data);
};

export const sendMail = async (to: string, subject: string, templateName: string, data: Record<string , any>) => {
    try {
        const html = await renderEmailTemplate(templateName, data);
        await transorter.sendMail({
            from: process.env.EMAIL_FROM, 
            to,
            subject,
            html,
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error(`Failed to send email to ${to}:`, error);
    }
};

