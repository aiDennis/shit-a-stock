<script lang="ts">
    import { fade, fly } from 'svelte/transition'
    import { isSearchVisible } from '../store/search'
    import Search from './Search.svelte'

    const dismissModal = () => isSearchVisible.set(false)
    const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            dismissModal()
        }
    }
</script>
{#if $isSearchVisible}
    <div
        class="modal__backdrop"
        role="button"
        tabindex="0"
        on:click={dismissModal}
        on:keydown={handleEsc}
        transition:fade
    ></div>
    <div class="modal" role="dialog" aria-modal="true">
        <div class="modal__cnt" transition:fly={{ y: 80, duration: 220 }}>
            <Search />
        </div>
    </div>
{/if}
<style>
    .modal {
        position: fixed;
        inset: 0;
        display: grid;
        justify-content: center;
        align-content: start;
        padding-top: 6vh;
        pointer-events: none;
        z-index: 50;
    }
    .modal__backdrop {
        position: fixed;
        inset: 0;
        opacity: 0.45;
        background: #1c1a17;
        z-index: 40;
    }
    .modal__cnt {
        z-index: 50;
        pointer-events: auto;
    }
</style>
