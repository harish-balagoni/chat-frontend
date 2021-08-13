import './App.css';
import Routing from './app/Component/routing';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import getStore from './app/reducers/index';

let { store, persistor } = getStore();

function App() {
  return (
    <div className="app">
      <div className="app__body">
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Routing />
          </PersistGate>
        </Provider>
      </div>
    </div>
  );
}

export default App;
