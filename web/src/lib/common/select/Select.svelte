<script>
    export let list = [];
    export let lbl = "";
    export let selection;
    export let enabled;
    export let clr;
    export let displayField;
    export let idField
    
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

    // debug("Select List: ", list )

  </script>
  
  <div class="flx-col container">
    {#if lbl != ""}
      <label for="select" class="lbl">{ lbl }</label>
    {/if}
    <select 
        id="select" 
        class={ clr } 
        bind:value={ selection } 
        disabled={ !enabled } 
        on:change={ () => { dispatch("new_selection") } }
    >
    {#each list as item (item[idField])}

      <option 
        class={ clr }
        value={ item[idField] } 
        selected="{ item[ idField ] == selection }"
    >{ item[ displayField ] }</option>

    {/each}
    </select>
  </div>
  
  <style>
  
    .container {
      gap: 0.25em;
    }
    .lbl {
        font-size: 0.9rem;
    }

  
  </style>