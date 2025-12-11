import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Github,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
} from "lucide-react";

export default function TopNavBar() {
  return (
    <div className="w-full h-10 flex text-xs md:text-sm font-medium z-50 relative bg-zinc-800 text-zinc-400 border-b border-white/5">
      <div className="wrapper flex justify-between items-center w-full h-full">
        {/* Left Side - Contact Info (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
            <Mail className="h-3.5 w-3.5" />
            <span>contact@devblog.com</span>
          </div>
          <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
            <Phone className="h-3.5 w-3.5" />
            <span>+1 (555) 123-4567</span>
          </div>
        </div>

        {/* Mobile Spacer (to center content if needed, currently just flex-end on mobile) */}
        <div className="md:hidden" />

        {/* Right Side - Socials */}
        <div className="flex items-center gap-4 mx-auto md:mx-0">
          <Link href="#" className="hover:text-white transition-colors">
            <Github className="h-3.5 w-3.5" />
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            <Linkedin className="h-3.5 w-3.5" />
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            <MessageCircle className="h-3.5 w-3.5" />
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            <Facebook className="h-3.5 w-3.5" />
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            <Instagram className="h-3.5 w-3.5" />
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            <Youtube className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
