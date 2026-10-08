package com.beanforge.kickback.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/** Development mailer: prints the reset link in the server log instead of emailing it. */
@Component
public class LoggingPasswordResetMailer implements PasswordResetMailer {

    private static final Logger log = LoggerFactory.getLogger(LoggingPasswordResetMailer.class);

    @Override
    public void sendResetLink(String toEmail, String firstName, String resetUrl) {
        log.info("[password-reset] link for {} ({}): {}", toEmail, firstName, resetUrl);
    }
}
