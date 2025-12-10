import { Search, MapPin, User, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductsHeader = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 animate-fade-in">
            <img
              src="/prosmart_logo_lg.png"
              alt="Prosmart Concepts"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Search */}
          <div
            className="hidden lg:flex items-center flex-1 max-w-sm mx-8 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500" />
              <input
                type="text"
                placeholder="Search products"
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div
            className="hidden lg:flex items-center gap-4 animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
              <MapPin className="w-4 h-4 text-cyan-500" />
              <span>Mumbai</span>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
              <User className="w-4 h-4 text-cyan-500" />
              <a href="mailto:online@prosmart.com" className="hover:text-[#0d3d0d] transition-colors">
                online@prosmart.com
              </a>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
              <Phone className="w-4 h-4 text-cyan-500" />
              <a href="tel:+919111111111" className="hover:text-[#0d3d0d] transition-colors">
                +91 9111111111
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <button className="lg:hidden p-2">
            <div className="w-5 h-0.5 bg-gray-800 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-800 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-800"></div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ProductsHeader;
