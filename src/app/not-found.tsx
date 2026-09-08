import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4 text-center">
      <p className="text-lg font-medium">Page not found.</p>
      <Button asChild>
        <Link href="/">Go home</Link>
      </Button>
    </div>
  )
}
