package com.beanforge.kickback.auth;

/**
 * Delivers the password reset link to the user.
 * The default implementation only logs the link (see LoggingPasswordResetMailer).
 * To send real email, add an implementation (e.g. JavaMailSender based) and mark it
 * @Primary, or replace the logging one.
 */
public interface PasswordResetMailer {
    void sendResetLink(String toEmail, String firstName, String resetUrl);
}
