"use client"

import { useState, type ReactNode } from 'react'
import { ContactCtaWithModal } from './ContactCtaWithModal'

type CallModalTriggerProps = {
  children: ReactNode
  className?: string
  onOpen?: () => void
}

export function CallModalTrigger({ children, className, onOpen }: CallModalTriggerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true)
          onOpen?.()
        }}
        className={className}
      >
        {children}
      </button>
      <ContactCtaWithModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}
