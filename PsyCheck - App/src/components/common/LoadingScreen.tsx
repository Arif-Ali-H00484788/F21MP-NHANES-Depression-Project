
import { AppLogo } from '@/components/common/AppLogo';
import { APP_NAME_FULL } from '@/lib/constants';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <AppLogo size={64} className="animate-pulse" />
      <p className="mt-4 text-lg text-foreground animate-pulse">Loading {APP_NAME_FULL}...</p>
    </div>
  );
}
