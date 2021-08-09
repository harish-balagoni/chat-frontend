import { 
    BrowserRouter,
    Switch,
    Route
  } from 'react-router-dom';
  import Whtsappscreen from './Component/whtsapp/whtsappscreen';
  
  import { createStore } from 'redux';
  import { Provider } from 'react-redux';
  import reducers from './reducers/combineReducers'
  
  const store = createStore(reducers)
  
  function PageNotFound(){
    return(
        <div>PageNotFound</div>
    )
  }
  
  function Whatsapp(){
    return(
      <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Whtsappscreen} />
                
                <Route path="*" component={PageNotFound} />
            </Switch>
  
        </BrowserRouter>
        </Provider>
    )
  }
  
  export default Whatsapp;