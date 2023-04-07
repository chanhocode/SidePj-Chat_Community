import React, { FunctionComponent, useCallback, useEffect, useRef } from 'react';
import { ChatArea, Form, MentionsTextarea, SendButton, Toolbox } from './styles';
import { IUser } from '@typings/db';
import autosize from 'autosize';
import sendImg from '../../utils/img/sendButton.png';

interface Props {
  onSubmitForm: (e: any) => void;
  chat?: string;
  onChangeChat: (e: any) => void;
  placeholder: string;
  // data?: IUser[];
}
const ChatBox: FunctionComponent<Props> = ({ onSubmitForm, onChangeChat, chat, placeholder }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  }, []);

  // enter로 submit
  const onKeyDownChat = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSubmitForm(e);
      }
    },
    [onSubmitForm],
  );
  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea
          onChange={onChangeChat}
          value={chat}
          onKeyDown={onKeyDownChat}
          id="editor-chat"
          placeholder={placeholder}
          ref={textareaRef}
        />
        <Toolbox>
          <SendButton
            // className={
            //   'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
            //   (chat?.trim() ? '' : ' c-texty_input__button--disabled')
            // }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            <img src={sendImg} alt="sendButton" />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
};

export default ChatBox;
