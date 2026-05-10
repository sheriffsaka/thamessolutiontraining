import { GraduationCap } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  dark?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

export function Logo({ className, showText = true, dark = false, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-10',
    md: 'h-16',
    lg: 'h-24',
    xl: 'h-32',
    xxl: 'h-40'
  };

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className={cn("relative flex items-center justify-center w-auto", sizeClasses[size as keyof typeof sizeClasses])}>
        <img src="https://res.cloudinary.com/di7okmjsx/image/upload/v1777572170/Thameslogo_ryvosf.png" alt="Thames Solution" className="h-full w-auto object-contain" />
      </div>
    </div>
  );
}
