import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies, createNewCompany } from "../store/companies.actions";
import type { RootState, AppDispatch } from "@/app/store";
import type { CreateCompanyPayload } from "../types/company.types";

export const useCompanies = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, totalRecords, totalPages, isLoading, isCreating, error } =
    useSelector((state: RootState) => state.companies);

  const loadCompanies = useCallback(
    (params: { search?: string; page?: number; limit?: number }) => {
      dispatch(fetchCompanies({ ...params }));
    },
    [dispatch],
  );

  const addCompany = useCallback(
    async (data: CreateCompanyPayload) => {
      return dispatch(createNewCompany({ data })).unwrap();
    },
    [dispatch],
  );

  return {
    companies: items,
    totalRecords,
    totalPages,
    isLoading,
    isCreating,
    error,
    loadCompanies,
    addCompany,
  };
};