import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, AlertCircle, CheckCircle2, Bot, User } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { chatApi } from '@/shared/api/chat.api'
import { cn } from '@/shared/lib/utils'

// Flexibly extract text from various possible message shapes
function extractText(msg) {
  return msg?.content ?? msg?.message ?? msg?.reply ?? msg?.text ?? ''
}

// Determine sender role from various possible message shapes
function extractRole(msg) {
  const r = msg?.role ?? msg?.sender ?? msg?.type ?? ''
  if (r === 'user' || r === 'human') return 'user'
  if (r === 'assistant' || r === 'ai' || r === 'bot' || r === 'system') return 'assistant'
  // Fallback: if there's an is_ai / is_bot flag
  if (msg?.is_ai || msg?.is_bot) return 'assistant'
  return 'user'
}

function MessageBubble({ role, text, isTyping }) {
  const isUser = role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn('flex items-end gap-2', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
          isUser ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground',
        )}
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'rounded-br-sm bg-primary text-primary-foreground'
            : 'rounded-bl-sm bg-muted text-foreground',
        )}
      >
        {isTyping ? (
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        ) : (
          <span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>
        )}
      </div>
    </motion.div>
  )
}

export function PatientChatPage() {
  const { t } = useTranslation()

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loadError, setLoadError] = useState(null)
  const [sendError, setSendError] = useState(null)
  const [finalized, setFinalized] = useState(false)
  const [finalizing, setFinalizing] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false)

  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Load conversation history on mount
  useEffect(() => {
    chatApi
      .history()
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.messages ?? data?.history ?? [])
        setMessages(
          list.map((msg, i) => ({
            id: msg.id ?? i,
            role: extractRole(msg),
            text: extractText(msg),
            created_at: msg.created_at ?? msg.timestamp ?? null,
          })),
        )
      })
      .catch(() => setLoadError(t('chat.loadError')))
      .finally(() => setHistoryLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || sending || finalized) return

    setInput('')
    setSendError(null)

    const userMsg = { id: Date.now(), role: 'user', text }
    setMessages((prev) => [...prev, userMsg])

    setSending(true)
    try {
      const res = await chatApi.send(text)
      // Extract AI reply — handle multiple response shapes
      const aiText =
        typeof res === 'string'
          ? res
          : res?.content ?? res?.message ?? res?.reply ?? res?.response ?? res?.text ?? ''

      if (aiText) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, role: 'assistant', text: aiText },
        ])
      }
    } catch (err) {
      const detail = err?.response?.data?.detail
      setSendError(typeof detail === 'string' ? detail : t('chat.sendError'))
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  const handleFinalize = async () => {
    setShowFinalizeConfirm(false)
    setFinalizing(true)
    try {
      await chatApi.finalize()
      setFinalized(true)
    } catch (err) {
      const detail = err?.response?.data?.detail
      setSendError(typeof detail === 'string' ? detail : t('common.error'))
    } finally {
      setFinalizing(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[800px] max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{t('chat.title')}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t('chat.subtitle')}</p>
        </div>
        {!finalized && !historyLoading && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFinalizeConfirm(true)}
            loading={finalizing}
            className="shrink-0"
          >
            {t('chat.finalize')}
          </Button>
        )}
      </div>

      {/* Finalize confirmation */}
      <AnimatePresence>
        {showFinalizeConfirm && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
          >
            <p className="flex-1 text-sm text-foreground">{t('chat.finalizeConfirm')}</p>
            <Button size="sm" onClick={handleFinalize}>{t('common.confirm')}</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowFinalizeConfirm(false)}>{t('common.cancel')}</Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-thin">
        {historyLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {loadError && !historyLoading && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-muted-foreground">{loadError}</p>
          </div>
        )}

        {!historyLoading && !loadError && messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3 py-12 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-7 w-7 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">{t('chat.empty')}</p>
            <p className="text-xs text-muted-foreground max-w-xs">{t('chat.emptyHint')}</p>
          </motion.div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} role={msg.role} text={msg.text} />
        ))}

        {sending && (
          <MessageBubble role="assistant" text="" isTyping />
        )}

        <div ref={bottomRef} />
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {sendError && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 rounded-xl bg-destructive/10 px-4 py-2.5 text-xs text-destructive mb-2"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {sendError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Finalized banner */}
      {finalized && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {t('chat.finalized')}
        </div>
      )}

      {/* Input area */}
      {!finalized && (
        <div className="pt-3 border-t border-border">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); setSendError(null) }}
              onKeyDown={handleKeyDown}
              placeholder={t('chat.placeholder')}
              rows={1}
              className="flex-1 resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors max-h-32 leading-relaxed"
              style={{ height: 'auto', minHeight: '42px' }}
              onInput={(e) => {
                e.target.style.height = 'auto'
                e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`
              }}
              disabled={sending || finalized}
            />
            <Button
              size="icon"
              onClick={handleSend}
              loading={sending}
              disabled={!input.trim() || sending}
              aria-label={t('chat.send')}
              className="shrink-0 h-[42px] w-[42px] rounded-xl"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-muted-foreground/60">
            {t('chat.enterHint')}
          </p>
        </div>
      )}
    </div>
  )
}
