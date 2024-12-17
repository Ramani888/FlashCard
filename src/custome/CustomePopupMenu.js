import React from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {
  MenuProvider,
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';

const DynamicPopupMenu = ({menuItems, onSelectOption, triggerText}) => {
  return (
    <Menu>
      <MenuTrigger>
        <Text style={styles.triggerText}>{triggerText}</Text>
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionsContainer: {
            marginTop: 10, 
            backgroundColor: '#fff', 
            padding: 5,
            borderRadius: 5,
            elevation: 5, 
            shadowColor: '#000', 
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.3,
            shadowRadius: 3,
          },
        }}>
        {menuItems.map((item, index) => (
          <MenuOption
            key={index}
            onSelect={() => onSelectOption(item)}
            disabled={item.disabled}
            customStyles={{
              optionWrapper: {
                padding: 10,
                backgroundColor: item.disabled ? '#f0f0f0' : 'white',
              },
            }}>
            <Text
              style={[styles.optionText, item.disabled && styles.disabledText]}>
              {item.label}
            </Text>
          </MenuOption>
        ))}
      </MenuOptions>
    </Menu>
  );
};
