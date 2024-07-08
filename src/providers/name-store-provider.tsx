'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import {
  type YourFullStateFunc,
  TYourState,
  createYourStore,
} from '@/stores/filter-booking-store'

export type filterBookingApi = ReturnType<typeof createYourStore>

export const YourStateContext = createContext<filterBookingApi | undefined>(
  undefined,
)

export interface YourStateProviderProps {
  children: ReactNode
}

export const YourStateProvider = ({
  children,
}: YourStateProviderProps) => {
  const storeRef = useRef<filterBookingApi>()
  if (!storeRef.current) {
    storeRef.current = createYourStore()
  }

  return (
    <YourStateContext.Provider value={storeRef.current}>
      {children}
    </YourStateContext.Provider>
  )
}

export const useCounterStore = <T,>(
  selector: (store: TYourState) => T,
): T => {
  const YourContextProvider = useContext(YourStateContext)

  if (!YourContextProvider) {
    throw new Error(`useCounterStore must be used within YourStateProvider`)
  }

  return useStore(YourContextProvider, selector)
}