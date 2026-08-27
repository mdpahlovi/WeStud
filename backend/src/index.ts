import type { Core } from "@strapi/types";

/**
 * Roles live in code so the security posture is reviewable and reproducible.
 * Strapi's role-based permissions are normally configured through the admin UI
 * and stored in the DB; this hook seeds the canonical set on every boot,
 * idempotently.
 */
const ROLES = [
    {
        name: "Public",
        description: "Default role for unauthenticated visitors.",
        type: "public",
        permissions: [
            // Required by Strapi 5 for /api/auth/* routes (login, register, etc.).
            "plugin::users-permissions.auth.callback",
            "plugin::users-permissions.auth.connect",
            "plugin::users-permissions.auth.forgotPassword",
            "plugin::users-permissions.auth.resetPassword",
            "plugin::users-permissions.auth.register",
            "plugin::users-permissions.auth.emailConfirmation",
            "plugin::users-permissions.auth.sendEmailConfirmation",
            "plugin::users-permissions.auth.refresh",
            "api::course.course.find",
            "api::course.course.findOne",
            "api::module.module.find",
            "api::module.module.findOne",
            "api::class.class.find",
            "api::class.class.findOne",
            "plugin::upload.content-api.find",
            "plugin::upload.content-api.findOne",
        ],
    },
    {
        name: "Authenticated",
        description: "Default role for signed-in users.",
        type: "authenticated",
        permissions: [
            "plugin::users-permissions.auth.logout",
            "plugin::users-permissions.auth.getSessions",
            "plugin::users-permissions.auth.revokeSession",
            "plugin::users-permissions.auth.changePassword",
            "api::course.course.find",
            "api::course.course.findOne",
            "api::module.module.find",
            "api::module.module.findOne",
            "api::class.class.find",
            "api::class.class.findOne",
            "api::enrollment.enrollment.find",
            "api::enrollment.enrollment.findOne",
            "api::enrollment.enrollment.create",
            "api::enrollment.enrollment.update",
            "api::enrollment.enrollment.delete",
            "plugin::users-permissions.user.me",
            "plugin::users-permissions.user.find",
            "plugin::users-permissions.user.findOne",
            "plugin::upload.content-api.find",
            "plugin::upload.content-api.findOne",
        ],
    },
    {
        name: "Student",
        description: "Enrolled learner. Same content access as Authenticated.",
        type: "student",
        permissions: [
            "plugin::users-permissions.auth.logout",
            "plugin::users-permissions.auth.getSessions",
            "plugin::users-permissions.auth.revokeSession",
            "plugin::users-permissions.auth.changePassword",
            "api::course.course.find",
            "api::course.course.findOne",
            "api::module.module.find",
            "api::module.module.findOne",
            "api::class.class.find",
            "api::class.class.findOne",
            "api::enrollment.enrollment.find",
            "api::enrollment.enrollment.findOne",
            "api::enrollment.enrollment.create",
            "api::enrollment.enrollment.update",
            "plugin::users-permissions.user.me",
            "plugin::users-permissions.user.find",
            "plugin::users-permissions.user.findOne",
            "plugin::upload.content-api.find",
            "plugin::upload.content-api.findOne",
        ],
    },
] as const;

export default {
    register(/* { strapi }: { strapi: Core.Strapi } */) {},
    async bootstrap({ strapi }: { strapi: Core.Strapi }) {
        await seedRolesAndPermissions(strapi);
    },
};

async function seedRolesAndPermissions(strapi: Core.Strapi) {
    // Uses the DB query layer directly; the users-permissions services in
    // Strapi 5 don't expose the methods needed here.
    const roleQuery = strapi.db.query("plugin::users-permissions.role");
    const permissionQuery = strapi.db.query("plugin::users-permissions.permission");

    for (const roleDef of ROLES) {
        let role = await roleQuery.findOne({
            where: { type: roleDef.type },
            populate: ["permissions"],
        });

        if (!role) {
            role = await roleQuery.create({
                data: {
                    name: roleDef.name,
                    description: roleDef.description,
                    type: roleDef.type,
                },
            });
            strapi.log.info(`[bootstrap] Created role "${roleDef.name}" (${roleDef.type})`);
        }

        const existingActions = new Set<string>((role.permissions || []).map((p: any) => p.action));
        const desiredActions = new Set<string>(roleDef.permissions);

        for (const action of desiredActions) {
            if (!existingActions.has(action)) {
                try {
                    await permissionQuery.create({ data: { action, role: role.id } });
                } catch {
                    // Action may not exist in this Strapi version.
                    strapi.log.debug(`[bootstrap] Permission "${action}" not registered for role "${roleDef.name}"`);
                }
            }
        }

        for (const p of role.permissions || []) {
            if (!desiredActions.has(p.action)) {
                try {
                    await permissionQuery.delete({ where: { id: p.id } });
                } catch {
                    /* ignore */
                }
            }
        }
    }
}
