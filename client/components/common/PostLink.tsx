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


  return (
    <Link to={`/post/${id}`} onClick={onClick}>
      {children}
    </Link>
  )
}

export default PostLink
