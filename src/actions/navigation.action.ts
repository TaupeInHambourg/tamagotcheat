'use server'
import { redirect } from 'next/navigation'

export async function navigateToDashboard (): Promise<void> {
  redirect('/dashboard')
}
