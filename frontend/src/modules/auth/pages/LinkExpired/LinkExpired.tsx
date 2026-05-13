import { History, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { AuthCard } from '@modules/auth/components/AuthCard/AuthCard';

export default function LinkExpired() {
  return (
    <AuthCard 
      title="Link Expired" 
      description="This reset link is no longer valid."
      icon={<History className="h-6 w-6 text-error" />}
    >
      <div className="space-y-6">
        <Button className="w-full bg-primary text-on-primary">Request new link</Button>
        <button className="flex w-full items-center justify-center gap-2 text-sm font-medium text-outline hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </button>
      </div>
    </AuthCard>
  );
}