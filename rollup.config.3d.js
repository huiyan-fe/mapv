import babel from 'rollup-plugin-babel';

export default {
	entry: 'index.3d.js',
	format: 'umd',
	moduleName: 'mapv',
	plugins: [babel({
		runtimeHelpers: true
	})],
	dest: 'build/mapv.3d.js'
}
