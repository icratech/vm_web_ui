<script>

    import { onMount } from "svelte"
    import { User } from "../../des_api"

    export let uid
    export let user = new User( )
    onMount( async( ) => { 
        if ( uid ) { user = JSON.parse( sessionStorage.users ).filter( u => u.id == uid )[0] }
    } )

</script>

<div class="flx-row content">
    <p style="color: var(--light_a)">{ user.name }</p>
    <p style="color: var(--aqua_aa)">{ user.email }</p>
</div>

<style>
    .content {
        justify-content: flex-end;
        padding: 0 0.5em;
        gap: 1em;
    }
</style>