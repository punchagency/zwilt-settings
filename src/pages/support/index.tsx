import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { notifyErrorFxn, notifySuccessFxn } from '../../../utils/toast-fxn';
import { ClipLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import { socket } from '@/lib/external-socket';

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

import axiosInstance from '../../config/axiosConfig';
import useUser from 'utils/recoil_store/hooks/use-user-state';

const CATEGORIES = [
  'Account & Billing',
  'Access & Permissions',
  'Integrations',
  'Bug Report',
  'Feature Request',
  'Other',
];

const SupportTicketForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
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
    try {
      const res = await axiosInstance.post('/api/admin/support/tickets', {
        category,
        subject,
        message,
      });
      if (res.data.success) {
        notifySuccessFxn('Support ticket submitted! We\'ll get back to you within 24 hours.');
        setCategory('');
        setSubject('');
        setMessage('');
        if (onSuccess) onSuccess();
      } else {
        notifyErrorFxn(res.data.message || 'Error submitting ticket');
      }
    } catch (err: any) {
      notifyErrorFxn(err.response?.data?.message || err.message || 'Failed to submit ticket');
    } finally {
      setLoading(false);
    }
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

const MyTicketsList: React.FC<{
  tickets: any[];
  loading: boolean;
  onSelectTicket: (ticket: any) => void;
  onRefresh: () => void;
}> = ({ tickets, loading, onSelectTicket, onRefresh }) => {
  if (loading) {
    return (
      <div className="flex flex-col gap-[0.52vw] py-[2vw] items-center justify-center text-[#6F6F76]">
        <ClipLoader size={20} color="#50589F" />
        <span className="text-[0.78vw] mt-[0.5vw]">Loading your tickets...</span>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-[3vw] flex flex-col items-center justify-center gap-[0.8vw]">
        <p className="text-[0.833vw] text-[#6F6F76]">You haven&apos;t submitted any support tickets yet.</p>
        <button
          onClick={onRefresh}
          className="text-[#50589F] hover:text-[#3C448B] text-[0.78vw] font-[600] underline"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[0.83vw] max-h-[30vw] overflow-y-auto no-scrollbar">
      {tickets.map((t: any) => {
        const statusColors = {
          OPEN: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
          RESOLVED: 'bg-gray-100 text-gray-600 border-gray-200',
          CLOSED: 'bg-gray-100 text-gray-600 border-gray-200',
        }[t.status as 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'] || 'bg-gray-50 text-gray-600 border-gray-200';

        return (
          <div
            key={t._id}
            onClick={() => onSelectTicket(t)}
            className="border border-[#E0E0E9] rounded-[0.52vw] p-[0.83vw] bg-white hover:border-[#50589F] hover:shadow-sm cursor-pointer transition-all duration-200 text-left"
          >
            <div className="flex items-center justify-between gap-[0.5vw] mb-[0.4vw]">
              <span className="text-[0.78vw] font-[600] text-[#6F6F76] uppercase tracking-wider">
                {t.category}
              </span>
              <span className={`text-[0.67vw] px-[0.5vw] py-[0.1vw] rounded-full border ${statusColors} font-[600]`}>
                {t.status}
              </span>
            </div>
            <p className="text-[0.875vw] font-[600] text-[#282833] truncate">
              {t.subject}
            </p>
            <div className="flex items-center justify-between text-[0.67vw] text-[#8C8C9A] mt-[0.6vw]">
              <span>
                Updated {new Date(t.updatedAt).toLocaleDateString()}
              </span>
              <span>
                {t.messages?.length || 0} messages
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const TicketDetailModal: React.FC<{
  ticket: any;
  onClose: () => void;
  onReplySuccess: () => void;
}> = ({ ticket, onClose, onReplySuccess }) => {
  const [replyMessage, setReplyMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(ticket);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchLatestDetails = async () => {
    setLoadingDetails(true);
    try {
      const res = await axiosInstance.get('/api/admin/support/tickets');
      if (res.data.success) {
        const found = res.data.data.find((t: any) => t._id === ticket._id);
        if (found) {
          setTicketDetails(found);
        }
      }
    } catch (err) {
      console.error('Error refreshing ticket details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    setTicketDetails(ticket);
  }, [ticket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticketDetails.messages]);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setSubmitting(true);
    try {
      const res = await axiosInstance.post(`/api/admin/support/tickets/${ticketDetails._id}/reply`, {
        message: replyMessage.trim()
      });

      if (res.data.success) {
        notifySuccessFxn('Reply sent!');
        setReplyMessage('');
        setTicketDetails(res.data.data);
        onReplySuccess();
      } else {
        notifyErrorFxn(res.data.message || 'Failed to send reply');
      }
    } catch (err: any) {
      notifyErrorFxn(err.response?.data?.message || err.message || 'Failed to send reply');
    } finally {
      setSubmitting(false);
    }
  };

  const isClosed = ticketDetails.status === 'CLOSED' || ticketDetails.status === 'RESOLVED';

  return (
    <div className="fixed inset-0 bg-[#00000040] flex items-center justify-end z-[10000] backdrop-blur-[2px]">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-[30vw] h-full bg-white shadow-2xl border-l border-[#E0E0E9] flex flex-col text-left"
      >
        {/* Modal Header */}
        <div className="px-[1.5vw] py-[1.2vw] border-b border-[#E0E0E9] flex items-center justify-between bg-[#F9F9FF]">
          <div>
            <div className="flex items-center gap-[0.5vw] mb-[0.2vw]">
              <span className="text-[0.67vw] px-[0.5vw] py-[0.1vw] rounded-full bg-slate-100 text-slate-700 font-[600] border border-slate-200 uppercase">
                {ticketDetails.category}
              </span>
              <span className={`text-[0.67vw] px-[0.5vw] py-[0.1vw] rounded-full border font-[600] ${
                {
                  OPEN: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
                  RESOLVED: 'bg-gray-100 text-gray-600 border-gray-200',
                  CLOSED: 'bg-gray-100 text-gray-600 border-gray-200',
                }[ticketDetails.status as 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'] || 'bg-gray-50 text-gray-600 border-gray-200'
              }`}>
                {ticketDetails.status}
              </span>
            </div>
            <h3 className="text-[1.1vw] font-[600] text-[#282833] line-clamp-2">
              {ticketDetails.subject}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#6F6F76] hover:text-[#282833] transition-colors p-[0.4vw] rounded-full hover:bg-gray-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Conversation Timeline */}
        <div className="flex-1 overflow-y-auto p-[1.5vw] flex flex-col gap-[1.2vw] bg-[#F9F9FF] no-scrollbar">
          {ticketDetails.messages?.map((m: any, idx: number) => {
            const isAdmin = m.senderType === 'ADMIN';
            return (
              <div
                key={idx}
                className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}
              >
                <div className="flex items-center gap-[0.4vw] mb-[0.2vw] text-[0.67vw] text-[#8C8C9A]">
                  <span className="font-[600]">
                    {isAdmin ? (m.sender?.name || 'Support Team') : 'You'}
                  </span>
                  <span>•</span>
                  <span>
                    {new Date(m.timestamp || m.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div
                  className={`max-w-[85%] rounded-[0.78vw] p-[0.83vw] text-[0.78vw] leading-[1.4] whitespace-pre-wrap border ${
                    isAdmin
                      ? 'bg-white text-[#282833] border-[#E0E0E9] rounded-tl-none'
                      : 'bg-[#50589F] text-white border-transparent rounded-tr-none'
                  }`}
                >
                  {m.message}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Input */}
        <div className="p-[1vw] border-t border-[#E0E0E9] bg-white">
          {isClosed ? (
            <p className="text-[0.78vw] text-[#8C8C9A] text-center py-[0.5vw]">
              This ticket is resolved or closed. If you need further help, please submit a new ticket.
            </p>
          ) : (
            <form onSubmit={handleReplySubmit} className="flex flex-col gap-[0.6vw]">
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your message to support..."
                rows={3}
                className="w-full border border-[#E0E0E9] rounded-[0.52vw] px-[0.83vw] py-[0.6vw] text-[0.78vw] text-[#282833] outline-none focus:border-[#50589F] transition-colors resize-none placeholder:text-[#B0B0BA]"
              />
              <div className="flex justify-end gap-[0.5vw]">
                <button
                  type="button"
                  onClick={fetchLatestDetails}
                  disabled={loadingDetails}
                  className="border border-[#E0E0E9] hover:bg-gray-50 text-[#6F6F76] text-[0.73vw] font-[600] px-[1vw] py-[0.5vw] rounded-[0.4vw] transition-colors"
                >
                  {loadingDetails ? 'Refreshing...' : 'Refresh'}
                </button>
                <button
                  type="submit"
                  disabled={submitting || !replyMessage.trim()}
                  className="bg-[#50589F] hover:bg-[#3C448B] text-white text-[0.73vw] font-[600] px-[1.2vw] py-[0.5vw] rounded-[0.4vw] transition-colors flex items-center gap-[0.4vw] disabled:opacity-50"
                >
                  {submitting ? <ClipLoader size={12} color="#fff" /> : 'Send Reply'}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

interface Message {
  senderId: string;
  senderType: 'USER' | 'ADMIN';
  message: string;
  timestamp: string;
  sender?: {
    name: string;
    email: string;
    profileImg?: string;
    profile_img?: string;
  };
}

const LiveChatWidget: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [session, setSession] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [connecting, setConnecting] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { userState } = useUser();
  const currentUser = userState.currentUser?.user;

  useEffect(() => {
    if (!isOpen) return;

    const initChat = async () => {
      setConnecting(true);
      try {
        const res = await axiosInstance.post('/api/admin/support/chats/initiate');
        if (res.data.success) {
          const sess = res.data.data;
          setSession(sess);
          setMessages(sess.messages || []);
        }
      } catch (err: any) {
        notifyErrorFxn('Failed to initiate live chat. Please try again.');
        onClose();
      } finally {
        setConnecting(false);
      }
    };

    initChat();
  }, [isOpen]);

  useEffect(() => {
    if (!session?._id) return;

    const joinRoom = () => {
      socket.emit('joinSupportChat', { sessionId: session._id });
    };

    if (socket.connected) {
      joinRoom();
    }

    socket.on('connect', joinRoom);

    const handleNewMessage = (msg: Message) => {
      setMessages(prev => {
        if (prev.some(m => m.timestamp === msg.timestamp && m.message === msg.message)) return prev;
        return [...prev, msg];
      });
    };

    socket.on('supportMessageReceived', handleNewMessage);

    return () => {
      socket.off('connect', joinRoom);
      socket.off('supportMessageReceived', handleNewMessage);
    };
  }, [session?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim() || !session?._id || !currentUser?._id) return;

    socket.emit('sendSupportMessage', {
      sessionId: session._id,
      message: text.trim(),
      senderId: currentUser._id,
      senderType: 'USER',
    });

    setText('');
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="fixed bottom-[1.5vw] right-[1.5vw] w-[24vw] h-[32vw] bg-white rounded-[1vw] shadow-2xl border border-[#E0E0E9] flex flex-col overflow-hidden z-[9999]"
    >
      <div className="bg-[#50589F] text-white px-[1.25vw] py-[0.83vw] flex items-center justify-between">
        <div className="flex items-center gap-[0.5vw]">
          <div className="w-[0.52vw] h-[0.52vw] rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[0.93vw] font-[600]">Zwilt Support Chat</span>
        </div>
        <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-[1.25vw] flex flex-col gap-[0.83vw] bg-[#F9F9FF]">
        {connecting ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-2">
            <ClipLoader size={24} color="#50589F" />
            <span className="text-[0.78vw]">Connecting to support...</span>
          </div>
        ) : (
          <>
            {messages.length === 0 && (
              <div className="text-center text-[#6F6F76] text-[0.78vw] my-auto px-[1.5vw] leading-[1.4]">
                👋 Welcome! Type your question below to start chatting with a support representative in real time.
              </div>
            )}
            {messages.map((m, idx) => {
              const isMe = m.senderType === 'USER';
              return (
                <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <span className="text-[0.62vw] text-[#8C8C9A] mb-[0.2vw]">
                    {isMe ? 'You' : (m.sender?.name || 'Support Agent')}
                  </span>
                  <div
                    className={`max-w-[80%] rounded-[0.7vw] px-[0.9vw] py-[0.6vw] text-[0.78vw] leading-[1.3] ${
                      isMe ? 'bg-[#50589F] text-white rounded-tr-none' : 'bg-white text-[#282833] border border-[#E0E0E9] rounded-tl-none'
                    }`}
                  >
                    {m.message}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="p-[0.83vw] bg-white border-t border-[#E0E0E9] flex items-center gap-[0.5vw]">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          disabled={connecting}
          placeholder="Type your message..."
          className="flex-1 border border-[#E0E0E9] rounded-[0.52vw] px-[0.83vw] py-[0.5vw] text-[0.78vw] outline-none focus:border-[#50589F] disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={connecting || !text.trim()}
          className="bg-[#50589F] hover:bg-[#3C448B] text-white p-[0.5vw] rounded-[0.52vw] transition-colors disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const Page: React.FC = () => {
  const [faqSearch, setFaqSearch] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'submit' | 'tickets'>('submit');
  const [tickets, setTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  const fetchTickets = async () => {
    setLoadingTickets(true);
    try {
      const res = await axiosInstance.get('/api/admin/support/tickets');
      if (res.data.success) {
        setTickets(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

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
            onClick={() => setIsChatOpen(true)}
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

          {/* Contact Form & My Tickets Tabs */}
          <div>
            <div className="flex border-b border-[#E0E0E9] mb-[0.83vw] gap-[1.5vw] text-left">
              <button
                onClick={() => setActiveTab('submit')}
                className={`pb-[0.6vw] text-[1vw] font-[600] transition-colors relative ${activeTab === 'submit' ? 'text-[#50589F]' : 'text-[#8C8C9A] hover:text-[#50589F]'}`}
              >
                Submit a Ticket
                {activeTab === 'submit' && (
                  <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#50589F]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('tickets')}
                className={`pb-[0.6vw] text-[1vw] font-[600] transition-colors relative flex items-center gap-[0.4vw] ${activeTab === 'tickets' ? 'text-[#50589F]' : 'text-[#8C8C9A] hover:text-[#50589F]'}`}
              >
                My Tickets
                {tickets.length > 0 && (
                  <span className="bg-[#50589F] text-white text-[0.65vw] px-[0.4vw] py-[0.1vw] rounded-full">
                    {tickets.length}
                  </span>
                )}
                {activeTab === 'tickets' && (
                  <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#50589F]" />
                )}
              </button>
            </div>

            <div className="border border-[#E0E0E9] rounded-[0.78vw] p-[1.25vw] bg-white">
              {activeTab === 'submit' ? (
                <SupportTicketForm onSuccess={() => {
                  fetchTickets();
                  setActiveTab('tickets');
                }} />
              ) : (
                <MyTicketsList
                  tickets={tickets}
                  loading={loadingTickets}
                  onSelectTicket={setSelectedTicket}
                  onRefresh={fetchTickets}
                />
              )}
            </div>
          </div>

        </div>
      </div>

      <LiveChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onReplySuccess={fetchTickets}
        />
      )}
    </div>
  );
};

export default Page;