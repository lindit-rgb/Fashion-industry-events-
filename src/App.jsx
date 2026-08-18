import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Calendar, Plus, Mail, X, ChevronDown, ExternalLink, Check } from 'lucide-react';
import { supabase } from './supabaseClient';

const REGIONS = ['All Regions', 'North America', 'Europe', 'Middle East', 'Asia', 'Global'];
const MONTHS = ['All Months', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function FashionTechCalendar() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All Regions');
  const [month, setMonth] = useState('All Months');
  const [showSubmit, setShowSubmit] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('tier', { ascending: false })
        .order('name');
      if (!error && data) setEvents(data);
      setLoading(false);
    })();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const filtered = useMemo(() => {
    return events
      .filter((e) => {
        const matchesSearch =
          search.trim() === '' ||
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.city.toLowerCase().includes(search.toLowerCase()) ||
          (e.focus || '').toLowerCase().includes(search.toLowerCase());
        const matchesRegion = region === 'All Regions' || e.region === region;
        const matchesMonth = month === 'All Months' || e.month === month;
        return matchesSearch && matchesRegion && matchesMonth;
      })
      .sort((a, b) => (a.tier === 'featured' ? -1 : 0) - (b.tier === 'featured' ? -1 : 0));
  }, [events, search, region, month]);

  return (
    <div style={{ minHeight: '100vh', background: '#FBF9F5', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,500;0,600;0,700;0,900;1,600&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .ft-serif { font-family: 'Bodoni Moda', serif; }
      `}</style>

      <header style={{ background: 'linear-gradient(135deg, #E8B354 0%, #D89B3C 55%, #C88A2E 100%)', padding: '56px 24px 64px', textAlign: 'center', position: 'relative' }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', color: '#fff', opacity: 0.85, marginBottom: 16 }}>
          Where Fashion (Tech) Is Meeting
        </div>
        <h1 className="ft-serif" style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, color: '#fff', margin: '0 0 16px', letterSpacing: -1 }}>
          The Calendar
        </h1>
        <p className="ft-serif" style={{ fontStyle: 'italic', fontSize: 18, color: 'rgba(255,255,255,0.95)', maxWidth: 480, margin: '0 auto' }}>
          Every fashion-tech conference and major fashion week worth your time — searchable by month and geography.
        </p>
        <button
          onClick={() => setShowEmailCapture(true)}
          style={{ marginTop: 28, background: '#fff', color: '#C88A2E', border: 'none', borderRadius: 4, padding: '12px 28px', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <Mail size={16} /> Get the calendar in your inbox
        </button>
      </header>

      <div style={{ maxWidth: 1000, margin: '-32px auto 0', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 8px 30px rgba(0,0,0,0.08)', padding: 20, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <div style={{ flex: '1 1 220px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events, cities, focus areas..."
              style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #eee', borderRadius: 6, fontSize: 14, fontFamily: 'Inter, sans-serif' }}
            />
          </div>
          <FilterSelect icon={<MapPin size={14} />} value={region} onChange={setRegion} options={REGIONS} />
          <FilterSelect icon={<Calendar size={14} />} value={month} onChange={setMonth} options={MONTHS} />
          <button
            onClick={() => setShowSubmit(true)}
            style={{ background: '#2A2012', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
          >
            <Plus size={16} /> Submit an event
          </button>
        </div>
      </div>

      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 20, fontWeight: 500 }}>
          {loading ? 'Loading…' : `${filtered.length} event${filtered.length !== 1 ? 's' : ''} found`}
        </div>

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
            <p className="ft-serif" style={{ fontSize: 20, fontStyle: 'italic', marginBottom: 8 }}>Nothing matches yet.</p>
            <p style={{ fontSize: 14 }}>Know of an event we're missing? <button onClick={() => setShowSubmit(true)} style={{ background: 'none', border: 'none', color: '#C88A2E', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: 14 }}>Submit it for review.</button></p>
          </div>
        )}

        <div style={{ display: 'grid', gap: 14 }}>
          {filtered.map((e) => {
            const isFeatured = e.tier === 'featured';
            return (
              <div
                key={e.id}
                style={{
                  background: isFeatured ? '#FFFBF2' : '#fff',
                  border: isFeatured ? '1.5px solid #E8B354' : '1px solid #f0ece2',
                  borderRadius: 8,
                  padding: 22,
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 20,
                  flexWrap: 'wrap',
                  boxShadow: isFeatured ? '0 4px 20px rgba(200,138,46,0.12)' : 'none',
                  position: 'relative',
                }}
              >
                <div style={{ flex: '1 1 300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span className="ft-serif" style={{ fontSize: 20, fontWeight: 700, color: '#2A2012' }}>{e.name}</span>
                    {isFeatured && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, #E8B354, #C88A2E)', padding: '3px 9px', borderRadius: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Featured
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: '#888', marginBottom: 10, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={13} /> {e.event_date}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} /> {e.city}</span>
                  </div>
                  <p style={{ fontSize: 14, color: '#4a4030', lineHeight: 1.6, margin: '0 0 8px' }}>{e.why}</p>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#C88A2E', textTransform: 'uppercase', letterSpacing: 0.5 }}>{e.focus}</span>
                </div>
                {e.link && (
                  <a href={e.link} target="_blank" rel="noopener noreferrer" style={{ alignSelf: 'flex-start', fontSize: 13, fontWeight: 600, color: '#2A2012', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                    Visit site <ExternalLink size={13} />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {showSubmit && <SubmitModal onClose={() => setShowSubmit(false)} onSubmit={async (newEvent) => {
        const { error } = await supabase.from('pending_events').insert([{
          name: newEvent.name,
          event_date: newEvent.date,
          month: newEvent.month,
          city: newEvent.city,
          region: newEvent.region,
          focus: newEvent.focus,
          why: newEvent.why,
          link: newEvent.link,
          contact_email: newEvent.contact,
        }]);
        setShowSubmit(false);
        if (error) {
          showToast('Something went wrong — please try again.');
        } else {
          showToast("Thanks — we'll review it and add it to the calendar.");
        }
      }} />}

      {showEmailCapture && <EmailModal onClose={() => setShowEmailCapture(false)} onSubmit={async (email) => {
        const { error } = await supabase.from('subscribers').insert([{ email }]);
        setShowEmailCapture(false);
        if (error) {
          showToast(error.code === '23505' ? "You're already on the list." : 'Something went wrong — please try again.');
        } else {
          showToast("You're on the list.");
        }
      }} />}

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#2A2012', color: '#fff', padding: '12px 24px', borderRadius: 6, fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          <Check size={16} color="#E8B354" /> {toast}
        </div>
      )}
    </div>
  );
}

function FilterSelect({ icon, value, onChange, options }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#999', pointerEvents: 'none' }}>{icon}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ appearance: 'none', padding: '10px 32px 10px 32px', border: '1px solid #eee', borderRadius: 6, fontSize: 14, fontFamily: 'Inter, sans-serif', background: '#fff', cursor: 'pointer' }}
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#999', pointerEvents: 'none' }} />
    </div>
  );
}

function SubmitModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ name: '', date: '', month: 'January', city: '', region: 'North America', focus: '', why: '', link: '', contact: '' });
  const [submitting, setSubmitting] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.city || !form.date) return;
    setSubmitting(true);
    await onSubmit(form);
    setSubmitting(false);
  };

  return (
    <Modal onClose={onClose} title="Submit an event for review">
      <p style={{ fontSize: 13, color: '#888', margin: '0 0 20px' }}>
        Hosting a fashion-tech event, or know of one we're missing? Send the details below. We review every submission before it goes live, so it won't appear on the calendar immediately.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <Field label="Event name" value={form.name} onChange={set('name')} required />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Date" value={form.date} onChange={set('date')} placeholder="e.g. March 14, 2026" required />
          <SelectField label="Month" value={form.month} onChange={set('month')} options={MONTHS.slice(1)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="City" value={form.city} onChange={set('city')} required />
          <SelectField label="Region" value={form.region} onChange={set('region')} options={REGIONS.slice(1)} />
        </div>
        <Field label="Focus area" value={form.focus} onChange={set('focus')} placeholder="e.g. AI, virtual try-on, retail tech" />
        <Field label="Why it matters" value={form.why} onChange={set('why')} multiline />
        <Field label="Event link" value={form.link} onChange={set('link')} placeholder="https://" />
        <Field label="Your email (not published)" value={form.contact} onChange={set('contact')} type="email" />
        <button type="submit" disabled={submitting} style={{ marginTop: 8, background: '#C88A2E', color: '#fff', border: 'none', borderRadius: 6, padding: '12px', fontWeight: 700, fontSize: 14, cursor: submitting ? 'default' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
          {submitting ? 'Sending…' : 'Submit for review'}
        </button>
      </form>
    </Modal>
  );
}

function EmailModal({ onClose, onSubmit }) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setSubmitting(true);
    await onSubmit(email);
    setSubmitting(false);
  };

  return (
    <Modal onClose={onClose} title="Get the calendar in your inbox">
      <p style={{ fontSize: 13, color: '#888', margin: '0 0 20px' }}>
        Subscribe below.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10 }}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          style={{ flex: 1, padding: '12px 14px', border: '1px solid #eee', borderRadius: 6, fontSize: 14, fontFamily: 'Inter, sans-serif' }}
        />
        <button type="submit" disabled={submitting} style={{ background: '#C88A2E', color: '#fff', border: 'none', borderRadius: 6, padding: '0 20px', fontWeight: 700, fontSize: 14, cursor: submitting ? 'default' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
          {submitting ? '...' : 'Subscribe'}
        </button>
      </form>
    </Modal>
  );
}

function Modal({ onClose, title, children }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(20,15,5,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 100 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 10, padding: 28, maxWidth: 440, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <h2 style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 22, fontWeight: 700, color: '#2A2012', margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: 4 }}><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, required, type = 'text', placeholder, multiline }) {
  return (
    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4a4030' }}>
      {label}
      {multiline ? (
        <textarea value={value} onChange={onChange} rows={2} placeholder={placeholder} style={{ width: '100%', marginTop: 4, padding: '9px 10px', border: '1px solid #eee', borderRadius: 6, fontSize: 14, fontFamily: 'Inter, sans-serif', resize: 'vertical' }} />
      ) : (
        <input type={type} required={required} value={value} onChange={onChange} placeholder={placeholder} style={{ width: '100%', marginTop: 4, padding: '9px 10px', border: '1px solid #eee', borderRadius: 6, fontSize: 14, fontFamily: 'Inter, sans-serif' }} />
      )}
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4a4030' }}>
      {label}
      <select value={value} onChange={onChange} style={{ width: '100%', marginTop: 4, padding: '9px 10px', border: '1px solid #eee', borderRadius: 6, fontSize: 14, fontFamily: 'Inter, sans-serif', background: '#fff' }}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
