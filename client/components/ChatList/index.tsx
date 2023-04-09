import { IDM } from '@typings/db';
import React, { FunctionComponent } from 'react';
import { ChatZone, Section } from './styles';
import Chat from '../Chat';
interface Props {
  chatData?: IDM[];
}

const ChatList: FunctionComponent<Props> = ({ chatData }) => {
  return (
    <ChatZone>
      <div>
        {chatData?.map((chat) => (
          <Chat key={chat.id} data={chat} />
        ))}
      </div>
    </ChatZone>
  );
};

export default ChatList;
