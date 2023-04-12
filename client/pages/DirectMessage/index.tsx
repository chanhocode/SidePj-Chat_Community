import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Container, Header } from './styles';
import BlankProfile from '../../utils/img/blankProfileImg.png';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { IDM, IUser } from '@typings/db';
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

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR('/api/users', fetcher);

  const scrollbarRef = useRef<Scrollbars>(null); // 스크롤바 컨트롤

  // 인피니티 스크롤
  const [chat, onChangeChat, setChat] = useInput('');
  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite<IDM[]>(
    (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  );

  // 소켓 연결
  const [socket] = useSocket(workspace);

  const onMessage = useCallback((data: IDM) => {
    if (data.SenderId === Number(id) && myData.id !== Number(id)) {
      mutateChat((chatData) => {
        // 가장 최신 배열에 가장 최신으로 데이터 넣기
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
  }, []);

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
      if (chat?.trim() && chatData) {
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            SenderId: myData.id,
            Sender: myData,
            ReceiverId: userData.id,
            Receiver: userData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          setChat('');
          // 채팅 전송시 스크롤 가장 아래로 위치
          scrollbarRef.current?.scrollToBottom();
        });
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .catch((error) => console.dir(error));
      }
    },
    [chat, chatData, mutateChat, workspace, id, myData, userData, setChat],
  );

  // 불변성 유지
  const chatSections = makeSection(chatData ? ([] as IDM[]).concat(...chatData).reverse() : []);

  useEffect(() => {
    socket?.on('dm', onMessage);
    return () => {
      socket?.off('dm', onMessage);
    };
  }, [socket, onMessage]);

  // 스크롤 조절: 로딩시 스크롤바 제일 아래로 시작
  useEffect(() => {
    if (chatData?.length === 1) {
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData]);

  if (!userData || !myData) {
    return null;
  }
  return (
    <Container>
      <Header>
        <img src={BlankProfile} alt={userData.nickname} width="20px" />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList chatSections={chatSections} ref={scrollbarRef} setSize={setSize} isReachingEnd={isReachingEnd} />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} placeholder="" />
    </Container>
  );
};

export default DirectMessage;
