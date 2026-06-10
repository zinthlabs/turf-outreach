import { useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Clock, Award } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-sky-50 rounded-l-[100px] -z-10 hidden lg:block" />

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-sm font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              Now Accepting New Patients
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight">
              Elevating Your <br />
              <span className="text-sky-600">Smile Experience</span>
            </h1>

            <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
              Premium dental care tailored to your comfort. At Cuspids Dental Studio, we blend artistry with science for a healthier, brighter smile.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/booking')}
                className="btn-primary flex items-center justify-center gap-2"
              >
                Book Appointment
                <ChevronRight size={20} />
              </button>
              <button className="btn-secondary">
                View Services
              </button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/100?img=${i+10}`}
                    alt="Patient"
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                  />
                ))}
              </div>
              <div className="text-sm">
                <p className="font-bold text-slate-900">500+ Happy Patients</p>
                <div className="flex text-amber-400">★★★★★</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-sky-200/50 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-200/50 rounded-full blur-3xl -z-10" />

            <img
              src="https://images.unsplash.com/photo-1629909605125-58da16ffaf91?q=80&w=1000&auto=format&fit=crop"
              alt="Modern Dental Clinic"
              className="w-full h-[500px] object-cover rounded-[40px] shadow-2xl border-8 border-white"
            />

            <div className="absolute bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-sky-50 max-w-xs hidden sm:block">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-2 bg-sky-100 rounded-lg text-sky-600">
                  <Award size={24} />
                </div>
                <p className="font-bold text-slate-800">Best Clinic 2024</p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">Recognized for excellence in aesthetic and restorative dentistry.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Cuspids Dental Studio?</h2>
            <p className="text-slate-600">We provide a comprehensive range of dental services in a state-of-the-art facility designed for your comfort.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 transition-all hover:border-sky-200 hover:shadow-lg group">
              <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 mb-6 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Safe & Certified</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Following international sterilization protocols to ensure the highest level of hygiene and safety for our patients.</p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 transition-all hover:border-sky-200 hover:shadow-lg group">
              <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 mb-6 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Easy Scheduling</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Book your appointments online with ease. No more waiting on hold—choose a time that works best for you.</p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 transition-all hover:border-sky-200 hover:shadow-lg group">
              <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 mb-6 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Expert Doctors</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Our team of specialists brings years of experience and a gentle touch to every procedure we perform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-sky-600 rounded-[40px] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 relative z-10">Ready for a Brighter Smile?</h2>
            <p className="text-sky-100 mb-10 text-lg max-w-xl mx-auto relative z-10">
              Join hundreds of satisfied patients. Book your consultation today and take the first step towards dental wellness.
            </p>
            <button
              onClick={() => navigate('/booking')}
              className="bg-white text-sky-700 px-10 py-4 rounded-full font-bold text-lg hover:bg-sky-50 transition-all relative z-10"
            >
              Book Your Appointment Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
