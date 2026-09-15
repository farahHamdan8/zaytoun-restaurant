import React, { useState } from 'react';
import { Calendar, Clock, Users, Phone, User, MessageSquare, X, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ReservationModal = ({ isOpen, onClose }) => {
  const { language, isRtl } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    notes: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleWhatsAppSend = () => {
    const restaurantPhone = "1234567890"; // استبدلي برقم الواتساب الخاص بالمطعم
    const message = language === 'ar'
      ? `طلب حجز طاولة جديد:\n- الاسم: ${formData.name}\n- الهاتف: ${formData.phone}\n- التاريخ: ${formData.date}\n- الوقت: ${formData.time}\n- عدد الأفراد: ${formData.guests}\n- ملاحظات: ${formData.notes || 'لا يوجد'}`
      : `New Table Reservation:\n- Name: ${formData.name}\n- Phone: ${formData.phone}\n- Date: ${formData.date}\n- Time: ${formData.time}\n- Guests: ${formData.guests}\n- Notes: ${formData.notes || 'None'}`;

    window.open(`https://wa.me/${restaurantPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl text-slate-100">
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {!submitted ? (
          <>
            <h2 className="text-2xl font-bold text-amber-400 mb-2">
              {language === 'ar' ? 'حجز طاولة' : 'Book a Table'}
            </h2>
            <p className="text-sm text-zinc-400 mb-6">
              {language === 'ar' ? 'قم بتعبئة التفاصيل لتأكيد حجزك معنا' : 'Fill in the details to confirm your reservation'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-zinc-300">
                  {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="absolute top-3 right-3 text-zinc-500" size={18} />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2.5 px-10 text-sm focus:outline-none focus:border-amber-400 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-zinc-300">
                    {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                  </label>
                  <div className="relative">
                    <Phone className="absolute top-3 right-3 text-zinc-500" size={18} />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2.5 px-10 text-sm focus:outline-none focus:border-amber-400 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-zinc-300">
                    {language === 'ar' ? 'عدد الأشخاص' : 'Guests'}
                  </label>
                  <div className="relative">
                    <Users className="absolute top-3 right-3 text-zinc-500" size={18} />
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2.5 px-10 text-sm focus:outline-none focus:border-amber-400 text-white"
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10].map(num => (
                        <option key={num} value={num}>{num} {language === 'ar' ? 'أفراد' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-zinc-300">
                    {language === 'ar' ? 'التاريخ' : 'Date'}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute top-3 right-3 text-zinc-500" size={18} />
                    <input
                      type="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2.5 px-10 text-sm focus:outline-none focus:border-amber-400 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-zinc-300">
                    {language === 'ar' ? 'الوقت' : 'Time'}
                  </label>
                  <div className="relative">
                    <Clock className="absolute top-3 right-3 text-zinc-500" size={18} />
                    <input
                      type="time"
                      name="time"
                      required
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2.5 px-10 text-sm focus:outline-none focus:border-amber-400 text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20"
              >
                {language === 'ar' ? 'تأكيد الحجز' : 'Confirm Booking'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-amber-400 mx-auto mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-white mb-2">
              {language === 'ar' ? 'تم استلام طلب الحجز!' : 'Reservation Received!'}
            </h3>
            <p className="text-sm text-zinc-400 mb-6">
              {language === 'ar' ? 'شكراً لك، يسعدنا استقبالك قريباً.' : 'Thank you, we look forward to hosting you.'}
            </p>
            
            <button
              onClick={handleWhatsAppSend}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl mb-3 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare size={18} />
              {language === 'ar' ? 'إرسال التأكيد عبر WhatsApp' : 'Send via WhatsApp'}
            </button>

            <button
              onClick={() => { setSubmitted(false); onClose(); }}
              className="text-xs text-zinc-500 hover:text-white underline"
            >
              {language === 'ar' ? 'إغلاق النافذة' : 'Close Window'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationModal;