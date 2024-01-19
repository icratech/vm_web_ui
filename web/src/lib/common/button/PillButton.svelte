<script>
    export let cls = ''
    import def from "$lib/images/btn-img-default.svg"
    export let img = def
    export let hint = null

    $: { if ( img == null ) { img = def } }

</script>


    <div 
        class="icon img { cls }"  
        style="background-image: url( { img } );" 
        on:click  on:keydown >
        { #if hint != null }
        <div class="hint">{ hint }</div>
        { /if }
    </div>


<style>

    .icon {
        background-size: cover;
        cursor: pointer;
        border-bottom: solid 0.1em var(--light_01);
        border-right: solid 0.1em var(--light_01);
        border-radius: 50%;
        min-width: 2.5em;
        max-width: 2.5em;
        width: 2.5em;
        min-height: 2.5em;
        max-height: 2.5em;
        height: 2.5em;
        opacity: 0.8;
    }
    .icon .hint {
        display: none;
        position: relative;
        color: var(--light_a);
        background-color: var(--dark);
        border-bottom: solid 0.1em var(--light_01);
        border-right: solid 0.1em var(--light_01);
        border-radius: 0.5em;
        font-size: 1.2em;
        top: 1.5em;
        left: 1.5em;
        height: 2em;
    }
    .icon:hover {
        opacity: 1;
    }
    @media (hover: hover) {
        .icon:hover .hint {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding-left: 0.5em;
            padding-right: 0.5em;
            width: max-content;
            z-index: 5;
        }
    }

    /* LAP TOP */
    /* @media(max-width: 1440px) {
    } */

    /* TABLET */
    /* @media(max-width: 1100px) {
    } */

    /* MOBILE */
    /* @media(max-width: 450px) { 
    } */

</style>
