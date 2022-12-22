const langModules = import.meta.glob('./*/*.yaml');

export const resources: any = {};
for (const filePath in langModules) {
    if ({}.hasOwnProperty.call(langModules, filePath)) {
        const pathElements = filePath.split('/');
        // eslint-disable-next-line no-await-in-loop
        const plugin = await langModules[filePath]();
        resources[pathElements[1]] = { plugin };
    }
}

// This creates a plugin*.js file for each language module in the release build.
// TODO: load language module on demand. Lang to be passed from QL plugin.
