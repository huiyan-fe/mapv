import babel from 'rollup-plugin-babel';

export default {
	entry: 'index.js',
	format: 'umd',
	moduleName: 'mapv',
	external: [
		'maptalks',
		'openlayers'
	],
  globals: {
    openlayers: 'ol',
    maptalks: 'maptalks'
  },
	plugins: [babel({
		runtimeHelpers: true
	})],
	dest: 'build/mapv.js'
}