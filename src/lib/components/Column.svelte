<script lang="ts">
	import { given, derived, type TableValues } from '../store';
	import evaluatex from 'evaluatex/dist/evaluatex';
	import LatexInput from './LatexInput.svelte';
	import LatexDisplay from './LatexDisplay.svelte';

	export let name = '';

	let expr = '';

	let table: TableValues;

	given.subscribe((new_table) => {
		table = new_table;
	});

	let items: number[] = [];

	$: {
		let calc = null;
		try {
			calc = evaluatex(expr, {});
		} catch (e) {}

		if (calc) {
			for (let i = 0; i < table.values[table.keys[0]].length; i++) {
				let vars: { [key: string]: number } = {};

				table.keys.forEach((key) => {
					vars[key] = parseFloat(table.values[key][i]);
				});

				let res = null;
				try {
					res = calc(vars);
				} catch (e) {}

				if (!res) {
					continue;
				}

				if (items.length > i) {
					items[i] = res;
				} else {
					items.push(res);
				}
			}
		}

		items = items;
	}

	$: {
		derived.update((val) => {
			val.values[name] = items.map((item) => item.toFixed(3));

			return val;
		});
	}
</script>

<div class="border-l border-gray-700">
	<div class="border-b border-gray-700 flex px-2 gap-1 h-14">
		<div class="grid place-content-center">
			<LatexDisplay>{name}=</LatexDisplay>
		</div>
		<div class="grid place-content-center">
			<LatexInput
				onChange={(latex) => {
					expr = latex;
				}}
			/>
		</div>
	</div>

	{#each items as item}
		<div class="text-center border-b border-gray-400 last-of-type:border-gray-700">
			{item.toFixed(3)}
		</div>
	{/each}
</div>
