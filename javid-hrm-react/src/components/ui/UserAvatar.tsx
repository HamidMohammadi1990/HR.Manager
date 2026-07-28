import type { UserDto } from '@/services/api';
import { getUserInitials, resolveProfileImageUrl } from '@/lib/userDisplay';
import { cn } from '@/lib/utils';

type UserAvatarUser = Pick<UserDto, 'FirstName' | 'LastName' | 'UserName' | 'ProfileImageUrl'>;

const sizeClasses = {
  sm: 'size-8 text-sm',
  md: 'size-10 text-sm',
  lg: 'size-20 text-2xl sm:size-24',
} as const;

interface UserAvatarProps {
  user: UserAvatarUser;
  size?: keyof typeof sizeClasses;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
}

export function UserAvatar({
  user,
  size = 'md',
  className,
  imageClassName,
  fallbackClassName,
}: UserAvatarProps) {
  const imageUrl = resolveProfileImageUrl(user.ProfileImageUrl);
  const initials = getUserInitials(user);

  return (
    <div className={cn('avatar overflow-hidden', sizeClasses[size], className)}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className={cn('avatar-image size-full object-cover', imageClassName)}
        />
      ) : (
        <div
          className={cn(
            'avatar-fallback from-primary to-primary/70 text-primary-foreground flex size-full items-center justify-center bg-linear-to-br font-semibold',
            fallbackClassName,
          )}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
