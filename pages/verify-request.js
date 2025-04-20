import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import VerifyRequestForm from '../components/VerifyRequestForm';

export default function VerifyRequest() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-2xl mx-auto p-4">
        <VerifyRequestForm />
      </div>
      <BottomNav />
    </div>
  );
}