"use client";

import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, Shield, Globe } from 'lucide-react';

// Custom SVG components for Social Icons to avoid "lucide-react" export errors
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { title: 'Product', links: [
      { name: 'Payment Gateway', href: '/merchant' },
      { name: 'Thrive Loans', href: '/loans/thrive' },
      { name: 'Currency Bridge', href: '/bridge' },
      
    ]},
    { title: 'Company', links: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
    ]},
    { title: 'Support', links: [
      { name: 'Help Center', href: '/help' },
      { name: 'Security', href: '/security' },
      { name: 'Status', href: '/status' },
    ]},
    { title: 'Legal', links: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Licenses', href: '/licenses' },
    ]},
  ];

  const socialLinks = [
    { icon: FacebookIcon, href: 'https://facebook.com/vaultstring', name: 'Facebook', color: 'hover:bg-[#1877f2]' },
    { icon: TwitterIcon, href: 'https://twitter.com/vaultstring', name: 'Twitter', color: 'hover:bg-[#000000]' },
    { icon: LinkedinIcon, href: 'https://linkedin.com/company/vaultstring', name: 'LinkedIn', color: 'hover:bg-[#0a66c2]' },
    { icon: InstagramIcon, href: 'https://instagram.com/vaultstring', name: 'Instagram', color: 'hover:bg-[#e4405f]' },
    { icon: YoutubeIcon, href: 'https://youtube.com/@vaultstring', name: 'YouTube', color: 'hover:bg-[#ff0000]' },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src="/vault.png" alt="VaultString" className="w-6 h-6 object-contain" />
              <span className="text-base font-bold text-gray-900 tracking-tight">VaultString</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Direct MWK-CNY transactions and trade finance for Malawi.
            </p>
            
            {/* Contact Details from vaultstring.com */}
            <div className="space-y-2 text-[11px] text-gray-500 font-medium">
              <div className="flex items-start gap-2">
                <MapPin size={12} className="text-[#84cc16] mt-0.5 shrink-0" />
                <span>Parkview Centre, Area 4,<br />Lilongwe, Malawi</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={12} className="text-[#84cc16] shrink-0" />
                <a href="mailto:support@vaultstring.com" className="hover:text-[#84cc16]">support@vaultstring.com</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={12} className="text-[#84cc16] shrink-0" />
                <a href="tel:+265989811915" className="hover:text-[#84cc16]">+265 989 811 915</a>
              </div>
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-xs text-gray-500 hover:text-[#84cc16] transition-colors font-medium">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Social Icons */}
          <div className="flex gap-2">
            {socialLinks.map((social, i) => {
              const Icon = social.icon;
              return (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-white transition-all ${social.color}`}
                  aria-label={social.name}
                >
                  <Icon />
                </a>
              );
            })}
          </div>

          {/* Compliance & Copyright */}
          <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <span>© {currentYear} VaultString</span>
            <span className="flex items-center gap-1">
              <Shield size={10} className="text-[#84cc16]" /> PCI DSS
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Globe size={10} className="text-[#84cc16]" /> Licensed
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}