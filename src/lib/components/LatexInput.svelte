<script lang="ts">
	import { onMount } from 'svelte';

	export let onChange: (latex: string) => void;

	let input: HTMLSpanElement | null = null;

	onMount(() => {
		// @ts-ignore
		let mathquill = MathQuill.getInterface(2);
		// @ts-ignore
		let value = mathquill.MathField(input, {
			handlers: {
				edit: () => {
					// @ts-ignore
					onChange(value.latex());
				}
			}
		});
	});
</script>

<span bind:this={input}></span>
