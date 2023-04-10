import { IChat, IDM } from '@typings/db';
import React, { FunctionComponent, memo, useMemo } from 'react';
import { ChatWrapper } from './styles';
import BlankProfile from '../../utils/img/blankProfileImg.png';
import dayjs from 'dayjs';
import regexifyString from 'regexify-string';
import { Link, useParams } from 'react-router-dom';

interface Props {
  data: IDM | IChat;
}

const Chat: FunctionComponent<Props> = ({ data }) => {
  const user = 'Sender' in data ? data.Sender : data.User;
  const { workspace } = useParams<{ workspace: string; channel: string }>();

  // g: 모두 찾아서 바꾸겠다. _ .+ 모든글자 한개이상 _ \d 숫자 _ ? 0 또는 1개, * 0개 이상
  // () _ 그루핑 : 묶인 값이 arr[1], arr[2]... 에 추가된다.
  const result = useMemo(
    () =>
      regexifyString({
        input: data.content,
        pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
        decorator(match, index) {
          const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
          if (arr) {
            return (
              <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
                @{arr[1]}
              </Link>
            );
          }
          return <br key={index} />;
        },
      }),
    [data.content, workspace], // 갱신 조건
  );
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
        <p>{result}</p>
      </div>
    </ChatWrapper>
  );
};

// 최적화
export default memo(Chat);
