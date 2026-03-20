- Production Navigation Architecture

App.tsx
   ↓
AuthProvider (check login session)
   ↓
NavigationContainer
   ↓
RootNavigator
   ├ SplashScreen
   ├ AuthStack
   │   ├ LoginScreen
   │   └ RegisterScreen
   │
   └ AppTabs
       ├ Home
       ├ History
       ├ Favorites
       └ Profile



src
│
├── components
│
├── screens
│   ├ SplashScreen.tsx
│   ├ LoginScreen.tsx
│   ├ RegisterScreen.tsx
│   ├ HomeScreen.tsx
│   ├ HistoryScreen.tsx
│   ├ FavoritesScreen.tsx
│   └ ProfileScreen.tsx
│
├── navigation
│   ├ RootNavigator.tsx
│   ├ AuthStack.tsx
│   └ TabNavigator.tsx
│
├── context
│   └ AuthContext.tsx
│
├── services
│   └ supabase.ts
│
└── constants
    └ colors.ts


                   App Start
                   │
                   ▼
              SplashScreen
                   │
         Check Supabase Session
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
     Logged Out           Logged In
        │                     │
        ▼                     ▼
     AuthStack             AppTabs
   ├ Login                ├ Home
   └ Register             ├ History
                          ├ Favorites
                          └ Profile