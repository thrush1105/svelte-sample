<script lang="ts">
  import '../app.css';

  let { data, children } = $props();
  let { session } = $derived(data);
</script>

<header class="bg-slate-100">
  <div class="mx-auto max-w-xl p-4">
    <div class="flex justify-between">
      <div class="flex gap-4">
        <a href="/">Home</a>
        <a href="/auth">Auth</a>
        <a href="/private">Private</a>
      </div>
      <div class="flex gap-4">
        {#if session}
          <form action="/auth?/logout" method="POST">
            <button class="block hover:cursor-pointer">Logout</button>
          </form>
        {/if}
      </div>
    </div>
  </div>
</header>

<div class="mx-auto max-w-xl p-4">
  {@render children()}
</div>
