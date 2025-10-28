'use client'

import { redirectToDashboard } from '@/actions/navigation.action.ts'
import React, { use, useEffect } from 'react'
import { toast } from 'react-toastify'

function ErrorClient (
  {
    error
  }:
  {
    error: Error | null | string
  }): React.ReactNode {
  useEffect(() => {
    toast.error(
      typeof error === 'string'
        ? error
        : error instanceof Error
          ? error.message
          : 'An unexpected error occurred.'
      , {
        position: 'top-right',
        autoClose: 5000
      }
    )
    void redirectToDashboard()
  }, [error])
  return (
    <div />
  )
}

export default ErrorClient
