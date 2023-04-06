import React, { useCallback, useState } from 'react';
import axios from 'axios';
import { Button, Error, Form, Header, Input, Label, LinkContainer, Success } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import { Link, Redirect } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const SignUp = () => {
  const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher);

  // 상태 관리
  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  // 에러 정의
  const [missmatchError, setMissmatchError] = useState(false); // 비밀번호 확인
  const [signUpError, setSignUpError] = useState(''); // 회원가입 에러
  const [signUpSuccess, setSignUpSuccess] = useState(false); // 회원가입 성공

  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      // 비밀번호 확인
      setMissmatchError(e.target.value !== passwordCheck);
    },
    [passwordCheck],
  );
  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      // 비밀번호 확인
      setMissmatchError(e.target.value !== password);
    },
    [password],
  );

  /**
   * 회원 가입 요청 보내기
   */
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      console.log('check: ', email, nickname, password, passwordCheck);
      if (!missmatchError) {
        setSignUpError('');
        setSignUpSuccess(false);
        axios
          .post('http://localhost:3095/api/users', { email, nickname, password })
          .then((response) => {
            setSignUpSuccess(true);
          })
          .catch((error) => {
            setSignUpError(error.response.data);
          })
          .finally(() => {});
      }
    },
    [email, nickname, password, passwordCheck, missmatchError],
  );

  if (data === undefined) {
    return <div>로딩중...</div>;
  }

  if (data) {
    return <Redirect to="/workspace/sleact/channel/일반" />;
  }

  if (!data) {
    return <Redirect to="/login" />;
  }

  return (
    <div id="container">
      <Header>Chat-Community</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
          {!email && <Error>이메일을 입력하세요!</Error>}
        </Label>

        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
          {!nickname && <Error>닉네임을 입력하세요!</Error>}
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {missmatchError && <Error>비밀번호가 일치하지 않습니다!</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입이 완료되었습니다.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default SignUp;
