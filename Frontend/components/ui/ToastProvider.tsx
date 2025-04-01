"use client"

import type React from "react"

import { ToastProvider as ToastProviderPrimitive } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"

export function ToastProvider({ children }: { children: React.ReactNode }) {
    return (
        <ToastProviderPrimitive>
            {children}
            <Toaster />
        </ToastProviderPrimitive>
    )
}

