import { Lock } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { AuthCard } from '@modules/auth/components/AuthCard/AuthCard';
import { useResetPassword } from '@modules/auth/hooks/useResetPassword';

export default function ResetPassword() {
  const { form, loading, error, onSubmit } = useResetPassword();
  const { register, formState: { errors } } = form;

  return (
    <AuthCard 
      title="Reset Password" 
      description="Create a new secure password"
      icon={<Lock className="h-6 w-6" />}
    >
      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="space-y-4">
          {/* New Password Field */}
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input 
              {...register("password")}
              id="new-password" 
              type="password" 
              placeholder="••••••••"
              className={`border-outline-variant bg-surface focus-visible:ring-primary ${
                errors.password ? "border-destructive focus-visible:ring-destructive" : ""
              }`} 
            />
            {errors.password && (
              <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input 
              {...register("confirmPassword")}
              id="confirm-password" 
              type="password" 
              placeholder="••••••••"
              className={`border-outline-variant bg-surface focus-visible:ring-primary ${
                errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""
              }`} 
            />
            {errors.confirmPassword && (
              <p className="text-xs font-medium text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        {/* API/Global Error Display */}
        {error && (
          <div className="animate-in fade-in slide-in-from-top-2">
            <p className="rounded-md bg-destructive/10 p-2.5 text-center text-xs font-medium text-destructive border border-destructive/20">
              {error}
            </p>
          </div>
        )}

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-primary text-on-primary hover:bg-primary/90 transition-all"
        >
          {loading ? "Updating Password..." : "Reset Password"}
        </Button>
      </form>
    </AuthCard>
  );
}