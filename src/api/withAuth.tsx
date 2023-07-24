import { Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

export default function withAuth(WrappedComponent) {
    return function WithAuthComponent(props) {
        const [cookies] = useCookies(['AuthorizationToken']);
        const memberId = localStorage.getItem('memberid');

        if (!cookies.AuthorizationToken || !memberId) {
            return <Navigate to="/login" />;
        }

        return <WrappedComponent {...props} />;
    };
}
