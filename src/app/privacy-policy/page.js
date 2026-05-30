import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Safar E Arabia',
  description: 'Privacy Policy for Safar E Arabia outlining how we collect and use your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="breadcrumb-area">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-12 text-center text-md-start">
              <div className="breadcrumb-content">
                <h2>Privacy Policy</h2>
                <ul>
                  <li><Link href="/">Home</Link></li>
                  <li>Privacy Policy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="policy-area pt-100 pb-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="policy-content bg-white p-5 border rounded shadow-sm">
                <h3 className="mb-4">1. Information We Collect</h3>
                <p className="text-muted mb-4">
                  When you use Safar E Arabia's services, we may collect personal information such as your name, email address, phone number, passport details, and payment information. This data is collected when you make a booking, subscribe to our newsletter, or fill out an inquiry form.
                </p>

                <h3 className="mb-4">2. How We Use Your Information</h3>
                <p className="text-muted mb-4">
                  The information we collect is used to:
                </p>
                <ul className="text-muted mb-4 pb-3 border-bottom">
                  <li className="mb-2">Process your bookings for Hajj, Umrah, and travel packages.</li>
                  <li className="mb-2">Apply for necessary visas on your behalf.</li>
                  <li className="mb-2">Communicate with you regarding your travel itinerary and updates.</li>
                  <li className="mb-2">Improve our website and customer service.</li>
                </ul>

                <h3 className="mb-4">3. Data Sharing and Protection</h3>
                <p className="text-muted mb-4">
                  We do not sell or trade your personal information to third parties. However, to facilitate your travel, we must share your data with trusted partners such as airlines, hotels, transport providers, and the Saudi Ministry of Hajj and Umrah. We implement strict security measures to ensure your data is protected against unauthorized access.
                </p>

                <h3 className="mb-4">4. Cookies</h3>
                <p className="text-muted mb-4">
                  Our website uses "cookies" to enhance user experience. You can choose to set your web browser to refuse cookies or to alert you when cookies are being sent. If you do so, note that some parts of the site may not function properly.
                </p>

                <h3 className="mb-4">5. Your Rights</h3>
                <p className="text-muted mb-4">
                  You have the right to access, update, or delete your personal information at any time. If you wish to exercise these rights, please contact us at privacy@safarearabia.com.
                </p>

                <h3 className="mb-4">6. Changes to this Policy</h3>
                <p className="text-muted mb-0">
                  Safar E Arabia has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the bottom of this page. We encourage users to frequently check this page for any changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
