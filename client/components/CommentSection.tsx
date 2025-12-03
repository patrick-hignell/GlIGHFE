import Comment from './Comment'
import { CommentData, CommentWithAuthor } from '../../models/comment'
import { useComments } from '../hooks/useComments'
import * as Collapsible from '@radix-ui/react-collapsible'
import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { addComment } from '../apis/comments'
import EmojiPicker, {
  Categories,
  EmojiClickData,
  EmojiStyle,
} from 'emoji-picker-react'
import GraphemeSplitter from 'grapheme-splitter'

interface Props {
  postId: number
}
export function CommentSection({ postId }: Props) {
  const queryClient = useQueryClient()
  const { data: comments, isPending, isError } = useComments(postId)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const { user, isAuthenticated } = useAuth0()
  const splitter = new GraphemeSplitter()
  const charLimit = 30
  const [showPicker, setShowPicker] = useState(false)
  const authId = user?.sub
  const [formData, setFormData] = useState({
    font: '',
    userId: '',
    message: '',
    image: '',
    postId: 0,
  })
  // const {
  //   data: userData,
  //   isPending: userLoading,
  //   isError: userError,
  // } = useQuery({
  //   queryKey: ['user', authId],
  //   queryFn: () => getUserById(authId),
  //   enabled: isAuthenticated && !!authId,
  // })

  useEffect(() => {
    if (user && authId) {
      setFormData({
        userId: authId,
        message: formData.message,
        image: formData.image,
        postId: postId,
        font: formData.font,
      })
    }
  }, [authId, postId, user])

  const addCommentMutation = useMutation({
    mutationFn: (newComment: CommentData) => addComment(newComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      setFormData({ ...formData, message: '' })
      setCommentsOpen(true)
    },
  })

  // if (userLoading) {
  //   return <p>Loading user data...</p>
  // }
  // if (userError) {
  //   return <p>Error loading user data.</p>
  // }

  if (isPending) {
    return <p>Loading comments...</p>
  }
  if (isError) {
    return <p className="font-sans">Error loading comments.</p>
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, message: e.target.value })
  }

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    setFormData((previousData) =>
      splitter.countGraphemes(
        String(previousData.message + emojiObject.emoji),
      ) <= charLimit
        ? {
            ...previousData,
            message: previousData.message + emojiObject.emoji,
          }
        : previousData,
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (authId && formData.message.length > 0) {
      const newComment: CommentData = {
        postId: postId,
        userId: authId,
        message: formData.message,
        image: formData.image,
        font: formData.font,
      }

      try {
        await addCommentMutation.mutateAsync(newComment)
      } catch (error) {
        console.error('Failed to add comment:', error)
      }
    }
  }

  return (
    <div className="w-full">
      <div className=" rounded-lg border-2 border-[#9dc574b8] bg-white p-2">
        <Collapsible.Root open={commentsOpen} onOpenChange={setCommentsOpen}>
          <Collapsible.CollapsibleTrigger asChild>
            <button>
              <i className="bi bi-chat-left-dots-fill relative top-0.5  text-2xl"></i>
            </button>
          </Collapsible.CollapsibleTrigger>
          <Collapsible.Content>
            {comments.map((comment: CommentWithAuthor) => (
              <Comment key={comment.id} commentData={comment} />
            ))}
            <div className="mb-5 mt-2">
              {isAuthenticated && (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4 mt-6 flex flex-row">
                    <input
                      type="text"
                      className=" w-full rounded-lg border border-[#c7ef9f] p-2 focus:outline-[#97d558]"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder=""
                      maxLength={charLimit}
                    ></input>
                    <button
                      className="pl-4 text-2xl"
                      type="button"
                      onClick={() => setShowPicker((val) => !val)}
                    >
                      😀
                    </button>
                    <button type="submit">
                      <i className="bi bi-send ml-2 mr-2 text-xl"></i>
                    </button>
                  </div>
                </form>
              )}
              {showPicker && (
                <EmojiPicker
                  categories={[
                    { category: 'suggested' as Categories, name: '' },
                    { category: 'smileys_people' as Categories, name: '' },
                    { category: 'animals_nature' as Categories, name: '' },
                    { category: 'food_drink' as Categories, name: '' },
                    { category: 'travel_places' as Categories, name: '' },
                    { category: 'activities' as Categories, name: '' },
                    { category: 'objects' as Categories, name: '' },
                    { category: 'symbols' as Categories, name: '' },
                    { category: 'flags' as Categories, name: '' },
                  ]}
                  previewConfig={{
                    defaultEmoji: '1f60a',
                    defaultCaption: '',
                    showPreview: false,
                  }}
                  className=""
                  width="full"
                  onEmojiClick={onEmojiClick}
                  emojiStyle={EmojiStyle.NATIVE}
                  searchPlaceHolder=""
                />
              )}
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>
    </div>
  )
}
