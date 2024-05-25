<script lang="ts">
	export let open = false;
	let dialog: undefined | HTMLDialogElement;

	$: {
		if (dialog && open) {
			dialog.showModal();
		} else if (dialog) {
			dialog.close();
		}
	}
</script>

<dialog
	bind:this={dialog}
	class="prose p-4 rounded-md shadow border-gray-200 border"
	on:close={() => (open = false)}
>
	<h1>Math Input Help</h1>
	<h2>Basic operations</h2>
	<p>
		Addition uses the "+" symbol, subtraction uses the "-" symbol, multiplication uses the "*"
		symbol, and division uses the "/" symbol. Fractions also use the "/" symbol.
	</p>
	<h2>Subscript and Superscript</h2>
	<p>
		Type "_" for subscript and "^" for superscript. For example, m<sub>1</sub> would be written by
		typing "m_1", and t<sup>2</sup> would be written by typing "t^2"
	</p>
	<h2>Other Operations and Symbols</h2>
	<p>
		In order to perform a square root, type in "sqrt". Pi and theta can be written by typing "pi"
		and "theta", respectively.
	</p>
	<button
		class="bg-red-500 disabled:bg-gray-500 disabled:cursor-not-allowed rounded px-6 p-2 text-white shadow enabled:hover:bg-red-400 enabled:active:scale-95 enabled:active:shadow-sm transition duration-100 text-md float-right"
		on:click={() => (open = false)}>Close</button
	>
</dialog>
