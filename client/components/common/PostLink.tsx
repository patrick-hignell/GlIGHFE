import { Link } from 'react-router'

interface PostLinkProps {
  children: React.ReactNode
  id: number
  onClick?: () => void
}

export const PostLink: React.FC<UserProfileLinkProps> = ({
  children,
  onClick,
  id,
}) => {
  // If there's no auth_id, just render the children without a link

  return (
    <Link to={`/post/${id}`} onClick={onClick}>
      {children}
    </Link>
  )
}

export default PostLink
