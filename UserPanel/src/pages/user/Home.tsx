import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Lightbulb,
  Users,
  ArrowRight,
  Star,
  Quote,
  Mail,
  Phone,
  MapPin,
  Send,
  Heart,
  Target,
  Award,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/* ---------------------- Quotes ---------------------- */
const quotes = [
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
  },
  {
    text: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King",
  },
  {
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi",
  },
  {
    text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
    author: "Brian Herbert",
  },
  {
    text: "Education is not preparation for life; education is life itself.",
    author: "John Dewey",
  },
];

/* ---------------------- Logo ---------------------- */
const NoteNexusLogo = ({ className = "h-8 w-8", textSize = "text-2xl" }) => (
  <div className="flex items-center space-x-3">
    <div className="relative group">
      <div
        className={`bg-gradient-to-tr from-[#669a9b] to-[#8dbbb9] p-2.5 rounded-2xl ${className} flex items-center justify-center shadow-lg transform transition-all duration-500 group-hover:rotate-6 group-hover:scale-105`}
      >
        <BookOpen className="h-5 w-5 text-white" strokeWidth={2.5} />
      </div>
    </div>
    <span className={`${textSize} font-bold text-slate-800`}>
      Note<span className="text-[#669a9b]">Nexus</span>
    </span>
  </div>
);

