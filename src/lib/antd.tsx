import React from 'react';
import { ConfigProvider } from 'antd';
import { getAntdTheme } from './theme';

export function AntdConfig({ children }: { children: React.ReactNode }) {
    return (
        <ConfigProvider theme={getAntdTheme()}>
            {children}
        </ConfigProvider>
    );
}