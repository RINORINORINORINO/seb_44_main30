import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Tag from './Tag';
import ViewsIcon from '../../../public/view.png';

import LikeIcon from '../../assets/heart (1).png';

import { savePosition } from '../../store/scroll.ts';
import { useDispatch } from 'react-redux';
import { usePostHeader } from '../../api/getHeader.ts';
import axios from 'axios';

export default function ContentsCard({ memberId, communityProps, clubProps, type }: any) {
    const {
        // memberId: communityMemberId,
        title: communityTitle,
        content: communityContent,
        view: communityView,
        // commentCount: communityCommentCount,
        nickname: communityNickname,
        profileImageUrl: communitProfileImageUrl,
        // member,
        tags: communityTags,
        // registeredAt,
        // modifiedAt,
        likeCount: communityLikeCount,
        boardStandardId,
    } = communityProps || {};

    const {
        title: clubTitle,
        content: clubContent,
        view: clubView,
        // commentCount: clubCommentCount,
        nickname: clubNickname,
        profileImageUrl: clubProfileImageUrl,
        boardClubId,
        tags,
        dueDate,
        boardClubStatus,
        likeCount: clubLikeCount, //[게시글에 대한 좋아요 갯수]
    } = clubProps || {};

    console.log(communityProps);
    console.log(clubProps);
    const headers = usePostHeader();
    const [clubStatus, setClubStatus] = useState(boardClubStatus);
    useEffect(() => {
        const now = new Date();
        now.setDate(now.getDate() - 1);
        const due = new Date(dueDate);

        if (now > due && clubStatus !== 'BOARD_CLUB_CANCEL') {
            setClubStatus('BOARD_CLUB_COMPLETED');
        }
    }, [dueDate, clubStatus]);
    const isCompleted = boardClubStatus === 'BOARD_CLUB_COMPLETED' || clubStatus === 'BOARD_CLUB_COMPLETED';

    const dispatch = useDispatch();
    const loginId = 1; //useSelector 사용
    const [likeCount, setLikeCount] = useState(boardClubId ? clubLikeCount : communityLikeCount);
    const navigate = useNavigate();
    //props 변경될 때 상태 최신화 위함
    useEffect(() => {
        setLikeCount(boardClubId ? clubLikeCount : communityLikeCount);
        // setIsLiked((memberLiked || clubMemberLiked).includes(loginId));
    }, [clubLikeCount, communityLikeCount, loginId]);

    const moveToDetail = () => {
        if (type === 'community') {
            dispatch(savePosition(window.scrollY));
            navigate(`/community/detail/${boardStandardId}`);
        } else if (type) {
            dispatch(savePosition(window.scrollY));
            navigate(`/club/detail/${boardClubId}`);
        }
    };

    //좋아요  API 요청 추가 필요
    const handleLike = () => {
        const payload = {};
        const boardType = boardStandardId ? 'standards' : 'clubs';
        const boardId = boardStandardId || boardClubId;

        axios
            .post(`${import.meta.env.VITE_KEY}/${boardType}/${boardId}/likes`, payload, headers)
            .then((res) => {
                console.log(res.data.data);
                if (res.data.data === '좋아요 취소 완료') {
                    alert('좋아요 취소 하였습니다!');
                    setLikeCount((prev) => prev - 1);
                }
                if (res.data.data === '좋아요 처리 완료') {
                    alert('게시글을 좋아요 하였습니다!');
                    setLikeCount((prev) => prev + 1);
                }
            })
            .catch((error) => {
                if (error.message === 'Request failed with status code 500') {
                    alert('로그인이 필요합니다');
                }
            });
    };

    const handleNavigateProfile = useCallback(() => {
        navigate(`/mypage`, { state: memberId });
    }, [memberId]);

    return (
        <CardWarp isCompleted={isCompleted}>
            <TitleContentsTagWarp>
                <TitleContainer onClick={moveToDetail}>
                    <h3>{communityProps ? communityTitle : clubTitle}</h3>
                </TitleContainer>
                <ContentsContainer onClick={moveToDetail}>
                    <p dangerouslySetInnerHTML={{ __html: communityProps ? communityContent : clubContent }} />
                </ContentsContainer>
                <TagContainer>
                    {communityProps &&
                        communityTags.map((tag: { tagName: string }) => (
                            <Tag key={tag.tagName} tag={tag.tagName} className="tag-component" />
                        ))}
                    {clubProps &&
                        tags.map((tag: { tagName: string }) => (
                            <Tag key={tag.tagName} tag={tag.tagName} className="tag-component" />
                        ))}
                </TagContainer>
            </TitleContentsTagWarp>
            <InfoContainer>
                <UserInfo>
                    <img
                        src={`https://splashzone-upload.s3.ap-northeast-2.amazonaws.com/${
                            communitProfileImageUrl || clubProfileImageUrl
                        }`}
                        className="user-icon"
                    />
                    <span onClick={handleNavigateProfile}>{clubNickname || communityNickname}</span>
                </UserInfo>
                <ContentsInfo>
                    <>
                        <img src={LikeIcon} onClick={handleLike} />
                        <small>{likeCount}</small>
                    </>
                    <img src={ViewsIcon} />
                    <small>{communityProps ? communityView : clubView}</small>
                    {/* <img src={MessageIcon} />
                    <small>{communityProps ? communityCommentCount || 0 : clubCommentCount || 0}</small> */}
                </ContentsInfo>
            </InfoContainer>
        </CardWarp>
    );
}

