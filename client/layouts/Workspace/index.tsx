import React, { FunctionComponent, useCallback } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import loadable from '@loadable/component';

import { Redirect } from 'react-router-dom';
import { Button, Input, Label } from '@pages/SignUp/styles';
import {
  Header,
  ProfileImg,
  RightMenu,
  WorkspaceWrapper,
  Workspaces,
  Channels,
  Chats,
  WorkspaceName,
  MenuScroll,
} from './styles';
import { Switch, Route } from 'react-router';

import BlankProfile from '../../utils/img/blankProfileImg.png';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace: FunctionComponent = ({ children }) => {
  const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher);

  /**
   * 로그아웃 요청
   */
  const onLogout = useCallback(() => {
    axios
      .post('http://localhost:3095/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => {
        mutate(false);
      });
  }, []);

  // 로그아웃시 로그인 페이지로 이동
  if (!data) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span>
            <ProfileImg src={BlankProfile} alt={data.email} />
          </span>
        </RightMenu>
      </Header>
      <button onClick={onLogout}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Chat Community</WorkspaceName>
          <MenuScroll>Menu scroll</MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path="/workspace/channel" component={Channel} />
            <Route path="/workspace/dm" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      {children}
    </div>
  );
};

export default Workspace;
