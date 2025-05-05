<script lang="ts">
  let { data } = $props();
  let { session, user } = $derived(data);
</script>

<div class="space-y-2">
  <p class="text-2xl font-bold">セッション</p>
  {#if user}
    <p>ID: {user.id}</p>
    <p>email: {user.email}</p>
    <p>provider: {user.app_metadata.provider}</p>
    <p>providers: {user.app_metadata.providers}</p>
  {/if}
  {#if session}
    {#if session.expires_at}
      <p>expires at: {new Date(session.expires_at * 1000).toLocaleString()}</p>
    {/if}
  {/if}
</div>
