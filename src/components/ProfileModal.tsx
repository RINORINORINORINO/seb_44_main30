import { useState } from 'react';
import styled from 'styled-components';
import { useCookies } from 'react-cookie';
import axios from 'axios';

interface ProfileModalProps {
    profileurl: any;
    setProfile: any;
}

const ProfileModal = ({ profileurl, setProfile }: ProfileModalProps) => {
    const [cookies] = useCookies(['AuthorizationToken', 'RefreshToken']);
    const authorizationToken = cookies.AuthorizationToken;
    const refreshToken = cookies.RefreshToken;
    const API_URL = import.meta.env.VITE_KEY;
    const [upimage, setUpimage] = useState<string | null>(null);
    const [uploadimage, setUploadImage] = useState<File | null>(null);
    const FileonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadImage(file);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setUpimage(reader.result);
                } else {
                    console.error('Failed to read the file as a data URL.');
                }
            };
        }
    };

    const Filesubmit = async () => {
        if (!uploadimage) {
            alert('이미지 파일을 선택해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('multipartFile', uploadimage);

        try {
            const response = await axios.patch(`${API_URL}/members/image/${localStorage.memberid}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `${decodeURIComponent(authorizationToken)}`,
                    Refresh: `${refreshToken}`,
                    withCredentials: true,
                },
            });
            console.log('수정됨', response.data);
            location.reload();
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <StyledModal>
            <div className="modal-background">
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                    <h1>이미지 수정하기!</h1>
                    <img src={upimage ? upimage : profileurl} style={{ width: '500px', height: '400px' }}></img>
                    <FileInputContainer>
                        <FileInputLabel htmlFor="file">프로필 이미지 선택</FileInputLabel>
                        <FileInput id="file" type="file" name="file" onChange={FileonChange} />
                    </FileInputContainer>
                    <div style={{ display: 'flex', gap: '20px', position: 'relative', top: '100px', left: '130px' }}>
                        <StyledButton type="button" onClick={Filesubmit}>
                            프로필 이미지 저장
                        </StyledButton>
                        <StyledButton
                            type="button"
                            onClick={() => {
                                setProfile(false);
                            }}
                        >
                            취소하기
                        </StyledButton>
                    </div>
                </div>
            </div>
        </StyledModal>
    );
};

export default ProfileModal;

const StyledModal = styled.div`
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
        width: 600px;
        height: 700px;
        background-color: #ffffff;
        padding: 10px;
        border-radius: 5px;
    }
`;

const FileInputContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`;

const FileInput = styled.input`
    display: none;
`;

const FileInputLabel = styled.label`
    cursor: pointer;
    padding: 10px 20px;
    background-color: #309140;
    border-radius: 5px;
    font-weight: bold;
    color: white;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #ddd;
    }
`;

const StyledButton = styled.button`
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #45a049;
    }
`;
