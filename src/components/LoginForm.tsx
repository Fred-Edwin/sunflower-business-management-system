"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { signInSchema, type SignInInput } from "@/lib/auth-schema"

// The shadcn login-form block, restyled to tokens and demoted to Tier 2
// (PHASE-00B §5.2 / §6.3). Kept: the form structure and submit handling, plus
// the PHASE-00A auth wiring (auth-client + react-hook-form + zodResolver +
// server-error mapping). Ours: 44px controls, accent primary button, no demo
// copy, no "or continue with" / social row, no sign-up link — INV-T4 keeps
// /sign-in the only unauthenticated surface and there is no self sign-up.
export function LoginForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values: SignInInput) {
    setServerError(null)

    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    })

    if (error) {
      setServerError("That email and password don't match a Sunflower account.")
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  className="h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="current-password"
                  className="h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {serverError ? (
          <p className="text-sm text-danger-solid" role="alert">
            {serverError}
          </p>
        ) : null}

        <Button
          type="submit"
          className="h-11"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </Form>
  )
}
