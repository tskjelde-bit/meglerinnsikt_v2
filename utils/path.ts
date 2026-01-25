
export const getBasePath = () => {
    return process.env.NEXT_PUBLIC_BASE_PATH || '';
};

export const prefixPath = (path: string) => {
    const basePath = getBasePath();
    // Prevent double slashes if path starts with / and basePath ends with / (though our basePath is clean)
    // Handle case where path is just '/'
    if (path === '/') return basePath || '/';

    // If path starts with /, append it
    if (path.startsWith('/')) {
        return `${basePath}${path}`;
    }

    // If relative, just return it (or append? Assume input is always root-relative)
    return `${basePath}/${path}`;
};
