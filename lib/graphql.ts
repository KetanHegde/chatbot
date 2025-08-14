import { gql } from "@apollo/client";

export const GET_CHATS = gql`
  query GetChats {
    chats(order_by: { updated_at: desc }) {
      id
      title
      created_at
      updated_at
      messages(limit: 1, order_by: { created_at: desc }) {
        content
        sender
        created_at
      }
    }
  }
`;

export const CHATS_UPDATED_AT_SUBSCRIPTION = gql`
  subscription ChatsUpdatedAt {
    chats {
      id
      updated_at
    }
  }
`


export const GET_MESSAGES = gql`
  query GetMessages($chatId: uuid!) {
    messages(
      where: { chat_id: { _eq: $chatId } }
      order_by: { created_at: asc }
    ) {
      id
      content
      sender
      created_at
    }
  }
`;

export const MESSAGES_SUBSCRIPTION = gql`
  subscription MessagesSubscription($chatId: uuid!) {
    messages(
      where: { chat_id: { _eq: $chatId } }
      order_by: { created_at: asc }
    ) {
      id
      content
      sender
      created_at
    }
  }
`;

export const INSERT_CHAT = gql`
  mutation InsertChat($title: String!) {
    insert_chats_one(object: { title: $title }) {
      id
      title
    }
  }
`;

export const UPDATE_CHAT_TITLE = gql`
  mutation UpdateChatTitle($chatId: uuid!, $title: String!) {
    update_chats_by_pk(pk_columns: { id: $chatId }, _set: { title: $title }) {
      id
      title
    }
  }
`;

export const SEND_MESSAGE_ACTION = gql`
  mutation SendMessageAction($chatId: uuid!, $content: String!) {
    sendMessage(chat_id: $chatId, content: $content) {
      reply
    }
  }
`;
