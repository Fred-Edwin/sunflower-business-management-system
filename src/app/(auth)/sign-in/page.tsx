import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LoginForm } from "@/components/LoginForm"

// The only unauthenticated surface (INV-T4). Restyled to the Ledger design
// system in PHASE-00B — the form itself is the demoted shadcn login-form block
// (components/LoginForm.tsx).
export default function SignInPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-surface-sunken p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-lg">Sign in</CardTitle>
          <CardDescription>Sunflower Events business management</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