const CardWarp = styled.div<{ isCompleted: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border-radius: 2rem;
    width: 360px;
    height: 270px;
    margin: 2rem;
    padding: 1.7rem;
    transition: 0.3s;
    border: ${(props) => (props.isCompleted ? '2px solid rgba(0,0,0,0.5)' : '1px solid rgba(56, 132, 213, 1);')};
    box-shadow: ${(props) =>
        props.isCompleted ? '0px 0px 10px 5px rgba(0,0,0,0.2)' : '0 0 10px rgba(117, 117, 117, 0.3)'};
    opacity: ${(props) => (props.isCompleted ? 0.2 : 1)};

    &:hover {
        border: 3px solid rgba(226, 240, 254, 0.8);
        background-color: rgba(56, 132, 213, 1);
        transform: scale(1.2);
        box-shadow: 0 5px 15px #bccbf9;
        color: #ffffff;

        *:not(.user-icon) {
            color: #ffffff;
        }
        .tag-component {
            border-color: #ffffff;
        }
        img.user-icon {
            filter: none;
        }
        img:not(.user-icon) {
            filter: invert(1);
        }
    }
`;

const TitleContentsTagWarp = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    flex-basis: 80%;
    justify-content: space-between;
`;

const TitleContainer = styled.div`
    font-size: 1.3rem;
    font-family: 'KimjungchulGothic-Bold';
    margin-bottom: 0.5rem;
    > h3 {
        max-width: 300px;
        align-self: flex-start;
        margin: 0;
        font-size: 20px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        &:hover {
            color: #c1daf5;
            cursor: pointer;
        }
    }
`;
const ContentsContainer = styled.div`
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    width: 300px;
    height: 77px;

    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
        color: #c1daf5;
        cursor: pointer;
    }
    > p {
        display: flex;
        align-items: center;
        word-wrap: break-word;
    }
`;

const TagContainer = styled.div`
    display: flex;
    margin-top: 20px;
`;

const InfoContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #696969;
    width: 105%;
    margin-top: 7px;
    padding: 4px 2px 0 2px;
    ${CardWarp}:hover & {
        border-top: 1px solid #ffffff;
    }
    flex-basis: 20%;
`;

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    padding-top: 10px;
    > img {
        width: 20px;
        height: 20px;
    }
    > span {
        width: 130px;
        margin-left: 10px;
        font-weight: 500;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        &:hover {
            cursor: pointer;
        }
    }
`;

const ContentsInfo = styled.div`
    display: flex;
    align-items: center;
    padding-top: 10px;
    margin: 0 10px 0 10px;
    > img {
        width: 20px;
        height: 20px;
        margin-left: 15px;
        filter: opacity(0.4) drop-shadow(0 0 0 #565656);
    }
    > small {
        margin-left: 3px;
        font-weight: 500;
    }
`;
