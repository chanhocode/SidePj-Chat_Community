import fetcher from '@utils/fetcher';
import React, { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import { useParams } from 'react-router';
import { CollapseButton } from './styles';
import { IUser, IUserWithOnline } from '@typings/db';
import EachDM from '@components/EachDM';
import useSocket from '@hooks/useSocket';

const DMList = () => {
  const { workspace } = useParams<{ workspace?: string }>();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000,
  });
  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher,
  );

  const [socket] = useSocket(workspace);
  const [channelCollapse, setChannelColllapse] = useState(false); // 멤버 목록 열고 닫기
  const [onlineList, setOnlineList] = useState<number[]>([]);

  const toggleChannelCollapse = useCallback(() => {
    setChannelColllapse((prev) => !prev);
  }, []);

  useEffect(() => {
    console.log('workspace 변경: ', workspace);
    setOnlineList([]);
  }, [workspace]);

  useEffect(() => {
    socket?.on('onlineList', (data: number[]) => {
      setOnlineList(data);
    });
    return () => {
      socket?.off('onlineList'); // 정리 _ 연결 끊기
    };
  }, [socket]);

  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Direct Messages</span>
      </h2>
      <div>
        {!channelCollapse &&
          memberData?.map((member) => {
            const isOnline = onlineList.includes(member.id);
            return <EachDM key={member.id} member={member} isOnline={isOnline} />;
          })}
      </div>
    </>
  );
};

export default DMList;
