import { UtilEnvVars } from '../enums';
import { Environment } from './Environment';
import { Logger } from './Logger';
import sgMail, { ClientResponse } from '@sendgrid/mail';

const apiKey = Environment.getString(UtilEnvVars.MAIL_SERVICE_TOKEN, null);
const logger = new Logger('util/Mailer');
if (!apiKey) {
	void logger.warn(`ENV: ${UtilEnvVars.MAIL_SERVICE_TOKEN} is not set, sending email not available!`);
} else if (!apiKey.startsWith('SG.')) {
	void logger.warn(`ENV: ${UtilEnvVars.MAIL_SERVICE_TOKEN} is invalid: ${apiKey}, sending email not available`);
} else {
	sgMail.setApiKey(apiKey);
}

export const sendEmail = async (
	from: string,
	to: string,
	subject: string,
	text: string,
	html: string,
): Promise<[ClientResponse, {}]> => {
	const msg = { to, from, subject, text, html };

	if (!apiKey?.startsWith('SG.')) {
		void logger.warn(`Seendgrid not available! No email sent to ${to}`);
		return;
	}

	return sgMail.send(msg);
};
