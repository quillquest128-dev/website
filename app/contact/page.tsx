'use client'
import { useState } from 'react'
import { MessageCircle, Mail, Send, CheckCircle2, Loader2 } from 'lucide-react'
import { DISCORD_LINK } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Simulate submission (in production, hook up to Supabase or email service)
    await new Promise(r => setTimeout(r, 1200))
    setSubmitted(true)
    setLoading(false)
    toast.success('Message sent! We\'ll get back to you soon.')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 min-h-screen">
      <div className="text-center mb-14">
        <span className="text-sm font-semibold text-[#00b5e8] uppercase tracking-widest block mb-3">Get in Touch</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Contact <span className="gradient-text">Support</span>
        </h1>
        <p className="text-[#8892a4] text-lg max-w-lg mx-auto">
          Have a question, issue, or just want to say hi? We're here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left – Contact Options */}
        <div className="lg:col-span-2 space-y-4">
          <a
            href={DISCORD_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="card-glass p-6 flex items-start gap-4 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-[rgba(0,181,232,0.1)] border border-[rgba(0,181,232,0.2)] flex items-center justify-center flex-shrink-0 group-hover:shadow-neon transition-shadow">
              <MessageCircle size={20} className="text-[#00b5e8]" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">Discord (Fastest)</h3>
              <p className="text-sm text-[#8892a4]">Join our server for real-time support from our team.</p>
              <span className="text-xs text-[#00b5e8] font-semibold mt-2 block">Join Server →</span>
            </div>
          </a>

          <div className="card-glass p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[rgba(0,181,232,0.1)] border border-[rgba(0,181,232,0.2)] flex items-center justify-center flex-shrink-0">
              <Mail size={20} className="text-[#00b5e8]" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">Contact Form</h3>
              <p className="text-sm text-[#8892a4]">Fill out the form and we'll reply to your email within 24 hours.</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[rgba(0,181,232,0.1)] bg-[rgba(0,181,232,0.02)]">
            <p className="text-xs text-[#4a5568] font-semibold uppercase tracking-wide mb-2">Response Times</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#8892a4]">Discord</span>
                <span className="text-emerald-400 font-semibold">~1 hour</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8892a4]">Email/Form</span>
                <span className="text-amber-400 font-semibold">~24 hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right – Form */}
        <div className="lg:col-span-3">
          {submitted ? (
            <div className="card-glass p-10 text-center h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                <CheckCircle2 size={28} className="text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
              <p className="text-[#8892a4] mb-6">We'll get back to you within 24 hours. For faster support, join our Discord.</p>
              <a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2">
                <MessageCircle size={16} /> Join Discord
              </a>
            </div>
          ) : (
            <div className="card-glass p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wide">
                      Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="input-dark"
                      placeholder="Your name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wide">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      className="input-dark"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wide">Subject</label>
                  <input
                    type="text"
                    className="input-dark"
                    placeholder="What's this about?"
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wide">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    className="input-dark resize-none"
                    placeholder="Tell us how we can help..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
                  {loading ? (
                    <><Loader2 size={16} className="animate-spin" /> Sending...</>
                  ) : (
                    <><Send size={16} /> Send Message</>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
