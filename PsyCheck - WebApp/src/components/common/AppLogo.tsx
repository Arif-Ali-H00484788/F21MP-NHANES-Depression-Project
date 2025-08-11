
import { Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppLogoProps {
  size?: number;
  className?: string;
  isBlinking?: boolean;
}

export function AppLogo({ size = 32, className, isBlinking = false }: AppLogoProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-primary',
        isBlinking && 'blinking-logo',
        className
      )}
      aria-label="PsyCheck App Logo"
    >
      <Brain style={{ width: size, height: size }} aria-hidden="true" />
      <span className="text-2xl font-bold text-foreground">
        Psy<span className="text-primary">Check</span>
      </span>
    </div>
  );
}
