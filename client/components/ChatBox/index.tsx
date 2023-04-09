import React, { FunctionComponent, useCallback, useEffect, useRef } from 'react';
import { ChatArea, EachMention, Form, MentionsTextarea, SendButton, Toolbox } from './styles';
import { useParams } from 'react-router';
import { IUser, IChannel } from '@typings/db';
import autosize from 'autosize';
import sendImg from '../../utils/img/sendButton.png';
import { Mention, SuggestionDataItem } from 'react-mentions';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import BlankProfile from '../../utils/img/blankProfileImg.png';

interface Props {
  onSubmitForm: (e: any) => void;
  chat?: string;
  onChangeChat: (e: any) => void;
  placeholder: string;
  // data?: IUser[];
}
const ChatBox: FunctionComponent<Props> = ({ onSubmitForm, onChangeChat, chat, placeholder }) => {
  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher);
  const { data: memberData } = useSWR<IUser[]>(userData ? `/api/workspaces/${workspace}/members` : null, fetcher);

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
  const renderSuggestion = useCallback(
    (
      suggestion: SuggestionDataItem,
      search: string,
      highlightedDisplay: React.ReactNode,
      index: number,
      focus: boolean,
    ): React.ReactNode => {
      if (!memberData) return;
      return (
        <EachMention focus={focus}>
          <img src={BlankProfile} alt={`${memberData[index].nickname}Profile`} style={{ width: '15px' }} />
          <span>{highlightedDisplay}</span>
        </EachMention>
      );
    },
    [memberData],
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
          inputRef={textareaRef}
          allowSuggestionsAboveCursor
        >
          <Mention
            appendSpaceOnAdd
            trigger="@"
            data={memberData?.map((v) => ({ id: v.id, display: v.nickname })) || []}
            renderSuggestion={renderSuggestion}
          />
        </MentionsTextarea>
        <Toolbox>
          <SendButton
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
