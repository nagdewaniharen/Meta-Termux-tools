"use client"

import { type ToasterProps } from "sonner"
import { Toaster as SonnerToaster } from "sonner"

export const Toaster = (props: ToasterProps) => {
  return <SonnerToaster {...props} />
}
