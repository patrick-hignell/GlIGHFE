import { createRoutesFromElements, Route } from 'react-router'
import Layout from './components/Layout.tsx'
import App from './components/App.tsx'
import MainFeed from './components/MainFeed.tsx'
import ProfilePage from './components/ProfilePage.tsx'
import Upload from './components/Upload.tsx'

export default createRoutesFromElements(
  // Layout component parent for all pages
  <Route path="/" element={<Layout />}>
    {/* The App component shows on the homepage ('/') */}
    <Route index element={<App />} />

    {/* These are the pages for your navbar links */}
    <Route path="feed" element={<MainFeed />} />
    <Route path="profile" element={<ProfilePage />} />
    <Route path="upload" element={<Upload />} />
  </Route>,
)
