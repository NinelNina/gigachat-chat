import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { useChat } from '../providers/ChatProvider';

function ChatRouteWrapper({ apiKey }: { apiKey: string }) {
  const { id } = useParams();
  const { state, dispatch } = useChat();

  React.useEffect(() => {
    if (id) {
      const chatExists = state.chats.some(c => c.id === id);
      if (chatExists) {
        dispatch({ type: 'SET_ACTIVE_CHAT', payload: id });
      }
    }
  }, [id, state.chats, dispatch]);

  if (id && !state.chats.some(c => c.id === id)) {
    return <Navigate to="/" replace />;
  }

  return <AppLayout apiKey={apiKey} />;
}

export const AppRoutes = ({ apiKey }: { apiKey: string }) => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout apiKey={apiKey} />} />
      <Route path="/chat/:id" element={<ChatRouteWrapper apiKey={apiKey} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
