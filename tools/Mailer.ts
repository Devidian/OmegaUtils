import { EnvVars } from '../enums';
import { Environment } from './Environment';
import { Logger } from './Logger';

const sgMail = require('@sendgrid/mail');
const apiKey = Environment.getString(EnvVars.MAIL_SERVICE_TOKEN, null);
const logger = new Logger('util/Mailer');
if (!apiKey) {
	logger.warn(`ENV: ${EnvVars.MAIL_SERVICE_TOKEN} is not set, sending email not available!`);
} else if (!apiKey.startsWith('SG.')) {
	logger.warn(`ENV: ${EnvVars.MAIL_SERVICE_TOKEN} is invalid: ${apiKey}, sending email not available`);
} else {
	sgMail.setApiKey(apiKey);
}

export const sendEmail = async (from: string, to: string, subject: string, text: string, html: string) => {
	const msg = { to, from, subject, text, html };

	if (!apiKey?.startsWith('SG.')) {
		logger.warn(`Seendgrid not available! No email sent to ${to}`);
		return;
	}

	try {
		const response = await sgMail.send(msg);
		return response;
	} catch (error) {
		throw error;
	}
};
