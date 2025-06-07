<script lang="ts">
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { Toaster } from '$lib/components/ui/sonner/index.js';
  import '../app.css';
  import AppHeader from './app-header.svelte';
  import AppSidebar from './app-sidebar.svelte';

  let { children } = $props();
</script>

<Sidebar.Provider>
  <AppSidebar />
  <main class="w-full">
    <AppHeader />
    <div class="mx-auto max-w-7xl p-4">
      {@render children()}
    </div>
  </main>
</Sidebar.Provider>

<Toaster />
