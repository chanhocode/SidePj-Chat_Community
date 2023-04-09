import { IDM } from '@typings/db';
import React, { FunctionComponent, useCallback, useRef } from 'react';
import { ChatZone, Section } from './styles';
import Chat from '../Chat';
import { Scrollbars } from 'react-custom-scrollbars';

interface Props {
  chatData?: IDM[];
}

// autoHide 스크롤을 움직일때만 스크롤 표시
const ChatList: FunctionComponent<Props> = ({ chatData }) => {
  const scrollbarRef = useRef(null);
  const onScroll = useCallback(() => {}, []);

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {chatData?.map((chat) => (
          <Chat key={chat.id} data={chat} />
        ))}
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
