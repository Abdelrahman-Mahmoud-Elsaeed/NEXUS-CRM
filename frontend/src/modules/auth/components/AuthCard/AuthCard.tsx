import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export const AuthCard = ({ children, title, description, icon }: AuthCardProps) => (
  <div className="flex min-h-screen items-center justify-center bg-background p-4 animate-in fade-in duration-500">
    <Card className="w-full max-w-[420px] border-outline-variant bg-surface shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="space-y-4 pt-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container text-primary">
            {icon || <LayoutGrid className="h-6 w-6" />}
          </div>
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold tracking-tight text-foreground">{title}</CardTitle>
            {description && (
              <CardDescription className="text-sm text-outline px-4">
                {description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-8">
        {children}
      </CardContent>
    </Card>
  </div>
);