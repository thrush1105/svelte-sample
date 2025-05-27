<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import { Github } from '@lucide/svelte';
</script>

<form method="POST" action="?/loginWithOAuth">
  <input type="hidden" name="provider" value="github" />
  <Button type="submit" variant="outline" class="w-full">
    <Github />
    GitHubでログイン
  </Button>
</form>
