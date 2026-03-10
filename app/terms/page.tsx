export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 min-h-screen">
      <div className="mb-10">
        <span className="text-sm font-semibold text-[#00b5e8] uppercase tracking-widest block mb-3">Legal</span>
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">Terms of Service</h1>
        <p className="text-[#4a5568] text-sm">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="card-glass p-8 space-y-8 text-[#8892a4] leading-relaxed">
        {[
          {
            title: '1. Acceptance of Terms',
            content: 'By accessing or using LazoStore, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not access the service.',
          },
          {
            title: '2. Digital Products',
            content: 'All products sold on LazoStore are digital goods. Upon successful payment and verification through Discord, products will be delivered to you via Discord. Due to the digital nature of these goods, all sales are generally final.',
          },
          {
            title: '3. Payment Process',
            content: 'Payments are handled manually through our Discord server. Prices are listed in USD. We reserve the right to refuse or cancel any order at our discretion.',
          },
          {
            title: '4. Delivery',
            content: 'Digital products are delivered via Discord after payment confirmation. Delivery times may vary but we aim to fulfill all orders within 24 hours. Most orders are completed within a few hours.',
          },
          {
            title: '5. Refunds',
            content: 'Due to the nature of digital products, refunds are handled on a case-by-case basis. If you experience issues with your product, please contact us on Discord and we will do our best to resolve the situation.',
          },
          {
            title: '6. Prohibited Use',
            content: 'You may not use our products for any illegal or unauthorized purpose. You may not redistribute, resell, or share products purchased from LazoStore without explicit written permission.',
          },
          {
            title: '7. Changes to Terms',
            content: 'We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of the service constitutes acceptance of the updated terms.',
          },
          {
            title: '8. Contact',
            content: 'For any questions regarding these terms, please contact us through our Discord server or via the contact form on our website.',
          },
        ].map(section => (
          <div key={section.title}>
            <h2 className="text-white font-bold text-lg mb-3">{section.title}</h2>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
