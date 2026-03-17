import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface EventStore {
  savedEvents: string[]
  viewedEvents: string[]
  selectedEvent: any | null
  filters: Record<string, any>
  
  // Actions
  saveEvent: (eventId: string) => void
  unsaveEvent: (eventId: string) => void
  trackView: (eventId: string) => void
  setSelectedEvent: (event: any) => void
  setFilters: (filters: Record<string, any>) => void
  clearFilters: () => void
}

export const useEventStore = create<EventStore>()(
  persist(
    (set) => ({
      savedEvents: [],
      viewedEvents: [],
      selectedEvent: null,
      filters: {},
      
      saveEvent: (eventId) =>
        set((state) => ({
          savedEvents: [...state.savedEvents, eventId],
        })),
      
      unsaveEvent: (eventId) =>
        set((state) => ({
          savedEvents: state.savedEvents.filter((id) => id !== eventId),
        })),
      
      trackView: (eventId) =>
        set((state) => ({
          viewedEvents: [...new Set([...state.viewedEvents, eventId])],
        })),
      
      setSelectedEvent: (event) =>
        set({ selectedEvent: event }),
      
      setFilters: (filters) =>
        set({ filters }),
      
      clearFilters: () =>
        set({ filters: {} }),
    }),
    {
      name: 'event-storage',
      partialize: (state) => ({ savedEvents: state.savedEvents }),
    }
  )
)