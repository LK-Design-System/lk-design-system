import React from 'react';

/**
 * Internal: shares the ShellPanel title id so a list rendered inside the panel
 * (ConversationList) can name its navigation landmark with aria-labelledby.
 */
export const ShellPanelContext = React.createContext(null);
