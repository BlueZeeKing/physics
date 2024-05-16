<script lang="ts">
	import { onMount } from 'svelte';
	import Table from '$lib/components/Table.svelte';
	import Diagram from '$lib/components/Diagram.svelte';
	import LatexInput from '$lib/components/LatexInput.svelte';
	import { derived, given } from '$lib/store';

	let elt: HTMLElement;
	let slope = 0;
	let y_intercept = 0;

	let m1 = '';
	let m2 = '';
	let d = '';
	let t = '';

	let calculator: Desmos.Calculator;

	derived.subscribe((table) => {
		if (calculator) {
			calculator.setExpression({
				type: 'table',
				id: 'data',
				columns: [
					{
						latex: 'x',
						values: table.values.x
					},
					{
						latex: 'y',
						values: table.values.y
					}
				]
			});
		}
	});

	onMount(() => {
		calculator = Desmos.GraphingCalculator(elt, {
			expressions: false
		});

		calculator.setExpression({
			type: 'table',
			id: 'data',
			columns: [
				{
					latex: 'x',
					values: []
				},
				{
					latex: 'y',
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
	});
</script>

<div class="grid grid-cols-2 h-screen">
	<div>
		<Diagram />
	</div>
	<div class="flex flex-col">
		<div class="h-[50vh]" bind:this={elt} />
		<p>y = {slope.toFixed(3)}x + {y_intercept.toFixed(3)}</p>
		<div class="flex-grow w-full">
			<Table />
		</div>
	</div>
</div>
