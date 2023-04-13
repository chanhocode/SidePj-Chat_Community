import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Container, Header } from './styles';
import BlankProfile from '../../utils/img/blankProfileImg.png';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { IChannel, IChat, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import axios from 'axios';
import makeSection from '@utils/makeSection';
import { Scrollbars } from 'react-custom-scrollbars';
import { Socket } from 'socket.io-client';
import useSocket from '@hooks/useSocket';
import InviteChannelModal from '@components/InviteChannelModal';

const Channel = () => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const { data: myData } = useSWR('/api/users', fetcher);
  const { data: channelData } = useSWR<IChannel>(`/api/workspaces/${workspace}/channels/${channel}`, fetcher);

  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);

  const scrollbarRef = useRef<Scrollbars>(null); // 스크롤바 컨트롤

  // 인피니티 스크롤
  const [chat, onChangeChat, setChat] = useInput('');
  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite<IChat[]>(
    (index) => `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  );
  const { data: channelMemberData } = useSWR<IUser[]>(
    myData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  );

  // 소켓 연결
  const [socket] = useSocket(workspace);

  const onMessage = useCallback(
    (data: IChat) => {
      if (data.Channel.name === channel && data.UserId !== myData?.id) {
        mutateChat((chatData) => {
          chatData?.[0].unshift(data);
          return chatData;
        }, false).then(() => {
          // 내가 150픽셀 이상 스크롤이 올라가 있는 상태이면 상대방이 채팅을 보냈을 때 스크롤 바가 내려 가지 않게 한다.
          if (scrollbarRef.current) {
            if (
              scrollbarRef.current.getScrollHeight() <
              scrollbarRef.current.getScrollHeight() + scrollbarRef.current.getScrollTop() + 150
            ) {
              setTimeout(() => {
                scrollbarRef.current?.scrollToBottom();
              }, 60);
            }
          }
        });
      }
    },
    [channel, mutateChat, myData],
  );

  /**
   * isEmpty: 데이터가 비어있는지 비어있으면 끝
   */
  const isEmpty = chatData?.[0].length === 0;
  /**
   * 데이터가 불러와야 하는 데이터 길이 보다 작다면 끝
   */
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      // Optimistic UI 적용 _ 서버에 요청을 보내기 전 화면 적용
      if (chat?.trim() && chatData && channelData) {
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            UserId: myData.id,
            User: myData,
            ChannelId: channelData.id,
            Channel: channelData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          setChat('');
          // 채팅 전송시 스크롤 가장 아래로 위치
          scrollbarRef.current?.scrollToBottom();
        });
        axios
          .post(`/api/workspaces/${workspace}/channels/${channel}/chats`, {
            content: chat,
          })
          .catch((error) => console.dir(error));
      }
    },
    [chat, chatData, mutateChat, workspace, myData, channelData, setChat, channel],
  );

  // 불변성 유지
  const chatSections = makeSection(chatData ? ([] as IChat[]).concat(...chatData).reverse() : []);

  useEffect(() => {
    socket?.on('message', onMessage);
    return () => {
      socket?.off('message', onMessage);
    };
  }, [socket, onMessage]);

  // 스크롤 조절: 로딩시 스크롤바 제일 아래로 시작
  useEffect(() => {
    if (chatData?.length === 1) {
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData]);

  const onClickInviteChannel = useCallback(() => {
    setShowInviteChannelModal(true);
  }, []);
  const onCloseModal = useCallback(() => {
    setShowInviteChannelModal(false);
  }, []);

  if (!myData || !myData) {
    return null;
  }
  return (
    <Container>
      <Header>
        <span>#{channel}</span>
        <div className="hader-right">
          <span>{channelMemberData?.length}</span>
          <button onClick={onClickInviteChannel}></button>
        </div>
      </Header>
      <ChatList chatSections={chatSections} ref={scrollbarRef} setSize={setSize} isReachingEnd={isReachingEnd} />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} placeholder="" />
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
    </Container>
  );
};

export default Channel;
