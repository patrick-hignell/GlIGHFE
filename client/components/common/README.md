# `UserProfileLink` Component

A reusable React component for creating consistent, clickable links to user profile pages throughout the application.

## Purpose

This component abstracts the logic for navigating to a user's profile (`/profile/:authId`), ensuring that all user links behave consistently and are easy to implement.

## Location

`client/components/common/UserProfileLink.tsx`

## How to Use

1. **Import the component:**
```
import UserProfileLink from '../../components/common/UserProfileLink';
// Adjust the path based on your file's location
```

2. **Wrap your elements:**
Wrap the user's avatar, name, or any other UI element you want to make clickable with the `<UserProfileLink>` component.

3. **Pass the `user` prop:**
The component requires a `user` object containing at least the `auth_id` property.

4. **Optional props:**
   * `className`: Apply Tailwind CSS classes or other styles directly to the `Link` element.
   * `onClick`: Provide a function to execute when the link is clicked (e.g., to close a modal).

### Example Usage:
```jsx
// Example from a Post or Comment component

// Assuming 'post' or 'comment' object has a 'user' property like:
// { auth_id: 'google-oauth2|...', name: 'John Doe', profile_picture: 'avatar.jpg' }

<UserProfileLink user={post.user} className="flex items-center space-x-2 p-1 rounded hover:bg-gray-100">
  <img
    src={post.user.profile_picture || '/images/placeholder-avatar.png'}
    alt={`${post.user.name}'s avatar`}
    className="h-8 w-8 rounded-full object-cover"
  />
  <span className="font-bold text-blue-600">{post.user.name}</span>
</UserProfileLink>

// If user.auth_id is not available, only the children will be rendered (without a link).
```