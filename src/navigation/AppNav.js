import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AppStack from './AppStack'

const AppNav = () => {
  return (
    <View style={{flex:1}}>
      <AppStack/>
    </View>
  )
}

export default AppNav

const styles = StyleSheet.create({})