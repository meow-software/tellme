import * as React from 'react';
import { Tailwind } from '@react-email/components';
import { Footer } from './../../components/layouts/footer';

interface EmailWrapperProps {
    header?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export const EmailWrapper: React.FC<EmailWrapperProps> = ({
    children,
    header,
    footer = <Footer />
}) => {
    const CSS_MAIN_CONTAINER = "bg-gray-50 font-sans text-gray-800 p-6";
    return (
        <Tailwind>
            <div className={CSS_MAIN_CONTAINER}>
                {header && <div>{header}</div>}
                <div className='bg-white rounded-b-lg shadow-md'>{children}</div>
                {footer && <div>{footer}</div>}
            </div>
        </Tailwind>
    );
};

export default EmailWrapper;
