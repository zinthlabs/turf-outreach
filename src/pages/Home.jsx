import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import { Facebook, Instagram, MessageCircle } from "lucide-react";


const images = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581009146145-b5ef03a19d7b?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1974&auto=format&fit=crop"
];

export default function Home() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black font-[Montserrat]">
      {/* Hero background carousel */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={images[current]}
          alt="Gym background"
          className="w-full h-full object-cover object-center grayscale contrast-125"
          style={{ maxHeight: '100vh' }}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-brightness-50" />
      </div>
      {/* Main glass hero and call-to-action, center both axes */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-20">
        <h1 className="text-white text-7xl font-black mb-6 text-center italic tracking-tighter uppercase">
          FORGE YOUR BODY
        </h1>
        <div className="text-brutal-yellow text-2xl mb-8 font-black text-center uppercase tracking-widest bg-black px-4 py-2">
          RAW POWER. NO EXCUSES. BOOK YOUR SESSION NOW.
        </div>
        <button
          className="brutalist-button text-2xl flex items-center gap-4"
          onClick={() => navigate('/booking')}
        >
          Book Now
          <AiOutlineArrowRight className="text-3xl" />
        </button>

      </div>
      {/* Carousel dots with glass effect */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex space-x-4 z-30">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`w-12 h-3 transition-all ${current === idx ? 'bg-brutal-yellow w-20' : 'bg-white/40'} border-2 border-black`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>
      {/* Glass Footer Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-24
                bg-white border-t-8 border-black
                flex items-center justify-center z-40">

        <div className="flex items-center gap-14 text-black font-black uppercase">

          {/* Powered by */}
          <div className="flex items-center gap-3">
            <span className="text-lg">
              Crafted by <a href="https://www.gratifylabs.in" target="_blank" rel="noopener noreferrer"><span className="underline decoration-4">Zinth Labs</span></a>
            </span>
          </div>

          {/* Social Icons */}
          <div className="flex gap-8 text-3xl">
            <a href="https://www.instagram.com/zinth.labs/" target="_blank" className="hover:text-brutal-red transition transform hover:-rotate-6">
              <Instagram size={32} strokeWidth={3} />
            </a>

            <a href="https://wa.me/919186146089" target="_blank" className="hover:text-brutal-red transition transform hover:rotate-6">
              <MessageCircle size={32} strokeWidth={3} />
            </a>
          </div>

        </div>
      </div>


    </div>

  );
}
