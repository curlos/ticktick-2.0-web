import './App.css';
import ServiceMenu from './components/ServiceMenu.component';

function App() {
  return (
    <>
      <div className="flex w-[100vw] max-w-[100%]">
        <div className="">
          <ServiceMenu />
        </div>
        <div className="flex-[3] bg-orange-500">dsadasd</div>
        <div className="flex-[10] bg-blue-500">dsadasd</div>
        <div className="flex-[6] bg-red-500">dsadasd</div>
      </div>
    </>
  );
}

export default App;
