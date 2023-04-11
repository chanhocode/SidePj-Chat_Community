import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Header, Container } from '@pages/Channel/styles';
import ChannelList from '@components/ChannelList';
import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';
import ChatList from '@components/ChatList';
import autosize from 'autosize';

const Channel = () => {
  const [chat, onChangeChat, setChat] = useInput('');
  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      setChat('');
    },
    [chat],
  );

  return (
    <Container>
      <Header>Channel</Header>
      {/* <ChatList /> */}
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} placeholder="" />
    </Container>
  );
};

export default Channel;
