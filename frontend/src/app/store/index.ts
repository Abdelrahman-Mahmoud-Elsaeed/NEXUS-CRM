import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/modules/auth/store/auth.slice';
import orgReducer from '@/modules/team/store/org.slice';
import invitationsReducer from '@/modules/invitation/store/invitations.slice';
import membersReducer from '@/modules/team/store/members.slice';
import contactsReducer from '@/modules/contact/store/contacts.slice';
import companiesReducer from '@/modules/companie/store/companies.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    org: orgReducer,
    invitations: invitationsReducer,
    members: membersReducer,
    contacts: contactsReducer,
    companies: companiesReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: true,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;