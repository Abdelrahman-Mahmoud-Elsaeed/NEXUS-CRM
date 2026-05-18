import { History, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { AuthCard } from '@modules/auth/components/AuthCard/AuthCard';
import { Link } from 'react-router-dom';

export default function LinkExpired() {
  return (
    <AuthCard 
      title="Link Expired" 
      description="This reset link is no longer valid or has already been used."
      icon={<History className="h-6 w-6 text-error" />}
    >
      <div className="space-y-6">
        <Link to="/forgot-password" className="block w-full">
          <Button type="button" className="w-full bg-primary text-on-primary hover:bg-primary/90 rounded-[var(--radius-md)]">
            Request new link
          </Button>
        </Link>
        
        <Link to="/login" className="block w-full">
          <button 
            type="button" 
            className="flex w-full items-center justify-center gap-2 text-sm font-medium text-outline hover:text-primary transition-colors pt-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </button>
        </Link>
      </div>
    </AuthCard>
  );
}