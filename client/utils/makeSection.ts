import { IChat, IDM } from '@typings/db';
import dayjs from 'dayjs';
/**
 * 매개변수로 받은 채팅리스트를 순회하며 날짜별로 분류 하여 만든 객체를 반환한다.
 * @param chatList IDM[] | IChat[]
 * @returns
 */
export default function makeSection<T extends IDM | IChat>(chatList: T[]) {
  const sections: { [key: string]: T[] } = {};
  chatList.forEach((chat) => {
    const monthDate = dayjs(chat.createdAt).format('YYYY-MM-DD');
    if (Array.isArray(sections[monthDate])) {
      // 이미 해당 날짜를 만든경우
      sections[monthDate].push(chat);
    } else {
      // 처음 만드는 경우
      sections[monthDate] = [chat];
    }
  });
  return sections;
}
