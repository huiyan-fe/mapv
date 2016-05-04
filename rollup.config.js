import babel from 'rollup-plugin-babel';

export default {
	entry: 'dev/es6/editor.js',
	format: 'cjs',
	plugins: [babel()],
	dest: 'static/js/editor.js'
};

