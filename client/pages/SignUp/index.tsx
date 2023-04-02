import React, { useCallback, useState } from 'react';
import { Button, Error, Form, Header, Input, Label, LinkContainer, Success } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';

const SignUp = () => {
  // 상태 관리
  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  // 에러 정의
  const [missmatchError, setMissmatchError] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
    // 비밀번호 확인
    setMissmatchError(e.target.value !== passwordCheck);
  }, []);
  const onChangePasswordCheck = useCallback((e) => {
    setPasswordCheck(e.target.value);
    setMissmatchError(e.target.value !== password);
  }, []);
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      console.log('check: ', email, nickname, password, passwordCheck);
      if (!missmatchError) {
        console.log('submit');
      }
    },
    [email, nickname, password, passwordCheck, missmatchError],
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
        <a href="/login">로그인 하러가기</a>
      </LinkContainer>
    </div>
  );
};

export default SignUp;
