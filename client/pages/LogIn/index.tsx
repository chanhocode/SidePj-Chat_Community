import React, { useCallback, useState } from 'react';
import { Button, Error, Form, Header, Input, Label, LinkContainer } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const LogIn = () => {
  // SWR & State
  const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  // Error
  const [logInError, setLogInError] = useState(false);

  /**
   * 로그인 요청
   */
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post('http://localhost:3095/api/users/login', { email, password }, { withCredentials: true })
        .then(() => {
          mutate();
        })
        .catch((error) => {
          setLogInError(error.response?.data?.code === 401);
        });
    },
    [email, password, mutate],
  );

  return (
    <div id="container">
      <Header>Chat-Community</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default LogIn;
