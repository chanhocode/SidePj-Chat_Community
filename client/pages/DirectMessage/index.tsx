import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Container, Header } from './styles';
import BlankProfile from '../../utils/img/blankProfileImg.png';
import useSWR from 'swr';
import { IDM, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import axios from 'axios';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR('/api/users', fetcher);

  const [chat, onChangeChat, setChat] = useInput('');
  const { data: ChatData, mutate: mutateChat } = useSWR<IDM[]>(
    `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    fetcher,
  );

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim()) {
        axios
          .post(`/api/workspace/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .then(() => {
            mutateChat();
            setChat('');
          })
          .catch((error) => console.dir(error));
      }
    },
    [chat, id, mutateChat, setChat, workspace],
  );

  if (!userData || !myData) {
    return null;
  }
  return (
    <Container>
      <Header>
        <img src={BlankProfile} alt={userData.nickname} width="20px" />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} placeholder="" />
    </Container>
  );
};

export default DirectMessage;
