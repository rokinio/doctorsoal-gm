<script>
  import { Router, Route } from "svelte-routing";
  import Layout from "./layouts/MainLayout.svelte";
  import Dashboard from "./pages/Dashboard.svelte";
  import RawQuestions from "./pages/RawQuestions.svelte";
  import ProcessedQuestions from "./pages/ProcessedQuestions.svelte";
  import PublishedQuestions from "./pages/PublishedQuestions.svelte";
  import Settings from "./pages/Settings.svelte";
  import EditQuestion from "./pages/EditQuestion.svelte";

  export let url = "";
</script>

<Router {url}>
  <Layout>
    <Route path="/" component={Dashboard} />
    <Route path="/raw-questions" component={RawQuestions} />
    <Route path="/processed-questions" component={ProcessedQuestions} />
    <Route path="/published-questions" component={PublishedQuestions} />
    <Route path="/settings" component={Settings} />
    <Route path="/edit-question/:id" component={EditQuestion} />
  </Layout>
</Router>

<style global>
  @import "./app.css";
  
  :global(html) {
    direction: rtl;
    font-family: 'Vazirmatn', sans-serif;
  }
  
  :global(body) {
    margin: 0;
    padding: 0;
    background-color: #f8f9fa;
  }
</style>