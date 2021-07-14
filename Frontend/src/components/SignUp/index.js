import React, { useState } from 'react';
import {Form, Input, Tooltip, Button} from 'antd';
import 'antd/dist/antd.css';
import { QuestionCircleOutlined } from '@ant-design/icons';
import Firebase from '../Firebase/firebase';
import { withRouter } from 'react-router-dom';
import Axios from "axios";
 
import * as ROUTES from '../../constants/routes';

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

const SignUpForm = (props) => {
  const {classes} = props;
  const [screenname, setScreenname]= useState('');
  const [nickname, setNickname]= useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [form] = Form.useForm();
  const [prompt, setPrompt]= useState('');

  const onFinish = (values, e) => {
    console.log('Received values of form: ', values);
    onClickRegisterButton();
  };

  const storeUserInput = () =>{
    window.localStorage.setItem('screen', screenname);
    window.localStorage.setItem('nickname', nickname);
    window.localStorage.setItem('emailForSignIn', email);
    window.localStorage.setItem('passwordForSignIn', password);
    console.log("User Input successfully stored to local storage:", screenname, nickname, email, password);
  };

  const getUserByNickname = ()=>{
    try{
      return Axios.get(`${process.env.REACT_APP_API_SERVER}/user/nickname?nickname=${nickname}`, {} );
    } catch (error){
      console.log(error);
    } 
  };

  const getUserByScreenname = ()=>{
    try{
      return Axios.get(`${process.env.REACT_APP_API_SERVER}/user/screenname?screenname=${screenname}`, {} );
    } catch (error){
      console.log(error);
    } 
  };

  const getUserByEmail = ()=>{
    console.log("email passed in: ", `${email}`);
    try{
      return Axios.get(`${process.env.REACT_APP_API_SERVER}/user/email?email=${email}`, {} );
    } catch (error){
      console.log(error);
      return error;
    } 
  };

  

  async function onClickRegisterButton() {
    try {
      const userWithScreenname = await getUserByScreenname();
      console.log("what's in get axios sname:", userWithScreenname);
      const existedScreenname = userWithScreenname.data.screenname;
      const userWithNickname = await getUserByNickname();
      console.log("what's in get axios nname:", userWithNickname);
      const existedNickname = userWithNickname.data.nickname;
      console.log("-----------------------:", existedNickname);
      const userWithEmail= await getUserByEmail();
      console.log("what's in get axios email:", userWithEmail);
      const existedEmail = userWithEmail.data.email;
      if(existedNickname === undefined && existedScreenname === undefined && existedEmail === undefined){
        await Firebase.register(screenname, email, password);
        Firebase.sendAccountVerificationEmail(email);
        setPrompt("*Please check your email for a link to complete your account registration with CartShare before Log in. Redirecting to Home page after 3 seconds....")
        storeUserInput();
        setTimeout(()=> props.history.push(ROUTES.HOME), 3000);
      }
      if(existedScreenname !== undefined){
        alert("A user with this screenname already exists, please input a different screenname.")
      }
      if(existedNickname !== undefined){
        alert("A user with this nickname already exists, please input a different nickname.")
      }
      if(existedEmail !== undefined){
        alert("A user with this email address already exists, please input a different email.")
      }
      
    } catch(error) {
      alert(error.message);
    }
  }

  return (
    <div>
    <br/>
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      scrollToFirstError
      >
        <Form.Item
          name="screenname"
          label="Screenname"
          value={screenname}
          rules={[
            {
              required: true,
              message: 'Please input your screenname!',
              whitespace: true,
            },
          ]}
        >
          <Input onChange={e => setScreenname(e.target.value)}/>
        </Form.Item>

        <Form.Item
          name="nickname"
          label={
            <span>
              Nickname&nbsp;
              <Tooltip title="What do you want others to call you?">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          value={nickname}
          rules={[
            {
              required: true,
              message: 'Please input your nickname!',
              whitespace: true,
            },
          ]}
        >
          <Input onChange={e => setNickname(e.target.value)}/>
        </Form.Item>

        <Form.Item
          name="email"
          label="E-mail"
          value={email}
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
          <Input onChange={e => setEmail(e.target.value)}/>
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          value={password}
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (getFieldValue('password').length >= 6) {
                  return Promise.resolve();
                }

                return Promise.reject('The password needs to be at least 6 characters!');
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password onChange={e => setPassword(e.target.value)}/>
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }

                return Promise.reject('The two passwords that you entered do not match!');
              },
            }),
          ]}
        >
          <Input.Password onChange={e => setPassword(e.target.value)}/>
        </Form.Item>

        <Form.Item {...tailFormItemLayout} onSubmit={onClickRegisterButton}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>

        <Form.Item {...tailFormItemLayout} >
          <p>{prompt}</p>
        </Form.Item>
        {/* {error && <p>{error.message}</p>} */}
    </Form>
    </div>
    )
  }

  export default withRouter(SignUpForm);
