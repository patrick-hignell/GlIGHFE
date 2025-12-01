import { useAuth0 } from '@auth0/auth0-react'
import { createUser, getUserById } from '../apis/users'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { IfAuthenticated, IfNotAuthenticated } from './Authenticated'
import { UserData } from '../../models/user'
import Loading from './Loading'
// import { PhotoUploader } from './PhotoUploader'

function LoginPage() {
  const emptyFormState = {
    authId: '',
    name: '',
    bio: '',
    font: '',
    profilePicture: '',
  } as UserData
  const queryClient = useQueryClient()
  const { loginWithRedirect, isAuthenticated, user } = useAuth0()
  const navigate = useNavigate()
  const [formState, setFormState] = useState<UserData>(emptyFormState)
  // const [imageId, setImageId] = useState('')
  const authId = user?.sub ?? ''
  const createMutation = useMutation({
    mutationFn: (user: UserData) => createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', authId] })
    },
  })

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user', authId],
    queryFn: () => getUserById(authId),
    enabled: isAuthenticated && !!authId,
  })

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      authId,
    }))
  }, [authId])

  useEffect(() => {
    if (isAuthenticated && userData) {
      navigate('/feed')
    }
  }, [userData, isAuthenticated, navigate])

  const handleLogin = async () => {
    const redirectUri = `${window.location.origin}`
    await loginWithRedirect({
      authorizationParams: { redirect_uri: redirectUri, prompt: 'login' },
    })
  }

  const handleChange = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = evt.target
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // function handleImageChange(newImage: string) {
  //   setImageId(newImage)
  //   console.log(newImage)
  //   console.log(imageId)
  // }

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault()
    try {
      await createMutation.mutateAsync(formState)
      navigate('/onboarding')
    } catch (error) {
      console.error('Failed to Update Profile:', error)
    }
  }

  // if (isLoading) {
  //   return <Loading />
  // }

  // if (isError) {
  //   return <div>Error loading user data</div>
  // }

  return (
    <div className="flex flex-col items-center">
      <IfNotAuthenticated>
        <button onClick={handleLogin}>
          <img src="../../images/loginButton96.png" alt="Login Logo" />
        </button>
      </IfNotAuthenticated>
      <IfAuthenticated>
        <p className="mt-5">Create Account</p>
        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="text-heading mb-2.5 mt-4 block text-sm font-medium"
            >
              Name:
              <input
                type="text"
                id="name"
                name="name"
                placeholder="User Name"
                className="bg-neutral-secondary-medium border-default-medium text-heading rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body block w-full rounded-lg border border-black px-3 py-2.5 text-sm"
                value={formState.name}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label
              htmlFor="bio"
              className="text-heading mb-2.5 block text-sm font-medium"
            >
              Bio:
              <textarea
                name="bio"
                id="bio"
                placeholder="Bio"
                rows={2}
                className="overflow-wrap break-word bg-neutral-secondary-medium border-default-medium text-heading rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body block w-full resize-none overflow-hidden rounded-lg border border-black px-3 py-2.5 text-sm"
                value={formState.bio}
                onChange={handleChange}
                onInput={(e) => {
                  e.currentTarget.style.height = 'auto'
                  e.currentTarget.style.height =
                    e.currentTarget.scrollHeight + 'px'
                }}
              ></textarea>
            </label>
            {/* <label
              htmlFor="Profile Picture"
              className="text-heading mb-2.5 block text-sm font-medium"
            >
              Profile Picture:
            <div>
              <PhotoUploader
                image={imageId}
                onImageChange={handleImageChange}
              />
            </div>
            </label> */}
          </div>
          <button
            type="submit"
            className="hover:bg-success-strong focus:ring-success-medium shadow-xs ml-7 box-border rounded-full border border-transparent bg-lime-300 px-4 py-2.5 text-sm font-medium leading-5 focus:outline-none focus:ring-4"
          >
            Create Profile
          </button>
        </form>
      </IfAuthenticated>
      <IfNotAuthenticated>
        <p>Please log in to create a profile and explore!</p>
      </IfNotAuthenticated>
    </div>
  )
}

export default LoginPage
