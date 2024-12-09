import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <main className="max-w-6xl mx-auto px-6">
        {/* Hero section */}
        <div className="py-20 text-center space-y-8">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
            NP Collaborator
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Streamline your nonprofit collaboration. Connect, coordinate, and create impact together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              href="/login"
            >
              Get Started Free
            </a>
            <a
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              href="#features"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Features section */}
        <section id="features" className="py-20 space-y-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white">
            Why Choose NP Collaborator?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Easy Collaboration',
                description: 'Connect with other nonprofits seamlessly and work together on shared projects.',
                icon: '🤝',
              },
              {
                title: 'Resource Sharing',
                description: 'Share and access resources, knowledge, and best practices within the community.',
                icon: '📚',
              },
              {
                title: 'Impact Tracking',
                description: 'Measure and visualize your collective impact with powerful analytics tools.',
                icon: '📊',
              },
            ].map((feature) => (
              <div key={feature.title} className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Social proof section */}
        <section className="py-20 space-y-16">
          <div className="text-center space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Trusted by Leading Nonprofits
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-70">
              {[
                'https://placehold.co/200x80/png?text=UNICEF',
                'https://placehold.co/200x80/png?text=RED+CROSS',
                'https://placehold.co/200x80/png?text=WWF',
                'https://placehold.co/200x80/png?text=OXFAM'
              ].map((logo, index) => (
                <Image
                  key={index}
                  src={logo}
                  alt="Organization logo"
                  width={130}
                  height={45}
                  className="dark:invert grayscale hover:grayscale-0 transition-all"
                />
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "NP Collaborator has transformed how we coordinate with other organizations. It's been invaluable for our mission.",
                author: "Sarah Johnson",
                role: "Executive Director",
                org: "Global Health Initiative",
                image: "https://i.pravatar.cc/150?img=1"
              },
              {
                quote: "The platform made it incredibly easy to find and connect with like-minded organizations. Our impact has doubled since joining.",
                author: "Michael Chen",
                role: "Operations Manager",
                org: "Education First",
                image: "https://i.pravatar.cc/150?img=3"
              },
              {
                quote: "Resource sharing through NP Collaborator has helped us optimize our budget and extend our reach significantly.",
                author: "Emma Rodriguez",
                role: "Program Director",
                org: "Community Outreach Alliance",
                image: "https://i.pravatar.cc/150?img=5"
              }
            ].map((testimonial) => (
              <div key={testimonial.author} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.author}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{testimonial.author}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.org}</p>
                  </div>
                </div>
                <blockquote className="text-gray-600 dark:text-gray-300 italic">
                  &quot;{testimonial.quote}&quot;
                </blockquote>
              </div>
            ))}
          </div>
        </section>

        {/* CTA section */}
        <section className="py-20">
          <div className="bg-blue-600 rounded-2xl p-12 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to Make a Bigger Impact?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join our community of mission-driven organizations and start collaborating today.
            </p>
            <a
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-colors"
              href="/login"
            >
              Start Free Trial
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-gray-200 dark:border-gray-800">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
              <ul className="space-y-2">
                {['Features', 'Pricing', 'Case Studies', 'Reviews'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
              <ul className="space-y-2">
                {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                {['Documentation', 'Help Center', 'Community', 'Partners'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                {['Privacy', 'Terms', 'Security', 'Accessibility'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
