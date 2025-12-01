import { Link } from 'react-router'
import { User } from '../../../models/user'

interface UserProfileLinkProps {
  user: Partial<User>
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export const UserProfileLink: React.FC<UserProfileLinkProps> = ({
  user,
  children,
  className,
  onClick,
}) => {
  // If there's no auth_id, just render the children without a link
  if (!user?.auth_id) {
    return <div className={className}>{children}</div>
  }

  return (
    <Link
      to={`/profile/${user.auth_id}`}
      className={className}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}

export default UserProfileLink
