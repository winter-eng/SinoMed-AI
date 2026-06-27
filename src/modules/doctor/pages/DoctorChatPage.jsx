import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Send } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

const INITIAL_CONVERSATIONS = [
  {
    id: 1,
    name: 'Aziz Karimov',
    time: '10:42',
    unread: 2,
    lastMessage: "Test natijalarim haqida so'ramoqchim...",
    messages: [
      { from: 'patient', text: "Salom doktor, kechagi test natijalarini olish mumkinmi?", time: '10:30' },
      { from: 'doctor', text: "Salom Aziz aka. Ha, natijalar tayyor. DRI ko'rsatkichingiz 82% ko'rsatdi.", time: '10:35' },
      { from: 'patient', text: 'Bu yaxshimi yoki yomonmi?', time: '10:36' },
      { from: 'doctor', text: "Xavf darajasi yuqori. Mutaxassis ko'rigiga murojaat qilish tavsiya etiladi.", time: '10:38' },
      { from: 'patient', text: 'Tushunarlı, qachon borish kerak?', time: '10:40' },
      { from: 'doctor', text: "Imkon qadar tezroq, 1–2 kun ichida. Klinika ma'lumotlarini yuboraman.", time: '10:42' },
    ],
  },
  {
    id: 2,
    name: 'Malika Toshmatova',
    time: '09:15',
    unread: 0,
    lastMessage: "Rahmat doktor, dori kuchli ta'sir qilyapti",
    messages: [
      { from: 'doctor', text: 'Malika xonim, tahlil natijalari tayyor. DRI: 65%. Batafsil ko\'rish tavsiya etiladi.', time: '08:50' },
      { from: 'patient', text: 'Voy, bu nima degani?', time: '09:00' },
      { from: 'doctor', text: "O'rtacha xavf darajasi. Metformin davomi to'g'ri. Ovqatlanish rejimini saqlang.", time: '09:10' },
      { from: 'patient', text: "Rahmat doktor, dori kuchli ta'sir qilyapti", time: '09:15' },
    ],
  },
  {
    id: 3,
    name: 'Jahon Nazarov',
    time: 'Kecha',
    unread: 1,
    lastMessage: 'Qayta qachon borish kerak?',
    messages: [
      { from: 'patient', text: 'Salom doktor. Men kecha klinikaga bordim.', time: '15:30' },
      { from: 'doctor', text: 'Yaxshi. Natijalar qanday chiqdi?', time: '15:45' },
      { from: 'patient', text: 'Shifokor 3 oy ichida qayta kelish kerak dedi.', time: '15:47' },
      { from: 'doctor', text: "To'g'ri. Men siz uchun eslatma qo'yaman. Dori ichishni unutmang.", time: '15:50' },
      { from: 'patient', text: 'Qayta qachon borish kerak?', time: '15:52' },
    ],
  },
  {
    id: 4,
    name: 'Dilnoza Umarova',
    time: 'Iyn 25',
    unread: 0,
    lastMessage: 'Dori-darmonlar haqida savol bor edi',
    messages: [
      { from: 'patient', text: 'Salom doktor. Dori-darmonlar haqida savol bor edi.', time: '14:00' },
      { from: 'doctor', text: 'Marhamat, so\'rang.', time: '14:10' },
      { from: 'patient', text: 'Metformin bilan birga vitamin ichsa bo\'ladimi?', time: '14:12' },
      { from: 'doctor', text: 'Ha, D va B12 vitamini tavsiya etiladi. Kuniga 1 marta ovqatdan keyin.', time: '14:15' },
    ],
  },
]

function initials(name) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

function fmt() {
  return new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
}

export function DoctorChatPage() {
  const { t } = useTranslation()
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS)
  const [activeId, setActiveId] = useState(null)
  const [draft, setDraft] = useState('')
  const bottomRef = useRef(null)

  const active = conversations.find((c) => c.id === activeId)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeId, active?.messages?.length])

  const openConversation = (id) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)),
    )
    setActiveId(id)
    setDraft('')
  }

  const sendMessage = () => {
    if (!draft.trim() || !activeId) return
    const text = draft.trim()
    const time = fmt()
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, lastMessage: text, time, messages: [...c.messages, { from: 'doctor', text, time }] }
          : c,
      ),
    )
    setDraft('')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!active ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div>
              <h1 className="text-xl font-semibold text-foreground">{t('doctor.chat.title')}</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {conversations.length} {t('doctor.chat.subtitle')}
              </p>
            </div>

            <div className="space-y-2">
              {conversations.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.3 }}
                >
                  <button
                    onClick={() => openConversation(c.id)}
                    className="w-full rounded-xl border border-border bg-card p-3.5 text-left transition-colors hover:bg-accent/50 active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                          {initials(c.name)}
                        </div>
                        {c.unread > 0 && (
                          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                            {c.unread}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p
                            className={cn(
                              'text-sm font-semibold text-foreground',
                              c.unread > 0 && 'text-primary',
                            )}
                          >
                            {c.name}
                          </p>
                          <span className="ml-2 shrink-0 text-[11px] text-muted-foreground">
                            {c.time}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {c.lastMessage}
                        </p>
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`chat-${active.id}`}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <button
                onClick={() => setActiveId(null)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-accent"
                aria-label={t('doctor.chat.backToList')}
              >
                <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              </button>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                {initials(active.name)}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{active.name}</p>
                <p className="text-xs text-green-500">Online</p>
              </div>
            </div>

            {/* Messages */}
            <div className="max-h-[55vh] min-h-[30vh] overflow-y-auto space-y-3 pb-2 pr-1">
              {active.messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.2 }}
                  className={cn('flex', msg.from === 'doctor' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-3.5 py-2.5',
                      msg.from === 'doctor'
                        ? 'rounded-br-sm bg-primary text-primary-foreground'
                        : 'rounded-bl-sm bg-muted text-foreground',
                    )}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p
                      className={cn(
                        'mt-1 text-[10px]',
                        msg.from === 'doctor'
                          ? 'text-right text-primary-foreground/70'
                          : 'text-muted-foreground',
                      )}
                    >
                      {msg.time}
                    </p>
                  </div>
                </motion.div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-border pt-3">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={t('doctor.chat.inputPlaceholder')}
                className="h-10 flex-1 rounded-xl border border-input bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
              <button
                onClick={sendMessage}
                disabled={!draft.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors hover:bg-primary/90 active:scale-95 disabled:opacity-40"
                aria-label={t('doctor.chat.send')}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
