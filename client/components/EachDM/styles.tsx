import styled from '@emotion/styled';

export const FriendList = styled.div`
  display: flex;
  align-items: center;
  .active-state {
    margin-right: 5px;
    max-width: 10px;
  }
  .onCircle {
    margin: 0 auto;
    width: 10px;
    height: 10px;
    border: 3px solid green;
    border-radius: 50%;
  }
  .offCircle {
    margin: 0 auto;
    width: 10px;
    height: 10px;
    border: 3px solid gray;
    border-radius: 50%;
  }
`;
