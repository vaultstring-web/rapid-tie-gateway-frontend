import { cn } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Avatar({ className, children, ...props }: AvatarProps) {
  return (
    <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)} {...props}>
      {children}
    </div>
  );
}

interface AvatarImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

export function AvatarImage({ src, alt, className }: AvatarImageProps) {
  return <img className={cn("aspect-square h-full w-full object-cover", className)} src={src} alt={alt} />;
}

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export function AvatarFallback({ children, className }: AvatarFallbackProps) {
  return (
    <div className={cn("flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-600 text-sm font-medium", className)}>
      {children}
    </div>
  );
}
