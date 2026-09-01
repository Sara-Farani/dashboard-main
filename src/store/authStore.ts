import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import * as authService from '../services/authService'
import type { AuthState, LoginResponse } from '../types/auth'

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      /*
        مشخص می‌کند که Zustand اطلاعات را از sessionStorage خوانده است.
        تا قبل از true شدن این مقدار، restoreSession نباید اجرا شود.
      */
      hasHydrated: false,

      /*
        مانع ارسال هم‌زمان چند درخواست getCurrentUser می‌شود.
      */
      isRestoringSession: false,

      login: async (
        username: string,
        password: string,
      ): Promise<LoginResponse> => {
        const response = await authService.login(username, password)

        set({
          token: response.token,
          user: response.user,
        })

        return response
      },

      /*
        روند بازیابی Session پس از Refresh:

        1. token از sessionStorage توسط persist بازیابی می‌شود.
        2. user عمداً در sessionStorage نگهداری نمی‌شود.
        3. اطلاعات کاربر و permissionها از Backend دریافت می‌شوند.
      */
      restoreSession: async (): Promise<void> => {
        const { token, user, isRestoringSession } = get()

        /*
          اگر user قبلاً دریافت شده یا درخواست دیگری در حال اجراست،
          نیازی به درخواست مجدد نیست.
        */
        if (user || isRestoringSession) {
          return
        }

        /*
          اگر token نداریم، یعنی کاربر Session فعالی ندارد.
        */
        if (!token) {
          return
        }

        set({
          isRestoringSession: true,
        })

        try {
          /*
            apiClient باید token را از sessionStorage یا interceptor
            به Authorization header اضافه کند.
          */
          const currentUser = await authService.getCurrentUser()

          /*
            ممکن است در فاصله ارسال درخواست تا دریافت پاسخ، کاربر logout کرده
            باشد یا token تغییر کرده باشد. در این صورت پاسخ قدیمی نباید
            دوباره user را در Store تنظیم کند.
          */
          if (get().token !== token) {
            return
          }

          set({
            user: currentUser,
          })
        } catch {
          /*
            در صورت خطا در getCurrentUser، Session محلی را نامعتبر در نظر
            می‌گیریم و اطلاعات ذخیره‌شده را حذف می‌کنیم.
          */
          set({
            token: null,
            user: null,
          })

          useAuthStore.persist.clearStorage()
        } finally {
          set({
            isRestoringSession: false,
          })
        }
      },

      logout: () => {
        /*
          توکن را قبل از پاک‌کردن Store نگه می‌داریم تا بتوانیم درخواست
          logout سمت Backend را با همان Bearer token ارسال کنیم.
        */
        const token = get().token

        /*
          UI باید فوراً از وضعیت login خارج شود.
        */
        set({
          token: null,
          user: null,
        })

        /*
          فقط token در persist ذخیره می‌شد؛ با این دستور sessionStorage
          نیز پاک می‌شود.
        */
        useAuthStore.persist.clearStorage()

        /*
          خطای logout سمت Backend نباید مانع logout محلی کاربر شود.
        */
        void authService.logout(token ?? undefined).catch(() => undefined)
      },

      setUser: (user) => {
        set({ user })
      },

      setHasHydrated: (hasHydrated: boolean) => {
        set({ hasHydrated })
      },
    }),
    {
      name: 'auth-session',

      storage: createJSONStorage(() => sessionStorage),

      /*
        user و permissions ذخیره نمی‌شوند؛
        بنابراین پس از هر Refresh، اطلاعات جدید کاربر از Backend دریافت می‌شود.
      */
      partialize: (state) => ({
        token: state.token,
      }),

      onRehydrateStorage: () => {
        return (state) => {
          state?.setHasHydrated(true)
        }
      },
    },
  ),
)