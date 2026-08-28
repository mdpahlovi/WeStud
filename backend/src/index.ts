import type { Core } from "@strapi/types";

/**
 * Canonical roles, seeded idempotently on every boot (instead of via the admin UI).
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
    // Strapi 5's users-permissions services don't expose what's needed, so use
    // the DB query layer directly.
    const roleQuery = strapi.db.query("plugin::users-permissions.role");
    const permissionQuery = strapi.db.query("plugin::users-permissions.permission");

    // Registrations land on default_role; it must be a seeded role, otherwise
    // /users/me 403s right after login.
    const DEFAULT_SIGNUP_ROLE = "student";
    const pluginStore = strapi.store({ type: "plugin", name: "users-permissions" });
    const advanced = ((await pluginStore.get({ key: "advanced" })) as Record<string, unknown>) ?? {};
    if (advanced.default_role !== DEFAULT_SIGNUP_ROLE) {
        await pluginStore.set({ key: "advanced", value: { ...advanced, default_role: DEFAULT_SIGNUP_ROLE } });
        strapi.log.info(`[bootstrap] default_role set to "${DEFAULT_SIGNUP_ROLE}"`);
    }

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
                } catch {}
            }
        }
    }
}
