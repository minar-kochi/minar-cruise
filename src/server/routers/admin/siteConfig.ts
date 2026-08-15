import { db } from "@/db";
import {
  SITE_CONFIG_SINGLETON_ID,
  getSiteConfigUncached,
} from "@/lib/helpers/config/getSiteConfig";
import {
  SITE_SECTIONS,
  getSectionVisibility,
} from "@/lib/helpers/config/getSectionVisibility";
import { SiteConfigValidator } from "@/lib/validators/SiteConfigValidator";
import {
  revalidateSectionVisibility,
  revalidateSiteConfig,
} from "@/revalidator/site";
import { AdminProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const sectionKeys = SITE_SECTIONS.map((s) => s.key) as [string, ...string[]];

export const siteConfig = router({
  getSiteConfig: AdminProcedure.query(async () => {
    return await getSiteConfigUncached();
  }),

  updateSiteConfig: AdminProcedure.input(SiteConfigValidator).mutation(
    async ({ input }) => {
      try {
        const data = await db.siteConfig.upsert({
          where: { id: SITE_CONFIG_SINGLETON_ID },
          create: { id: SITE_CONFIG_SINGLETON_ID, ...input },
          update: input,
        });
        await revalidateSiteConfig();
        return data;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update site configuration",
        });
      }
    },
  ),

  /** Returns every known section with its current state, labels included. */
  getSectionVisibility: AdminProcedure.query(async () => {
    const visibility = await getSectionVisibility();
    return SITE_SECTIONS.map((section) => ({
      key: section.key,
      label: section.label,
      isVisible: visibility[section.key],
    }));
  }),

  updateSectionVisibility: AdminProcedure.input(
    z.object({
      sections: z.array(
        z.object({
          key: z.enum(sectionKeys),
          isVisible: z.boolean(),
        }),
      ),
    }),
  ).mutation(async ({ input: { sections } }) => {
    try {
      const labelFor = new Map(SITE_SECTIONS.map((s) => [s.key, s.label]));

      await db.$transaction(
        sections.map((section) =>
          db.siteSectionVisibility.upsert({
            where: { key: section.key },
            create: {
              key: section.key,
              label: labelFor.get(section.key as never) ?? section.key,
              isVisible: section.isVisible,
            },
            update: { isVisible: section.isVisible },
          }),
        ),
      );

      await revalidateSectionVisibility();
      return { success: true };
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update section visibility",
      });
    }
  }),
});
