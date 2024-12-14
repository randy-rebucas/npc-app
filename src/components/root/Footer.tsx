import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#2A2D36] text-white py-16">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Logo and Newsletter Section */}
        <div className="flex justify-between items-start mb-16">
          <div className="max-w-md">
            <Image src="/logo.png" alt="NP Collaborator" width={0} height={0} sizes="100vw" className="w-auto h-auto mb-4" />
            <p className="text-lg">
              Let Doctors compete for your Nurse Practitioner collaboration requirement.
            </p>
          </div>

          <div className="text-right">
            <h3 className="text-xl mb-4">Subscribe to our newsletter</h3>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email..."
                className="px-4 py-2 rounded bg-[#363A45] text-white"
              />
              <button className="bg-[#4154F1] px-6 py-2 rounded">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Directory, Professionals, and Contact Sections */}
        <div className="grid grid-cols-3 gap-8 mb-16">
          <div>
            <h3 className="text-xl font-semibold mb-4">Page Directory</h3>
            <ul className="space-y-2">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Professionals</h3>
            <ul className="space-y-2">
              <li><Link href="/nurse-practitioners">Nurse Practitioners</Link></li>
              <li><Link href="/physicians">Physicians</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <p className="mb-2">support@npcollaborator.com</p>
            <p>7901 4TH ST. N STE 300</p>
            <p>St. Petersburg, FL 33702</p>
          </div>
        </div>

        {/* Copyright and Social Links */}
        <div className="flex justify-between items-center pt-8 border-t border-gray-700">
          <p>Copyright © NP Collaborator</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:opacity-80">
              <Image src="/instagram-icon.svg" alt="Instagram" className="w-6 h-6" width={30} height={30} />
            </Link>
            <Link href="/" className="hover:opacity-80">
              <Image src="/twitter-icon.svg" alt="Twitter" className="w-6 h-6" width={30} height={30} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}