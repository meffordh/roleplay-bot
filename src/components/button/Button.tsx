import { ButtonHTMLAttributes } from 'react';
import { Icon } from 'react-feather';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: Icon;
  buttonStyle?: 'regular' | 'action' | 'alert' | 'outline';
  description?: string;
}

export function Button({ 
  label, 
  icon: Icon, 
  buttonStyle = 'regular', 
  description,
  className = '',
  ...props 
}: ButtonProps) {
  return (
    <button
      data-component="Button"
      className={`button-style-${buttonStyle} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <div className="flex flex-col items-start">
        <span>{label}</span>
        {description && (
          <span className="text-sm text-muted-foreground">{description}</span>
        )}
      </div>
    </button>
  );
}
