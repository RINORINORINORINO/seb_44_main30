import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import backgroundImg from '../assets/Community_background.png';
import DetailCommentSection from '../components/DetailCommentSection.tsx';
import DetailContentSection from '../components/DetailContentSection.tsx';
import { Loading } from '../components/Lodaing.tsx';
import { useQuery } from '@tanstack/react-query';
import { getDetailCommunityPost } from '../api/CommunityApi/CommunityApi.ts';
import { RouteParams } from '../types/CommunityTypes.ts';
import moment from 'moment';
import axios from 'axios';
import { usePostHeader } from '../api/getHeader.ts';
type BackgroundStyledProps = {
    $image: string;
};

const CommunityDetail = () => {
    const { boardStandardId } = useParams<RouteParams>();
    const headers = usePostHeader();
    const [likeCount, setLikeCount] = useState(0);
    if (!boardStandardId) {
        throw new Error('해당 게시글에 대한 ID가 존재하지 않습니다.');
    }

    const navigate = useNavigate();

    const {
        isLoading,
        error: errorData,
        data,
    } = useQuery(
        ['communityDetail', boardStandardId],
        () => {
            console.log(`게시글ID:${boardStandardId}데이터를 가져옵니다.`);
            return getDetailCommunityPost(boardStandardId);
        },
        {
            staleTime: 10000, // 10초
        },
    );
    const detailCommunityData = data || undefined;
    console.log(detailCommunityData);
    useEffect(() => {
        if (detailCommunityData?.likeCount !== undefined) {
            setLikeCount(detailCommunityData.likeCount);
        }
    }, [detailCommunityData]);
    // 좋아요 요청
    const handleLike = () => {
        const payload = {};
        axios
            .post(`${import.meta.env.VITE_KEY}/standards/${boardStandardId}/likes`, payload, headers)
            .then((res) => {
                console.log(res.data.data)
                if (res.data.data === '좋아요 취소 완료') {
                    alert('좋아요 취소 하였습니다!');
                    setLikeCount((prev)=>prev-1);
                }
                if (res.data.data === '좋아요 처리 완료') {
                    alert('게시글을 좋아요 하였습니다!');
                    setLikeCount((prev)=>prev+1);
                }
            })
            .catch((error) => {
                if (error.message === 'Request failed with status code 500') {
                    alert('로그인이 필요합니다');
                }
            });
    };

    const hanldeNavigatePrev = () => {
        navigate(-1);
    };



    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (isLoading) {
        return <Loading />;
    }

    if (errorData) {
        console.log(errorData);
        return <div>게시글을 불러올 수 없습니다.</div>;
    }
    return (
        <Background $image={backgroundImg}>
            <PostContainer>
                <TitleSection>
                    <button onClick={hanldeNavigatePrev}>목록</button>
                    <h1>{detailCommunityData?.title}</h1>
                    <div>
                        <div>
                            <h3>관련태그: </h3>
                            <span className="tag">{detailCommunityData.tags[0].tagName}</span>
                        </div>
                        <div>
                            <span className="date">{moment(detailCommunityData?.createdAt).format('YYYY-MM-DD')}</span>
                            <img
                                src={`https://splashzone-upload.s3.ap-northeast-2.amazonaws.com/${detailCommunityData?.profileImageUrl}`}
                            />
                            <span className="name">
                                {detailCommunityData?.nickname}
                            </span>
                        </div>
                    </div>
                </TitleSection>
                <DetailContentSection
                    title={detailCommunityData?.title}
                    commentCount={detailCommunityData?.commentCount}
                    view={detailCommunityData?.view}
                    content={detailCommunityData?.content}
                    handleLike={handleLike}
                    isLiked={detailCommunityData?.isLiked}
                    likeCount={likeCount}
                    memberId={detailCommunityData?.memberId}
                    boardStandardId={detailCommunityData?.boardStandardId}
                    tag={detailCommunityData?.tags[0].tagName}
                />
                <DetailCommentSection boardStandardClubId={Number(boardStandardId)} />
            </PostContainer>
        </Background>
    );
};

export default CommunityDetail;

const Background = styled.div<BackgroundStyledProps>`
    background-image: url(${(props) => props.$image});
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;
const PostContainer = styled.div`
    width: 1200px;
    border-radius: 15px;
    border: none;
    box-sizing: border-box;
    background: #fff;
    margin: 60px 0 60px 0;
    padding: 80px 120px 80px 120px;
    box-shadow: 0px 4px 15px 0px rgba(0, 0, 0, 0.25);
`;
const TitleSection = styled.section`
    > button {
        font-weight: 600;
        color: #696969;
        background: none;
        border: none;
        cursor: pointer;
        &:hover {
            color: #3884d5;
        }
    }
    > h1 {
        font-size: 35px;
    }
    img {
        width: 17px;
        height: 17px;
        border-radius: 3px;
        margin: 0 2px 0 20px;
    }
    > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        > span {
            font-size: 20px;
            font-weight: 600;
        }
        > div {
            display: flex;
            align-items: center;
            > span.date {
                color: #696969;
                font-size: 14px;
            }
            > span.tag {
                font-size: 12px;
                background-color: #3884d5;
                color: #ffffff;
                padding: 5px 8px 5px 8px;
                border-radius: 20px;
                list-style: none;
                white-space: nowrap;
                margin: 0px 0px 0px 5px;
                font-size: 15px;
            }
            > span.name {
                font-weight: 600;
            }
        }
    }
    border-bottom: 1px solid #d9d9d9;
`;
