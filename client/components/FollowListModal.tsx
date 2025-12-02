import React, { useEffect, useRef } from 'react'
// import { Link } from 'react-router'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { User } from '../../models/user'
import UserProfileLink from './common/UserProfileLink'
import { Image } from 'cloudinary-react'
interface FollowListModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  users: User[]
}

const FollowListModal: React.FC<FollowListModalProps> = ({
  isOpen,
  onClose,
  title,
  users,
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg"
      >
        {/* Modal Header */}
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <h3
            id="modal-title"
            className="flex items-center space-x-2 text-xl font-semibold"
          >
            {title === 'Followers' && (
              <i className="bi bi-people text-2xl" aria-hidden="true"></i>
            )}
            {title === 'Following' && (
              <i className="bi bi-person-check text-2xl" aria-hidden="true"></i>
            )}
            <span className="sr-only">{title}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
            aria-label="Close modal"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* User List */}
        <div className="max-h-64 overflow-y-auto">
          {users.length > 0 ? (
            users.map((user) => (
              <UserProfileLink
                key={user.auth_id}
                user={user}
                onClick={onClose}
                className="flex items-center space-x-4 border-b py-2 last:border-b-0 hover:bg-gray-50"
              >
                <div className="flex h-16 w-16 items-center justify-center space-x-4 overflow-hidden rounded-full bg-gray-900 p-1 shadow-md">
                  <Image
                    className="rounded-full"
                    cloudName="dfjgv0mp6"
                    publicId={user.profile_picture}
                    alt={user.name + "'s profile"}
                    width="300"
                    height="300"
                    crop="fill"
                  />
                </div>
                <p className="font-medium text-gray-900">{user.name}</p>
              </UserProfileLink>
            ))
          ) : (
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <i className="bi bi-person-x text-2xl"></i>
              <span className="sr-only">No users to display.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FollowListModal
