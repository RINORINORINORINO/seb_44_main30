import { Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { setToast } from '../store/toastState';
import { useDispatch } from 'react-redux';

export default function withAuth(WrappedComponent) {
    return function WithAuthComponent(props) {
        const dispatch = useDispatch();
        const [cookies] = useCookies(['AuthorizationToken']);
        const memberId = localStorage.getItem('memberid');

        if (!cookies.AuthorizationToken || !memberId) {
            dispatch(setToast('로그인이 필요합니다'));
            return <Navigate to="/login" />;
        }

        return <WrappedComponent {...props} />;
    };
}
