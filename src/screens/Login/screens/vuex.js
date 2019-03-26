import { vuex as RecoverPassword } from './RecoverPassword';

const vuex = { RecoverPassword };

const keys = Object.keys(vuex);

const modules = keys.reduce((acc, key) => ({ ...acc, [key]: vuex[key].module }), {});

// Shorthand para ‘modules: modules’
export default { modules };
