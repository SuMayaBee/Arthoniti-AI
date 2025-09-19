import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
          <textarea
        className={cn(
          "flex h-[150px] w-full rounded-[20px] bg-white px-5 py-5 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none border border-gray-300",
          className
        )}
        ref={ref}
        {...props}
      />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
