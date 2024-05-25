<script lang="ts">
	import { onMount } from 'svelte';
	import Table from '$lib/components/Table.svelte';
	import Diagram from '$lib/components/Diagram.svelte';
	import { derived, reset, startLocal } from '$lib/store';
	import LatexDisplay from '$lib/components/LatexDisplay.svelte';
	import InputHelp from '$lib/components/InputHelp.svelte';

	let elt: HTMLElement;
	let slope = 0;
	let y_intercept = 0;
	let true_slope = 0;

	let answer: null | string = null;

	let calculator: Desmos.Calculator;

	let help_open = false;

	derived.subscribe((table) => {
		if (calculator) {
			calculator.setExpression({
				type: 'table',
				id: 'data',
				columns: [
					{
						latex: 'x_l',
						values: table.values.x
					},
					{
						latex: 'y_l',
						values: table.values.y
					}
				]
			});
		}
	});

	onMount(() => {
		startLocal();
		calculator = Desmos.GraphingCalculator(elt, {
			expressions: false
		});

		calculator.setExpression({
			type: 'table',
			id: 'data',
			columns: [
				{
					latex: 'x_l',
					values: []
				},
				{
					latex: 'y_l',
					values: []
				}
			]
		});

		calculator.setExpression({
			type: 'expression',
			latex: '(x_1, y_1)',
			color: Desmos.Colors.BLACK
		});
		calculator.setExpression({
			type: 'expression',
			latex: 'x_1 = 0'
		});
		calculator.setExpression({
			type: 'expression',
			latex: 'y_1 = 0'
		});
		calculator.setExpression({
			type: 'expression',
			latex: '(x_2, y_2)',
			color: Desmos.Colors.BLACK
		});
		calculator.setExpression({
			type: 'expression',
			latex: 'x_2 = 1'
		});
		calculator.setExpression({
			type: 'expression',
			latex: 'y_2 = 1'
		});
		calculator.setExpression({
			type: 'expression',
			latex: '(y - y_1) = ((y_1 - y_2) / (x_1 - x_2))(x - x_1)',
			color: Desmos.Colors.BLACK
		});

		calculator.setExpression({
			type: 'expression',
			latex: 'y_l ~ mx_l',
			hidden: true
		});

		let slope_expr = calculator.HelperExpression({ latex: '(y_1 - y_2) / (x_1 - x_2)' });
		slope_expr.observe('numericValue', function () {
			slope = slope_expr.numericValue;
		});

		let intercept_expr = calculator.HelperExpression({
			latex: '((y_1 - y_2) / (x_1 - x_2))(0 - x_1) + y_1'
		});
		intercept_expr.observe('numericValue', function () {
			y_intercept = intercept_expr.numericValue;
		});

		let real_expr = calculator.HelperExpression({ latex: 'm' });
		real_expr.observe('numericValue', function () {
			true_slope = real_expr.numericValue;
		});
	});

	$: percent_error = Math.abs((slope - true_slope) / true_slope);
</script>

<InputHelp bind:open={help_open} />
<div class="grid grid-cols-2 h-screen">
	<div>
		<Diagram />
	</div>
	<div class="flex flex-col">
		<div class="h-[50vh]" bind:this={elt} />
		<div class="flex flex-row">
			<p
				class="transition duration-200"
				class:text-green-600={percent_error < 0.05}
				class:text-amber-600={percent_error >= 0.05 && percent_error <= 0.25}
				class:text-red-600={percent_error > 0.25}
			>
				y = {slope.toFixed(3)}x + {y_intercept.toFixed(3)}
			</p>
			<div class="flex-grow" />
			<button
				class="bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed rounded px-6 p-2 text-white shadow enabled:hover:bg-blue-400 enabled:active:scale-95 enabled:active:shadow-sm transition duration-100 text-md m-1"
				on:click={() => (help_open = true)}>Input Help</button
			>
		</div>
		<div class="w-full">
			<Table />
		</div>
		<div class="p-2 flex flex-row">
			<label for="final-submission">What is <LatexDisplay>g</LatexDisplay>?</label><input
				id="final-submission"
				class="border border-gray-600 mx-1 w-16"
				bind:value={answer}
			/>
			{#if answer && Number.parseFloat(answer).toFixed(3) == slope.toFixed(3) && percent_error < 0.05}
				<p>✅</p>
			{:else if answer}
				<p>❌</p>
			{/if}
			<div class="flex-grow" />
			<button
				class="bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed rounded px-6 p-2 text-white shadow enabled:hover:bg-blue-400 enabled:active:scale-95 enabled:active:shadow-sm transition duration-100 text-md"
				on:click={() => {
					reset();
				}}>Clear</button
			>
		</div>
	</div>
</div>
