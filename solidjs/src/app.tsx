import { Suspense, type Component } from 'solid-js';
import { useLocation } from '@solidjs/router';
import Header from "./components/Header"; 

const App: Component<{ children: Element }> = (props) => {
  const location = useLocation();

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
