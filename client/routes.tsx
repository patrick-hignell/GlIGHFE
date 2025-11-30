import { createRoutesFromElements, Route } from 'react-router'
import Layout from './components/Layout.tsx'
import MainFeed from './components/MainFeed.tsx'
import ProfilePage from './components/ProfilePage.tsx'
import UploadPage from './components/Upload.tsx'
import LoginPage from './components/LoginPage.tsx'
import Onboarding from './components/Onboarding.tsx'

export default createRoutesFromElements(
  // Layout component parent for all pages
  <Route path="/" element={<Layout />}>
    {/* The App component shows on the homepage ('/') */}
    <Route index element={<LoginPage />} />

    {/* These are the pages for your navbar links */}
    <Route path="onboarding" element={<Onboarding />} />
    <Route path="feed" element={<MainFeed />} />
    {/* <Route path="profile" element={<ProfilePage />} />  ---- old code before <feature/profile-page> branch*/}
    <Route path="profile/:authId" element={<ProfilePage />} />
    <Route path="upload" element={<UploadPage />} />
  </Route>,
)
