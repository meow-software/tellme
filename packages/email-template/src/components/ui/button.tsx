
import * as React from 'react';

interface ButtonProps {
    href: string;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ href, children }) => {
    return (
        <a href={href} className="no-underline">
            <div className="inline-block px-5 py-3 rounded-lg bg-indigo-600 text-white font-semibold">
                {children}
            </div>
        </a>
    );
};
