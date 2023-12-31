import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import loadable from '@loadable/component';
import { AnimatePresence } from 'framer-motion';
import withAuth from '../../api/withAuth';

const Main = loadable(() => import('../../pages/Main'));
const Signup = loadable(() => import('../../pages/Signup'));
const Login = loadable(() => import('../../pages/Login'));
const Community = loadable(() => import('../../pages/Community'));
const CommunityDetail = loadable(() => import('../../pages/CommunityDetail'));
const ClubDetail = loadable(() => import('../../pages/ClubDetail'));
const CommunityCreate = loadable(() => import('../../pages/CommunityCreate'));
const ClubCreate = loadable(() => import('../../pages/ClubCreate'));
const Club = loadable(() => import('../../pages/Club'));
const Mypage = loadable(() => import('../../pages/Mypage'));

const AuthenticatedCommunityCreate = withAuth(CommunityCreate);
const AuthenticatedClubCreate = withAuth(ClubCreate);
const AuthenticatedMypage = withAuth(Mypage);

export default function AnimateRoute() {
    const location = useLocation();

    return (
        <AnimatePresence>
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Main></Main>}></Route>
                <Route path="/signup" element={<Signup></Signup>}></Route>
                <Route path="/login" element={<Login></Login>}></Route>
                <Route path="/community/:tag/:keyword" element={<Community></Community>}></Route>
                <Route path="/community" element={<Navigate replace to="/community/전체/null" />} />
                <Route
                    path="/community/create"
                    element={<AuthenticatedCommunityCreate></AuthenticatedCommunityCreate>}
                ></Route>
                <Route path="/community/detail/:boardStandardId" element={<CommunityDetail></CommunityDetail>}></Route>
                <Route path="/club/detail/:boardClubId" element={<ClubDetail></ClubDetail>}></Route>
                <Route path="/club/:tag/:keyword?" element={<Club></Club>}></Route>
                <Route path="/club/create" element={<AuthenticatedClubCreate></AuthenticatedClubCreate>}></Route>
                <Route
                    path="/club/create/:boardClubId"
                    element={<AuthenticatedClubCreate></AuthenticatedClubCreate>}
                ></Route>
                <Route path="/mypage" element={<AuthenticatedMypage></AuthenticatedMypage>}></Route>
            </Routes>
        </AnimatePresence>
    );
}
