import React, { FC, PropsWithChildren } from 'react';

// Updated function with proper type inference for children
export const combineComponents = (
    ...components: FC<PropsWithChildren<any>>[]
): FC<PropsWithChildren<any>> => {
    return components.reduce(
        (AccumulatedComponents, CurrentComponent) => {
            return ({ children }: PropsWithChildren<any>): JSX.Element => {
                return (
                    <AccumulatedComponents>
                        <CurrentComponent>{children}</CurrentComponent>
                    </AccumulatedComponents>
                );
            };
        },
        ({ children }: PropsWithChildren<any>) => <>{children}</>,
    );
};
