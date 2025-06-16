import CelebrationCompany from '@/components/ui/celebrationCompany/CelebrationCompany';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Confirmacion de cuenta creada | Hoteles'
}


export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen pt-72 sm:pt-22 ">
      <CelebrationCompany />
    </div>
  );
}