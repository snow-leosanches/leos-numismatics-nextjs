'use client';

import React from 'react';
import { BrowserTracker } from "@snowplow/browser-tracker";

export const AnalyticsContext = React.createContext<BrowserTracker>(undefined!);