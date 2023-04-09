import { IChat, IDM } from '@typings/db';
import React, { FunctionComponent } from 'react';
import { ChatWrapper } from './styles';
import BlankProfile from '../../utils/img/blankProfileImg.png';
import dayjs from 'dayjs';

interface Props {
  data: IDM | IChat;
}

const Chat: FunctionComponent<Props> = ({ data }) => {
  const user = 'Sender' in data ? data.Sender : data.User;
  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={BlankProfile} alt={`${user.nickname}Profile`} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <p>{data.content}</p>
      </div>
    </ChatWrapper>
  );
};
export default Chat;
