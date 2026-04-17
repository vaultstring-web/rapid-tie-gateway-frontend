import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div 
      className={cn(
        // Changed bg-white to var(--bg-secondary)
        // Changed border to var(--border-color)
        "rounded-lg border bg-[var(--bg-secondary)] border-[var(--border-color)] shadow-[var(--card-shadow)] transition-colors", 
        className
      )} 
      {...props} 
    />
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3 
      className={cn(
        "text-lg font-semibold leading-none tracking-tight text-[var(--text-primary)]", 
        className
      )} 
      {...props} 
    />
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn("p-6 pt-0 text-[var(--text-secondary)]", className)} {...props} />;
}