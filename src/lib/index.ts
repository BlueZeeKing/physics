// Standard Normal variate using Box-Muller transform.
// from https://stackoverflow.com/a/36481059/24132157
export const gaussianRandom = (mean = 0, stdev = 1) => {
	const u = 1 - Math.random(); // Converting [0,1) to (0,1]
	const v = Math.random();
	const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
	// Transform to the desired mean and standard deviation:
	return z * stdev + mean;
};