/* ---------------------- Component ---------------------- */
function Home() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("home");
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleGetStarted = () => navigate("/login");

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentQuote((prev) => (prev + 1) % quotes.length);
        setIsVisible(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  /* ---------------------- Contact Submit ---------------------- */
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/v1/contacts/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
        setFormData({ name: "", email: "", message: "" });
        toast.success("Form Submitted successfully");
      } else toast.error(data.error || "Something went wrong.");
    } catch {
      toast.error("Failed to send message. Try again later.");
    }
  };

  /* ---------------------- Theme Data ---------------------- */
  const features = [
    {
      icon: BookOpen,
      title: "Smart Note Organization",
      description:
        "Organize your notes with intelligent categorization and instant search.",
    },
    {
      icon: Lightbulb,
      title: "Study Insights",
      description:
        "Get personalized tips to optimize your study sessions and focus areas.",
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description:
        "Share knowledge, discuss ideas, and grow together with peers.",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Student-Centered",
      description: "We design with empathy and a passion for student success.",
    },
    {
      icon: Target,
      title: "Innovation",
      description: "Constantly pushing boundaries for smarter learning tools.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Delivering high-quality features and seamless performance.",
    },
    {
      icon: Zap,
      title: "Accessibility",
      description: "Making education accessible to every learner, everywhere.",
    },
  ];

  /* ---------------------- Navbar ---------------------- */
  const renderNavigation = () => (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-[#dcebea]/60">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        <button onClick={() => setCurrentPage("home")}>
          <NoteNexusLogo />
        </button>
        <div className="hidden md:flex items-center space-x-8">
          {["home", "about", "contact"].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`transition duration-300 ${
                currentPage === page
                  ? "text-[#669a9b] font-semibold"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </button>
          ))}
          <button
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] text-white px-6 py-2 rounded-lg shadow hover:shadow-lg hover:-translate-y-0.5 transition"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );

  /* ---------------------- Home Page ---------------------- */
  const renderHomePage = () => (
    <div className="bg-gradient-to-br from-slate-50 via-[#dcebea] to-[#b9d6d5]">
      {/* Hero */}
      <section className="py-20 text-center">
        
        <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-4">
          Welcome to <span className="text-[#669a9b]">NoteNexus</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-8">
          Your intelligent companion for capturing, organizing, and transforming
          knowledge into wisdom.
        </p>

        {/* Quotes */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg max-w-3xl mx-auto border border-[#dcebea]/50 transition-all">
          <Quote className="h-8 w-8 text-[#8dbbb9] mx-auto mb-4 animate-pulse" />
          <blockquote
            className={`text-2xl italic text-slate-700 mb-3 transition-all ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            "{quotes[currentQuote].text}"
          </blockquote>
          <p className="text-slate-500">— {quotes[currentQuote].author}</p>
        </div>

        <button
          onClick={handleGetStarted}
          className="mt-10 bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
        >
          Start Your Journey <ArrowRight className="inline h-5 w-5 ml-2" />
        </button>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white/80 border-t border-[#dcebea]/60">
        <div className="max-w-5xl mx-auto text-center grid md:grid-cols-4 gap-8">
          {[
            { number: "500+", label: "Active Students" },
            { number: "1,200+", label: "Notes Uploaded" },
            { number: "98%", label: "Satisfaction Rate" },
            { number: "24/7", label: "Student Support" },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-6 rounded-xl shadow hover:shadow-lg transition bg-gradient-to-br from-[#669a9b]/10 to-[#8dbbb9]/10"
            >
              <h3 className="text-3xl font-bold text-[#669a9b]">{stat.number}</h3>
              <p className="text-slate-700 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-br from-[#dcebea] to-[#b9d6d5]/40">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-slate-800 mb-12">
            Empower Your Learning
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, description }, i) => (
              <div
                key={i}
                className="bg-white/80 border border-[#dcebea]/60 rounded-2xl shadow-lg p-8 hover:-translate-y-1 transition"
              >
                <div className="bg-gradient-to-tr from-[#669a9b] to-[#8dbbb9] w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {title}
                </h3>
                <p className="text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-gradient-to-br from-slate-50 via-[#dcebea] to-[#b9d6d5]">
        <div className="max-w-3xl mx-auto bg-white/80 border border-[#dcebea]/60 p-12 rounded-3xl shadow-lg">
          <Star className="h-10 w-10 text-[#669a9b] mx-auto mb-4 animate-pulse" />
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Ready to Transform Your Studies?
          </h2>
          <p className="text-slate-600 mb-8">
            Join 500+ students already learning smarter with NoteNexus.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] text-white px-10 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
          >
            Get Started for Free
          </button>
          <p className="text-sm text-slate-500 mt-4">
            No credit card required • Learn at your own pace
          </p>
        </div>
      </section>
    </div>
  );

  /* ---------------------- About Page ---------------------- */
  const renderAboutPage = () => (
    <div className="bg-gradient-to-br from-slate-50 via-[#dcebea] to-[#b9d6d5] py-20">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-slate-800">
          About <span className="text-[#669a9b]">NoteNexus</span>
        </h1>
        <p className="text-xl text-slate-600 mt-4 max-w-3xl mx-auto">
          We’re on a mission to revolutionize how students learn, organize, and
          grow through smart note-taking and collaboration.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-semibold text-[#669a9b] mb-4">
            Our Mission
          </h2>
          <p className="text-slate-700 leading-relaxed">
            At NoteNexus, we believe every student deserves tools that make
            learning more organized and engaging. Our platform blends intuitive
            design with smart technology to create a truly personal learning
            experience.
          </p>
        </div>
        <div className="bg-gradient-to-tr from-[#669a9b] to-[#8dbbb9] rounded-3xl p-8 text-white text-center shadow-lg">
          <BookOpen className="h-16 w-16 mx-auto mb-4 animate-bounce" />
          <h3 className="text-2xl font-bold mb-2">Empowering Students</h3>
          <p>Through innovation, accessibility, and excellence.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {values.map(({ icon: Icon, title, description }, i) => (
          <div
            key={i}
            className="bg-white/80 p-6 rounded-2xl shadow border border-[#dcebea]/50 hover:-translate-y-1 transition"
          >
            <div className="bg-gradient-to-tr from-[#669a9b] to-[#8dbbb9] w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              {title}
            </h3>
            <p className="text-slate-600">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  /* ---------------------- Contact Page ---------------------- */
  const renderContactPage = () => (
    <div className="bg-gradient-to-br from-slate-50 via-[#dcebea] to-[#b9d6d5] py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-slate-800">
          Get in <span className="text-[#669a9b]">Touch</span>
        </h1>
        <p className="text-xl text-slate-600 mt-4">
          We'd love to hear from you. Send us a message below.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 px-4">
        <form
          onSubmit={handleFormSubmit}
          className="bg-white/80 border border-[#dcebea]/50 rounded-3xl p-8 shadow-lg space-y-6"
        >
          <h2 className="text-2xl font-semibold text-[#669a9b] mb-4">
            Send us a message
          </h2>

          {isSubmitted && (
            <div className="bg-green-50 border border-green-300 text-green-700 p-3 rounded-lg">
              ✅ Message sent successfully!
            </div>
          )}

          {["name", "email", "message"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-slate-700 mb-2 capitalize">
                {field}
              </label>
              {field === "message" ? (
                <textarea
                  rows={6}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#669a9b]"
                  required
                />
              ) : (
                <input
                  type={field === "email" ? "email" : "text"}
                  value={formData[field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#669a9b]"
                  required
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#669a9b] to-[#8dbbb9] text-white py-3 rounded-lg font-semibold shadow hover:shadow-lg transition"
          >
            <Send className="inline h-5 w-5 mr-2" /> Send Message
          </button>
        </form>

        <div className="space-y-8">
          {[
            {
              icon: Mail,
              title: "Email",
              lines: ["adityanotenexus@gmail.com", "supportnotenexus@gmail.com"],
            },
            {
              icon: Phone,
              title: "Phone",
              lines: ["+91 7905361332", "Mon–Fri, 9am–6pm IST"],
            },
            {
              icon: MapPin,
              title: "Location",
              lines: ["Lucknow, Uttar Pradesh, India"],
            },
          ].map(({ icon: Icon, title, lines }, i) => (
            <div
              key={i}
              className="bg-white/80 p-6 rounded-2xl shadow border border-[#dcebea]/50 flex space-x-4 items-start hover:-translate-y-1 transition"
            >
              <div className="bg-gradient-to-tr from-[#669a9b] to-[#8dbbb9] w-12 h-12 rounded-xl flex items-center justify-center">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">
                  {title}
                </h3>
                {lines.map((line, j) => (
                  <p key={j} className="text-slate-600">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ---------------------- Footer ---------------------- */
  const renderFooter = () => (
    <footer className="bg-[#669a9b] text-white py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 space-y-4 md:space-y-0">
        
        <p className="text-white/90 text-sm text-center md:text-right">
          © 2025 NoteNexus — Empowering students through organized learning.
        </p>
      </div>
    </footer>
  );

  /* ---------------------- Page Switch ---------------------- */
  return (
    <div className="min-h-screen">
      {renderNavigation()}
      {currentPage === "home" && renderHomePage()}
      {currentPage === "about" && renderAboutPage()}
      {currentPage === "contact" && renderContactPage()}
      {renderFooter()}
    </div>
  );
}

export default Home;
