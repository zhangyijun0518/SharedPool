import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios'
import Stores from './stores/Stores';
import Store from './store/Store';
import StoreEdit from './store/storeEdit';
import StoreAdd from './store/storeAdd';
import Product from './product/Product';
import ProductAdd from './product/productAdd';
import ProductEdit from './product/productEdit';
import Products from './products/Products';
import Cart from './cart/Cart';
import MenuAppBar from './appbar/MenuAppBar.js';
import PoolApprove from './joinPool/PoolApprove';
import PoolCreation from './pool/CreatePool';
import PoolInfo from './pool/PoolInfo';
import PoolRefer from './joinPool/PoolRefer';
import PoolResults from './pools/PoolResults';
import NotFound from './NotFound/NotFound';
import JoinPool from "./joinPool/joinPool";
import SendMessage from "./pool/SendMessage";
import OrderHistory from './order/orderHistory/OrderHistory'
import Pickupmenu from './order/pickUpMenu/PickUpMenu';
import CheckedOut from './cart/CheckedOut';
import AddToCartButton from './cart/AddToCartButton'
import Message from "./pool/Message";

import Navigation from './components/Navigation';
import SignUpPage from './components/SignUp';
import SignInPage from './components/SignIn';
import PasswordForgetPage from './components/PasswordForget';
// import HomePage from './components/Home';
import AccountPage from './components/Account';
import PoolerPage from './components/Pooler'
import SignOutPage from './components/SignOut';
import EditNicknamePage from './components/EditNickname';

import * as ROUTES from './constants/routes';
import Firebase from './components/Firebase';


console.log(process.env.REACT_APP_API_KEY)

class App extends Component {

  state = {
    authUser: JSON.parse(localStorage.getItem("authUser"))
  };

  componentDidMount() {
    // console.log("local storage in app.js", localStorage.authUser)
    if (this.state.authUser === null) {
      Firebase.auth.onAuthStateChanged(user => {
        console.log("app component didmount, on auth statechange")
        if (user && user.emailVerified) {
          localStorage.setItem("authUser", JSON.stringify(user))
          const url = process.env.REACT_APP_API_SERVER + '/user/email?email=' + user.email
          console.log(url)
          axios.get(url)
            .then(res => {
              console.log("user info after auth", res.data);
              localStorage.setItem("uid", res.data.id)
              localStorage.setItem("screenname", res.data.screenname)
            })
            .catch(err => {
              console.log(err);
            });
          this.setState({
            authUser: user
          });
        }
      });
    }
  }


