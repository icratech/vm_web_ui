<script>

    import { User } from "../../des/api"

    export let cls = 'fg-orange'
    export let user = new User( )

</script>

<div class="flx-row content">
    { #if user }<div class="name { cls }">{ user.name }</div>{ /if }
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