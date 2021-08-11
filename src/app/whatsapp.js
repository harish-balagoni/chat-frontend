import { 
    BrowserRouter,
    Switch,
    Route
  } from 'react-router-dom';
  import Whtsappscreen from './Component/whtsapp/whtsappscreen';
  import ChatRoom from './Component/chatroom/ChatRoom';
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
        <div className='dark'>
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Whtsappscreen} />
                <Route path='/ChatRoom' exact component={ChatRoom}/>
                <Route path="*" component={PageNotFound} />
            </Switch>
  
        </BrowserRouter>
        </div>
        </Provider>
    )
  }
  
  export default Whatsapp;