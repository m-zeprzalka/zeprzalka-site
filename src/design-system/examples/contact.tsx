import { CopyEmail } from "@/components/layout/copy-email"
import { getHomeContent } from "@/lib/content/home"

/** Rząd nad formularzem kontaktu: adres do skopiowania i czas odpowiedzi. */
export function ContactExample() {
  const { email, contact } = getHomeContent("pl")
  const { labels } = contact

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <CopyEmail email={email} label={labels.copyEmail} copiedLabel={labels.copied} />
      <p className="text-sm text-muted-foreground">
        {labels.responseTimeLabel} <span className="text-foreground">{labels.responseTime}</span>
      </p>
    </div>
  )
}
