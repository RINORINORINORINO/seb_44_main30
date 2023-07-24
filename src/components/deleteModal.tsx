import styled from 'styled-components';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const DeleteModal = ({ setDeletModal }: any) => {
    const [cookies] = useCookies(['AuthorizationToken', 'RefreshToken']);
    const authorizationToken = cookies.AuthorizationToken;
    const refreshToken = cookies.RefreshToken;
    const navigate = useNavigate();
    const memberdeletehandler = () => {
        const API_URL = import.meta.env.VITE_KEY;
        axios
            .delete(`${API_URL}/members/${localStorage.memberid}`, {
                headers: {
                    Authorization: `${decodeURIComponent(authorizationToken)}`,
                    Refresh: `${refreshToken}`,
                    withCredentials: true,
                },
            })
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.error('Error deleting item:', error);
            });
    };

    return (
        <StyledWrapper>
            <div className="modal-background">
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                    <p>정말삭제하시겠습니까?</p>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <StyledButton type="button" onClick={memberdeletehandler}>
                            확인
                        </StyledButton>
                        <StyledButton onClick={() => setDeletModal(false)}>취소</StyledButton>
                    </div>
                </div>
            </div>
        </StyledWrapper>
    );
};

export default DeleteModal;

const StyledWrapper = styled.div`
    border: 1px solid black;
    padding: 10px;
    text-align: center;
    .modal-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(10px);
        background-color: rgba(66, 65, 65, 0.2);
        z-index: 9999;
    }

    .modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 400px;
        height: 150px;
        background-color: #ffffff;
        padding: 10px;
        border-radius: 10px;
    }
`;

const StyledButton = styled.button`
    width: 70px;
    height: 40px;
    border-radius: 15px;
    margin-top: 10px;
    background-color: ${(props) => (props.type === 'button' ? '#3884d5' : '#ffcccc')};
    color: white;
    cursor: pointer;
`;
