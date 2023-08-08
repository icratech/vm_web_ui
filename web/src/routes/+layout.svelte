
<script>
    import Header from './Header.svelte'
</script>

<div class="flx-col main">

    <Header />

    <div class="flx-row layout">

        <div class="flx-col nav">
            <a href='/'>HOME</a>
            <a href='/device'>DEVICES</a>
            <a href='/job'>JOBS</a>
            <a href='/demo'>DEMO</a>
        </div>

        <div class="flx-col content">
            <slot></slot>
        </div>

    </div>

</div>

<style>
    .main {
        background-color: var(--dark);
        color: var(--accent);
        padding: 1em;
        height: 100vh;
    }
    .nav {
        width: 6em;
        gap:2em;
    }
    .content {
        height: 100%;
    }
</style>