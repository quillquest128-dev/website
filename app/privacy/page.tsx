export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 min-h-screen">
      <div className="mb-10">
        <span className="text-sm font-semibold text-[#00b5e8] uppercase tracking-widest block mb-3">Legal</span>
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">Privacy Policy</h1>
        <p className="text-[#4a5568] text-sm">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="card-glass p-8 space-y-8 text-[#8892a4] leading-relaxed">
        {[
          {
            title: '1. Information We Collect',
            content: 'We collect information you provide directly to us, including your name, email address, and Discord username when you place an order. We may also collect usage data such as pages visited and actions taken on our site.',
          },
          {
            title: '2. How We Use Your Information',
            content: 'We use the information we collect to process your orders, communicate with you about your purchases, provide customer support, and improve our services. We do not sell your personal information to third parties.',
          },
          {
            title: '3. Data Storage',
            content: 'Your order information is stored securely in our database powered by Supabase. We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, or destruction.',
          },
          {
            title: '4. Data Retention',
            content: 'We retain your order information for as long as necessary to fulfill the purposes outlined in this policy, or as required by law. You may request deletion of your data by contacting us.',
          },
          {
            title: '5. Third-Party Services',
            content: 'Our service uses Supabase for database storage and Discord for product delivery. These services have their own privacy policies, and we encourage you to review them.',
          },
          {
            title: '6. Cookies',
            content: 'We use essential cookies for authentication and session management. We do not use tracking or advertising cookies. You can control cookie settings through your browser.',
          },
          {
            title: '7. Your Rights',
            content: 'You have the right to access, correct, or delete your personal data. You may also object to the processing of your data in certain circumstances. To exercise these rights, please contact us through Discord or our contact form.',
          },
          {
            title: '8. Contact Us',
            content: 'If you have questions about this Privacy Policy or how we handle your data, please reach out through our Discord server or via the contact form on our website.',
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
