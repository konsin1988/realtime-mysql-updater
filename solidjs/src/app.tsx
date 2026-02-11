import { onMount, Suspense, type Component } from 'solid-js';
import { useLocation } from '@solidjs/router';
import Header from "./components/Header"; 
import { wsService } from './api/ws';


const App: Component<{ children: Element }> = (props) => {
  const location = useLocation();

  onMount(() => {
    wsService.connect();
  });

  return (
    <>
      <Header />
      <main> 
        <Suspense>{props.children}</Suspense>
      </main>
    </>
  );
};

export default App;
