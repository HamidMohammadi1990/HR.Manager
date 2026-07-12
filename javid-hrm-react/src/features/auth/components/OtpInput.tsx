import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { useOtpInput } from '../hooks/useOtpInput';

interface OtpInputProps {
  length?: number;
  onComplete?: (value: string) => void;
  className?: string;
  inputClassName?: string;
  error?: string;
}

export function OtpInput({
  length = 4,
  onComplete,
  className,
  inputClassName,
  error,
}: OtpInputProps) {
  const { getInputProps } = useOtpInput({ length, onComplete });

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-center gap-6" dir="ltr">
        {Array.from({ length }, (_, index) => (
          <Input
            key={index}
            className={cn(
              'data-filled:border-border-light focus:border-border-light size-14 rounded-lg text-center text-lg duration-200 sm:size-14',
              inputClassName,
            )}
            {...getInputProps(index)}
          />
        ))}
      </div>
      {error && <p className="text-warning h-5 text-sm">{error}</p>}
    </div>
  );
}

export { useOtpInput };
