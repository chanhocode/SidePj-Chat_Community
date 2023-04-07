import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { useEffect, VFC } from 'react';
import { useParams } from 'react-router';
import { NavLink, useLocation } from 'react-router-dom';
import useSWR from 'swr';
import { FriendList } from './styles';

interface Props {
  member: IUser;
  isOnline: boolean;
}
const EachDM: VFC<Props> = ({ member, isOnline }) => {
  const { workspace } = useParams<{ workspace?: string }>();
  const location = useLocation();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const date = localStorage.getItem(`${workspace}-${member.id}`) || 0;
  const { data: count, mutate } = useSWR<number>(
    userData ? `/api/workspaces/${workspace}/dms/${member.id}/unreads?after=${date}` : null,
    fetcher,
  );

  useEffect(() => {
    if (location.pathname === `/workspace/${workspace}/dm/${member.id}`) {
      mutate(0);
    }
  }, [mutate, location.pathname, workspace, member]);

  // NavLink : activeClass 를 가질 수 있다. 지금 주소와 액티브 주소가 같으면 class 적용
  return (
    <NavLink key={member.id} activeClassName="selected" to={`/workspace/${workspace}/dm/${member.id}`}>
      <FriendList>
        <div className="active-state">
          <div className={`${member.id === userData?.id ? 'onCircle' : isOnline ? 'onCircle' : 'offCircle'}`}></div>
        </div>
        <span className={count && count > 0 ? 'bold' : undefined}>{member.nickname}</span>
        {member.id === userData?.id && <span> (나)</span>}
        {(count && count > 0 && <span className="count">{count}</span>) || null}
      </FriendList>
    </NavLink>
  );
};

export default EachDM;
