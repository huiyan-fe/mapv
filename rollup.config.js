import babel from 'rollup-plugin-babel';

export default {
	entry: 'index.js',
	format: 'umd',
	moduleName: 'mapv',
	plugins: [babel()],
	dest: 'build/mapv.js'
}
