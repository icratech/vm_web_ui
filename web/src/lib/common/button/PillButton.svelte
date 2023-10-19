<script>
    export let cls 
    import def from "$lib/images/btn-img-default.svg"
    export let img = def
    export let hint 

    $: { if ( img == null ) { img = def } }

</script>


    <div class="icon img { cls }"  style="background-image: url( { img } );" on:click  on:keydown >
        { #if hint != null }
        <div class="hint">{ hint }</div>
        { /if }
    </div>


<style>

    .icon {
        outline: 0.2em solid var(--dark_a); outline-offset: -0.1em;
        background-size: cover;
        cursor: pointer;
        border-radius: 50%;
        min-width: 2.5em;
        width: 2.5em;
        min-height: 2.5em;
        height: 2.5em;
    }
    .icon .hint {
        visibility: hidden;
        background-color: var(--dark);
        border-bottom: solid 0.1em var(--light_01);
        border-right: solid 0.1em var(--light_01);
        color: var(--light_a);
        font-size: 1.2em;
        position: relative;
        top: 0.75em;
        left: 2.5em;
        height: 2em;
        width: 10em;
        border-radius: 0.5em;
    }
    .icon:hover .hint {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-left: 0.5em;
        padding-right: 0.5em;
        width:max-content;
        visibility: visible;
        z-index: 99;
    }


    /* LAP TOP */
    @media(max-width: 1440px) {

    }

    /* TABLET */
    @media(max-width: 1024px) {
        .icon:hover .hint { display: none; }
    }

    /* MOBILE */
    @media(max-width: 425px) { 
        
    }

</style>
