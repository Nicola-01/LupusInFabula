"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Toaster as Sonner } from "sonner";

const Toaster = ({
  ...props
}) => {
  // The app's theme lives on <body data-bs-theme>, not in next-themes.
  const readTheme = () => document.body.dataset.bsTheme || "light"
  const [theme, setTheme] = useState(readTheme)
  useEffect(() => {
    const obs = new MutationObserver(() => setTheme(readTheme()))
    obs.observe(document.body, { attributes: true, attributeFilter: ["data-bs-theme"] })
    return () => obs.disconnect()
  }, [])

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)"
        }
      }
      {...props}
    />
  );
}

export { Toaster }
