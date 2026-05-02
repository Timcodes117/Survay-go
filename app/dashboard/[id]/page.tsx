import { redirect } from "next/navigation"

export default async function FormRouteRedirect({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  redirect(`/dashboard/${id}/editor`)
}
