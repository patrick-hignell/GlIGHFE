import { createRoutesFromElements, Route } from 'react-router'
import Layout from './components/Layout.tsx'
import MainFeed from './components/MainFeed.tsx'
import ProfilePage from './components/ProfilePage.tsx'
import UploadPage from './components/Upload.tsx'
import LoginPage from './components/LoginPage.tsx'
import Onboarding from './components/Onboarding.tsx'
import IndividualPostPage from './components/IndividualPostPage.tsx'

export default createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route index element={<LoginPage />} />

    <Route path="onboarding" element={<Onboarding />} />
    <Route path="feed" element={<MainFeed />} />
    {/* <Route path="profile" element={<ProfilePage />} />  ---- old code before <feature/profile-page> branch*/}
    <Route path="profile/:authId" element={<ProfilePage />} />
    <Route path="post/:id" element={<IndividualPostPage />} />
    <Route path="upload" element={<UploadPage />} />
  </Route>,
)
