<script lang="ts">
	import { onMount } from 'svelte';

	let input: HTMLSpanElement | null = null;

	onMount(() => {
		// @ts-ignore
		let mathquill = MathQuill.getInterface(2);
		// @ts-ignore
		mathquill.StaticMath(input);
	});
</script>

<span bind:this={input}><slot /></span>
