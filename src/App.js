import logo from './logo.svg';
import './App.css';

//import Whatsapp from './app/whatsapp';
//import Createaccount from './app/Component/registration';
import Routing from './app/Component/routing';
function App() {
  return (
    <div className="app">
      <div className="app__body">
      <Routing/>
      </div>
      {/* <Whatsapp /> */}
      {/* <Createaccount/> */}
    </div>
  );
}

export default App;
