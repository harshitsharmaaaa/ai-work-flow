import { resend } from "@/lib/resend"

const FROM_ADDRESS = "onboarding@resend.dev"

export async function sendEmail({
  to,
  subject,
  body,
}: {
  to: string
  subject: string
  body: string
}) {
  const { data, error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject,
    text: body,
  })

  if (error) {
    throw new Error(error.message)
  }

  if (!data?.id) {
    throw new Error("Resend did not return an email id")
  }

  return {
    id: data.id,
  }
}
