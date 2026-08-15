import HeaderTitleDescription from "@/components/admin/elements/headerTitleDescription";
import SectionVisibilityForm from "@/components/admin/site-config/SectionVisibilityForm";

export default function VisibilitySettingsPage() {
  return (
    <main>
      <HeaderTitleDescription
        title="Show / hide sections"
        description="Turn navigation links and whole pages on or off. Changes take effect on the live site immediately."
      />
      <div className="p-6">
        <SectionVisibilityForm />
      </div>
    </main>
  );
}
