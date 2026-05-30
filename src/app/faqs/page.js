import Breadcrumb from '@/components/Breadcrumb';
import dbConnect from '@/lib/dbConnect';
import Setting from '@/models/Setting';

export const metadata = {
  title: 'FAQs | Safar e Arabian',
  description: 'Frequently asked questions about our Hajj, Umrah, and travel packages.',
};

const defaultFaqs = [
  {
    question: 'What documents are required for Umrah?',
    answer: 'You will need a valid passport (minimum 6 months validity), completed Umrah visa application, recent passport-size photos, proof of accommodation, and a return flight ticket.',
  },
  {
    question: 'How far in advance should I book my Hajj package?',
    answer: 'We recommend booking your Hajj package at least 6-12 months in advance due to high demand and limited quota allocations. Early booking also ensures better hotel options near the Haram.',
  },
  {
    question: 'Are your hotel packages near Masjid al-Haram?',
    answer: 'Yes, we offer a range of hotels from 3-star to 5-star, all within walking distance of Masjid al-Haram. The exact distance varies by package — details are listed on each hotel page.',
  },
  {
    question: 'What transport services do you provide?',
    answer: 'We provide VIP GMC transport, luxury sedans, and group buses for transfers between Jeddah Airport, Makkah, and Madina. All vehicles are air-conditioned and driven by experienced drivers.',
  },
  {
    question: 'Can I customize my Umrah package?',
    answer: 'Absolutely! We offer fully customizable packages. You can choose your preferred hotel, transport type, duration of stay, and add-on services like guided Ziyarat tours.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept credit/debit cards (Visa, Mastercard), PayPal, bank transfers, and wallet payments. All transactions are secured with SSL encryption.',
  },
  {
    question: 'Is there a cancellation policy?',
    answer: 'Cancellations made 30+ days before departure receive a full refund. Cancellations 15-29 days before receive a 50% refund. Cancellations within 14 days are non-refundable. Please review the specific terms for each package.',
  },
  {
    question: 'Do you provide visa assistance?',
    answer: 'Yes, we provide complete visa processing assistance for Saudi Arabia, including Umrah visas, tourist visas, and business visas. Our team handles all documentation and submission.',
  },
];

async function getFaqs() {
  try {
    await dbConnect();
    const setting = await Setting.findOne({ type: 'faqs' }).lean();
    if (setting?.value && Array.isArray(setting.value) && setting.value.length > 0) {
      return setting.value;
    }
  } catch (e) {
    // fall through to defaults
  }
  return defaultFaqs;
}

export default async function FaqsPage() {
  const faqs = await getFaqs();

  return (
    <>
      <Breadcrumb title="FAQs" subtitle="Frequently Asked Questions" />

      <section className="faq-area pt-100 pb-100">
        <div className="container">
          <div className="row justify-content-center mb-60">
            <div className="col-lg-8 text-center">
              <div className="section-title">
                <span>Got Questions?</span>
                <h2>Frequently Asked Questions</h2>
                <p>Find answers to the most common questions about our services, packages, and booking process.</p>
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="accordion" id="faqAccordion">
                {faqs.map((faq, i) => (
                  <div className="accordion-item" key={i} style={{
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    overflow: 'hidden',
                  }}>
                    <h2 className="accordion-header" id={`faqHeading${i}`}>
                      <button
                        className={`accordion-button ${i !== 0 ? 'collapsed' : ''}`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#faqCollapse${i}`}
                        aria-expanded={i === 0 ? 'true' : 'false'}
                        aria-controls={`faqCollapse${i}`}
                        style={{
                          fontWeight: 600,
                          fontSize: '16px',
                          color: 'var(--title-color, #100C08)',
                          background: '#fff',
                        }}
                      >
                        {faq.question}
                      </button>
                    </h2>
                    <div
                      id={`faqCollapse${i}`}
                      className={`accordion-collapse collapse ${i === 0 ? 'show' : ''}`}
                      aria-labelledby={`faqHeading${i}`}
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body" style={{
                        color: 'var(--text-color, #787878)',
                        fontSize: '15px',
                        lineHeight: 1.8,
                        padding: '20px 25px',
                      }}>
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact CTA */}
              <div style={{
                background: 'linear-gradient(135deg, var(--primary-color1, #B1723C), var(--primary-color2, #6D4100))',
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                marginTop: '50px',
                color: '#fff',
              }}>
                <h4 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
                  Still Have Questions?
                </h4>
                <p style={{ opacity: 0.9, marginBottom: '25px', fontSize: '16px' }}>
                  Our team is available 24/7 to help you plan your perfect journey.
                </p>
                <a href="/contact" className="primary-btn1" style={{
                  background: '#fff',
                  color: 'var(--primary-color1, #B1723C)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 30px',
                  borderRadius: '5px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}>
                  Contact Us
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11" fill="none">
                    <path d="M1 5.5H13M13 5.5L8.5 1M13 5.5L8.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
