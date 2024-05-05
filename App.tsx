import { View, Text } from 'react-native'
import React from 'react'
import MainNavigator from './src/navigations/MainNavigator'
import { UserProvider } from './src/context/UserContext'

const App = () => {
  return (
    <>
      <UserProvider>
        <MainNavigator />
      </UserProvider>
    </>
  )
}

export default App