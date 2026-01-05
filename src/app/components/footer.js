import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, Heart, Shield, CheckCircle, Package, Truck, Award } from 'lucide-react';
import Link from "next/link";

export default function Footer() {
 const currentYear = new Date().getFullYear();

 const socialLinks = [
 { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-amber-600' },
 { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/zyrastyllz?igsh=MWo3M3ZwcnNkN2ZlaQ==', color: 'hover:text-yellow-600' },
 { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-amber-500' },
 { name: 'Youtube', icon: Youtube, href: '#', color: 'hover:text-yellow-700' }
 ];

 const policyLinks = [
 { name: 'Privacy Policy', href: '/privacy' },
 { name: 'Terms of Service', href: '/terms' },
 { name: 'Contact', href: '/contact' }
 ];

 return (
 <footer className="w-full bg-gradient-to-b from-amber-50 to-white border-t border-amber-200 mt-16">
 {/* Main Footer Content */}
 <div className="max-w-[1600px] mx-auto px-4 py-14">
 <div className="flex flex-col md:flex-row justify-between items-center gap-10">
 {/* Brand and Contact */}
 <div className="w-full md:w-auto text-center md:text-left">
 <Link href="/" className="text-3xl font-serif text-amber-800 tracking-wider mb-2 inline-block hover:text-yellow-700 transition">
 ZYRA </Link>
 <p className="text-slate-600 mb-4 text-sm leading-relaxed max-w-md mx-auto md:mx-0">
 your choice our promise
 </p>
 {/* Contact Info */}
 <div className="space-y-2 text-slate-700 text-sm">
 <a href="tel:+918220822377" className="flex items-center gap-2 hover:text-amber-700 transition justify-center md:justify-start">
 <Phone className="w-4 h-4 text-amber-700" />
 +91 8220822377
 </a>
 <a href="mailto:info@zyrastyllz.com" className="flex items-center gap-2 hover:text-amber-700 transition justify-center md:justify-start">
 <Mail className="w-4 h-4 text-amber-700" />
 info@zyrastyllz.com
</a>
 <div className="flex items-center gap-2 justify-center md:justify-start">
 <MapPin className="w-4 h-4 text-amber-700" />
Thuckalay Kanniyakumari </div>
 </div>
 </div>

 {/* Policy and Social */}
 <div className="flex flex-col gap-6 items-center md:items-end">
 <div className="flex gap-6">
 {policyLinks.map((pol) => (
 <Link key={pol.name} href={pol.href} className="text-slate-600 hover:text-amber-700 transition text-sm">
 {pol.name}
 </Link>
 ))}
 </div>
 <div className="flex items-center gap-4 mt-2">
 <span className="text-slate-600 text-xs font-medium">Follow Us:</span>
 <div className="flex gap-2">
 {socialLinks.map((social) => {
 const Icon = social.icon;
 return (
 <a key={social.name} href={social.href}
 className={`bg-white p-2 rounded-full shadow hover:scale-110 transition-all text-slate-600 ${social.color} border border-amber-200`}
 aria-label={social.name}
 >
 <Icon className="w-5 h-5" />
 </a>
 );
 })}
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Bottom Bar */}
 <div className="bg-gradient-to-r from-amber-900 to-yellow-800 text-white py-6">
 <div className="max-w-[1600px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
 <p className="text-amber-200 text-center sm:text-left">
 © {currentYear} Zyra. All rights reserved.
 </p>
 <div className="flex items-center gap-1 text-amber-200">
 <span>Made with</span>
 <Heart className="w-4 h-4 text-red-400 fill-current animate-pulse" />
 <span>in India</span>
 </div>
 <div className="flex items-center gap-2 text-amber-200 text-xs">
 <img src="/images/logo.png" alt="Your Company Logo" className="h-12" />
 <span>Built by Skillsync Pro</span>
 </div>
 </div>
 </div>
 </footer>
 );
}
