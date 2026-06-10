import { Facebook, Instagram, MessageCircle, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-white text-slate-600 py-16 mt-24 border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Clinic Info */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-sky-800">Cuspids Dental Studio</h3>
          <p className="text-sm leading-relaxed">
            Your smile is our priority. We provide professional dental care with the latest technology in a calm and comfortable environment.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="#" className="p-2 rounded-full bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white transition-all">
              <Instagram size={20} />
            </a>
            <a href="#" className="p-2 rounded-full bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white transition-all">
              <Facebook size={20} />
            </a>
            <a href="#" className="p-2 rounded-full bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white transition-all">
              <MessageCircle size={20} />
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-sky-500" />
              <span>+91 91861 46089</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-sky-500" />
              <span>hello@cuspidsdental.com</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={16} className="text-sky-500 mt-0.5" />
              <span>123 Dental Street, Medical Hub,<br />City Center, State 560001</span>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Hours</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span>Mon - Fri:</span>
              <span className="font-medium text-slate-900">9:00 AM - 8:00 PM</span>
            </li>
            <li className="flex justify-between">
              <span>Saturday:</span>
              <span className="font-medium text-slate-900">10:00 AM - 6:00 PM</span>
            </li>
            <li className="flex justify-between">
              <span>Sunday:</span>
              <span className="text-sky-600 font-medium">Emergency Only</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-16 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
        <p>© {new Date().getFullYear()} Cuspids Dental Studio · All Rights Reserved</p>
        <p>
          Designed by <span className="text-sky-600 font-semibold">Zinth Labs</span>
        </p>
      </div>
    </footer>
  );
}
