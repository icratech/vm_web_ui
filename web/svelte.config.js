
// import adapter from '@sveltejs/adapter-static' // npm install @sveltejs/adapter-static
import adapter from '@sveltejs/adapter-node' // npm install @sveltejs/adapter-node
/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
        adapter: adapter( )
	}
};

export default config;
