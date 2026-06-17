import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts, createNewContact } from "../store/contacts.actions";
import type { RootState, AppDispatch } from "@/app/store";
import type { CreateContactPayload } from "../types/contact.types";

export const useContacts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, totalRecords, totalPages, isLoading, isCreating, error } =
    useSelector((state: RootState) => state.contacts);

  const loadContacts = useCallback(
    (params: { search?: string; page?: number; limit?: number }) => {
      dispatch(fetchContacts({ ...params }));
    },
    [dispatch],
  );

  const addContact = useCallback(
    async (data: CreateContactPayload)  => {
      return dispatch(createNewContact({ data })).unwrap();
    },
    [dispatch],
  );

  return {
    contacts: items,
    totalRecords,
    totalPages,
    isLoading,
    isCreating,
    error,
    loadContacts,
    addContact,
  };
};
