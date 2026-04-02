import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary border-t border-accent/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <p className="text-white font-bold text-lg mb-2">
              GigLine<span className="text-accent"> Compliance</span>
            </p>
            <p className="text-white/60 text-sm leading-relaxed">
              Safety Walkthroughs &amp; Gap Checks for Small Operations.
            </p>
            <p className="text-white/40 text-xs mt-4">
              Verified against OSHA standards · Serving the Triad and surrounding region
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Navigation</p>
            <nav className="flex flex-col gap-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/services', label: 'Services' },
                { href: '/about', label: 'About' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://launchpathedu.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:text-accent/80 transition-colors"
              >
                LaunchPath Transportation EDU ↗
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Contact</p>
            <p className="text-sm text-white/70 mb-1">Vince Lawrence</p>
            <a
              href="mailto:vince@giglinecompliance.com"
              className="block text-sm text-accent hover:text-accent/80 transition-colors mb-1"
            >
              vince@giglinecompliance.com
            </a>
            <a
              href="tel:3366714967"
              className="block text-sm text-white/70 hover:text-white transition-colors"
            >
              336-671-4967
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-accent/20 text-center text-white/30 text-xs">
          &copy; {new Date().getFullYear()} GigLine Compliance. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
