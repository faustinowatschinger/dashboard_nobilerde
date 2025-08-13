import { create } from 'zustand';
import dayjs from 'dayjs';

const initialState = {
  dateRange: {
    from: dayjs().subtract(30, 'day'),
    to: dayjs(),
  },
  bucket: 'day',
  country: 'ALL',
  ageBucket: 'ALL',
  gender: 'ALL',
  tipoYerba: 'ALL',
};

const useFiltersStore = create((set) => ({
  ...initialState,
  setFilter: (key, value) => set({ [key]: value }),
  resetFilters: () => set(initialState),
}));

export default useFiltersStore;
