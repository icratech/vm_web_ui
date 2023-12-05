<script>

    import { onMount } from "svelte"
    import { User } from "../../des_api"

    export let uid
    export let cls = 'fg-orange'
    export let user = new User( )
    onMount( async( ) => { 
        if ( uid ) { user = JSON.parse( sessionStorage.users ).filter( u => u.id == uid )[0] }
        if ( user === undefined ) { 
            user = new User( ) 
            user.name = "UNKNOWN"
        }
    } )

</script>

<div class="flx-row content">
    <div class="name { cls }">{ user.name }</div>
    <!-- <div class="email { cls }">{ user.email }</div> -->
</div>

<style>
    .content {
        justify-content: flex-end;
        align-items: center;
        padding: 0 0.5em;
        gap: 1em;
    }
    .name { 
        /* color: var(--light_a);  */
        font-size: 1.2em;
        font-style: oblique;
    }
    /* .email {
        font-size: 1.1em;
        font-style: oblique;
    } */
</style>