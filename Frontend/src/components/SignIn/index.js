import React, { useState } from 'react';
import Axios from 'axios';
import Firebase from '../Firebase';
import { Form, Input, Button } from 'antd';
import { FacebookFilled, GoogleSquareFilled } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { withRouter } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import * as Handler from '../../constants/axiosHandler';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },

  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 24,
      offset: 0,
    },
  },
};

const Signin = (props) => {
  const { authUser } = props;
  const [emailInput, setEmail] = useState('');
  const [passwordInput, setPassword] = useState('');
  const [prompt, setPrompt] = useState('');
  const hint1 = "OR sign in with your Google | Facebook account: ";

  const onFinish = (values, e) => {
    logInAccount();
  }

  return (
    <div>
      <br />
      <Form
        onFinish={onFinish}
        {...formItemLayout}
        name="Login"
      >
        <Form.Item
          name="email"
          label="E-mail"
          value={emailInput}
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input onChange={e => setEmail(e.target.value)} />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          value={passwordInput}
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
          hasFeedback
        >
          <Input.Password onChange={e => setPassword(e.target.value)} />
        </Form.Item>

        <Form.Item
          {...tailFormItemLayout}
        >
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>

        <Form.Item 
        {...tailFormItemLayout} 
        >
          <p>{prompt}</p>
        </Form.Item>

      </Form>

      <Form.Item {...tailFormItemLayout}>
        <p>{hint1}</p>
        <Button
          type="primary"
          // {...tailFormItemLayout}
          icon={<GoogleSquareFilled />}
          onClick={getGoogleOAuth}
        >
          Google
        </Button>
        <br />
        <br />
        <Button
        type="primary"
        // {...tailFormItemLayout}
        icon={<FacebookFilled />}
        onClick={getFacebookOAuth}
      >
        Facebook
        </Button>

      </Form.Item>

    </div>
  )

  async function logInAccount() {
    console.log("email user input:", emailInput);
    console.log("pd user input:", passwordInput);
    if (authUser) {
      console.log("authUser email:", authUser.email);
    }
    await Firebase.login(emailInput, passwordInput);
    Firebase.auth.onAuthStateChanged(user => {
      console.log("login component didmount, on auth statechange")
      if (user) {
        console.log("userrrr:", typeof(user), user.emailVerified);
        if (user.email === emailInput) {
          if (!user.emailVerified) {
            setPrompt("*Please check your email to get verified before sign in!");
            setTimeout(() => window.location.reload(false), 1000);
            console.log("authUser not verified:", authUser);
          }
          else if(user.emailVerified){
            var sName = window.localStorage.getItem("screen");
            var nName = window.localStorage.getItem("nickname");
            var email = window.localStorage.getItem("emailForSignIn");
            console.log("Got local storage items????-----", sName, nName, email);
            if (sName && nName && email) {
              Handler.AddEmailVerifiedUserToDB(sName, nName, email);
            }
            props.history.push(ROUTES.HOME)
          }
        }
        else {
          setTimeout(() => props.history.push(ROUTES.HOME), 1000);
        }
      }
      else {
        setTimeout(() => props.history.push(ROUTES.HOME), 1000);
      }

    })
  }

  async function getGoogleOAuth() {
    var provider = Firebase.googleOAuth();
    console.log("what's in provider: ", provider);
    await Firebase.signInWithProvider(provider);

  }

  async function getFacebookOAuth() {
    var provider = Firebase.facebookOAuth();
    console.log("what's in provider: ", provider);
    await Firebase.signInWithProvider(provider);
  }


}

export default withRouter(Signin);