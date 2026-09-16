import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import ReservationSection from './components/ReservationSection';
import StorySection from './components/StorySection';
import TestimonialsSection from './components/TestimonialsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/footer';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import Chatbot from './components/Chatbot';
import Toast from './components/Toast';

export default function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <Navbar />
        <main>
          <Hero />
          <MenuSection />
          <ReservationSection />
          <StorySection />
          <TestimonialsSection />
          <ContactSection />
        </main>
        <Footer />
        <CartDrawer />
        <CheckoutModal />
        <Chatbot />
        <Toast />
      </CartProvider>
    </LanguageProvider>
  );
}
