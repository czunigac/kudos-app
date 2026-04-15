"use client";

import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useToast from "@/components/ui/use-toast";
import { useUpdateProfile } from "@/hooks/useProfile";
import api from "@/lib/api";
import type { UserProfile } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const profileFormSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "Display name is required")
    .max(100, "Max 100 characters"),
  avatarUrl: z.string().max(2048, "URL is too long"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const updateProfile = useUpdateProfile();

  const id = typeof params.id === "string" ? params.id : params.id?.[0];

  const { data: profile, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const { data } = await api.get<UserProfile>("/api/auth/me");
      return data;
    },
  });

  useEffect(() => {
    if (!profile || !id) return;
    if (id !== profile.id) {
      router.replace(`/profile/${profile.id}`);
    }
  }, [profile, id, router]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { displayName: "", avatarUrl: "" },
  });

  useEffect(() => {
    if (!profile) return;
    form.reset({
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
    });
  }, [profile, form]);

  if (isLoading || !profile || !id || id !== profile.id) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  async function onSubmit(values: ProfileFormValues) {
    try {
      await updateProfile.mutateAsync({
        displayName: values.displayName,
        avatarUrl: values.avatarUrl?.trim() || null,
      });
      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
    } catch {
      toast({
        title: "Could not save",
        description: "Check your inputs and try again.",
        variant: "destructive",
      });
    }
  }

  const previewName = form.watch("displayName") || profile.displayName;
  const previewAvatar =
    form.watch("avatarUrl")?.trim() || profile.avatarUrl;

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update how your name and photo appear across KudosApp.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your presence</CardTitle>
          <CardDescription>
            Email comes from your login and cannot be changed here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center gap-4">
            <UserAvatar
              user={{
                displayName: previewName,
                avatarUrl: previewAvatar,
              }}
              size="lg"
            />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{previewName}</p>
              <p className="truncate">{profile.email}</p>
            </div>
          </div>

          <form
            onSubmit={form.handleSubmit((v) => void onSubmit(v))}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={profile.email} disabled readOnly />
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display name</Label>
              <Input
                id="displayName"
                autoComplete="name"
                {...form.register("displayName")}
                aria-invalid={form.formState.errors.displayName ? "true" : "false"}
              />
              {form.formState.errors.displayName ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.displayName.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatarUrl">Avatar image URL</Label>
              <Input
                id="avatarUrl"
                type="url"
                inputMode="url"
                placeholder="https://… (optional)"
                {...form.register("avatarUrl")}
                aria-invalid={form.formState.errors.avatarUrl ? "true" : "false"}
              />
              <p className="text-xs text-muted-foreground">
                Use a direct link to an image. Leave empty to use a generated
                avatar from your display name.
              </p>
              {form.formState.errors.avatarUrl ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.avatarUrl.message}
                </p>
              ) : null}
            </div>

            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recognition stats</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">Total points</dt>
              <dd className="text-lg font-semibold tabular-nums text-foreground">
                {profile.totalPoints}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Kudos given</dt>
              <dd className="text-lg font-semibold tabular-nums text-foreground">
                {profile.kudosGivenCount}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Kudos received</dt>
              <dd className="text-lg font-semibold tabular-nums text-foreground">
                {profile.kudosReceivedCount}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
