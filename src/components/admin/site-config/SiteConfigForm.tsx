"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  SiteConfigValidator,
  TSiteConfigValidator,
} from "@/lib/validators/SiteConfigValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FieldError, FieldErrors, useForm } from "react-hook-form";
import toast from "react-hot-toast";

/**
 * Comma/enter-separated list editor for the string[] columns (keywords, booking
 * numbers). RHF cannot register an array of bare strings usefully, so these are
 * held in local state and pushed into the form with `setValue`.
 */
function TagListEditor({
  id,
  label,
  hint,
  placeholder,
  values,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  placeholder: string;
  values: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  function commit() {
    const parts = draft
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    if (!parts.length) return;
    onChange([...values, ...parts]);
    setDraft("");
  }

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-1.5 flex gap-2">
        <Input
          id={id}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // This lives inside a <form>; Enter would otherwise submit it.
              e.preventDefault();
              commit();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={commit}>
          Add
        </Button>
      </div>
      {hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
      <div className="mt-2 flex flex-wrap gap-2">
        {values.map((value, index) => (
          <span
            key={`${value}-${index}`}
            className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm"
          >
            {value}
            <button
              type="button"
              aria-label={`Remove ${value}`}
              onClick={() => onChange(values.filter((_, i) => i !== index))}
            >
              <X className="size-3.5" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SiteConfigForm() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.admin.siteConfig.getSiteConfig.useQuery();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TSiteConfigValidator>({
    resolver: zodResolver(SiteConfigValidator),
    defaultValues: {
      siteName: "",
      metaTitle: "",
      metaDescription: "",
      keywords: [],
      ogImage: "/thumbnail.jpg",
      bookingNumbers: [],
      contactEmail: null,
    },
  });

  useEffect(() => {
    if (!data) return;
    reset({
      siteName: data.siteName,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      keywords: data.keywords,
      ogImage: data.ogImage,
      bookingNumbers: data.bookingNumbers,
      contactEmail: data.contactEmail,
    });
  }, [data, reset]);

  const { mutate: updateSiteConfig, isPending } =
    trpc.admin.siteConfig.updateSiteConfig.useMutation({
      onError(error) {
        toast.error(error.message, { duration: 6000 });
      },
      async onSuccess() {
        toast.success("Site settings updated — pages revalidated");
        await utils.admin.siteConfig.getSiteConfig.invalidate();
      },
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  const keywords = watch("keywords");
  const bookingNumbers = watch("bookingNumbers");

  return (
    <form
      className="mx-auto max-w-2xl space-y-6"
      onSubmit={handleSubmit(
        (values) => updateSiteConfig(values),
        (formErrors: FieldErrors<TSiteConfigValidator>) => {
          const first = Object.values(formErrors).find(
            (e): e is FieldError => typeof e?.message === "string",
          )?.message;
          toast.error(first ?? "Please check the highlighted fields.", {
            duration: 5000,
          });
        },
      )}
    >
      <Card>
        <CardHeader>
          <CardTitle>Branding &amp; SEO</CardTitle>
          <CardDescription>
            Defaults for the browser tab title, search results and social share
            cards. Individual pages can still override them.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label htmlFor="siteName">Site name</Label>
            <Input id="siteName" className="mt-1.5" {...register("siteName")} />
            <p
              className={cn("mt-1 min-h-4 text-sm text-red-500", {
                hidden: !errors.siteName,
              })}
            >
              {errors.siteName?.message}
            </p>
          </div>

          <div>
            <Label htmlFor="metaTitle">Default page title</Label>
            <Input
              id="metaTitle"
              className="mt-1.5"
              {...register("metaTitle")}
            />
            <p
              className={cn("mt-1 min-h-4 text-sm text-red-500", {
                hidden: !errors.metaTitle,
              })}
            >
              {errors.metaTitle?.message}
            </p>
          </div>

          <div>
            <Label htmlFor="metaDescription">Default description</Label>
            <Textarea
              id="metaDescription"
              rows={4}
              className="mt-1.5"
              {...register("metaDescription")}
            />
            <p
              className={cn("mt-1 min-h-4 text-sm text-red-500", {
                hidden: !errors.metaDescription,
              })}
            >
              {errors.metaDescription?.message}
            </p>
          </div>

          <div>
            <Label htmlFor="ogImage">Social share image</Label>
            <Input id="ogImage" className="mt-1.5" {...register("ogImage")} />
            <p className="mt-1 text-xs text-muted-foreground">
              A path in /public (e.g. <code>/thumbnail.jpg</code>) or a full URL.
            </p>
            <p
              className={cn("mt-1 min-h-4 text-sm text-red-500", {
                hidden: !errors.ogImage,
              })}
            >
              {errors.ogImage?.message}
            </p>
          </div>

          <TagListEditor
            id="keywords"
            label="SEO keywords"
            placeholder="sunset cruise, Kochi tourism"
            hint="Press Enter or Add. Commas split multiple at once."
            values={keywords}
            onChange={(next) =>
              setValue("keywords", next, { shouldDirty: true })
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact details</CardTitle>
          <CardDescription>
            Shown on the contact page and wherever customers are asked to call.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <TagListEditor
            id="bookingNumbers"
            label="Booking phone numbers"
            placeholder="+91 80890 21666"
            values={bookingNumbers}
            onChange={(next) =>
              setValue("bookingNumbers", next, { shouldDirty: true })
            }
          />

          <div>
            <Label htmlFor="contactEmail">Contact email</Label>
            <Input
              id="contactEmail"
              className="mt-1.5"
              {...register("contactEmail", {
                setValueAs: (v) => (v === "" ? null : v),
              })}
            />
            <p
              className={cn("mt-1 min-h-4 text-sm text-red-500", {
                hidden: !errors.contactEmail,
              })}
            >
              {errors.contactEmail?.message}
            </p>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Saving
          </>
        ) : (
          "Save site settings"
        )}
      </Button>
    </form>
  );
}
