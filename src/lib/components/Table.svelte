<script lang="ts">
	import { given, derived } from '../store';
	import Column from './Column.svelte';
	import LatexDisplay from './LatexDisplay.svelte';
</script>

<div class="grid border border-l-0 border-b-0 border-gray-700 grid-flow-col">
	{#each $given.keys as name}
		<div class="border-l border-gray-700">
			<div
				class="border-b border-gray-700 px-2 h-10 grid justify-center grid-cols-2 content-center gap-1"
			>
				<span class="text-right">
					<LatexDisplay>{name}</LatexDisplay>
				</span>
				({$given.units[name]})
			</div>

			{#each $given.values[name] as value}
				<div class="text-center border-b border-gray-400 last-of-type:border-gray-700">{value}</div>
			{/each}
		</div>
	{/each}
	{#each $derived.keys as name}
		<Column {name} />
	{/each}
</div>
