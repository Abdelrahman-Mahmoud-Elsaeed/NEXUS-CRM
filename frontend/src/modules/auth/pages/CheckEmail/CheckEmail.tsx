import { Inbox } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { AuthCard } from '@modules/auth/components/AuthCard/AuthCard';

export default function CheckEmail() {
  return (
    <AuthCard 
      title="Check Your Email" 
      description="We sent instructions to your email address."
      icon={<Inbox className="h-6 w-6" />}
    >
      <div className="space-y-6">
        <Button variant="outline" className="w-full border-outline-variant hover:bg-surface-container">
          Return to Login
        </Button>
        <p className="text-center text-xs text-outline">
          Didn't get email? <button className="text-primary font-medium hover:underline">Resend email</button>
        </p>
      </div>
    </AuthCard>
  );
}