  render() {
    console.log("authuser in app.js:", this.state.authUser);
    return (
      <Router>
        <div>
          <Navigation authUser={this.state.authUser} />
          <MenuAppBar authUser={this.state.authUser} />
          <Switch>
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route path={ROUTES.SIGN_IN} render={(props) => <SignInPage {...props} authUser={this.state.authUser} />} />
            <Route path={ROUTES.SIGN_OUT} component={SignOutPage} />
            <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
            <Route path={ROUTES.ACCOUNT} render={(props) => <AccountPage {...props} authUser={this.state.authUser} />} />
            <Route path={ROUTES.POOLER} render={(props) => <PoolerPage {...props} authUser={this.state.authUser} />} />
            <Route path={ROUTES.EDIT_NICKNAME} render={(props) => <EditNicknamePage {...props} authUser={this.state.authUser} />} />

            <Route exact path={'/'} component={Stores} />
            <Route exact path='/' render={(props) => <Stores {...props} authUser={this.state.authUser} />} />
            <Route exact path='/stores' render={(props) => <Stores {...props} authUser={this.state.authUser} />} />
            {/* <Route exact path="/store/:id" component={Store} /> */}
            <Route exact path="/store/:id([0-9]+)" render={(props) => <Store {...props} authUser={this.state.authUser} />} />
            {/* <Route exact path="/product/:id" component={Product} /> */}
            <Route exact path="/product/:id([0-9]+)" render={(props) => <Product {...props} authUser={this.state.authUser} />} />
            {/* <Route exact path="/store/:id([0-9])" component={Store} /> */}
            <Route exact path="/store/:id([0-9]+)" render={(props) => <Store {...props} authUser={this.state.authUser} />} />
            <Route exact path="/store/edit/:id([0-9]+)" render={(props) => <StoreEdit {...props} authUser={this.state.authUser} />} />
            <Route exact path="/store/add/" render={(props) => <StoreAdd {...props} authUser={this.state.authUser} />} />

            {/* <Route exact path="/product/:id([0-9])" component={Product} /> */}
            <Route exact path="/product/:id([0-9]+)" render={(props) => <Product {...props} authUser={this.state.authUser} />} />

            {/* <Route exact path="/product/add" component={ProductAdd} /> */}
            <Route exact path="/product/add/" render={(props) => <ProductAdd {...props} authUser={this.state.authUser} />} />

            {/* <Route exact path="/product/edit/:id([0-9])" component={ProductEdit} /> */}
            <Route exact path="/product/edit/:id([0-9]+)" render={(props) => <ProductEdit {...props} authUser={this.state.authUser} />} />


            <Route exact path="/products/:q" component={Products} />
            <Route exact path="/products" render={(props) => <Products {...props} authUser={this.state.authUser} />} />

            {/* <Route path={'/cart'} component={Cart} /> */}
            <Route path='/cart' render={(props) => <Cart {...props} authUser={this.state.authUser} />} />

            {/* <Route path={'/orderhistory'} component={OrderHistory} /> */}
            <Route path='/orderhistory' render={(props) => <OrderHistory {...props} authUser={this.state.authUser} />} />

            {/* <Route path={'/pickupmenu'} component={pickupmenu} /> */}
            <Route path='/pickupmenu' render={(props) => <Pickupmenu {...props} authUser={this.state.authUser} />} />

            {/*<Route path={'/pool'} component={PoolList}/>*/}
            {/* <Route path={'/pool/create'} component={PoolCreation}/> */}
            <Route path='/pool/create' render={(props) => <PoolCreation {...props} authUser={this.state.authUser} />} />

            {/* <Route path={'/pools'} component={PoolResults}/> */}
            <Route path='/pools' render={(props) => <PoolResults {...props} authUser={this.state.authUser} />} />

            {/* <Route path={'/mypool'} component={PoolInfo}/> */}
            <Route path='/mypool' render={(props) => <PoolInfo {...props} authUser={this.state.authUser} />} />

            {/*<Route path={'/:rid/refer/:uid'} component={PoolRefer} />*/}
            <Route path='/:rid/refer/:uid' render={(props) => <PoolRefer {...props} authUser={this.state.authUser} />} />

            {/* <Route path={'/:rid/approve/:uid'} component={PoolApprove}/> */}
            <Route path='/:rid/approve/:uid' render={(props) => <PoolApprove {...props} authUser={this.state.authUser} />} />

            {/* <Route path={'/joinpool/:pid'} component={JoinPool}/> */}
            <Route path='/joinpool/:pid' render={(props) => <JoinPool {...props} authUser={this.state.authUser} />} />

            {/* <Route path={'/sendmsg/:name'} component={SendMessage}/> */}
            <Route path='/msg/' render={(props) => <Message {...props} authUser={this.state.authUser} />} />
            <Route path='/sendmsg/:name' render={(props) => <SendMessage {...props} authUser={this.state.authUser} />} />

            {/* <Route path={'/checkedout'} component={CheckedOut} /> */}
            <Route path='/checkedout' render={(props) => <CheckedOut {...props} authUser={this.state.authUser} />} />

            {/* <Route path={'/addtocart'} render={() => <AddToCartButton productId="1" quantity="2" uid="10" />} /> */}
            <Route path='/addtocart' render={(props) => <AddToCartButton productId="1" quantity="2" uid="10" {...props} authUser={this.state.authUser} />} />

            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

// function App() {
//   return (
//     <div className="App">
//       <Router>
//         <MenuAppBar />
//         <Switch>
//           <Route exact path={'/'} component={Stores} />
//           <Route exact path="/store/:id" component={Store} />
//           <Route exact path="/product/:id" component={Product} />
//           <Route exact path="/store/:id([0-9])" component={Store} />
//           <Route exact path="/product/:id([0-9])" component={Product} />
//           <Route exact path="/product/add" component={ProductAdd} />
//           <Route exact path="/product/edit/:id([0-9])" component={ProductEdit} />
//           <Route exact path="/products/:q" component={Products} />
//           <Route path={'/cart'} component={Cart} />
//           <Route path={'/orderhistory'} component={OrderHistory} />
//           <Route path={'/pickupmenu'} component={PickUpMenu} />
//           {/*<Route exact path={'/'} component={Home} />*/}
//           <Route path={'/cart'} component={Cart}/>
//           <Route path={'/orderhistory'} component={OrderHistory}/>
//           {/*/!*<Route path={'/orderpickup'} component={OrderPickup}/>*!/*/}
//           {/*<Route path={'/pool'} component={PoolList}/>*/}
//           <Route path={'/pool/create'} component={PoolCreation}/>
//           <Route path={'/pools'} component={PoolResults}/>
//           <Route path={'/mypool'} component={PoolInfo}/>
//           <Route path={'/:rid/refer/:uid'} component={PoolRefer}/>
//           <Route path={'/:rid/approve/:uid'} component={PoolApprove}/>
//           <Route path={'/joinpool/:pid'} component={JoinPool}/>
//           <Route path={'/sendmsg/:name'} component={SendMessage}/>
//           <Route component={NotFound}/>
//           <Route path={'/checkedout'} component={CheckedOut} />
//           {/* for temporary test add to cart button */}
//           <Route path={'/addtocart'} render={() => <AddToCartButton productId="1" quantity="2" uid="10" />} />
//           <Route path={'/'} component={Stores} />
//         </Switch>
//       </Router>
//     </div>
//   );
// }

export default App;