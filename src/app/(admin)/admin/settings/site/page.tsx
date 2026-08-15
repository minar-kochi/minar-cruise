import HeaderTitleDescription from "@/components/admin/elements/headerTitleDescription";
import SiteConfigForm from "@/components/admin/site-config/SiteConfigForm";

export default function SiteSettingsPage() {
  return (
    <main>
      <HeaderTitleDescription
        title="Site settings"
        description="The site name, the default title and description search engines show, the social share image, and the numbers customers call to book."
      />
      <div className="p-6">
        <SiteConfigForm />
      </div>
    </main>
  );
}
