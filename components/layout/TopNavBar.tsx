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
    <div className="w-full h-10 flex text-sm font-medium z-50 relative overflow-hidden bg-[#FFB900]">
      <div className="wrapper flex justify-between items-center w-full">
        {/* Left Side - Yellow */}
        <div className="pr-12 relative">
          <div className="flex items-center gap-6 text-gray-900">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>Phone</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Location</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Response Time</span>
            </div>
          </div>

          {/* Slanted Divider Effect */}
          <div className="absolute top-0 right-0 h-full w-12 bg-[#FFB900] transform skew-x-[20deg] translate-x-6 z-10"></div>
        </div>

        {/* Right Side - Purple */}
        <div className="bg-[#A355F7] w-auto h-full flex items-center justify-end relative min-w-[300px]">
          {/* Anti-slant background filler if needed, but flex layout handles it mostly */}
          <div className="absolute top-0 left-0 h-full w-12 bg-[#A355F7] transform skew-x-[20deg] -translate-x-6"></div>

          <div className="flex items-center gap-4 text-white relative z-20">
            <Link href="#" className="hover:opacity-80 transition-opacity">
              <Github className="h-4 w-4" />
            </Link>
            <Link href="#" className="hover:opacity-80 transition-opacity">
              <Linkedin className="h-4 w-4" />
            </Link>
            <Link href="#" className="hover:opacity-80 transition-opacity">
              <MessageCircle className="h-4 w-4" />
            </Link>
            <Link href="#" className="hover:opacity-80 transition-opacity">
              <Facebook className="h-4 w-4" />
            </Link>
            <Link href="#" className="hover:opacity-80 transition-opacity">
              <Instagram className="h-4 w-4" />
            </Link>
            <Link href="#" className="hover:opacity-80 transition-opacity">
              <Youtube className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-[#A355F7] absolute top-0 bottom-0 right-0 w-20" />{" "}
    </div>
  );
}
