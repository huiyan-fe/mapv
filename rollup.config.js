import babel from 'rollup-plugin-babel';

export default {
	entry: 'index.js',
	format: 'umd',
	moduleName: 'mapv',
	plugins: [babel({
        presets: [ 'es2015-rollup' ]
    })],
	dest: 'build/mapv.js'
}
