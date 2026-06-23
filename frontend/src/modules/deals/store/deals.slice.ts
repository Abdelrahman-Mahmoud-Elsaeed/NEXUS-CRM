// src/modules/deals/store/deals.slice.ts
import { createSlice } from "@reduxjs/toolkit";
import { 
  fetchDeals, 
  fetchDeal, 
  createNewDeal, 
  updateExistingDeal,
  moveDealStage,
  deleteExistingDeal,
  fetchPipeline
} from "./deals.actions";
import type { DealListItem, DealData, PipelineData } from "../types/deal.types";

interface DealsState {
  items: DealListItem[];
  totalRecords: number;
  totalPages: number;
  isLoading: boolean;
  isLoadingDetail: boolean;
  dealDetail: DealData | null;
  isCreating: boolean;
  isUpdating: boolean;
  isMoving: boolean;
  isDeleting: boolean;
  error: string | null;
  pipeline: PipelineData | null;
  isLoadingPipeline: boolean;
}

const initialState: DealsState = {
  items: [],
  totalRecords: 0,
  totalPages: 1,
  isLoading: false,
  isLoadingDetail: false,
  dealDetail: null,
  isCreating: false,
  isUpdating: false,
  isMoving: false,
  isDeleting: false,
  error: null,
  pipeline: null,
  isLoadingPipeline: false,
};

export const dealsSlice = createSlice({
  name: "deals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Deals
      .addCase(fetchDeals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDeals.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.items = action.payload.data.deals;
          state.totalRecords = action.payload.data.meta.total;
          state.totalPages = action.payload.data.meta.totalPages;
        }
      })
      .addCase(fetchDeals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Deal Detail
      .addCase(fetchDeal.pending, (state) => {
        state.isLoadingDetail = true;
        state.error = null;
      })
      .addCase(fetchDeal.fulfilled, (state, action) => {
        state.isLoadingDetail = false;
        if (action.payload.success) {
          state.dealDetail = action.payload.data;
        }
      })
      .addCase(fetchDeal.rejected, (state, action) => {
        state.isLoadingDetail = false;
        state.error = action.payload as string;
      })
      
      // Create Deal
      .addCase(createNewDeal.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createNewDeal.fulfilled, (state, action) => {
        state.isCreating = false;
        if (action.payload.success) {
          state.items.unshift(action.payload.data);
          state.totalRecords += 1;
        }
      })
      .addCase(createNewDeal.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      })

      // Update Deal
      .addCase(updateExistingDeal.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateExistingDeal.fulfilled, (state, action) => {
        state.isUpdating = false;
        
        if (action.payload.success) {
          const updatedDeal = action.payload.data;

          // Update details inside active detail selection view
          if (state.dealDetail && state.dealDetail.id === updatedDeal.id) {
            state.dealDetail = updatedDeal;
          }
          
          // Map and update inline inside item rows array
          const index = state.items.findIndex(item => item.id === updatedDeal.id);
          if (index !== -1) {
            state.items[index] = updatedDeal;
          }
        }
      })
      .addCase(updateExistingDeal.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })

      // Move Deal Stage
      .addCase(moveDealStage.pending, (state) => {
        state.isMoving = true;
        state.error = null;
      })
      .addCase(moveDealStage.fulfilled, (state, action) => {
        state.isMoving = false;
        
        if (action.payload.success) {
          const updatedDeal = action.payload.data;

          // Update details inside active detail selection view
          if (state.dealDetail && state.dealDetail.id === updatedDeal.id) {
            state.dealDetail = updatedDeal;
          }
          
          // Map and update inline inside item rows array
          const index = state.items.findIndex(item => item.id === updatedDeal.id);
          if (index !== -1) {
            state.items[index] = updatedDeal;
          }
        }
      })
      .addCase(moveDealStage.rejected, (state, action) => {
        state.isMoving = false;
        state.error = action.payload as string;
      })

      // Delete Deal
      .addCase(deleteExistingDeal.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteExistingDeal.fulfilled, (state, action) => {
        state.isDeleting = false;
        
        if (action.payload.success) {
          const { id } = action.payload;
          
          // Remove from detail view if it's the current deal
          if (state.dealDetail && state.dealDetail.id === id) {
            state.dealDetail = null;
          }
          
          // Remove from items array
          state.items = state.items.filter(item => item.id !== id);
          state.totalRecords -= 1;
        }
      })
      .addCase(deleteExistingDeal.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      })

      // Fetch Pipeline
      .addCase(fetchPipeline.pending, (state) => {
        state.isLoadingPipeline = true;
        state.error = null;
      })
      .addCase(fetchPipeline.fulfilled, (state, action) => {
        state.isLoadingPipeline = false;
        if (action.payload.success) {
          state.pipeline = action.payload.data;
        }
      })
      .addCase(fetchPipeline.rejected, (state, action) => {
        state.isLoadingPipeline = false;
        state.error = action.payload as string;
      });
  },
});

export default dealsSlice.reducer;
