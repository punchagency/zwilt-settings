import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { notifyErrorFxn, notifySuccessFxn } from '../../../utils/toast-fxn';
import { ClipLoader } from 'react-spinners';
import { motion } from 'framer-motion';

// ─── Icons (inline SVGs to avoid adding a new icon lib dep) ───────────────────

const IconChat = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const IconDoc = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);
const IconMail = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const IconChevron = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ─── FAQ Data ─────────────────────────────────────────────────────────────────

const faqs = [
  {
    question: 'How do I reset my password?',
    answer:
      'Go to Settings → Password & Security → Change Password. You will need your current password. If you have forgotten it, use the "Forgot Password" link on the sign-in page.',
  },
  {
    question: 'How do I enable Two-Factor Authentication?',
    answer:
      'Go to Settings → Password & Security → Two Factor Authentication. You can set up an authenticator app (e.g. Google Authenticator) or use SMS verification via your registered phone number.',
  },
  {
    question: 'How do I add or remove team members?',
    answer:
      'Team owners and admins can manage team members from Settings → Manage Team. Use the "Invite" button to add new members. Existing members can be suspended or removed from the same page.',
  },
  {
    question: 'How do I update my billing information?',
    answer:
      'Go to Settings → Payment & Billing. Click "Manage Billing" to open the billing portal where you can update your payment method, view invoices, and manage your subscription.',
  },
  {
    question: 'How do I connect my Google Calendar?',
    answer:
      'Go to Settings → Integrations and click "Connect" next to Google Calendar. You will be redirected to Google to authorise the connection. Once authorised, calendar events will sync automatically.',
  },
  {
    question: 'Why am I seeing a "No access" error?',
    answer:
      'Your seat may have been suspended or your app access may have been updated by your organisation admin. Contact your admin, or reach out to Zwilt support if the problem persists.',
  },
];

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border border-[#E0E0E9] rounded-[0.78vw] overflow-hidden transition-all duration-200 ${open ? 'bg-[#F9F9FF]' : 'bg-white'}`}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-[1.25vw] py-[1.1vw] text-left group"
      >
        <span className={`text-[0.875vw] font-[600] transition-colors ${open ? 'text-[#50589F]' : 'text-[#282833] group-hover:text-[#50589F]'}`}>
          {question}
        </span>
        <span className={`transition-transform duration-200 text-[#50589F] ${open ? 'rotate-90' : ''}`}>
          <IconChevron />
        </span>
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="px-[1.25vw] pb-[1.1vw] text-[0.833vw] text-[#6F6F76] leading-[1.4]"
        >
          {answer}
        </motion.div>
      )}
    </div>
  );
};

// ─── Contact Card ─────────────────────────────────────────────────────────────

const ContactCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  href?: string;
  onClick?: () => void;
}> = ({ icon, title, description, action, href, onClick }) => (
  <div className="flex flex-col gap-[0.83vw] border border-[#E0E0E9] rounded-[0.78vw] p-[1.25vw] bg-white hover:border-[#B4B4C8] hover:shadow-sm transition-all duration-200">
    <div className="w-[2.5vw] h-[2.5vw] rounded-[0.52vw] bg-[#F4F4FA] flex items-center justify-center text-[#50589F]">
      {icon}
    </div>
    <div>
      <p className="font-[600] text-[0.93vw] text-[#282833]">{title}</p>
      <p className="text-[0.78vw] text-[#6F6F76] mt-[0.2vw] leading-[1.3]">{description}</p>
    </div>
    {href ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[0.78vw] font-[600] text-[#50589F] hover:text-[#3C448B] flex items-center gap-[0.3vw] mt-auto"
      >
        {action} <IconChevron />
      </a>
    ) : (
      <button
        onClick={onClick}
        className="text-[0.78vw] font-[600] text-[#50589F] hover:text-[#3C448B] flex items-center gap-[0.3vw] mt-auto text-left"
      >
        {action} <IconChevron />
      </button>
    )}
  </div>
);

// ─── Contact Form ─────────────────────────────────────────────────────────────

const CATEGORIES = [
  'Account & Billing',
  'Access & Permissions',
  'Integrations',
  'Bug Report',
  'Feature Request',
  'Other',
];

