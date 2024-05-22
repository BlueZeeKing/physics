<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	export let latex = '';
	export let id: null | string = null;

	let input: HTMLSpanElement | null = null;
	let started = false;

	$: {
		if (browser && started) {
			window.localStorage.setItem(`latex-${id}`, latex);
		}
	}

	let mathquill: unknown;
	let field: unknown;

	onMount(() => {
		// @ts-ignore
		mathquill = MathQuill.getInterface(2);
		// @ts-ignore
		field = mathquill.MathField(input, {
			handlers: {
				edit: () => {
					// @ts-ignore
					latex = field.latex();
				}
			}
		});

		let prev_val = window.localStorage.getItem(`latex-${id}`);
		if (!prev_val) {
			started = true;
			return;
		}

		latex = prev_val;

		started = true;
	});

	$: {
		if (field) {
			// @ts-ignore
			field.latex(latex);
		}
	}
</script>

<span bind:this={input}></span>
