import { Phone, Mail, Clock, MapPin } from "lucide-react"
import ContactForm from "@/components/contact/contact-form"
import CompanyLogos from "@/components/contact/company-logos"

export default function ContactUsPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-black text-white py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column - Contact Info */}
            <div>
              <h2 className="text-3xl font-bold mb-2">You Will Grow, You Will Succeed. We Promise That</h2>
              <p className="text-gray-600 mb-8">
                Pellentesque arcu facilisis nunc mi pham. Dignissim mattis in lectus tincidunt tincidunt ultrices. Diam
                convallis morbi pellentesque adipiscing.
              </p>

              <div className="space-y-8">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="bg-teal-50 p-3 rounded-full">
                    <Phone className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Call for inquiry</h3>
                    <p className="text-gray-600">+257 388-6895</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="bg-teal-50 p-3 rounded-full">
                    <Mail className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Send us email</h3>
                    <p className="text-gray-600">kramulous@sbcglobal.net</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="bg-teal-50 p-3 rounded-full">
                    <Clock className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Opening hours</h3>
                    <p className="text-gray-600">Mon - Fri: 10AM - 10PM</p>
                  </div>
                </div>

                {/* Office */}
                <div className="flex items-start gap-4">
                  <div className="bg-teal-50 p-3 rounded-full">
                    <MapPin className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Office</h3>
                    <p className="text-gray-600">19 North Road Piscataway, NY 08854</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
              <p className="text-gray-500 mb-6">Nibh dis faucibus prom lacus tristique</p>

              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="h-[300px] w-full rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343077!2d-74.46059872426865!3d40.54892835343177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c3c65531ee8d1f%3A0x7a7f4a1c5a29f1e!2sPiscataway%2C%20NJ%2008854!5e0!3m2!1sen!2sus!4v1716151234567!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Company Logos */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4 md:px-6">
          <CompanyLogos />
        </div>
      </section>
    </main>
  )
}
