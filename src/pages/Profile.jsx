import { useEffect, useState } from "react";
import { updateUserDetails } from "../services/api";
import { LogOut, User, Mail, Phone } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handler = () => {
      const updated = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(updated);
      setName(updated?.name || "");
      setEmail(updated?.email || "");
    };

    window.addEventListener("authChanged", handler);
    return () => window.removeEventListener("authChanged", handler);
  }, []);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      setMessage("Name & Email cannot be empty");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const response = await updateUserDetails({ name, email });

      if (response.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setUser(response.data.user);
      }

      setMessage("Dossier updated!");
      window.dispatchEvent(new Event("authChanged"));
    } catch {
      setMessage("Update failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.dispatchEvent(new Event("authChanged"));
    window.location.href = "/";
  };

  return (
    <div className="relative min-h-screen pt-48 pb-20 px-4 bg-brutal-black">


      {/* BACKGROUND */}
      <div
        className="absolute inset-0 -z-20 grayscale opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1974&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* MAIN CARD */}
      <div className="max-w-2xl mx-auto w-full p-8 brutalist-card !bg-white">

        {/* HEADER */}
        <div className="flex flex-col items-center mb-12 border-b-8 border-black pb-8">
          <div className="relative">
            <img
              src="https://i.pinimg.com/736x/3e/77/89/3e7789b164213f91358aaa4a47bd8d95.jpg"
              className="w-32 h-32 border-8 border-black object-cover grayscale"
              alt="Profile Avatar"
            />
            <div className="absolute -bottom-4 -right-4 bg-brutal-yellow border-4 border-black p-2">
              <User size={32} strokeWidth={3} />
            </div>
          </div>

          <h1 className="text-4xl font-black mt-8 text-black uppercase italic tracking-tighter">
            {user?.name || "RECRUIT"}
          </h1>

          <p className="text-black font-black uppercase text-sm tracking-widest mt-2 bg-brutal-yellow px-4 py-1">
            {user?.email || "NO IDENTIFICATION"}
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-8">

          {/* NAME */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest mb-2 text-black">
              Codename
            </label>
            <div className="flex items-center gap-3 px-4 py-4 border-4 border-black bg-white focus-within:bg-brutal-yellow transition-colors">
              <User className="text-black w-6 h-6" strokeWidth={3} />
              <input
                type="text"
                className="flex-1 bg-transparent outline-none text-black font-black uppercase tracking-tighter text-xl"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter codename"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest mb-2 text-black">
              Comms Link
            </label>
            <div className="flex items-center gap-3 px-4 py-4 border-4 border-black bg-white focus-within:bg-brutal-yellow transition-colors">
              <Mail className="text-black w-6 h-6" strokeWidth={3} />
              <input
                type="email"
                className="flex-1 bg-transparent outline-none text-black font-black uppercase tracking-tighter text-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter comms link"
              />
            </div>
          </div>

          {/* PHONE (read-only) */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest mb-2 text-black">
              Direct Line
            </label>
            <div className="flex items-center gap-3 px-4 py-4 border-4 border-black bg-gray-200">
              <Phone className="text-black/40 w-6 h-6" strokeWidth={3} />
              <input
                type="text"
                className="flex-1 bg-transparent outline-none text-black/40 font-black uppercase tracking-tighter text-xl"
                value={user?.phone_number || ""}
                disabled
              />
            </div>
          </div>

          {/* SAVE BUTTON */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="brutalist-button w-full text-2xl py-5 bg-brutal-yellow shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            {isSaving ? "UPDATING..." : "COMMIT CHANGES"}
          </button>

          {/* LOGOUT BUTTON */}
          <button
            onClick={logout}
            className="w-full flex justify-center items-center gap-4 py-4 border-4 border-black bg-brutal-red text-white font-black uppercase tracking-widest hover:bg-black transition-colors"
          >
            <LogOut size={24} strokeWidth={3} /> ABORT SESSION
          </button>

          {/* MESSAGE */}
          {message && (
            <div className={`text-center p-4 border-4 border-black font-black uppercase tracking-tighter ${
                message.includes("updated")
                  ? "bg-brutal-yellow text-black"
                  : "bg-brutal-red text-white"
              }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
