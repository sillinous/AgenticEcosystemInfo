import React from 'react';

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  RAILS = 'RAILS',
  CAPABILITY = 'CAPABILITY',
  CHAT = 'CHAT',
  FUTURE = 'FUTURE'
}

export interface NavItem {
  id: ViewState;
  label: string;
  icon: React.ReactNode;
}

export interface Insight {
  title: string;
  description: string;
  category: 'Economics' | 'Legal' | 'Technical' | 'Social';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}