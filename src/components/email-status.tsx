"use client"

interface EmailStatusProps {
  results: Array<{
    email: string
    success: boolean
    emailSent?: boolean
    error?: string
  }>
}

export default function EmailStatus({ results }: EmailStatusProps) {
  const successfulEmails = results.filter((r) => r.success && r.emailSent).length
  const failedEmails = results.filter((r) => !r.success || !r.emailSent).length

  if (results.length === 0) return null

  return (
    <div className="space-y-3">
  
      <div className="flex gap-3 text-sm">
        <span className="text-green-600">✓ {successfulEmails} emails sent</span>
        {failedEmails > 0 && <span className="text-red-600">✗ {failedEmails} failed</span>}
      </div>

   
     
    </div>
  )
}
