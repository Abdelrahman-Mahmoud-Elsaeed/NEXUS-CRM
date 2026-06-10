import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/modules/auth/store/auth.slice';
import orgReducer from '@/modules/organization/store/org.slice';
import invitationsReducer from '@/modules/organization/store/invitations.slice';
import membersReducer from '@/modules/organization/store/members.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    org: orgReducer,
    invitations: invitationsReducer,
    members: membersReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: true,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;