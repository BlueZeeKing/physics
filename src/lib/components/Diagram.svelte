<script lang="ts">
	import { given } from '$lib/store';

	// Standard Normal variate using Box-Muller transform.
	// from https://stackoverflow.com/a/36481059/24132157
	function gaussianRandom(mean = 0, stdev = 1) {
		const u = 1 - Math.random(); // Converting [0,1) to (0,1]
		const v = Math.random();
		const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
		// Transform to the desired mean and standard deviation:
		return z * stdev + mean;
	}

	let mass_1_y = 0; // meters
	let mass_1: null | HTMLDivElement = null;
	let mass_1_string: null | HTMLDivElement = null;
	let mass_1_mass = 25; // kg

	$: {
		if (mass_1 && mass_1_string) {
			mass_1.style.transform = `translateY(${mass_1_y}rem)`;
			mass_1_string.style.transform = `scaleY(${mass_1_y / 4 + 1})`;
		}
	}

	$: {
		if (mass_1) {
			mass_1.style.width = `${Math.sqrt(mass_1_mass)}rem`;
			mass_1.style.height = `${Math.sqrt(mass_1_mass)}rem`;
		}
	}

	let mass_2_y = 30; // meters
	let mass_2: null | HTMLDivElement = null;
	let mass_2_string: null | HTMLDivElement = null;
	let mass_2_mass = 5; // kg

	$: {
		if (mass_2 && mass_2_string) {
			mass_2.style.transform = `translateY(${mass_2_y}rem)`;
			mass_2_string.style.transform = `scaleY(${mass_2_y / 4 + 1})`;
		}
	}

	$: {
		if (mass_2) {
			mass_2.style.width = `${Math.sqrt(mass_2_mass)}rem`;
			mass_2.style.height = `${Math.sqrt(mass_2_mass)}rem`;
		}
	}

	$: accel = (mass_1_mass * 9.8 - mass_2_mass * 9.8) / (mass_1_mass + mass_2_mass);

	let start: null | number = null;
	let triggered = false;
	let display_time: null | number = null;
	let running = false;

	function animation() {
		if (mass_2_y >= 0 && mass_1_y >= 0 && start) {
			let t = (Date.now() - start) / 1000;
			mass_2_y = 0.5 * -accel * Math.pow(t, 2) + 30;
			mass_1_y = 0.5 * accel * Math.pow(t, 2);

			if (!triggered && mass_1_y >= 20) {
				triggered = true;
				display_time = t * gaussianRandom(1, 0.01);
			}
			requestAnimationFrame(animation);
		} else {
			running = false;
			given.update((vals) => {
				vals.values['m_1'].push(mass_1_mass.toFixed(3));
				vals.values['m_2'].push(mass_2_mass.toFixed(3));
				vals.values['d'].push('20.000');
				vals.values['t'].push((display_time ?? NaN).toFixed(3));
				return vals;
			});
		}
	}
</script>

<div>
	<div class="flex pt-10">
		<div class="flex-grow" />
		<div class="grid grid-cols-2 w-64 relative">
			<div class="w-32 h-32 rounded-full border-2 border-gray-900 bg-cyan-200 col-span-2 mx-auto" />
			<div
				bind:this={mass_1}
				class="bg-gray-200 border-2 border-gray-900 text-center align-middle grid place-content-center bg-amber-200 mx-auto relative"
			>
				<div
					bind:this={mass_1_string}
					class="absolute w-[2px] h-16 bg-gray-900 top-[-4rem] left-1/2 origin-bottom"
				/>
				<span class="m-auto align-middle">m<sub>1</sub></span>
			</div>
			<div
				bind:this={mass_2}
				class="bg-gray-200 border-2 border-gray-900 text-center align-middle grid place-content-center bg-red-200 mx-auto relative"
			>
				<div
					bind:this={mass_2_string}
					class="absolute w-[2px] h-16 bg-gray-900 top-[-4rem] right-1/2 origin-bottom"
				/>
				<span class="m-auto align-middle">m<sub>2</sub></span>
			</div>
			<div class="absolute top-32 left-0 -translate-x-full flex">
				<div class="grid">
					<p class="m-auto pr-2">d</p>
				</div>
				<div class="h-[20rem] w-10 border border-blue-700 border-r-0" />
			</div>
		</div>
		<div class="flex-grow" />
	</div>
	<button
		on:click={() => {
			start = Date.now();
			mass_1_y = 0;
			mass_2_y = 30;
			triggered = false;
			running = true;
			requestAnimationFrame(animation);
		}}>Run</button
	>
	<br />
	<input type="range" bind:value={mass_1_mass} max={50} min={10} disabled={running} />
	{#if display_time}
		<p>Time: {display_time.toFixed(3)}</p>
	{/if}
</div>