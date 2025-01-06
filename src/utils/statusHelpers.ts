// utils/statusHelpers.ts

import { MutationStatus } from '@tanstack/react-query'; // Import MutationStatus if you're using TypeScript

export const getCombinedStatus = (statuses: MutationStatus[]): MutationStatus => {
    if (statuses.some(status => status === 'pending')) {
        return 'pending';
    }
    if (statuses.some(status => status === 'error')) {
        return 'error';
    }
    return 'idle'; // Default to 'idle' if none of the above conditions match
};
