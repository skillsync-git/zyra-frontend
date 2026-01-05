

'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('https://api-xmg2fjjbya-uc.a.run.app/api/contact-messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (response.ok) {
      alert('Thank you for contacting us! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } else {
      alert(data.error || 'Failed to send message. Please try again.');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Failed to send message. Please check your connection and try again.');
  }
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      details: ["Keralapuram Thuckalay kanniyakumari"]
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      details: ["+91 8220822377", ""]
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      details: ["info@zyrastyllz.com", ""]
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Working Hours",
      details: ["24 x 7"]
    }
  ];

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header Spacer */}
      <div className="h-20"></div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-900 to-yellow-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-light mb-6">Get In Touch</h1>
          <p className="text-xl opacity-90">We love to hear from you</p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow-lg text-center border border-amber-100">
              <div className="text-amber-700 flex justify-center mb-4">
                {info.icon}
              </div>
              <h3 className="text-lg font-light mb-3 text-amber-900">{info.title}</h3>
              {info.details.map((detail, i) => (
                <p key={i} className="text-slate-600 text-sm">{detail}</p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main Contact Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-amber-100">
            <h2 className="text-3xl font-light mb-6 text-amber-900">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
  <label className="block text-sm uppercase tracking-wide mb-2 text-amber-700">
    Your Name *
  </label>
  <input
    type="text"
    name="name"
    value={formData.name}
    onChange={handleChange}
    required
    className="w-full px-4 py-3 border border-amber-200 rounded focus:outline-none focus:border-amber-700 text-slate-900 placeholder:text-slate-400"
    placeholder="John Doe"
  />
</div>

<div>
  <label className="block text-sm uppercase tracking-wide mb-2 text-amber-700">
    Email Address *
  </label>
  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    required
    className="w-full px-4 py-3 border border-amber-200 rounded focus:outline-none focus:border-amber-700 text-slate-900 placeholder:text-slate-400"
    placeholder="john@example.com"
  />
</div>

<div>
  <label className="block text-sm uppercase tracking-wide mb-2 text-amber-700">
    Phone Number
  </label>
  <input
    type="tel"
    name="phone"
    value={formData.phone}
    onChange={handleChange}
    className="w-full px-4 py-3 border border-amber-200 rounded focus:outline-none focus:border-amber-700 text-slate-900 placeholder:text-slate-400"
    placeholder="+91 98765 43210"
  />
</div>

<div>
  <label className="block text-sm uppercase tracking-wide mb-2 text-amber-700">
    Subject *
  </label>
  <input
    type="text"
    name="subject"
    value={formData.subject}
    onChange={handleChange}
    required
    className="w-full px-4 py-3 border border-amber-200 rounded focus:outline-none focus:border-amber-700 text-slate-900 placeholder:text-slate-400"
    placeholder="How can we help?"
  />
</div>

<div>
  <label className="block text-sm uppercase tracking-wide mb-2 text-amber-700">
    Message *
  </label>
  <textarea
    name="message"
    value={formData.message}
    onChange={handleChange}
    required
    rows="5"
    className="w-full px-4 py-3 border border-amber-200 rounded focus:outline-none focus:border-amber-700 resize-none text-slate-900 placeholder:text-slate-400"
    placeholder="Tell us more about your inquiry..."
  ></textarea>
</div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-900 to-yellow-800 text-white py-4 rounded hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>

          {/* Map & Additional Info */}
          <div className="space-y-8">
            {/* Map */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100">
              <div className="w-full h-80 bg-amber-50 rounded-lg flex items-center justify-center">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15794.329378943385!2d77.3084815241258!3d8.244683054709105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b04f8f967104d49%3A0xf94e65afb9bd4a0c!2sThuckalay%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1765606330104!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-amber-100">
              <h3 className="text-2xl font-light mb-6 text-amber-900">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-amber-800">What are your shipping times?</h4>
                  <p className="text-slate-600 text-sm">We typically ship within 2-3 business days. Delivery takes 5-7 days within India.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-amber-800">Do you offer international shipping?</h4>
                  <p className="text-slate-600 text-sm">Yes, we ship to most countries. International delivery takes 10-15 business days.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-amber-800">What is your return policy?</h4>
                  <p className="text-slate-600 text-sm">We offer a 7-day return policy for unused sarees in original condition.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-amber-800">Can I customize a saree?</h4>
                  <p className="text-slate-600 text-sm">Yes! Contact us for custom orders and we will work with our artisans to create your perfect saree.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visit Store CTA */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 py-20 border-t border-amber-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-light mb-6 text-amber-900">Visit Our Flagship Store</h2>
          <p className="text-lg text-slate-600 mb-8">
            Experience our complete collection in person and get personalized styling assistance from our experts
          </p>
          <button className="bg-gradient-to-r from-amber-900 to-yellow-800 text-white px-10 py-4 text-sm uppercase tracking-wider hover:shadow-lg transition rounded-lg">
            Get Directions
          </button>
        </div>
      </div>
    </div>
  );
}