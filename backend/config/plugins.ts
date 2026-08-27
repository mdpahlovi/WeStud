export default ({ env }) => ({
    email: {
        config: {
            provider: "nodemailer",
            providerOptions: {
                host: env("SMTP_HOST", "smtp.gmail.com"),
                port: env("SMTP_PORT", 587),
                auth: {
                    user: env("EMAIL_USER"),
                    pass: env("EMAIL_PASS"),
                },
            },
            settings: {
                defaultFrom: env("EMAIL_FROM", env("EMAIL_USER")),
                defaultReplyTo: env("EMAIL_REPLY_TO", env("EMAIL_USER")),
            },
        },
    },
});