const SupportTicketForm: React.FC = () => {
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !subject.trim() || !message.trim()) {
      notifyErrorFxn('Please fill in all fields before submitting.');
      return;
    }
    setLoading(true);
    // Placeholder: wire up to a real support ticket API when available.
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    notifySuccessFxn('Support ticket submitted! We\'ll get back to you within 24 hours.');
    setCategory('');
    setSubject('');
    setMessage('');
  };

  const inputClass =
    'w-full border border-[#E0E0E9] rounded-[0.52vw] px-[0.83vw] py-[0.67vw] text-[0.833vw] text-[#282833] outline-none focus:border-[#50589F] transition-colors placeholder:text-[#B0B0BA]';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[1vw]">
      <div>
        <label className="block text-[0.833vw] font-[600] text-[#282833] mb-[0.4vw]">Category</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className={`${inputClass} bg-white cursor-pointer`}
        >
          <option value="" disabled>Select a category…</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-[0.833vw] font-[600] text-[#282833] mb-[0.4vw]">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder="Brief summary of your issue"
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-[0.833vw] font-[600] text-[#282833] mb-[0.4vw]">Message</label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={5}
          placeholder="Describe your issue in as much detail as possible…"
          className={`${inputClass} resize-none`}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-[#50589F] hover:bg-[#3C448B] text-white text-[0.833vw] font-[600] px-[1.67vw] py-[0.67vw] rounded-[0.52vw] transition-colors flex items-center gap-[0.4vw]"
        >
          {loading ? <ClipLoader size={14} color="#fff" /> : 'Submit Ticket'}
        </button>
      </div>
    </form>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const Page: React.FC = () => {
  const [faqSearch, setFaqSearch] = useState('');

  const filteredFaqs = faqs.filter(
    f =>
      f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-[1.25vw] h-[100%] overflow-hidden border-box">
      <ToastContainer />

      {/* Header */}
      <div className="px-[1.25vw] flex flex-col gap-[0.52vw]">
        <p className="font-[600] text-[1.25vw] text-[#282833] leading-[1.64vw] -mb-[0.15vw]">
          Help & Support
        </p>
        <p className="font-normal text-[0.833vw] text-[#6F6F76] leading-[1.1vw] -mb-[0.28vw]">
          Find answers, browse docs, or get in touch with the Zwilt support team.
        </p>
      </div>

      <div className="px-[1.25vw] h-[calc(100%-4vw)] overflow-y-auto scrollbar-thin pb-[2vw]">

        {/* Contact cards row */}
        <div className="grid grid-cols-3 gap-[1.04vw] mb-[1.67vw]">
          <ContactCard
            icon={<IconDoc />}
            title="Documentation"
            description="Browse guides, tutorials, and release notes for all Zwilt products."
            action="Open Docs"
            href="https://docs.zwilt.com"
          />
          <ContactCard
            icon={<IconChat />}
            title="Live Chat"
            description="Chat with a support agent in real time. Available Mon–Fri, 9am–6pm GMT."
            action="Start Chat"
            onClick={() => notifySuccessFxn('Live chat coming soon!')}
          />
          <ContactCard
            icon={<IconMail />}
            title="Email Support"
            description="Send us an email and expect a response within one business day."
            action="Email us"
            href="mailto:support@zwilt.com"
          />
        </div>

        <div className="grid grid-cols-[1.2fr_1fr] gap-[1.67vw]">

          {/* FAQ Section */}
          <div>
            <div className="flex items-center justify-between mb-[0.83vw]">
              <p className="font-[600] text-[1vw] text-[#282833]">Frequently Asked Questions</p>
            </div>
            <div className="mb-[0.83vw]">
              <input
                type="text"
                value={faqSearch}
                onChange={e => setFaqSearch(e.target.value)}
                placeholder="Search FAQs…"
                className="w-full border border-[#E0E0E9] rounded-[0.52vw] px-[0.83vw] py-[0.6vw] text-[0.833vw] text-[#282833] outline-none focus:border-[#50589F] transition-colors placeholder:text-[#B0B0BA]"
              />
            </div>
            <div className="flex flex-col gap-[0.52vw]">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map(faq => (
                  <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
                ))
              ) : (
                <p className="text-[0.833vw] text-[#6F6F76] py-[1vw] text-center">
                  No FAQs match your search.
                </p>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <p className="font-[600] text-[1vw] text-[#282833] mb-[0.83vw]">Submit a Support Ticket</p>
            <div className="border border-[#E0E0E9] rounded-[0.78vw] p-[1.25vw] bg-white">
              <SupportTicketForm />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Page;