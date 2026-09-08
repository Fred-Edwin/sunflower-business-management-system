"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// DatePicker is not a discrete shadcn primitive — it is the documented
// Calendar-in-a-Popover composition (PHASE-00B §5.1). It stays GENERIC: no
// Nairobi-timezone logic here. `lib/dates` formatting happens at the call site
// (coding-standards.md §8). The trigger shows whatever `format` returns, or a
// plain ISO date as a fallback.

function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  format,
  disabled,
  className,
  id,
  "aria-invalid": ariaInvalid,
}: {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  format?: (date: Date) => string
  disabled?: boolean
  className?: string
  id?: string
  "aria-invalid"?: boolean
}) {
  const [open, setOpen] = React.useState(false)

  const label = value
    ? (format ? format(value) : value.toISOString().slice(0, 10))
    : placeholder

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          size="default"
          disabled={disabled}
          aria-invalid={ariaInvalid}
          data-empty={!value}
          className={cn(
            "w-full justify-start font-normal data-[empty=true]:text-text-muted",
            className,
          )}
        >
          <CalendarIcon />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange?.(date)
            setOpen(false)
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
