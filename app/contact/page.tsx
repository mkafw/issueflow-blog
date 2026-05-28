import type { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';

export const metadata: Metadata = {
  title: '联系 | Issueflow Blog',
  description: '有任何问题或建议？欢迎联系我',
};

export default function ContactPage() {
  return (
    <main className="max-w-xl mx-auto px-6 py-12 md:py-20">
      <section className="apple-glass p-8 md:p-12 mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gold-gradient mb-3">联系</h1>
        <p className="text-cosmic-text-secondary">有任何问题或建议？欢迎留言</p>
      </section>
      <div className="apple-glass p-8 md:p-10">
        <ContactForm />
      </div>
    </main>
  );
}
