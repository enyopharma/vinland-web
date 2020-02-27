import { useState, useEffect, useCallback } from 'react'
import { configureStore } from '@reduxjs/toolkit'
import { reducer as search } from './search'

export const store = configureStore({
    reducer: { search }
})
