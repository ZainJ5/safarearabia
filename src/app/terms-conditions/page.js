import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions | Safar E Arabia',
  description: 'Terms and Conditions for using Safar E Arabia services.',
};

export default function TermsConditionsPage() {
  return (
    <>
      <div className="breadcrumb-area">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-12 text-center text-md-start">
              <div className="breadcrumb-content">
                <h2>Terms & Conditions</h2>
                <ul>
                  <li><Link href="/">Home</Link></li>
                  <li>Terms & Conditions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="terms-area pt-100 pb-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="policy-content bg-white p-5 border rounded shadow-sm">
                <h3 className="mb-4">1. Introduction</h3>
                <p className="text-muted mb-4">
                  Welcome to Safar E Arabia. By accessing our website and using our services, you agree to be bound by these Terms and Conditions. Please read them carefully before making any booking for Hajj, Umrah, or other travel packages.
                </p>

                <h3 className="mb-4">2. Bookings and Reservations</h3>
                <p className="text-muted mb-4">
                  All bookings are subject to availability. A reservation is only confirmed once we receive the required deposit or full payment as specified in the package details. We reserve the right to cancel any booking if payments are not received by the due dates.
                </p>

                <h3 className="mb-4">3. Payments and Pricing</h3>
                <p className="text-muted mb-4">
                  Prices are quoted in USD or SAR unless otherwise stated. Prices are subject to change without prior notice due to fluctuations in currency exchange rates, airline tariffs, or taxes. However, once a booking is fully paid, the price is guaranteed.
                </p>

                <h3 className="mb-4">4. Cancellations and Refunds</h3>
                <ul className="text-muted mb-4 pb-3 border-bottom">
                  <li className="mb-2">Cancellations made 30 days prior to departure may be subject to a cancellation fee.</li>
                  <li className="mb-2">Cancellations made within 15 days of departure are strictly non-refundable.</li>
                  <li className="mb-2">Visa processing fees are non-refundable once the application has been submitted to the authorities.</li>
                  <li className="mb-2">Refunds, if applicable, will be processed within 14-21 business days.</li>
                </ul>

                <h3 className="mb-4">5. Travel Documents and Visas</h3>
                <p className="text-muted mb-4">
                  It is the responsibility of the traveler to ensure they have a valid passport (valid for at least 6 months from the date of travel) and all necessary visas. Safar E Arabia assists with Umrah and Hajj visa processing, but approval is solely at the discretion of the Saudi Ministry of Hajj and Umrah.
                </p>

                <h3 className="mb-4">6. Liability</h3>
                <p className="text-muted mb-0">
                  Safar E Arabia acts only as an agent for airlines, hotels, and transport operators. We are not liable for any personal injury, property damage, or loss resulting from the acts or omissions of these third-party suppliers, or due to force majeure events such as natural disasters or political unrest.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
