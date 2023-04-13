import { IDM, IChat } from '@typings/db';
import React, { useCallback, forwardRef, MutableRefObject } from 'react';
import { ChatZone, Section, StickyHeader } from './styles';
import Chat from '../Chat';
import { Scrollbars } from 'react-custom-scrollbars';

interface Props {
  chatSections: { [key: string]: (IDM | IChat)[] };
  setSize: (f: (size: number) => number) => Promise<IDM[][] | IChat[][] | undefined>;
  isReachingEnd: boolean;
}

const ChatList = forwardRef<Scrollbars, Props>(({ chatSections, setSize, isReachingEnd }, ref) => {
  // values 스크롤에 대한 정보
  const onScroll = useCallback(
    (values) => {
      if (values.scrollTop === 0 && !isReachingEnd) {
        console.log('스크롤 최상단 위치: 데이터 요청');
        // 데이터 추가 로딩
        setSize((prevSize) => prevSize + 1).then(() => {
          const current = (ref as MutableRefObject<Scrollbars>)?.current;
          if (current) {
            current?.scrollTop(current?.getScrollHeight() - values.scrollHeight);
          }
        });
      }
    },
    [isReachingEnd, ref, setSize],
  );

  return (
    <ChatZone>
      <Scrollbars autoHide ref={ref} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map((chat) => (
                <Chat key={chat.id} data={chat} />
              ))}
            </Section>
          );
        })}
      </Scrollbars>
    </ChatZone>
  );
});

export default ChatList;
