
import BusinessProfileForm from "@/features/business-profile/components/BusinessProfileForm";

export default function BusinessProfilePage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Business Profile
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Set up your business details, branding and payment information.
        </p>
      </div>

      <BusinessProfileForm />
    </div>
  );
}
