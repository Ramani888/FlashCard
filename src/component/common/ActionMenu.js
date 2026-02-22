import React from 'react';
import {View} from 'react-native';
import MenuOptionItem from './MenuOptionItem';
import {menuStyles} from './MenuStyles';

/**
 * Dynamic reusable action menu component
 * 
 * @param {Array} actions - Array of action objects with following structure:
 *   {
 *     icon: ReactElement (required) - Icon component
 *     label: string (required) - Menu item text
 *     onSelect: function (required) - Callback when item is selected
 *     isDanger: boolean (optional) - Red text styling for dangerous actions
 *     showDivider: boolean (optional) - Show divider after this item (default: true)
 *     show: boolean (optional) - Conditionally show/hide item (default: true)
 *   }
 * @param {ReactElement} customContent - Optional custom content (e.g., Switch, headers)
 * @param {string} customContentPosition - Position of custom content: 'top', 'bottom', or 'middle' (default: 'bottom')
 */
const ActionMenu = ({
  actions = [],
  customContent = null,
  customContentPosition = 'bottom',
}) => {
  // Filter out actions where show === false
  const visibleActions = actions.filter(action => action.show !== false);

  // Determine if the last action should show divider
  const actionsWithDividers = visibleActions.map((action, index) => {
    const isLast = index === visibleActions.length - 1;
    return {
      ...action,
      showDivider: action.showDivider !== undefined ? action.showDivider : !isLast,
    };
  });

  const renderActions = () => {
    return actionsWithDividers.map((action, index) => (
      <MenuOptionItem
        key={`action-${index}`}
        icon={action.icon}
        label={action.label}
        onPress={action.onSelect}
        textColor={action.textColor}
        isDanger={action.isDanger}
        showDivider={action.showDivider}
      />
    ));
  };

  return (
    <View style={menuStyles.wrapper}>
      {customContentPosition === 'top' && customContent}
      {customContentPosition !== 'middle' ? (
        renderActions()
      ) : (
        <>
          {actionsWithDividers.slice(0, Math.ceil(actionsWithDividers.length / 2)).map((action, index) => (
            <MenuOptionItem
              key={`action-top-${index}`}
              icon={action.icon}
              label={action.label}
              onPress={action.onSelect}
              textColor={action.textColor}
              isDanger={action.isDanger}
              showDivider={action.showDivider}
            />
          ))}
          {customContent}
          {actionsWithDividers.slice(Math.ceil(actionsWithDividers.length / 2)).map((action, index) => (
            <MenuOptionItem
              key={`action-bottom-${index}`}
              icon={action.icon}
              label={action.label}
              onPress={action.onSelect}
              textColor={action.textColor}
              isDanger={action.isDanger}
              showDivider={action.showDivider}
            />
          ))}
        </>
      )}
      {customContentPosition === 'bottom' && customContent}
    </View>
  );
};

export default React.memo(ActionMenu);
