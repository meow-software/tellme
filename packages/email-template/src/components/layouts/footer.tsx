import * as React from 'react';
import { APP_NAME } from './../../constant';

export const Footer: React.FC = () => {
    return (
        <div className="mt-6 border-t border-gray-200 pt-4 flex justify-between items-center text-gray-400 text-xs">
            <div>© {new Date().getFullYear()} {APP_NAME}</div>
        </div>
    );
};
