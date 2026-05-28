import type { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';

export const metadata: Metadata = {
  title: '联系 | Issueflow Blog',
  description: '有任何问题或建议？欢迎联系我',
};

export default function ContactPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-gold-gradient mb-4">联系</h1>
      <p className="text-cosmic-text-secondary mb-10">有任何问题或建议？欢迎留言</p>
      <div className="apple-glass p-8">
        <ContactForm />
      </div>
    </main>
  );
}
