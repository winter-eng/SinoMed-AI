import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Lightbulb } from 'lucide-react'
import { Card } from '@/shared/components/ui/Card'
import { EmptyState } from '@/shared/components/ui/EmptyState'

export function FindingsList({ title, items, emptyMessage, type }) {
  const Icon = type === 'finding' ? AlertCircle : Lightbulb
  const iconColor = type === 'finding' ? 'text-amber-500' : 'text-primary'

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      {items.length === 0 ? (
        <EmptyState icon={<CheckCircle2 className="h-5 w-5" />} title={emptyMessage} className="py-6" />
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <Card variant="subtle" padding="sm" className="flex items-start gap-3">
                <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${iconColor}`} />
                <p className="text-sm text-foreground leading-snug">{item}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
