"use client"

import { MicIcon, SearchIcon } from "lucide-react"
import { GallerySection, StateRow } from "./gallery-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { DatePicker } from "@/components/ui/date-picker"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { toast } from "sonner"

const BUTTON_VARIANTS = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "link",
] as const

export function Tier1Gallery() {
  return (
    <>
      <GallerySection
        title="Button"
        note="Every variant in resting / hover / focus / active / disabled / aria-invalid / loading."
      >
        {BUTTON_VARIANTS.map((variant) => (
          <StateRow key={variant} label={variant}>
            <Button variant={variant}>Send quote</Button>
            <Button variant={variant} data-force-state="hover">
              Send quote
            </Button>
            <Button variant={variant} data-force-state="focus">
              Send quote
            </Button>
            <Button variant={variant} data-force-state="active">
              Send quote
            </Button>
            <Button variant={variant} disabled>
              Send quote
            </Button>
            <Button variant={variant} aria-invalid>
              Send quote
            </Button>
          </StateRow>
        ))}
        <StateRow label="sizes">
          <Button size="xs">xs</Button>
          <Button size="sm">sm</Button>
          <Button size="default">default</Button>
          <Button size="lg">lg</Button>
          <Button size="icon" aria-label="mic">
            <MicIcon />
          </Button>
        </StateRow>
      </GallerySection>

      <GallerySection title="Input">
        <StateRow label="resting / focus / disabled / aria-invalid">
          <Input placeholder="you@example.com" className="max-w-xs" />
          <Input
            placeholder="you@example.com"
            className="max-w-xs"
            data-force-state="focus"
          />
          <Input placeholder="disabled" className="max-w-xs" disabled />
          <Input
            placeholder="invalid"
            className="max-w-xs"
            aria-invalid
          />
        </StateRow>
        <StateRow label="InputGroup — magnifier + field">
          <InputGroup className="max-w-xs">
            <InputGroupAddon>
              <SearchIcon className="size-4 text-text-muted" />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search clients" />
          </InputGroup>
        </StateRow>
      </GallerySection>

      <GallerySection title="Textarea">
        <StateRow label="resting / focus / disabled / aria-invalid">
          <Textarea placeholder="Notes" className="max-w-xs" />
          <Textarea
            placeholder="Notes"
            className="max-w-xs"
            data-force-state="focus"
          />
          <Textarea placeholder="disabled" className="max-w-xs" disabled />
          <Textarea placeholder="invalid" className="max-w-xs" aria-invalid />
        </StateRow>
      </GallerySection>

      <GallerySection
        title="Select"
        note="Trigger states shown live. The open panel is not force-mounted — a forced-open Radix Select locks body scroll, which would break this page. Open one to see the content styling."
      >
        <StateRow label="trigger: resting / focus / disabled">
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Choose a client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">Karatina Girls High</SelectItem>
              <SelectItem value="b">County Government</SelectItem>
              <SelectItem value="c">Nyeri Club</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-48" data-force-state="focus">
              <SelectValue placeholder="Choose a client" />
            </SelectTrigger>
          </Select>
          <Select disabled>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Disabled" />
            </SelectTrigger>
          </Select>
        </StateRow>
      </GallerySection>

      <GallerySection title="Checkbox / RadioGroup / Switch">
        <StateRow label="Checkbox: unchecked / checked / disabled / invalid">
          <Checkbox aria-label="a" />
          <Checkbox aria-label="b" defaultChecked />
          <Checkbox aria-label="c" disabled />
          <Checkbox aria-label="d" defaultChecked disabled />
          <Checkbox aria-label="e" aria-invalid />
        </StateRow>
        <StateRow label="RadioGroup">
          <RadioGroup defaultValue="one" className="flex gap-4">
            <Label className="gap-1.5">
              <RadioGroupItem value="one" /> One
            </Label>
            <Label className="gap-1.5">
              <RadioGroupItem value="two" /> Two
            </Label>
            <Label className="gap-1.5 opacity-50">
              <RadioGroupItem value="three" disabled /> Disabled
            </Label>
          </RadioGroup>
        </StateRow>
        <StateRow label="Switch: off / on / disabled">
          <Switch aria-label="a" />
          <Switch aria-label="b" defaultChecked />
          <Switch aria-label="c" disabled />
          <Switch aria-label="d" defaultChecked disabled />
        </StateRow>
      </GallerySection>

      <GallerySection
        title="Badge"
        note="Generic Tier 1 badge. The domain StatusBadge (dot + label, no chip) is in the deferred Tier 2 set."
      >
        <StateRow label="variants">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="ghost">Ghost</Badge>
        </StateRow>
      </GallerySection>

      <GallerySection title="Card">
        <StateRow label="resting" className="items-stretch">
          <Card className="w-64">
            <CardHeader>
              <CardTitle>Quote QUO-2026-0042</CardTitle>
              <CardDescription>Karatina Girls High</CardDescription>
            </CardHeader>
            <CardContent className="text-text-muted">
              Body content on the surface.
            </CardContent>
          </Card>
        </StateRow>
      </GallerySection>

      <GallerySection title="Tabs">
        <StateRow label="resting (Tab one active)">
          <Tabs defaultValue="one" className="w-80">
            <TabsList>
              <TabsTrigger value="one">Details</TabsTrigger>
              <TabsTrigger value="two">History</TabsTrigger>
              <TabsTrigger value="three" disabled>
                Disabled
              </TabsTrigger>
            </TabsList>
            <TabsContent value="one" className="pt-2 text-text-muted">
              Panel one.
            </TabsContent>
            <TabsContent value="two" className="pt-2 text-text-muted">
              Panel two.
            </TabsContent>
          </Tabs>
        </StateRow>
      </GallerySection>

      <GallerySection title="Dialog / Sheet / Popover / DropdownMenu / Tooltip">
        <StateRow label="triggers (open to view overlay styling)">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Void invoice INV-2026-0043?</DialogTitle>
                <DialogDescription>
                  This cannot be undone. A replacement invoice is issued
                  separately.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive">Void invoice</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Narrow the list.</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open popover</Button>
            </PopoverTrigger>
            <PopoverContent>Popover body on surface-raised.</PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">Void</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Tooltip anchor (hover)</Button>
              </TooltipTrigger>
              <TooltipContent>Tooltip on neutral-900</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </StateRow>
      </GallerySection>

      <GallerySection title="Table (primitive)">
        <StateRow label="resting" className="block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Qty</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Chiavari chairs</TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  200
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Round tables 1.8m</TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  25
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </StateRow>
      </GallerySection>

      <GallerySection title="Calendar / DatePicker">
        <StateRow label="Calendar (single) / DatePicker trigger" className="items-start">
          <Calendar mode="single" className="rounded-md border border-border" />
          <DatePicker placeholder="Event date" />
        </StateRow>
      </GallerySection>

      <GallerySection title="Skeleton / Separator / ScrollArea / Toast">
        <StateRow label="Skeleton">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="size-10 rounded-full" />
        </StateRow>
        <StateRow label="Separator" className="block">
          <div className="max-w-xs">
            <p className="text-sm">Above</p>
            <Separator className="my-2" />
            <p className="text-sm">Below</p>
          </div>
        </StateRow>
        <StateRow label="ScrollArea">
          <ScrollArea className="h-24 w-48 rounded-md border border-border p-2 text-sm">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i}>Row {i + 1}</div>
            ))}
          </ScrollArea>
        </StateRow>
        <StateRow label="Toast (Sonner)">
          <Button
            variant="outline"
            onClick={() => toast.success("Quote sent to Karatina Girls High")}
          >
            Fire success toast
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.error("Could not reach the server")}
          >
            Fire error toast
          </Button>
        </StateRow>
      </GallerySection>
    </>
  )
}
